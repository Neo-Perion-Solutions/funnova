import api from '../../../lib/axios';

export const dashboardApi = {
  getStats: () => api.get('/admin/stats').then(res => res.data),
};
