import express, { Request, Response } from "express";
import dotenv from "dotenv";
import qaAgent from "./agents/qa-agent";
import { questionnaireResponseAnalyzerAgent } from "./agents/analyzer-agent";
import { technicalQuestionnaireAgent } from "./agents/technical-agent";
import {
  formattedQuestionnaireWithResponse,
  qualificationChecker,
} from "./utils/score_calc";

import { scrapper } from "./utils/scrapper";
dotenv.config();

const app = express();
app.use(express.json());

const port: number = Number(process.env.PORT) || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/qa", async (req: Request, res: Response) => {
  console.log(req);
  const { checkFor, jdLink, qualificationResponses, technicalResponses } =
    req.body;

  if (checkFor === "QUALIFICATION") {
    const { jobDescription } = await scrapper(jdLink);
    const result = await qaAgent(jobDescription);
    res.send(result);
  } else if (checkFor === "TECHNICAL") {
    const isQualified = qualificationChecker(qualificationResponses);
    if (isQualified) {
      const { jobDescription } = await scrapper(jdLink);
      const formattedQuestionnaire = formattedQuestionnaireWithResponse(
        qualificationResponses
      );
      const analysis = await questionnaireResponseAnalyzerAgent(
        jobDescription,
        formattedQuestionnaire
      );
      const result = await technicalQuestionnaireAgent(analysis.toString());
      res.send(result);
    } else {
      res.send("Not Qualified");
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
