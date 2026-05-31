import api from './axios';
export const dashboardApi = { get: () => api.get('/admin/dashboard'), member: () => api.get('/member/dashboard') };
