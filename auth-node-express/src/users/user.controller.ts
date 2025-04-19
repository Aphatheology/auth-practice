import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from 'middlewares/auth';
import * as userService from './user.service';
import { sendSuccess } from '../utils/apiResponse';

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.register(req.body);
  sendSuccess(res, StatusCodes.CREATED, 'User registered successfully', user);
});

export const googleCallback = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {
  const user = req.user;

  const accessToken = await user.createAccessToken();
  const refreshToken = await user.createRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  // res.redirect(`${config.client.url}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  sendSuccess(res, StatusCodes.OK, 'User login successfully', {user, accessToken, refreshToken});
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.login(req.body);
  sendSuccess(res, StatusCodes.OK, 'User login successfully', user);
});

export const getProfile = catchAsync(async (req: CustomRequest, res: Response): Promise<any> => {
    const user = await userService.getProfile(req.user);
    sendSuccess(res, StatusCodes.OK, 'User profile fetched successfully', user);
});

export const refreshAccessToken = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const tokens = await userService.refreshToken(req.body.refreshToken);
  sendSuccess(res, StatusCodes.OK, 'Token refreshed successfully', tokens);
});

export const logout = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {
  await userService.logout(req.user?.id);
  sendSuccess(res, StatusCodes.OK, 'User logged out successfully');
});

export const sendVerificationEmail = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {
  await userService.sendEmailVerification(req.user);
  sendSuccess(res, StatusCodes.OK, 'Verification email sent successfully');
});

export const verifyEmail = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {
  await userService.verifyEmail(req.user, req.body.otp);
  sendSuccess(res, StatusCodes.OK, 'Email verified successfully');
});

export const forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await userService.sendForgotPasswordEmail(req.body.email);
  sendSuccess(res, StatusCodes.OK, 'Forgot Password OTP sent to email');
});

export const resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, otp, password } = req.body;
  await userService.resetPassword(email, otp, password);
  sendSuccess(res, StatusCodes.OK, 'Password reset successfully');
});
