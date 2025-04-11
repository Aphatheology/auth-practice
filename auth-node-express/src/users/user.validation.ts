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
    token: Joi.string().required(),
  }),
};
