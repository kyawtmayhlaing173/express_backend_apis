import jwt from "jsonwebtoken";
import { decode } from "../jwtUtils";
import { Request, Response, NextFunction } from 'express';

export function auth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ msg: "token required" });
    }

    const user = decode(token);
    if (!user) {
        return res.status(401).json({ msg: "incorrect token" });
    }

    res.locals.user = user;
    next();
}