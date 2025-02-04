import { QuestionObject } from "../agents/qa-agent";
import { z } from "zod";
import { ResponseFormatter, ResponseFormatterType } from "../agents/qa-agent";

const QuestionObjectWithResponse = QuestionObject.extend({
  response: z.string().describe("Response to the question"),
});

export const QuestionnaireWithResponse = ResponseFormatter.extend({
  questionnaire: z.object({
    question1: QuestionObjectWithResponse,
    question2: QuestionObjectWithResponse,
    question3: QuestionObjectWithResponse,
    question4: QuestionObjectWithResponse,
    question5: QuestionObjectWithResponse,
  }),
});

export type QuestionnaireWithResponseType = z.infer<
  typeof QuestionnaireWithResponse
>;

export const qualificationChecker = ({
  questionnaire,
}: QuestionnaireWithResponseType) => {
  let score = 0;
  // calculate the score
  Object.values(questionnaire).forEach((questionObject) => {
    if (questionObject.answer === questionObject.response) {
      score += 1;
    }
  });

  // if score percentage is greater than 70% return true
  const isQualified = score / 5 > 0.7;
  return isQualified;
};

export const FormattedQuestionObject = z.object({
  question: z.string().describe("Question to ask the applicant"),
  response: z.string().describe("Response to the question"),
  answer: z.string().describe("Answer to the question"),
  verdict: z.enum(["Correct", "Incorrect"]).describe("Verdict of the response"),
});

export const FormattedQuestionnaireWithVerdict = ResponseFormatter.extend({
  questionnaire: z.object({
    question1: FormattedQuestionObject,
    question2: FormattedQuestionObject,
    question3: FormattedQuestionObject,
    question4: FormattedQuestionObject,
    question5: FormattedQuestionObject,
  }),
});

export type FormattedQuestionnaireWithVerdictType = z.infer<
  typeof FormattedQuestionnaireWithVerdict
>;

export const formattedQuestionnaireWithResponse = ({
  questionnaire,
}: QuestionnaireWithResponseType): FormattedQuestionnaireWithVerdictType => {
  const formattedQuestionnaire: FormattedQuestionnaireWithVerdictType = {
    questionnaire: {
      question1: {
        question: questionnaire["question1"].question,
        response: questionnaire["question1"].response,
        answer: questionnaire["question1"].answer,
        verdict:
          questionnaire["question1"].response ===
          questionnaire["question1"].answer
            ? "Correct"
            : "Incorrect",
      },
      question2: {
        question: questionnaire["question2"].question,
        response: questionnaire["question2"].response,
        answer: questionnaire["question2"].answer,
        verdict:
          questionnaire["question2"].response ===
          questionnaire["question2"].answer
            ? "Correct"
            : "Incorrect",
      },
      question3: {
        question: questionnaire["question3"].question,
        response: questionnaire["question3"].response,
        answer: questionnaire["question3"].answer,
        verdict:
          questionnaire["question3"].response ===
          questionnaire["question3"].answer
            ? "Correct"
            : "Incorrect",
      },
      question4: {
        question: questionnaire["question4"].question,
        response: questionnaire["question4"].response,
        answer: questionnaire["question4"].answer,
        verdict:
          questionnaire["question4"].response ===
          questionnaire["question4"].answer
            ? "Correct"
            : "Incorrect",
      },
      question5: {
        question: questionnaire["question5"].question,
        response: questionnaire["question5"].response,
        answer: questionnaire["question5"].answer,
        verdict:
          questionnaire["question5"].response ===
          questionnaire["question5"].answer
            ? "Correct"
            : "Incorrect",
      },
    },
  };

  return formattedQuestionnaire;
};
