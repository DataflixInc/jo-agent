"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattedQuestionnaireWithResponse = exports.FormattedQuestionnaireWithVerdict = exports.FormattedQuestionObject = exports.qualificationChecker = exports.QuestionnaireWithResponse = void 0;
const qa_agent_1 = require("../agents/qa-agent");
const zod_1 = require("zod");
const qa_agent_2 = require("../agents/qa-agent");
const QuestionObjectWithResponse = qa_agent_1.QuestionObject.extend({
    response: zod_1.z.string().describe("Response to the question"),
});
exports.QuestionnaireWithResponse = qa_agent_2.ResponseFormatter.extend({
    questionnaire: zod_1.z.object({
        question1: QuestionObjectWithResponse,
        question2: QuestionObjectWithResponse,
        question3: QuestionObjectWithResponse,
        question4: QuestionObjectWithResponse,
        question5: QuestionObjectWithResponse,
    }),
});
const qualificationChecker = ({ questionnaire, }) => {
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
exports.qualificationChecker = qualificationChecker;
exports.FormattedQuestionObject = zod_1.z.object({
    question: zod_1.z.string().describe("Question to ask the applicant"),
    response: zod_1.z.string().describe("Response to the question"),
    answer: zod_1.z.string().describe("Answer to the question"),
    verdict: zod_1.z.enum(["Correct", "Incorrect"]).describe("Verdict of the response"),
});
exports.FormattedQuestionnaireWithVerdict = qa_agent_2.ResponseFormatter.extend({
    questionnaire: zod_1.z.object({
        question1: exports.FormattedQuestionObject,
        question2: exports.FormattedQuestionObject,
        question3: exports.FormattedQuestionObject,
        question4: exports.FormattedQuestionObject,
        question5: exports.FormattedQuestionObject,
    }),
});
const formattedQuestionnaireWithResponse = ({ questionnaire, }) => {
    const formattedQuestionnaire = {
        questionnaire: {
            question1: {
                question: questionnaire["question1"].question,
                response: questionnaire["question1"].response,
                answer: questionnaire["question1"].answer,
                verdict: questionnaire["question1"].response ===
                    questionnaire["question1"].answer
                    ? "Correct"
                    : "Incorrect",
            },
            question2: {
                question: questionnaire["question2"].question,
                response: questionnaire["question2"].response,
                answer: questionnaire["question2"].answer,
                verdict: questionnaire["question2"].response ===
                    questionnaire["question2"].answer
                    ? "Correct"
                    : "Incorrect",
            },
            question3: {
                question: questionnaire["question3"].question,
                response: questionnaire["question3"].response,
                answer: questionnaire["question3"].answer,
                verdict: questionnaire["question3"].response ===
                    questionnaire["question3"].answer
                    ? "Correct"
                    : "Incorrect",
            },
            question4: {
                question: questionnaire["question4"].question,
                response: questionnaire["question4"].response,
                answer: questionnaire["question4"].answer,
                verdict: questionnaire["question4"].response ===
                    questionnaire["question4"].answer
                    ? "Correct"
                    : "Incorrect",
            },
            question5: {
                question: questionnaire["question5"].question,
                response: questionnaire["question5"].response,
                answer: questionnaire["question5"].answer,
                verdict: questionnaire["question5"].response ===
                    questionnaire["question5"].answer
                    ? "Correct"
                    : "Incorrect",
            },
        },
    };
    return formattedQuestionnaire;
};
exports.formattedQuestionnaireWithResponse = formattedQuestionnaireWithResponse;
//# sourceMappingURL=score_calc.js.map