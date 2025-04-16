import crypto from 'crypto';
import moment from 'moment';
import Token, { IToken, TokenTypeEnum } from './token.model';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';

/**
 * Generates a secure random token.
 */
export const generateTokenString = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Creates and stores a token for a user and purpose.
 */
export const createToken = async (
  userId: string,
  type: TokenTypeEnum,
  expiresInMinutes: number
): Promise<{token: string, otp: string}> => {
  const token = generateTokenString();
  const otp = generateOtp();
  const expiresAt = moment().add(expiresInMinutes, 'minutes').toDate();

  await Token.create({
    user: userId,
    type,
    token,
    otp,
    expiresAt
  });

  return { token, otp };
};

/**
 * Verifies if the token is valid, not expired, and matches type.
 */
export const verifyToken = async (
  userId: string,
  otp: string,
  type: TokenTypeEnum, 
): Promise<IToken> => {
  console.log(`db.tokens.find({ user: ${userId}, otp: ${otp}, type: ${type}})`);
  const storedToken = await Token.findOne({ user: userId, otp, type });

  if (!storedToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OTP or already used");
  }

  if (new Date() > storedToken.expiresAt) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Expired OTP");
  }

  return storedToken;
};

/**
 * Deletes all tokens for a user and type (e.g., after verification or password reset).
 */
export const deleteTokens = async (
  userId: string,
  type: TokenTypeEnum
): Promise<void> => {
  await Token.deleteMany({ user: userId, type });
};
