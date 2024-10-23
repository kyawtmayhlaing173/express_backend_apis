import { PrismaClient, Category } from '@prisma/client'
import { expenseRouter } from '../routers/expense';
import { userRouter } from '../routers/user';
import express from "express";

const prisma = new PrismaClient();
const app = express();

async function main() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/", expenseRouter);
    app.use("/", userRouter);
    
    app.listen(8000, () => {
        console.log("Server running on port 8000");
    });
}

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })