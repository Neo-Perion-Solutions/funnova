import api from '../../../lib/axios';

export const subjectsApi = {
  getAll: (params) => api.get('/admin/subjects', { params }).then(res => res.data),
  getById: (id) => api.get(`/admin/subjects/${id}`).then(res => res.data),
  create: (data) => api.post('/admin/subjects', data).then(res => res.data),
  update: (id, data) => api.put(`/admin/subjects/${id}`, data).then(res => res.data),
};
