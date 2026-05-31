import api from './axios';

export const coachAssignmentsApi = {
  list: (params = {}) => api.get('/admin/coach-assignments', { params }),
  create: (payload) => api.post('/admin/coach-assignments', payload),
  approve: (id) => api.post(`/admin/coach-assignments/${id}/approve`),
  reject: (id) => api.post(`/admin/coach-assignments/${id}/reject`),
};
