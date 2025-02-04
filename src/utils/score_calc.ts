import { QuestionObject } from "../agents/qa-agent";
import { z } from "zod";
import { ResponseFormatter, ResponseFormatterType } from "../agents/qa-agent";

const QuestionObjectWithResponse = QuestionObject.extend({
  response: z.string().describe("Response to the question"),
});

export const SelectedResponseFormat = ResponseFormatter.extend({
  selected_necessary_requirements: z
    .array(z.string())
    .describe("List of selected necessary requirements"),
  selected_preferred_requirements: z
    .array(z.string())
    .describe("List of selected preferred requirements"),
});

export type SelectedResponseFormatType = z.infer<typeof SelectedResponseFormat>;

export const qualificationChecker = (
  selectedResponse: SelectedResponseFormatType
) => {
  // If the selected necessary requirements length is greater than 50% of the necessary requirements, return true
  const necessaryRequirements = selectedResponse.necessary_requirements;
  const selectedNecessaryRequirements =
    selectedResponse.selected_necessary_requirements;
  const necessaryRequirementsLength = necessaryRequirements.length;
  const selectedNecessaryRequirementsLength =
    selectedNecessaryRequirements.length;
  const necessaryRequirementsPercentage = Math.floor(
    (selectedNecessaryRequirementsLength / necessaryRequirementsLength) * 100
  );

  // If the selected preferred requirements length is greater than 50% of the preferred requirements, return true
  const preferredRequirements = selectedResponse.preferred_requirements;
  const selectedPreferredRequirements =
    selectedResponse.selected_preferred_requirements;
  const preferredRequirementsLength = preferredRequirements.length;
  const selectedPreferredRequirementsLength =
    selectedPreferredRequirements.length;
  const preferredRequirementsPercentage = Math.floor(
    (selectedPreferredRequirementsLength / preferredRequirementsLength) * 100
  );

  // if both necessary and preferred requirements are greater than 50%, return true
  if (
    necessaryRequirementsPercentage >= 50 &&
    preferredRequirementsPercentage >= 50
  ) {
    return true;
  } else {
    return false;
  }
};

export const FormattedQuestionObject = z.object({
  question: z.string().describe("Question to ask the applicant"),
  response: z.string().describe("Response to the question"),
  answer: z.string().describe("Answer to the question"),
  verdict: z.enum(["Correct", "Incorrect"]).describe("Verdict of the response"),
});
