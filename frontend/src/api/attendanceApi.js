import api from './axios';
export const attendanceApi = {
  list: (params) => api.get('/admin/attendance', { params }),
  mark: (payload) => api.post('/admin/attendance', payload),
  searchMembers: (search) => api.get('/admin/attendance/search-members', { params: { search } }),
};
