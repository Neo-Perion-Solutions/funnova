import api from '../../../lib/axios';

export const sectionsApi = {
  getAll: (params) => api.get('/admin/sections', { params }).then(res => res.data),
  getById: (id) => api.get(`/admin/sections/${id}`).then(res => res.data),
  create: (data) => api.post('/admin/sections', data).then(res => res.data),
  update: (id, data) => api.put(`/admin/sections/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/admin/sections/${id}`).then(res => res.data),
  reorder: (data) => api.post('/admin/sections/reorder', data).then(res => res.data),
};
