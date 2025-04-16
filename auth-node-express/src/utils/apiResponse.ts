import { Response } from "express";

export const sendSuccess = (
  res: Response,
  statusCode = 200,
  message: string,
  data: any = {}
) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode = 400,
  message: string,
  errors: any = {},
) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};
