import { Request, Response, NextFunction } from "express";
import { decode } from "../jwtUtils";
import { prisma } from "../prisma";

export function auth(req: Request, res: Response, next: NextFunction) {
    
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        res.status(400).json({ msg: "Token required" });
    }
    console.log(`Token is ${token}`);
    const decodedUser = decode(token);
    
    if (!decodedUser) {
        res.status(401).json({ msg: "Incorrect token" });
    }
    res.locals.user = decodedUser;
    console.log(`User is ${decodedUser}`);
    next();
}

// export async function isOwner(req: Request, res: Response, next: NextFunction){
//      const { id } = req.params;
//      const user = res.locals.user;

//      const cart = await prisma.cart.findUnique({
//         where: {
//             userId: id,
//         },
//         include: { user: true, product: true },
//      });

//      if (cart?.)
// }