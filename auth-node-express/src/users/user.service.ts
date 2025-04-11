import ApiError from "../utils/apiError";
import { IUser } from './user.interface';
import Users from "./user.model";
import { StatusCodes } from 'http-status-codes';

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
const register = async (userBody: Record<string, any>): Promise<{ user: IUser; token: string }> => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already taken");
  }

  const user = await Users.create(userBody);
  const token = await user.createJWT();

  return { user, token };
};

/**
 * Logs in a user by validating their email and password.
 * If successful, returns user data and a signed JWT token.
 * 
 * @param {{ email: string; password: string }} userBody - The login credentials
 * @returns {Promise<{ user: Partial<IUser>, token: string }>} The authenticated user (excluding sensitive fields) and a JWT token
 * @throws {ApiError} If the credentials are invalid
 */
const login = async (userBody: { email: string; password: string }): Promise<{ user: IUser; token: string }> => {
  const user = await Users.findOne({ email: userBody.email }).select(
    "+password"
  );

  if (
    !user ||
    !(await user.comparePassword(userBody.password, user.password))
  ) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect email or password"
    );
  }
  const token = await user.createJWT();

  return { user, token };
};

/**
 * Get logged in user profile
 * @param {IUser} user
 * @returns {Promise<IUser>}
 */
const getProfile = async (user: IUser | undefined): Promise<IUser> => {
  const userProfile = await Users.findOne({ _id: user?.id });

  if (!userProfile) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return userProfile;
};

export default {
  register,
  login,
  getProfile,
};
