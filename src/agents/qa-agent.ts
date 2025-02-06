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

export const QualificationResponseFormatter = z.object({
  qualificationQuestions: z
    .object({
      question1: QuestionObject,
      question2: QuestionObject,
      question3: QuestionObject,
      question4: QuestionObject,
      question5: QuestionObject,
    })
    .describe("List of questions"),
});

// Create type of ResponseFormatter
export type QualificationResponseFormatterType = z.infer<
  typeof QualificationResponseFormatter
>;

export const qaAgent = async (jd: string) => {
  const model = new ChatOpenAI({
    model: "o1",
  }).withStructuredOutput(QualificationResponseFormatter, {
    name: "questionnaire",
  });

  const SYSTEM_TEMPLATE = `
  You are given a Job description that an applicant is applying for. 
  You have the following tasks.
    1. From the job description, list out all the responsibilities and qualifications required for the job.
    2. Create a questionnaire that will help you understand if the applicants can fulfill the responsibilities and qualifications.
    3. The questionnaire should not have technical questions. 
    4. The questionnaire should have multiple-choice questions with ONLY one correct answer.
    5. Every choice should be RELEVANT and equally close to other options.
    6. The correct answer should be provided for each question.
    7. Every question should have EXACTLY 4 options.
    8. The questionnaire should have EXACTLY 5 questions.
    9. Every option should feel correct to confuse the applicant. But there has to be ONLY 1 correct option.
    10. Do not add optoin A, B, C, D or 1, 2, 3, 4 to the options.

    Job Description: ${jd}
    `;

  const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
  const responseMessage = await model.invoke([systemMessage]);

  // randomise the order of options for each question
  const questionnaire = responseMessage.qualificationQuestions;
  Object.values(questionnaire).forEach((questionObject) => {
    questionObject.options = questionObject.options.sort(
      () => 0.5 - Math.random()
    );
  });

  return { qualificationQuestions: questionnaire };
};
