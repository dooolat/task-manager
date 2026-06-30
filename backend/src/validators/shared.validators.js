import Joi from 'joi';
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/task.constants.js';

export const objectIdSchema = Joi.string().hex().length(24);

export const emailSchema = Joi.string().trim().lowercase().email({ tlds: { allow: false } });
export const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .messages({
    'string.pattern.base': 'Password must include uppercase, lowercase, and a number'
  });
export const nameSchema = Joi.string().trim().min(2).max(80);

export const taskTitleSchema = Joi.string().trim().min(2).max(120);
export const taskDescriptionSchema = Joi.string().trim().allow('').max(2000);
export const taskStatusSchema = Joi.string().valid(...TASK_STATUSES);
export const taskPrioritySchema = Joi.string().valid(...TASK_PRIORITIES);
export const colorSchema = Joi.string().trim().pattern(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
