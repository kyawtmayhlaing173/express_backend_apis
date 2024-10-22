import { PrismaClient, Category } from '@prisma/client'
import express from "express";

const prisma = new PrismaClient();
const app = express();

async function main() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/expenses", async (req, res) => {
        try {
            const data = await prisma.expense.findMany({
                orderBy: { id: "desc" },
                take: 20,
            });
            res.json(data);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e });
        }
    });

    app.post("/expense", async (req, res) => {
        const { description, amount, notes, category } = req.body;
        const validCategories: Category[] = Object.values(Category);

        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: `Invalid category: '${category}'. Only supports ${validCategories.join(", ")}` });
        }
        try {
            const expense = await prisma.expense.create({
                data: { description, amount, notes, category }
            });
            res.json(expense);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error});
        }
    });
    
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