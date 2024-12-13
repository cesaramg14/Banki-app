import { NextFunction, Request, Response } from "express";

type ErrorController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchError = (controller: ErrorController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch(next);
  };
};
