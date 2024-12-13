import express from "express";
import { getAll, updateProfile, deleteUser } from "@controllers/userController";

export const userRouter = express.Router();

userRouter.route("/").get(getAll);
userRouter.route("/:id").put(updateProfile);
userRouter.route("/:id").delete(deleteUser);