const express = require("express");
const router = express.Router();

const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "email and password required"});
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hash },
    });
    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.json({ token, user});
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "email and password required" });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        if (bcrypt.compare(password, user.password)) {
            const token = jwt.sign(user, process.env.JWT_SECRET);
            return res.json({ token, user });
        }
    }
    res.status(401).json({ message: "incorrect email or password"})
});

module.exports = { userRouter: router };