import { PrismaClient } from '@prisma/client'
import express from "express";

const prisma = new PrismaClient();
const app = express();

async function main() {
    app.get("/", (req, res) => {
        return res.json({ "message": "Hello world" });
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