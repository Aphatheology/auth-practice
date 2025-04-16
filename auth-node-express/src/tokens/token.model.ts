import mongoose, { Schema, Document } from 'mongoose';

export enum TokenTypeEnum {
  EMAIL_VERIFICATION = 'email_verification',
  FORGOT_PASSWORD = 'forgot_password',
}

export interface IToken extends Document {
  user: mongoose.Types.ObjectId;
  type: TokenTypeEnum;
  token: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: TokenTypeEnum, required: true },
    token: { type: String, required: true },
    otp: { type: String, required: false, select: false },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

tokenSchema.index({ otp: 1, type: 1 });

const Token = mongoose.model<IToken>('Token', tokenSchema);
export default Token;
