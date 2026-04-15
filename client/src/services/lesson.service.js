import api from '../lib/axios';

export const getSubjects = async (grade) => {
  const response = await api.get(`/subjects?grade=${grade}`);
  return response.data;
};

export const getLessons = async (subject_id) => {
  const response = await api.get(`/lessons?subject_id=${subject_id}`);
  return response.data;
};

export const getLessonDetails = async (lesson_id) => {
  const response = await api.get(`/lessons/${lesson_id}`);
  return response.data;
};

export const createLesson = async (data) => {
  const response = await api.post('/lessons', data);
  return response.data;
};

export const createLessonBulk = async (data) => {
  const response = await api.post('/lessons/bulk', data);
  return response.data;
};

export const createQuestion = async (data) => {
  const response = await api.post('/questions', data);
  return response.data;
};

export const createGame = async (data) => {
  const response = await api.post('/games', data);
  return response.data;
};

export const updateGame = async (id, data) => {
  const response = await api.put(`/games/${id}`, data);
  return response.data;
};
