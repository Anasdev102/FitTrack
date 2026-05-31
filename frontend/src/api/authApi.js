import api from './axios';

export const authApi = {
  login: (payload) => api.post('/login', payload),
  register: (payload) => api.post('/register', payload),
  me: () => api.get('/me'),
  logout: () => api.post('/logout'),
};
