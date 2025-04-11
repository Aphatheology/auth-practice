import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from 'middlewares/auth';
import * as userService from './user.service';
import { sendSuccess } from '../utils/apiResponse';

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.register(req.body);
  sendSuccess(res, 'User registered successfully', user, StatusCodes.CREATED);
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.login(req.body);
  sendSuccess(res, 'User login successfully', user, StatusCodes.OK);
});

export const getProfile = catchAsync(async (req: CustomRequest, res: Response): Promise<any> => {
    const user = await userService.getProfile(req.user);
    sendSuccess(res, 'User profile fetched successfully', user, StatusCodes.OK);
});

export const refreshAccessToken = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const tokens = await userService.refreshToken(req.body.token);
  sendSuccess(res, 'Token refreshed successfully', StatusCodes.OK);
});

export const logout = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {
  await userService.logout(req.user?.id);
  sendSuccess(res, 'User logged out successfully', StatusCodes.OK);
});
