import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import User from "../users/user.model";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from 'http-status-codes';
import { IUser } from '../users/user.interface';
import config from "../config/config";

export interface CustomRequest extends Request {
  user: IUser;
  token?: string
}

const auth: RequestHandler  = async (req, res, next): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
    }
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
    }

    (req as CustomRequest).user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
