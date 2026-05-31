import api from './axios';
export const aiApi = { reminder: (payload) => api.post('/admin/ai/reminder', payload) };
