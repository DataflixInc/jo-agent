import sendGridEmailClient, { MailDataRequired } from "@sendgrid/mail";
import dotenv from "dotenv";
import { analyzeResponse } from "../agents/analyzer";

dotenv.config();

// Add response key to QuestionObject in TechnicalResponseFormatter and QualificationResponseFormatter to use in this file
type QuestionObject = {
  question: string;
  options: string[];
  answer: string;
  response: string;
};

type ResponsesType = {
  question1: QuestionObject;
  question2: QuestionObject;
  question3: QuestionObject;
  question4: QuestionObject;
  question5: QuestionObject;
};

export const sendEmailToCareersTeam = async (
  name: string,
  email: string,
  jobTitle: string,
  linkedInURL: string,
  location: string,
  total_years_of_experience: string,
  relevant_years_of_experience: string,
  full_time_from_office: string,
  qualificationQuestions: ResponsesType,
  technicalQuestions: ResponsesType
) => {
  try {
    sendGridEmailClient.setApiKey(process.env.SENDGRID_API_KEY!);

    const { qualificationScore, technicalScore, text } = responseFormatter(
      qualificationQuestions,
      technicalQuestions
    );

    // Analyze the response
    const responseAnalysis = await analyzeResponse(jobTitle, text);

    const msg: MailDataRequired = {
      to:
        process.env.PROD === "false"
          ? [
              "bhargavr@dataflix.com",
              "mounikap@dataflix.com",
              "preethamv@dataflix.com",
            ]
          : "careers@dataflix.com",
      from: {
        email: "no-reply@dataflix.com",
        name: "Dataflix Jo",
      },
      subject: `Pre-Screening by Jo: ${jobTitle}`,
      content: [
        {
          type: "text/html",
          value: `
<div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; max-width: 600px; margin: 16px auto; font-family: Arial, sans-serif;">
  <p style="margin: 0 0 16px 0;">Hello team,</p>

  <p style="margin: 0 0 16px 0;">
    I have pre-screened a potential new hire for the role: 
    <strong>Azure Cloud Engineer - AI, Multi-Agent Systems, and Security</strong>.
  </p>

  <div style="margin-bottom: 16px;">
    <p style="font-weight: bold; margin: 0 0 8px 0;">Pre-Screen Applicant Summary</p>
    <div style="margin: 4px 0;">Name: ${name}</div>
    <div style="margin: 4px 0;">Email: ${email}</div>
    <div style="margin: 4px 0;">LinkedIn URL: ${linkedInURL}</div>
    <div style="margin: 4px 0;">Date: ${new Date().toLocaleDateString()}</div>
    <div style="margin: 4px 0;">Time: ${new Date().toLocaleTimeString()}</div>
    <div style="margin: 4px 0;">Location: ${location.toString()} </div>
    <div style="margin: 4px 0;">Total Years of Experience: ${total_years_of_experience.toString()} </div>
    <div style="margin: 4px 0;">Relevant Years of Experience: ${relevant_years_of_experience.toString()}</div>
    <div style="margin: 4px 0;">Would you be able to work full-time from the office? ${
      full_time_from_office ? "Yes" : "No"
    }</div>
  </div>

  <div style="margin-bottom: 16px;">
    <p style="font-weight: bold; margin: 0 0 8px 0;">Pre-Screen Scoring &amp; Assessment</p>
    <div style="margin: 4px 0;">Functional Score: ${qualificationScore}</div>
    <div style="margin: 4px 0;">Technical Score: ${technicalScore}</div>
  </div>

  <div style="margin-bottom: 16px;">
    <p style="font-weight: bold; margin: 0 0 8px 0;">Assessment</p>
    <div>${responseAnalysis.text}</div>
  </div>

  <div style="margin-bottom: 16px;">
    ${text}
  </div>

  <div style="margin: 0 0 4px 0;">Thanks,</div>
  <div>Jo</div>
</div>

`,
        },
      ],
    };

    await sendGridEmailClient.send(msg);
    return;
  } catch (error) {
    console.log("Error sending email");
    console.log({ error });
    throw new Error("Error sending email");
  }
};

const questionBlock = (question: QuestionObject, questionNumber: string) => {
  return `
<div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; max-width: 500px; margin: 16px auto; font-family: Arial, sans-serif;">
  <p style="font-weight: bold; font-size: 16px; margin-bottom: 12px;">
    ${questionNumber}: ${question.question}
  </p>
  <ol style="list-style-type: decimal; padding-left: 20px; margin-bottom: 16px;">
    ${question.options
      .map((option) => `<li style="margin-bottom: 8px;">${option}</li>`)
      .join("")}
  </ol>
  <div style="font-weight: bold; margin-bottom: 8px;">Answer: ${
    question.answer
  }</div>
  <div style="color: ${
    question.response === question.answer ? "#28a745" : "#dc3545"
  }; font-weight: bold;">
    ${question.response === question.answer ? "Correct" : "Incorrect"}
  </div>
</div>
`;
};

const responseFormatter = (
  qualificationQuestions: ResponsesType,
  technicalQuestions: ResponsesType
) => {
  const formattedQualificationQuestions = Object.keys(
    qualificationQuestions
  ).map((key) => {
    const question = qualificationQuestions[key as keyof ResponsesType];
    const questionNumber = key.replace("question", "Q");
    return questionBlock(question, questionNumber);
  });

  const formattedTechnicalQuestions = Object.keys(technicalQuestions).map(
    (key) => {
      const question = technicalQuestions[key as keyof ResponsesType];
      const questionNumber = key.replace("question", "Q");
      return questionBlock(question, questionNumber);
    }
  );

  // Calculate the total number of correct answers for qualification and technical questions
  const correctQualificationAnswers = Object.keys(
    qualificationQuestions
  ).filter((key) => {
    const question = qualificationQuestions[key as keyof ResponsesType];
    return question.response === question.answer;
  }).length;

  const correctTechnicalAnswers = Object.keys(technicalQuestions).filter(
    (key) => {
      const question = technicalQuestions[key as keyof ResponsesType];
      return question.response === question.answer;
    }
  ).length;

  return {
    qualificationScore: `${correctQualificationAnswers}/5`,
    technicalScore: `${correctTechnicalAnswers}/5`,
    text: `
<p><b>Functional Questions and Responses:</b></p>
${formattedQualificationQuestions.join("")}

<p><b>Technical Questions and Responses:</b></p>
${formattedTechnicalQuestions.join("")}
`,
  };
};
