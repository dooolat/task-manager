import Joi from 'joi';
import { colorSchema, nameSchema, objectIdSchema } from './shared.validators.js';

export const categoryIdParamSchema = Joi.object({
  id: objectIdSchema.required()
});

export const createCategorySchema = Joi.object({
  name: nameSchema.required(),
  color: colorSchema.default('#6366f1')
});

export const updateCategorySchema = Joi.object({
  name: nameSchema,
  color: colorSchema
}).min(1);

