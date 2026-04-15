import api from '../../../lib/axios';

export const unitsApi = {
  getAll: (params) => api.get('/admin/units', { params }).then(res => res.data),
  getById: (id) => api.get(`/admin/units/${id}`).then(res => res.data),
  create: (data) => api.post('/admin/units', data).then(res => res.data),
  update: (id, data) => api.put(`/admin/units/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/admin/units/${id}`).then(res => res.data),
  reorder: (data) => api.post('/admin/units/reorder', data).then(res => res.data),
};
