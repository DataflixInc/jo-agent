"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateQuestionnaireScore = void 0;
// Calculate the score from the list of questionnaire
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const qa_agent_1 = require("../agents/qa-agent");
// Add response to the QuestionObject
const QuestionObjectWithResponse = qa_agent_1.QuestionObject.extend({
    response: zod_1.z.string().describe("Response to the question"),
});
exports.calculateQuestionnaireScore = (0, tools_1.tool)((_a) => __awaiter(void 0, [_a], void 0, function* ({ questionnaireWithResponses, }) {
    let score = 0;
    questionnaireWithResponses.forEach((questionObject) => {
        if (questionObject.answer === questionObject.response) {
            score += 1;
        }
    });
    return score;
}), {
    name: "calculateQuestionnaireScore",
    description: "Call to find the score of the questionnaire based on the responses.",
    schema: zod_1.z.object({
        questionnaireWithResponses: zod_1.z
            .array(QuestionObjectWithResponse)
            .describe("List of questions with responses"), // Schema expects an array of QuestionObjectWithResponse
    }),
});
//# sourceMappingURL=score-calc.js.map