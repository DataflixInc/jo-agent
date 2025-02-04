// Create an agent that will receive job description as parameter. Agent should analyze the technical skills and qualification required for the job.
// Return a summary of the technical skills and qualification required for the job.

import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { FormattedQuestionnaireWithVerdictType } from "../utils/score_calc";

export const jdAnalyzerAgent = async (jd: string) => {
  const model = new ChatOpenAI({
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

  const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
  const responseMessage = await model.invoke([systemMessage]);

  console.log("Questionnaire:", responseMessage);
  return responseMessage;
};

export const questionnaireResponseAnalyzerAgent = async (
  jd: string,
  questionnaire: FormattedQuestionnaireWithVerdictType
) => {
  const model = new ChatOpenAI({
    model: "o1",
  });

  const SYSTEM_TEMPLATE = `
  You are given a job description and questionnaire with responses from the applicant. 
  The questionnaire is created to understand the qualification of the applicant.
  The questionnaire has multiple-choice questions with ONLY one correct answer.

  You have the following tasks.
    1. Analyze the job description.
    2. Analyze the responses from the applicant.
    3. Based on the analysis, provide a detailed summary about the technical skills and qualification of the applicant.
    The summary is for the fellow team member to understand the technical skills and qualification of the applicant 
    to generate technical questions for the applicant.

    The summary should include the following:
    - Technical skills user has experience with.
    - Qualifications user has.
    - Any additional information that can be useful for the fellow team member to create technical questions.
    
    Job Description: ${jd}
    
    Questionnaire: ${questionnaire.toString()}
    `;

  const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
  const responseMessage = await model.invoke([systemMessage]);

  console.log("Questionnaire Response Analysis:", responseMessage);
  // Return string
  return responseMessage.content;
};
