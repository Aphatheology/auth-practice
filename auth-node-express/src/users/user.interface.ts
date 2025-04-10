import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  authProvider: [AuthProviderEnum];
  isEmailVerified: boolean;
  createJWT: () => string;
  comparePassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
}

export enum AuthProviderEnum {
  EMAIL_PASSWORD = "email-password",
  GOOGLE = "google"
}
