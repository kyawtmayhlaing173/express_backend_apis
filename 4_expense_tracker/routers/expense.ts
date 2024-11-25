import { PrismaClient, Category } from "@prisma/client";
import express from "express";
import { auth, isOwner } from "../middlewares/auth";
import { getDateRange } from "../middlewares/dateTime";

const prisma = new PrismaClient();
const app = express();

app.get("/expenses", auth, async (req, res) => {
    try {
        const user = res.locals.user;
        const { category } = req.body;
        const { startDate, endDate, filter } = req.query;

        const startDateString = typeof startDate === 'string' ? startDate : undefined;
        const endDateString = typeof endDate === 'string' ? endDate : undefined;
        const filterString = typeof filter === 'string' ? filter : undefined;

        let filterStartDate, filterEndDate;
        try {
            ({ filterStartDate, filterEndDate } = getDateRange(filterString, startDateString, endDateString));
        } catch (error) {
            return res.status(400).send({ error: (error as Error).message });
        }

        const data = await prisma.expense.findMany({
            include: { user: true },
            orderBy: { id: "desc" },
            take: 20,
            where: {
                user: {
                    id: user.id
                },
                ...(category && { category: category }),
                createdAt: { gte: filterStartDate, lte: filterEndDate }
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

        await prisma.expense.create({
            data: { description, amount, notes, category, userId: user.id }
        });

        res.status(200).json({ message: "Successfully updated the task" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

app.put("/expense/:id", auth, async (req, res) => {
    const { description, amount, category, notes } = req.body;
    const { id } = req.params;

    try {
        await prisma.expense.updateMany({
            where: { id: id },
            data: {
                description, amount, category, notes,
            }
        });
        const expense = await prisma.expense.findUnique({
            where: { id: id },
            include: { user: true }
        })
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.delete("/expense/:id", auth, isOwner(), async (req, res) => {
    const { id } = req.params;
    
    try {
        const expense = await prisma.expense.findUnique({
            where: { id: id },
        });
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" })
        }
        await prisma.expense.delete({
            where: { id: id }
        });
        res.json({ message: "Expense is successfully deleted" });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

export const expenseRouter = app;