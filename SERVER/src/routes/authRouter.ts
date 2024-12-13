import express from "express";
import {
  registerController,
  verifyRegisterController,
  login
} from "@controllers/authController";

export const authRouter = express.Router();

// Ruta de registro
authRouter.post("/register", registerController);
// login
authRouter.route("/login").post(login);
// Ruta para verificar registro
authRouter.post("/verifyRegister", verifyRegisterController);
