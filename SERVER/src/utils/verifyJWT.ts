import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface PayloadWithUser extends Request {
    user?: jwt.JwtPayload | string;
}

export const verifyJWT = (
    req: PayloadWithUser,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err, user) => {
        if (err || !user) return res.sendStatus(403);
        req.user = user;
        next();
    });
};