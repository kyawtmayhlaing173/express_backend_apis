import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import { userRouter } from "../routers/user";
import { exerciseRouter } from '../routers/exercise';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/user", userRouter);
app.use("/exercise", exerciseRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});