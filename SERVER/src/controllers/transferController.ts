import { Request, Response } from "express";
import { transferFunds } from "../services/transferService";
import { catchError } from "@middlewares/catchError";


export const transferController = catchError(async (req: Request, res: Response) => {
  const { fromAccountNumber, toAccountNumber, amount, description } = req.body;
  if (!fromAccountNumber || !toAccountNumber || amount === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos requeridos para la transferencia'
    });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'El monto debe ser un número positivo'
    });
  }

  if (fromAccountNumber === toAccountNumber) {
    return res.status(400).json({
      status: 'error',
      message: 'No se puede transferir a la misma cuenta'
    });
  }

  const result = await transferFunds({
    fromAccountNumber,
    toAccountNumber,
    amount,
    description
  });

  return res.status(200).json({
    status: 'success',
    message: result.suspicious
      ? "Transferencia realizada con éxito. Nota: Esta transferencia es sospechosa y será revisada."
      : "Transferencia realizada con éxito",
    data: result
  });
});

