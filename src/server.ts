import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { morganLogger } from "./logger/request.logger.js";
import logger from "./logger/winston.logger.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app: Application = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morganLogger);

app.get("/", (req: Request, res: Response) => {
  res.send("Howzit? Welcome to Express API service! your IP is " + req.ip);
});

const port: number = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  logger.info(`http://127.0.0.1:${port} 에서 서버가 실행되었습니다.`);
});
