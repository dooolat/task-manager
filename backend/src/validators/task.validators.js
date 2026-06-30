import Joi from 'joi';
import {
  objectIdSchema,
  taskDescriptionSchema,
  taskPrioritySchema,
  taskStatusSchema,
  taskTitleSchema
} from './shared.validators.js';

export const taskIdParamSchema = Joi.object({
  id: objectIdSchema.required()
});

export const taskListQuerySchema = Joi.object({
  search: Joi.string().trim().max(120).allow(''),
  status: taskStatusSchema.empty(''),
  priority: taskPrioritySchema.empty(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const createTaskSchema = Joi.object({
  title: taskTitleSchema.required(),
  description: taskDescriptionSchema,
  status: taskStatusSchema.default('pending'),
  priority: taskPrioritySchema.default('medium'),
  dueDate: Joi.date().allow(null, ''),
  categoryId: objectIdSchema.allow(null, '')
});

export const updateTaskSchema = Joi.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema.allow(null),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: Joi.date().allow(null, ''),
  categoryId: objectIdSchema.allow(null, '')
}).min(1);
