import Joi from 'joi';
import { password } from '../utils/customValidation';

export const register = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string(),
  }),
};

export const login = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

export const refreshToken = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

export const verifyEmail = {
  body: Joi.object({
    otp: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};
