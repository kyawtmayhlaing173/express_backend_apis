const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

/***
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function auth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "token required"});
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).json({ message: "incorrect token"});
    }

    res.locals.user = user;
    next();
}

function isOwner() {
    return async (req, res, next) => {
        const { id } = req.params;
        const user = res.locals.user;

        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
            include: { user: true },
        });
        if (task.user.id == user.id)
            return next();

        res.status(403).json({ message: "Unauthorized user"});
    }
}

module.exports = { auth, isOwner };