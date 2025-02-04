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
exports.technicalQuestionnaireAgent = void 0;
const zod_1 = require("zod");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const TechnicalQuestionObject = zod_1.z.object({
    question: zod_1.z
        .string()
        .describe("Question to ask the applicant to understand their technical skills and technical qualification"),
    options: zod_1.z.array(zod_1.z.string()).describe("Options for the question"),
    answer: zod_1.z.string().describe("Answer to the question"),
});
const ResponseFormatter = zod_1.z.object({
    questionnaire: zod_1.z
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
const technicalQuestionnaireAgent = (jd, qualificationResponses) => __awaiter(void 0, void 0, void 0, function* () {
    const model = new openai_1.ChatOpenAI({
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
    const systemMessage = new messages_1.SystemMessage(SYSTEM_TEMPLATE);
    const responseMessage = yield model.invoke([systemMessage]);
    const questionnaire = responseMessage.questionnaire;
    Object.values(questionnaire).forEach((questionObject) => {
        questionObject.options = questionObject.options.sort(() => 0.5 - Math.random());
    });
    return { qualified: true, questionnaire };
});
exports.technicalQuestionnaireAgent = technicalQuestionnaireAgent;
//# sourceMappingURL=technical-agent.js.map