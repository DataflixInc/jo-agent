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
exports.ResponseFormatter = exports.QuestionObject = void 0;
const zod_1 = require("zod");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
exports.QuestionObject = zod_1.z.object({
    question: zod_1.z
        .string()
        .describe("Question to ask the applicant to understand their qualification"),
    options: zod_1.z.array(zod_1.z.string()).describe("Options for the question"),
    answer: zod_1.z.string().describe("Answer to the question"),
});
exports.ResponseFormatter = zod_1.z.object({
    questionnaire: zod_1.z
        .object({
        question1: exports.QuestionObject,
        question2: exports.QuestionObject,
        question3: exports.QuestionObject,
        question4: exports.QuestionObject,
        question5: exports.QuestionObject,
    })
        .describe("List of questions"),
});
const qaAgent = (jd) => __awaiter(void 0, void 0, void 0, function* () {
    const model = new openai_1.ChatOpenAI({
        model: "o1",
    }).withStructuredOutput(exports.ResponseFormatter, {
        name: "questionnaire",
    });
    const SYSTEM_TEMPLATE = `
  You are given a Job description that an applicant is applying for. 
  You have the following tasks.
    1. From the job description, analyze the responsibilities and qualifications required for the job.
    2. Create a questionnaire that will help you understand if the applicants can fulfill the responsibilities and qualifications.
    3. The questionnaire should not have technical questions. 
    4. The questionnaire should have multiple-choice questions with ONLY one correct answer.
    5. Every choice should be RELEVANT and equally close to other options.
    6. The correct answer should be provided for each question.
    7. The questionnaire should have EXACTLY 5 questions.
    8. Do not add optoin A, B, C, D or 1, 2, 3, 4 to the options.
    
    Job Description: ${jd}
    `;
    const systemMessage = new messages_1.SystemMessage(SYSTEM_TEMPLATE);
    const responseMessage = yield model.invoke([systemMessage]);
    // randomise the order of options for each question
    const questionnaire = responseMessage.questionnaire;
    Object.values(questionnaire).forEach((questionObject) => {
        questionObject.options = questionObject.options.sort(() => 0.5 - Math.random());
    });
    return { questionnaire };
});
exports.default = qaAgent;
//# sourceMappingURL=qa-agent.js.map