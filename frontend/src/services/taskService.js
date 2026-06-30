import api from './api.js';

const cleanTaskParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );

export const getTasksRequest = async (params) => {
  const response = await api.get('/tasks', { params: cleanTaskParams(params) });
  return response.data;
};

export const getTaskSummaryRequest = async () => {
  const response = await api.get('/tasks/summary');
  return response.data.data;
};

export const getTaskRequest = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data;
};

export const createTaskRequest = async (payload) => {
  const response = await api.post('/tasks', payload);
  return response.data.data;
};

export const updateTaskRequest = async (id, payload) => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data.data;
};

export const deleteTaskRequest = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
