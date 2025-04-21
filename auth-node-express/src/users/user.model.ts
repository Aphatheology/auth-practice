import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { AuthProviderEnum, IUser } from './user.interface';

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    username: {
      type: String,
      required: false,
    },
    authProvider: {
      type: [String],
      enum: AuthProviderEnum,
      required: true,
      default: [AuthProviderEnum.EMAIL_PASSWORD]
    },
    isEmailVerified: { type: Boolean, default: false },
    refreshToken: {
      type: String,
      default: null,
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this?.password, salt);
  next();
});

userSchema.methods.createAccessToken = async function (): Promise<string> {
  const payload = {
    id: this._id,
    email: this.email,
    iat: moment().unix(),
    exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
  };

  return jwt.sign(payload, config.jwt.accessTokenSecret);
};

userSchema.methods.createRefreshToken = async function (): Promise<string> {
  return jwt.sign({ id: this._id }, config.jwt.refreshTokenSecret, {
    expiresIn: moment().add(config.jwt.refreshTokenExpireInMinute, "minutes").unix(),
  });
};

/**
 * Compares a candidate password with the user's stored hash
 * @param {string} candidatePassword
 * @param {string} userPassword
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
