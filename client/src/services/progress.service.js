import api from './api';

export const submitProgress = async (student_id, lesson_id, answers) => {
  // answers should be: [{ question_id, answer_given }, ...]
  const response = await api.post('/progress', { student_id, lesson_id, answers });
  return response.data;
};

export const getProgressSummary = async (student_id) => {
  const response = await api.get(`/progress/${student_id}`);
  return response.data;
};

export const getStudentScores = async (student_id) => {
  const response = await api.get(`/progress/${student_id}/scores`);
  return response.data;
};
