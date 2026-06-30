import { asyncHandler } from '../utils/asyncHandler.js';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../services/category.service.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await listCategories(req.userId);

  res.status(200).json({
    success: true,
    data: categories
  });
});

export const addCategory = asyncHandler(async (req, res) => {
  const category = await createCategory({
    userId: req.userId,
    ...req.body
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

export const editCategory = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.userId, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
});

export const removeCategory = asyncHandler(async (req, res) => {
  await deleteCategory(req.userId, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

