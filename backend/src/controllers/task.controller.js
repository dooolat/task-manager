import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask, deleteTask, getTaskById, getTaskSummary, listTasks, updateTask } from '../services/task.service.js';

export const addTask = asyncHandler(async (req, res) => {
  const task = await createTask(req.userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const result = await listTasks({
    userId: req.userId,
    search: req.query.search,
    status: req.query.status,
    priority: req.query.priority,
    page: req.query.page,
    limit: req.query.limit
  });

  res.status(200).json({
    success: true,
    data: result.tasks,
    meta: result.meta
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.userId, req.params.id);

  res.status(200).json({
    success: true,
    data: task
  });
});

export const editTask = asyncHandler(async (req, res) => {
  const task = await updateTask(req.userId, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task
  });
});

export const removeTask = asyncHandler(async (req, res) => {
  await deleteTask(req.userId, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

export const taskSummary = asyncHandler(async (req, res) => {
  const summary = await getTaskSummary(req.userId);

  res.status(200).json({
    success: true,
    data: summary
  });
});

