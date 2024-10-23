import express from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { prisma } from "../prisma";
import { generateToken, verifyToken } from "../jwtUtils";

const router = express.Router();
router.use(express.json());

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log('Email', email);
  
  if (!email || !password) {
    return res.status(400).json({ msg: "email and password required" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash },
  });
  const token = generateToken(user);
  res.json({ token, user });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "email and password required" });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            const token = generateToken(user);
            return res.json({ token, user });
        }
    }
    res.status(401).json({ msg: "incorrect email and password" });
});

export const userRouter = router;