import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDatabase } from "./database/mongodb";
import { PORT } from "./config";
dotenv.config();

console.log(process.env.PORT);

const app: Application = express();
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
  });
}
startServer();
