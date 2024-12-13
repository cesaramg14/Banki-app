import { catchError } from "@middlewares/catchError";
import { UserInput } from "@models/User";
import { registerUser, verifyRegister, loginService } from "@services/authService";
import { Request, Response } from "express";

interface RegisterRequestBody {
  name: string;
  email: string;
}

interface OTPRequestBody {
  token: string;
  user: UserInput;
}

/* Comenzar registro de un usuario nuevo */
export const registerController = catchError(
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    // Obtener información del usuario del body
    const { name, email } = req.body;

    // Obtener token del servicio
    const token = await registerUser({ name, email });

    // Retornar token
    return res.status(200).json({ token });
  }
);

/* Validar token OTP para finalizar registro del usuario */
export const verifyRegisterController = catchError(
  async (req: Request<{}, {}, OTPRequestBody>, res: Response) => {
    // Obtener token y usuario del body
    const { token, user } = req.body;

    // Obtener usuario del servicio
    const userCreated = await verifyRegister({ token, user });

    // Retornar usuario creado
    return res.status(201).json(userCreated);
  }
);

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await loginService(email, password);
    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Incorrect credentials") {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
};
