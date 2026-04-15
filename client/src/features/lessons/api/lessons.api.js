import api from '../../../lib/axios';

export const lessonsApi = {
  getAll: (params) => api.get('/admin/lessons', { params }).then(res => res.data),
  getById: (id) => api.get(`/admin/lessons/${id}`).then(res => res.data),
  create: (data) => api.post('/admin/lessons', data).then(res => res.data),
  update: (id, data) => api.put(`/admin/lessons/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/admin/lessons/${id}`).then(res => res.data),
  restore: (id) => api.post(`/admin/lessons/${id}/restore`).then(res => res.data),
  reorder: (data) => api.post('/admin/lessons/reorder', data).then(res => res.data),
};
