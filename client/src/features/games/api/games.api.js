import api from '../../../lib/axios';

export const gamesApi = {
  getAll: (params) => api.get('/admin/games', { params }).then(res => res.data),
  getById: (id) => api.get(`/admin/games/${id}`).then(res => res.data),
  create: (data) => api.post('/admin/games', data).then(res => res.data),
  update: (id, data) => api.put(`/admin/games/${id}`, data).then(res => res.data),
  toggle: (id) => api.post(`/admin/games/${id}/toggle`).then(res => res.data),
  delete: (id) => api.delete(`/admin/games/${id}`).then(res => res.data),
};
