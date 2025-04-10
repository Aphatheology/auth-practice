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
      required: true,
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
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createJWT = async function (): Promise<string> {
  const payload = {
    id: this._id,
    email: this.email,
    iat: moment().unix(),
    exp: moment().add(config.jwt.expireInMinute, "minutes").unix(),
  };

  return jwt.sign(payload, config.jwt.secret);
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
