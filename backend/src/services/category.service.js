import Category from '../models/Category.js';
import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const findCategoryByName = async (userId, name, excludeCategoryId = null) => {
  const category = await Category.findOne({
    userId,
    name: {
      $regex: `^${escapeRegex(name.trim())}$`,
      $options: 'i'
    },
    ...(excludeCategoryId ? { _id: { $ne: excludeCategoryId } } : {})
  });

  return category;
};

export const createCategory = async ({ userId, name, color }) => {
  const existing = await findCategoryByName(userId, name);

  if (existing) {
    throw new ApiError(409, 'Category name already exists');
  }

  const category = await Category.create({
    userId,
    name: name.trim(),
    color
  });

  return category;
};

export const listCategories = async (userId) =>
  Category.find({ userId }).sort({ name: 1, createdAt: -1 });

export const updateCategory = async (userId, categoryId, updates) => {
  const existing = await Category.findOne({ _id: categoryId, userId });

  if (!existing) {
    throw new ApiError(404, 'Category not found');
  }

  if (updates.name) {
    const duplicate = await findCategoryByName(userId, updates.name, categoryId);
    if (duplicate) {
      throw new ApiError(409, 'Category name already exists');
    }
    existing.name = updates.name.trim();
  }

  if (updates.color) {
    existing.color = updates.color;
  }

  await existing.save();
  return existing;
};

export const deleteCategory = async (userId, categoryId) => {
  const category = await Category.findOneAndDelete({ _id: categoryId, userId });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  await Task.updateMany(
    { userId, categoryId: category._id },
    { $set: { categoryId: null } }
  );

  return category;
};

