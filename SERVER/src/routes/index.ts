import express from "express";
import { userRouter } from "./userRouter";
import { authRouter } from "./authRouter";

export const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);