import { Response } from "express";

export const sendSuccess = (
  res: Response,
  message: string,
  data: any = {},
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  errors: any = {},
  statusCode = 400
) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};
