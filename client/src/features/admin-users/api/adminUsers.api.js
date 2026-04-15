import api from '../../../lib/axios';

export const adminUsersApi = {
  getAll: (params) => api.get('/admin/admin-users', { params }).then(res => res.data),
  getById: (id) => api.get(`/admin/admin-users/${id}`).then(res => res.data),
  create: (data) => api.post('/admin/admin-users', data).then(res => res.data),
  update: (id, data) => api.put(`/admin/admin-users/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/admin/admin-users/${id}`).then(res => res.data),
};
