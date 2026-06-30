import { Router } from 'express';
import {
  addTask,
  editTask,
  getTask,
  getTasks,
  removeTask,
  taskSummary
} from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTaskSchema,
  taskIdParamSchema,
  taskListQuerySchema,
  updateTaskSchema
} from '../validators/task.validators.js';

const router = Router();

router.get('/tasks/summary', requireAuth, taskSummary);
router.get('/tasks', requireAuth, validate({ query: taskListQuerySchema }), getTasks);
router.post('/tasks', requireAuth, validate({ body: createTaskSchema }), addTask);
router.get('/tasks/:id', requireAuth, validate({ params: taskIdParamSchema }), getTask);
router.put('/tasks/:id', requireAuth, validate({ params: taskIdParamSchema, body: updateTaskSchema }), editTask);
router.delete('/tasks/:id', requireAuth, validate({ params: taskIdParamSchema }), removeTask);

export default router;

