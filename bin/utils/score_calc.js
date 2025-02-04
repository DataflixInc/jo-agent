"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormattedQuestionObject = exports.qualificationChecker = exports.SelectedResponseFormat = void 0;
const qa_agent_1 = require("../agents/qa-agent");
const zod_1 = require("zod");
const qa_agent_2 = require("../agents/qa-agent");
const QuestionObjectWithResponse = qa_agent_1.QuestionObject.extend({
    response: zod_1.z.string().describe("Response to the question"),
});
exports.SelectedResponseFormat = qa_agent_2.ResponseFormatter.extend({
    selected_necessary_requirements: zod_1.z
        .array(zod_1.z.string())
        .describe("List of selected necessary requirements"),
    selected_preferred_requirements: zod_1.z
        .array(zod_1.z.string())
        .describe("List of selected preferred requirements"),
});
const qualificationChecker = (selectedResponse) => {
    // If the selected necessary requirements length is greater than 50% of the necessary requirements, return true
    const necessaryRequirements = selectedResponse.necessary_requirements;
    const selectedNecessaryRequirements = selectedResponse.selected_necessary_requirements;
    const necessaryRequirementsLength = necessaryRequirements.length;
    const selectedNecessaryRequirementsLength = selectedNecessaryRequirements.length;
    const necessaryRequirementsPercentage = Math.floor((selectedNecessaryRequirementsLength / necessaryRequirementsLength) * 100);
    // If the selected preferred requirements length is greater than 50% of the preferred requirements, return true
    const preferredRequirements = selectedResponse.preferred_requirements;
    const selectedPreferredRequirements = selectedResponse.selected_preferred_requirements;
    const preferredRequirementsLength = preferredRequirements.length;
    const selectedPreferredRequirementsLength = selectedPreferredRequirements.length;
    const preferredRequirementsPercentage = Math.floor((selectedPreferredRequirementsLength / preferredRequirementsLength) * 100);
    // if both necessary and preferred requirements are greater than 50%, return true
    if (necessaryRequirementsPercentage >= 50 &&
        preferredRequirementsPercentage >= 50) {
        return true;
    }
    else {
        return false;
    }
};
exports.qualificationChecker = qualificationChecker;
exports.FormattedQuestionObject = zod_1.z.object({
    question: zod_1.z.string().describe("Question to ask the applicant"),
    response: zod_1.z.string().describe("Response to the question"),
    answer: zod_1.z.string().describe("Answer to the question"),
    verdict: zod_1.z.enum(["Correct", "Incorrect"]).describe("Verdict of the response"),
});
//# sourceMappingURL=score_calc.js.map