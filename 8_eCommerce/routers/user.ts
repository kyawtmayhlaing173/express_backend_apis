import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "../prisma";
import { generateToken } from "../jwtUtils";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
    const { email, password, name } = req.body as { email: string; password: string; name: string };

    if (!email || !password || !name) {
        res.status(400).json({ msg: "Email and Password required" });
    }

    try {
        const existingUser = await prismaClient.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            res.status(400).json({ msg: "The email already exist." });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data: { email, password: hash, name },
        });

        const token = generateToken(user);
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email: string; password: string; };
        if (!email || !password) {
            res.status(400).json({ msg: "Email and password are required" });
        }

        const user = await prismaClient.user.findUnique({
            where: { email: email }
        });
        console.log(`User ${user?.password}`);

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = generateToken(user);
                res.json({ token, user })
            }
        }
        res.status(401).json({ msg: "Incorrect email and password" });
    } catch (e) {
        res.status(500).json({ msg: "Sign Up Failed" });
    }

});

export default router;