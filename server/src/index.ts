import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

import { RegisterDeleteWeight } from "./routes/deleteWeight";
import { RegisterLogin } from "./routes/login";
import { RegisterSignup } from "./routes/signUp";
import { RegisterUpdateWeight } from "./routes/updateWeight";
import { RegisterGetWeightHistory } from "./routes/getWeightHistory";
import { RegisterSaveWeight } from "./routes/saveWeight";

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());

RegisterLogin(app);
RegisterSignup(app);
RegisterGetWeightHistory(app);
RegisterSaveWeight(app);
RegisterUpdateWeight(app);
RegisterDeleteWeight(app);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
