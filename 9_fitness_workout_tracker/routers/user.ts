import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { generateToken } from "../jwtUtils";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
    const { email, password, username } = req.body as { email: string; password: string; username: string };

    if (!email || !password || !username) {
        res.status(400).json({ msg: "Email and Password required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            res.status(400).json({ msg: "The email already exist." });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hash, username },
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

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = generateToken(user);
                res.json({ token, user })
            } else {
                res.status(401).json({ msg: "Incorrect email and password" });
            }
        } else {
            res.status(401).json({ msg: "Incorrect email and password" });
        }
    } catch (e) {
        res.status(500).json({ msg: "Sign Up Failed" });
    }
});

export const userRouter = router;