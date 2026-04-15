import api from '../../../lib/axios';

export const studentsApi = {
  getAll: (params) => api.get('/admin/students', { params }).then(res => res.data),
  getById: (id) => api.get(`/admin/students/${id}`).then(res => res.data),
  getProgress: (id) => api.get(`/admin/students/${id}/progress`).then(res => res.data),
  create: (data) => api.post('/admin/students', data).then(res => res.data),
  update: (id, data) => api.put(`/admin/students/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/admin/students/${id}`).then(res => res.data),
  resetPassword: (id, password) => api.post(`/admin/students/${id}/reset-password`, { password }).then(res => res.data),
};
