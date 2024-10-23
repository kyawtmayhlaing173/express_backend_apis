import { PrismaClient, Category } from "@prisma/client";
import express from "express";
import { auth } from "../middlewares/auth";

const prisma = new PrismaClient();
const app = express();

app.get("/expenses", auth, async (req, res) => {
    try {
        const user = res.locals.user;
        const data = await prisma.expense.findMany({
            include: { user: true },
            orderBy: { id: "desc" },
            take: 20,
            where: {
                user: {
                    id: user.id
                }
            }
        });
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

app.post("/expense", auth, async (req, res) => {
    const { description, amount, notes, category } = req.body;
    const validCategories: Category[] = Object.values(Category);

    if (!validCategories.includes(category)) {
        return res.status(400).json({ message: `Invalid category: '${category}'. Only supports ${validCategories.join(", ")}` });
    }
    try {
        const user = res.locals.user;

        const expense = await prisma.expense.create({
            data: { description, amount, notes, category, userId: user.id }
        });

        res.json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

export const expenseRouter = app;