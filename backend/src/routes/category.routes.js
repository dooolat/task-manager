import { Router } from 'express';
import { addCategory, editCategory, getCategories, removeCategory } from '../controllers/category.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema
} from '../validators/category.validators.js';

const router = Router();

router.get('/categories', requireAuth, getCategories);
router.post('/categories', requireAuth, validate({ body: createCategorySchema }), addCategory);
router.put('/categories/:id', requireAuth, validate({ params: categoryIdParamSchema, body: updateCategorySchema }), editCategory);
router.delete('/categories/:id', requireAuth, validate({ params: categoryIdParamSchema }), removeCategory);

export default router;

