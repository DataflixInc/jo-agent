import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";

export const analyzeResponse = async (jobTitle: string, text: string) => {
  try {
    const model = new ChatOpenAI({
      model: "o3-mini",
    });

    const SYSTEM_TEMPLATE = `
        You are given a job title and a response to functional and technical questions from an applicant. 
        Your task is to analyze the response. 
        Assess the applicant's qualification for the job.
        Write a summary of the analysis under 500 characters.

        Job Title: ${jobTitle}
        Response: ${text}
        
        `;

    const systemMessage = new SystemMessage(SYSTEM_TEMPLATE);
    const responseMessage = await model.invoke([systemMessage]);

    return responseMessage;
  } catch (error) {
    console.log(error);
    throw new Error("Error analyzing response");
  }
};
