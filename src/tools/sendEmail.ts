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

  Applicant has answered the following quiz:
  Qualification Questions and Responses: 
  ${convertJSONWithSubTreesToListFormatText(qualificationQuestions)}

  Technical Questions and Responses: 
  ${convertJSONWithSubTreesToListFormatText(technicalQuestions)}

Regards,
Jo by Dataflix
`,
    };

    await sendGridEmailClient.send(msg);
  } catch (error) {
    console.log("Error sending email");
    console.log({ error });
    throw new Error("Error sending email");
  }
};

export const convertJSONWithSubTreesToListFormatText = (json: any): any => {
  // Create an empty list to store the converted text.
  const list = [];

  // Iterate over the object's properties and add them to the list.
  for (const property in json) {
    // If the property is an object, recursively convert it to list format text.
    if (typeof json[property] === "object") {
      list.push(`${convertJSONWithSubTreesToListFormatText(json[property])}`);
    } else {
      list.push(`- ${property}: ${json[property]}`);
    }
  }

  // Join the list items into a single string, separated by newlines.
  const text = `${list.join("\n")}`;

  // Return the converted text.
  return text;
};
