import { AppError } from "@utils/appError";
import { NextFunction, Request, Response } from "express";

interface ExtendedError extends Error {
  name: string;
  errors?: { path: string; message: string }[];
  parent?: { detail: string };
}

type ErrorHandler = (
  error: ExtendedError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export const errorHandler: ErrorHandler = (
  error: ExtendedError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error.name === "SequelizeValidationError") {
    const errObj: { [key: string]: string } = {};
    error.errors!.map((er) => {
      errObj[er.path] = er.message;
    });
    return res.status(400).json(errObj);
  }
  if (error.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      message: error.message,
      error: error.parent!.detail,
    });
  }
  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({
      message: error.message,
    });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({
    message: error.message,
    error: error,
  });
};
