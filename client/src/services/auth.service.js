import api from './api';

export const login = async (student_id, password) => {
  const response = await api.post('/auth/login', { student_id, password });
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
