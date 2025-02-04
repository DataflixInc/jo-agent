import { z } from "zod";

import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { SelectedResponseFormatType } from "../utils/score_calc";

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
      question6: TechnicalQuestionObject,
      question7: TechnicalQuestionObject,
      question8: TechnicalQuestionObject,
      question9: TechnicalQuestionObject,
      question10: TechnicalQuestionObject,
    })
    .describe("List of technical questions"),
});

export const technicalQuestionnaireAgent = async (
  jd: string,
  qualificationResponses: SelectedResponseFormatType
) => {
  const model = new ChatOpenAI({
    model: "o1",
  }).withStructuredOutput(ResponseFormatter, {
    name: "questionnaire",
  });

  const SYSTEM_TEMPLATE = `
  You are given a job description and applicants qualifications to create questionnaire.
  Applicant selected a list of qualifications from a list of necessary and preferred requirements provided to the applicant for the job.
  The questionnaire is to verify the skills of the applicant from the list of qualifications selected by the applicant.
  The questionnaire should be multiple-choice questions with ONLY one correct answer.

  You have the following tasks.
    1. Analyze the job description.
    2. Use the qualification list selected by the applicant to create a questionnaire.
    3. Create a questionnaire that will help you understand the technical skills and qualification of the applicant.
    4. The questionnaire should have multiple-choice questions with ONLY one correct answer.
    5. The correct answer should be provided for each question.
    6. The questionnaire should have only 10 questions.
    7. Do not add optoin A, B, C, D or 1, 2, 3, 4 to the options.
    8. Every choice should be RELEVANT to the question. 

    Job Description: ${jd}

    Selected Necessary Qualifications by Applicant: ${qualificationResponses.selected_necessary_requirements.toString()}
    Selected Preferred Qualifications by Applicant: ${qualificationResponses.selected_preferred_requirements.toString()}
    `;

  const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
  const responseMessage = await model.invoke([systemMessage]);

  const questionnaire = responseMessage.questionnaire;
  Object.values(questionnaire).forEach((questionObject) => {
    questionObject.options = questionObject.options.sort(
      () => 0.5 - Math.random()
    );
  });

  return { qualified: true, questionnaire };
};
