import sendGridEmailClient, { MailDataRequired } from "@sendgrid/mail";
import dotenv from "dotenv";

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
  qualificationQuestions: ResponsesType,
  technicalQuestions: ResponsesType
) => {
  try {
    sendGridEmailClient.setApiKey(process.env.SENDGRID_API_KEY!);

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
        name: "Jo by Dataflix",
      },
      subject: `New Application - ${jobTitle}`,
      text: `
Hello team,

A new application for  ${jobTitle} has been submitted.
Applicant details:
Name: ${name}
Email: ${email}
LinkedIn URL: ${linkedInURL}

${responseFormatter(qualificationQuestions, technicalQuestions)}

Regards,
Jo by Dataflix
`,
    };

    await sendGridEmailClient.send(msg);
    return;
  } catch (error) {
    console.log("Error sending email");
    console.log({ error });
    throw new Error("Error sending email");
  }
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
    return `
  ${questionNumber}: ${question.question}
  1: ${question.options[0]}
  2: ${question.options[1]}
  3: ${question.options[2]}
  4: ${question.options[3]}
  Answer: ${question.answer} 
  ${question.response === question.answer ? "Correct" : "Incorrect"}
  `;
  });

  const formattedTechnicalQuestions = Object.keys(technicalQuestions).map(
    (key) => {
      const question = technicalQuestions[key as keyof ResponsesType];
      return `
${key}: ${question.question}
1: ${question.options[0]}
2: ${question.options[1]}
3: ${question.options[2]}
4: ${question.options[3]}
Answer: ${question.answer}
${question.response === question.answer ? "Correct" : "Incorrect"}
`;
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

  return `
Qualification Questions and Responses:
${formattedQualificationQuestions.join("\n")}
Technical Questions and Responses:
${formattedTechnicalQuestions.join("\n")}
Total correct qualification answers: ${correctQualificationAnswers}/5
Total correct technical answers: ${correctTechnicalAnswers}/5




`;
};
