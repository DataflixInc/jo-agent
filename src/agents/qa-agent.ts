import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";

export const QuestionObject = z.object({
  question: z
    .string()
    .describe(
      "Question to ask the applicant to understand their qualification"
    ),
  options: z.array(z.string()).describe("Options for the question"),
  answer: z.string().describe("Answer to the question"),
});

export const ResponseFormatter = z.object({
  necessary_requirements: z.array(z.string()).describe("List of questions"),
  preferred_requirements: z.array(z.string()).describe("List of questions"),
});

// Create type of ResponseFormatter
export type ResponseFormatterType = z.infer<typeof ResponseFormatter>;

const qaAgent = async (jd: string) => {
  const model = new ChatOpenAI({
    model: "o1",
  }).withStructuredOutput(ResponseFormatter, {
    name: "questionnaire",
  });

  const SYSTEM_TEMPLATE = `
  You are given a Job description that an applicant is applying for. 
  You have the following tasks.
    1. From the job description, analyze the responsibilities and qualifications required for the job.
    2. Make a list of necessary requirements that are necessary for the job.
    3. Make a list of preferred requirements that are preferred for the job.
    4. List items should only contain name labels of the requirement for an applicant to select. Do not add any extra information.
    
    Job Description: ${jd}
    `;

  const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
  const responseMessage = await model.invoke([systemMessage]);

  return responseMessage;
};

export default qaAgent;
