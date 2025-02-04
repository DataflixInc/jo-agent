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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const qa_agent_1 = __importDefault(require("./agents/qa-agent"));
const technical_agent_1 = require("./agents/technical-agent");
const score_calc_1 = require("./utils/score_calc");
const scrapper_1 = require("./utils/scrapper");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = Number(process.env.PORT) || 8080;
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/qa", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    const { checkFor, jdLink, qualificationResponses, technicalResponses } = req.body;
    if (checkFor === "QUALIFICATION") {
        const { jobDescription } = yield (0, scrapper_1.scrapper)(jdLink);
        const result = yield (0, qa_agent_1.default)(jobDescription);
        res.send(result);
    }
    else if (checkFor === "TECHNICAL") {
        const isQualified = (0, score_calc_1.qualificationChecker)(qualificationResponses);
        if (isQualified) {
            const { jobDescription } = yield (0, scrapper_1.scrapper)(jdLink);
            const result = yield (0, technical_agent_1.technicalQuestionnaireAgent)(jobDescription, qualificationResponses);
            res.send(result);
        }
        else {
            res.send({
                qualified: false,
            });
        }
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map