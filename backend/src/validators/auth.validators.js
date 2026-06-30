import Joi from 'joi';
import { emailSchema, nameSchema, passwordSchema } from './shared.validators.js';

export const registerSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required()
});

export const loginSchema = Joi.object({
  email: emailSchema.required(),
  password: Joi.string().required()
});

