import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import { buildPaginationMeta } from '../utils/pagination.js';

const { Types } = mongoose;

const ensureCategoryOwnership = async (userId, categoryId) => {
  if (!categoryId) {
    return null;
  }

  const category = await Category.findOne({ _id: categoryId, userId });

  if (!category) {
    throw new ApiError(400, 'Selected category was not found for this account');
  }

  return category;
};

const normalizeTaskPayload = async (userId, payload) => {
  const normalizedPayload = {
    ...payload
  };

  if (Object.prototype.hasOwnProperty.call(payload, 'categoryId')) {
    await ensureCategoryOwnership(userId, payload.categoryId);
    normalizedPayload.categoryId = payload.categoryId || null;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'dueDate')) {
    normalizedPayload.dueDate = payload.dueDate || null;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'description') && payload.description == null) {
    normalizedPayload.description = '';
  }

  return normalizedPayload;
};

export const createTask = async (userId, payload) => {
  const normalizedPayload = await normalizeTaskPayload(userId, payload);

  const task = await Task.create({
    ...normalizedPayload,
    userId,
    categoryId: normalizedPayload.categoryId || null
  });

  return Task.findById(task._id).populate('categoryId', 'name color');
};

export const listTasks = async ({ userId, search, status, priority, page, limit }) => {
  const filter = { userId };

  if (search) {
    filter.title = {
      $regex: escapeRegex(search.trim()),
      $options: 'i'
    };
  }

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  const normalizedLimit = Math.min(limit, 100);
  const skip = (page - 1) * normalizedLimit;

  const [total, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit)
      .populate('categoryId', 'name color')
  ]);

  return {
    tasks,
    meta: buildPaginationMeta({ page, limit: normalizedLimit, total })
  };
};

export const getTaskById = async (userId, taskId) => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid task id');
  }

  const task = await Task.findOne({ _id: taskId, userId }).populate('categoryId', 'name color');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

export const updateTask = async (userId, taskId, payload) => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid task id');
  }

  const normalizedPayload = await normalizeTaskPayload(userId, payload);

  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    normalizedPayload,
    {
      new: true,
      runValidators: true
    }
  ).populate('categoryId', 'name color');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

export const deleteTask = async (userId, taskId) => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid task id');
  }

  const task = await Task.findOneAndDelete({ _id: taskId, userId });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

export const getTaskSummary = async (userId) => {
  const [summary] = await Task.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        pending: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
          }
        },
        highPriority: {
          $sum: {
            $cond: [{ $eq: ['$priority', 'high'] }, 1, 0]
          }
        }
      }
    }
  ]);

  return {
    total: summary?.total || 0,
    completed: summary?.completed || 0,
    pending: summary?.pending || 0,
    highPriority: summary?.highPriority || 0
  };
};
