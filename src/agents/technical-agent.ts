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

const ResponseFormatter = z.object({
  questionnaire: z
    .object({
      question1: TechnicalQuestionObject,
      question2: TechnicalQuestionObject,
      question3: TechnicalQuestionObject,
      question4: TechnicalQuestionObject,
      question5: TechnicalQuestionObject,
    })
    .describe("List of technical questions"),
});

export const technicalQuestionnaireAgent = async (analysis: string) => {
  const model = new ChatOpenAI({
    model: "o1",
  }).withStructuredOutput(ResponseFormatter, {
    name: "questionnaire",
  });

  const SYSTEM_TEMPLATE = `
    You are given an analysis of the technical skills and qualification required for the job that an applicant is applying for.
    You have the following tasks.
        1. From the analysis, create a questionnaire that will help you understand the technical skills and qualification of the applicant.
        2. The questionnaire should have multiple-choice questions with ONLY one correct answer.
        3. The correct answer should be provided for each question.
        4. The questionnaire should have only 5 questions.
        5.  Do not add optoin A, B, C, D or 1, 2, 3, 4 to the options.
        6. Every choice should be RELEVANT to the question.

        Analysis: ${analysis}
      `;

  const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
  const responseMessage = await model.invoke([systemMessage]);

  const questionnaire = responseMessage.questionnaire;
  Object.values(questionnaire).forEach((questionObject) => {
    questionObject.options = questionObject.options.sort(
      () => 0.5 - Math.random()
    );
  });

  return { questionnaire };
};
