"use strict";
// Create an agent that will receive job description as parameter. Agent should analyze the technical skills and qualification required for the job.
// Return a summary of the technical skills and qualification required for the job.
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
exports.questionnaireResponseAnalyzerAgent = exports.jdAnalyzerAgent = void 0;
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const jdAnalyzerAgent = (jd) => __awaiter(void 0, void 0, void 0, function* () {
    const model = new openai_1.ChatOpenAI({
        model: "o1",
    });
    const SYSTEM_TEMPLATE = `
  You are given a Job description that an applicant is applying for. 
  You have the following tasks.
    1. From the job description, analyze the technical skills and qualification required for the job.
    2. Create a detailed summary of the job description, technical skills and qualification required for the job for the 
    fellow team member to create a questionnaire for the applicant to understand their technical skills and qualification.
    
    Job Description: ${jd}
    `;
    const systemMessage = new messages_1.SystemMessage(SYSTEM_TEMPLATE);
    const responseMessage = yield model.invoke([systemMessage]);
    console.log("Questionnaire:", responseMessage);
    return responseMessage;
});
exports.jdAnalyzerAgent = jdAnalyzerAgent;
const questionnaireResponseAnalyzerAgent = (jd, qualificationResponses) => __awaiter(void 0, void 0, void 0, function* () {
    const model = new openai_1.ChatOpenAI({
        model: "o1",
    });
    const SYSTEM_TEMPLATE = `
  You are given a job description and applicants qualifications to create questionnaire.
  Applicant selected a list of qualifications from a list of necessary and preferred requirements provided to the applicant for the job.
  The questionnaire is to verify the skills of the applicant from the list of qualifications selected by the applicant.
  The questionnaire should be multiple-choice questions with ONLY one correct answer.

  You have the following tasks.
    1. Analyze the job description.
    2. Use the qualification list selected by the applicant to create a questionnaire.
    3. Based on the analysis, provide a detailed summary about the technical skills and qualification of the applicant.
    The summary is for the fellow team member to understand the technical skills and qualification of the applicant 
    to generate technical questions for the applicant.

    The summary should include the following:
    - Technical skills user has experience with.
    - Qualifications user has.
    - Any additional information that can be useful for the fellow team member to create technical questions.
    
    Job Description: ${jd}
    
    `;
    const systemMessage = new messages_1.SystemMessage(SYSTEM_TEMPLATE);
    const responseMessage = yield model.invoke([systemMessage]);
    console.log("Questionnaire Response Analysis:", responseMessage);
    // Return string
    return responseMessage.content;
});
exports.questionnaireResponseAnalyzerAgent = questionnaireResponseAnalyzerAgent;
//# sourceMappingURL=analyzer-agent.js.map