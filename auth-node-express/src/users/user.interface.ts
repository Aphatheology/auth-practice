import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  username: string;
  authProvider: [AuthProviderEnum];
  isEmailVerified: boolean;
  refreshToken?: string | null;
  createAccessToken: () => string;
  createRefreshToken: () => string;
  comparePassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
}

export enum AuthProviderEnum {
  EMAIL_PASSWORD = "email_password",
  GOOGLE = "google"
}
