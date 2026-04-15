import api from '../../../lib/axios';

export const questionsApi = {
  getByLesson: (lessonId) => api.get(`/admin/questions/${lessonId}`).then(res => res.data),
  saveByLesson: (lessonId, data) => api.put(`/admin/questions/${lessonId}`, data).then(res => res.data),
};
