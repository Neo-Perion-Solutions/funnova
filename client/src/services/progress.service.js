import api from '../lib/axios';

export const submitProgress = async (student_id, lesson_id, answers) => {
  // answers should be: [{ question_id, answer_given }, ...]
  const response = await api.post('/progress', { student_id, lesson_id, answers });
  return response.data;
};

export const getProgressSummary = async (student_id = null) => {
  const url = student_id ? `/progress/${student_id}` : '/progress/summary';
  const response = await api.get(url);
  return response.data;
};

export const getStudentScores = async (student_id = null) => {
  const url = student_id ? `/progress/${student_id}/scores` : '/progress/scores';
  const response = await api.get(url);
  return response.data;
};

// Alias for convenience
export const getScores = async (student_id = null) => {
  return getStudentScores(student_id);
};

// Submit quiz answers
export const submitQuiz = async (data) => {
  const response = await api.post('/progress/submit-quiz', data);
  return response.data;
};

export const progressService = {
  submitProgress,
  getProgressSummary,
  getStudentScores,
  getScores,
  submitQuiz,
};
