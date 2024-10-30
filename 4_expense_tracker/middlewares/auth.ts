import jwt from "jsonwebtoken";
import { decode } from "../jwtUtils";
import { Request, Response, NextFunction } from 'express';
import { prisma } from "../prisma";

export function auth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ msg: "Token required" });
    }

    const user = decode(token);
    if (!user) {
        return res.status(401).json({ msg: "Incorrect token" });
    }

    res.locals.user = user;
    next();
}

export function isOwner() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const user = res.locals.user;

        const expense = await prisma.expense.findUnique({
            where: { id: id },
            include: { user: true },
        });

        if (expense?.user.id == user.id) return next();
        res.status(403).json({ message: "Unauthorized user"});
    }
}