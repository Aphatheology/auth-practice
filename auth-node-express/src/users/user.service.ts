import jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';
import ApiError from "../utils/apiError";
import { AuthProviderEnum, IUser } from './user.interface';
import Users from "./user.model";
import config from '../config/config';
import { buildVerificationEmail, sendEmail, buildResetPasswordEmail, buildSetPasswordEmail } from '../utils/email';
import { TokenTypeEnum } from '../tokens/token.model';
import { deleteTokens, createToken, verifyToken } from '../tokens/token.service';

const isEmailTaken = async (email: string): Promise<boolean> => {
  const user = await Users.findOne({ email });
  return !!user;
};

/**
 * Registers a new user with email and password.
 * Hashes the password, stores the user, and generates a JWT token.
 * 
 * @param {Record<string, any>} userBody - The user details from the request (email, password, etc.)
 * @returns {Promise<{ user: Partial<IUser>, token: string }>} The created user (excluding sensitive fields) and a JWT token
 * @throws {ApiError} If the email is already taken
 */
export const register = async (userBody: Record<string, any>): Promise<{ user: IUser; accessToken: string, refreshToken: string }> => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already taken");
  }

  const user = await Users.create(userBody);
  await sendEmailVerification(user);
  const accessToken = await user.createAccessToken();
  const refreshToken = await user.createRefreshToken();

  return { user, accessToken, refreshToken };
};

/**
 * Logs in a user by validating their email and password.
 * If successful, returns user data and a signed JWT token.
 * 
 * @param {{ email: string; password: string }} userBody - The login credentials
 * @returns {Promise<{ user: Partial<IUser>, token: string }>} The authenticated user (excluding sensitive fields) and a JWT token
 * @throws {ApiError} If the credentials are invalid
 */
export const login = async (userBody: { email: string; password: string }): Promise<{ user: IUser; accessToken: string, refreshToken: string }> => {
  const user = await Users.findOne({ email: userBody.email }).select(
    "+password"
  );

  if (!user?.password) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Password not set, use social sign in");
  }

  if (
    !user ||
    !(await user.comparePassword(userBody.password, user.password))
  ) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect email or password"
    );
  }

  const accessToken = await user.createAccessToken();
  const refreshToken = await user.createRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

/**
 * Get logged in user profile
 * @param {IUser} user
 * @returns {Promise<IUser>}
 */
export const getProfile = async (user: IUser): Promise<IUser> => {
  const userProfile = await Users.findOne({ _id: user.id });

  if (!userProfile) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return userProfile;
};

/**
 * Refreshes the user's access and refresh tokens.
 * Verifies the current refresh token, generates new tokens, and updates the user.
 *
 * @param {string} userRefreshToken - The refresh token from the client
 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - The new tokens
 * @throws {ApiError} If the token is invalid or the user does not exist
 */
export const refreshToken = async (userRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const decoded = jwt.verify(userRefreshToken, config.jwt.refreshTokenSecret) as { id: string };
  const user = await Users.findById(decoded.id).select('+refreshToken');;

  if (!user || user.refreshToken !== userRefreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const newAccessToken = await user.createAccessToken();
  const newRefreshToken = await user.createRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * Logs out the user by clearing their refresh token from the database.
 *
 * @param {string} userId - The ID of the user to log out
 * @returns {Promise<void>}
 * @throws {ApiError} If the user is not found
 */
export const logout = async (userId: string): Promise<void> => {
  const user = await Users.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.refreshToken = null;
  await user.save();
};

/**
 * Sends email verification link to the user.
 */
export const sendEmailVerification = async (user: IUser): Promise<void> => {
  await deleteTokens(user._id.toString(), TokenTypeEnum.EMAIL_VERIFICATION);

  const { token, otp } = await createToken(user._id.toString(), TokenTypeEnum.EMAIL_VERIFICATION, 10);
  const html = buildVerificationEmail(otp);
  await sendEmail(user.email, 'Verify your email', html);
};

/**
 * Verifies user's email using token.
 */
export const verifyEmail = async (user: IUser, otp: string): Promise<void> => {
  await verifyToken(user._id.toHexString(), otp, TokenTypeEnum.EMAIL_VERIFICATION);
  user.isEmailVerified = true;
  await user.save();
  await deleteTokens(user._id.toHexString(), TokenTypeEnum.EMAIL_VERIFICATION);
};


/**
 * Sends a password reset link to the user's email.
 */
export const sendForgotPasswordEmail = async (email: string): Promise<void> => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User with email does not exist');
  }
  const { token, otp } = await createToken(user._id.toString(), TokenTypeEnum.FORGOT_PASSWORD, 10);
  const html = buildResetPasswordEmail(otp);
  await sendEmail(email, 'Reset your password', html);
};

/**
 * Resets user password using the token.
 */
export const resetPassword = async (userEmail: string, otp: string, newPassword: string): Promise<void> => {
  const user = await Users.findOne({ email: userEmail });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found");
  }

  await verifyToken(user._id.toHexString(), otp, TokenTypeEnum.FORGOT_PASSWORD);

  user.password = newPassword;
  await user.save();
  await deleteTokens(user._id.toHexString(), TokenTypeEnum.FORGOT_PASSWORD,);
};

export const sendSetPasswordEmail = async (user: IUser): Promise<void> => {
  await deleteTokens(user._id.toString(), TokenTypeEnum.SET_PASSWORD);

  const { token, otp } = await createToken(user._id.toString(), TokenTypeEnum.SET_PASSWORD, 10);
  const html = buildSetPasswordEmail(otp);
  await sendEmail(user.email, 'Set your Password', html);
};

export const setPassword = async (user: IUser, otp: string, newPassword: string): Promise<{ user: IUser }> => {
  console.log(user);
  await verifyToken(user._id.toHexString(), otp, TokenTypeEnum.SET_PASSWORD);

  user.password = newPassword;
  if (!user.authProvider.includes(AuthProviderEnum.EMAIL_PASSWORD)) {
    user.authProvider.push(AuthProviderEnum.EMAIL_PASSWORD);
  }
  await user.save();
  await deleteTokens(user._id.toHexString(), TokenTypeEnum.FORGOT_PASSWORD,);
  return { user };
};
