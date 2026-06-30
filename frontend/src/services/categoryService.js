import api from './api.js';

export const getCategoriesRequest = async () => {
  const response = await api.get('/categories');
  return response.data.data;
};

export const createCategoryRequest = async (payload) => {
  const response = await api.post('/categories', payload);
  return response.data.data;
};

export const updateCategoryRequest = async (id, payload) => {
  const response = await api.put(`/categories/${id}`, payload);
  return response.data.data;
};

export const deleteCategoryRequest = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

