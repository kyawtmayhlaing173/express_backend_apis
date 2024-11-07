import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from '../routers/user';
import productRouter from '../routers/product';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/", productRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${port}`);
})