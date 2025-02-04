// Calculate the score from the list of questionnaire
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { QuestionObject } from "../agents/qa-agent";

// Add response to the QuestionObject
const QuestionObjectWithResponse = QuestionObject.extend({
  response: z.string().describe("Response to the question"),
});

type QuestionObjectWithResponse = z.infer<typeof QuestionObjectWithResponse>;

export const calculateQuestionnaireScore = tool(
  async ({
    questionnaireWithResponses,
  }: {
    questionnaireWithResponses: QuestionObjectWithResponse[];
  }) => {
    let score = 0;
    questionnaireWithResponses.forEach(
      (questionObject: QuestionObjectWithResponse) => {
        if (questionObject.answer === questionObject.response) {
          score += 1;
        }
      }
    );
    return score;
  },
  {
    name: "calculateQuestionnaireScore",
    description:
      "Call to find the score of the questionnaire based on the responses.",
    schema: z.object({
      questionnaireWithResponses: z
        .array(QuestionObjectWithResponse)
        .describe("List of questions with responses"), // Schema expects an array of QuestionObjectWithResponse
    }),
  }
);
