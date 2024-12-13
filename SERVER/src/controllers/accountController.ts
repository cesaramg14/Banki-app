import { Request, Response } from "express";
import { catchError } from "@middlewares/catchError";
import { 
  registerAccount, 
  validateAccount, 
  getAccountBalance,
  getTransactionHistory, 
  getAccount
} from "@services/accountService";

export const  registerAccountController = async (req: Request, res: Response) => {
  try {
    const { accountNumber, userId, balance } = req.body;

    const newAccount = await registerAccount(accountNumber, userId, balance);

    return res.status(201).json({
      message: "Cuenta registrada exitosamente.",
      account: newAccount
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: "Error desconocido." });
  }
};

export const validateAccountController = async (req: Request, res: Response) => {
  try {
    const { accountNumber, userId } = req.body;

    const account = await validateAccount(accountNumber, userId);

    return res.status(200).json({
      message: "Cuenta válida.",
      account
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: "Error desconocido." });
  }
};

export const getAccountBalanceController = async (req: Request, res: Response) => {
  try {

    const { accountNumber } = req.params;
    const balance = await getAccountBalance(accountNumber);

    return res.status(200).json({
      message: "Saldo de la cuenta obtenido con éxito.",
      balance
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: "Error desconocido." });
  }
};



export const getAccountController = async (req: Request, res: Response) => {
  try {

    const { accountNumber } = req.params;
    const balance = await getAccount(accountNumber);

    return res.status(200).json({
      message: "Cuenta obtenido con éxito.",
      balance
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: "Error desconocido." });
  }
};



export const getTransactionHistoryController = catchError(async (req: Request, res: Response) => {
  const { accountNumber } = req.params;
  const { 
    startDate, 
    endDate, 
    type, 
    page = 1, 
    limit = 10 
  } = req.query;

  const transactions = await getTransactionHistory({
    accountNumber,
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    type: type as 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | undefined,
    page: Number(page),
    limit: Number(limit)
  });

  return res.status(200).json({
    status: 'success',
    data: transactions
  });
});
