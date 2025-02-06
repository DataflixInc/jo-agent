import { z } from "zod";

import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";

const TechnicalQuestionObject = z.object({
  question: z
    .string()
    .describe(
      "Question to ask the applicant to understand their technical skills and technical qualification"
    ),
  options: z.array(z.string()).describe("Options for the question"),
  answer: z.string().describe("Answer to the question"),
});

export const TechnicalResponseFormatter = z.object({
  technicalQuestions: z
    .object({
      question1: TechnicalQuestionObject,
      question2: TechnicalQuestionObject,
      question3: TechnicalQuestionObject,
      question4: TechnicalQuestionObject,
      question5: TechnicalQuestionObject,
    })
    .describe("List of technical questions"),
});

export type TechnicalResponseFormatterType = z.infer<
  typeof TechnicalResponseFormatter
>;

export const technicalQuestionnaireAgent = async (jobDescription: string) => {
  const model = new ChatOpenAI({
    model: "o1",
  }).withStructuredOutput(TechnicalResponseFormatter, {
    name: "questionnaire",
  });

  const SYSTEM_TEMPLATE = `
    You are given a job description which includes technical skills and qualifications required for the job that an applicant is applying for.
    You have the following tasks.
        1. From the analysis, list out all the technical skills required for an applicant.
        2. From the list of skills required, create a questionnaire that will help you understand if the applicants have the required technical skills.
        3. The questionnaire should only have technical questions.
        4. The questionnaire should have multiple-choice questions with ONLY one correct answer.
        5. The correct answer should be provided for each question.
        6. The questionnaire should have only 5 questions.
        7. Do not add any prefixes like 1,2,3,4 or A,B,C,D.
        8. Options should only contain text. 
        9. Every choice should be RELEVANT to the question.

        Analysis: ${jobDescription}
      `;

  const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
  const responseMessage = await model.invoke([systemMessage]);

  const questionnaire = responseMessage.technicalQuestions;
  Object.values(questionnaire).forEach((questionObject) => {
    questionObject.options = questionObject.options.sort(
      () => 0.5 - Math.random()
    );
  });

  return { technicalQuestions: questionnaire };
};
