import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { qaAgent } from "./agents/qa-agent";
import { technicalQuestionnaireAgent } from "./agents/technical-agent";
import { scrapper } from "./utils/scrapper";
import { sendEmailToCareersTeam } from "./tools/sendEmail";

dotenv.config();

const app = express();
app.use(express.json());

const port: number = Number(process.env.PORT) || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// This endpoint handles POST requests to /qa, processing job description links and generating qualification and technical questions.
app.post("/qa", async (req: Request, res: Response) => {
  const { jdLink } = req.body;

  const { jobTitle, jobDescription } = await scrapper(jdLink);
  const [{ qualificationQuestions }, { technicalQuestions }] =
    await Promise.all([
      qaAgent(jobDescription),
      technicalQuestionnaireAgent(jobDescription),
    ]);

  res.send({
    jobTitle,
    qualificationQuestions,
    technicalQuestions,
  });
});

app.post("/qa-responses", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const {
      name,
      email,
      linkedInURL,
      jobTitle,
      total_years_of_experience,
      relevant_years_of_experience,
      full_time_from_office,
      qualificationQuestions,
      technicalQuestions,
    } = body;
    console.log("body: ", body);

    await sendEmailToCareersTeam(
      name,
      email,
      jobTitle,
      linkedInURL,
      total_years_of_experience,
      relevant_years_of_experience,
      full_time_from_office,
      qualificationQuestions,
      technicalQuestions
    );

    res.send("Email sent successfully").status(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
