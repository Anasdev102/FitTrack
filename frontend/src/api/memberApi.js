import api from './axios';

export const memberApi = {
  plans: () => api.get('/plans'),
  subscribe: (payload) => api.post('/member/subscriptions/request', payload),
  dashboard: () => api.get('/member/dashboard'),
  subscriptions: () => api.get('/member/subscriptions'),
  currentSubscription: () => api.get('/member/subscriptions/current'),
  subscriptionHistory: () => api.get('/member/subscriptions/history'),
  payments: () => api.get('/member/payments'),
  attendances: () => api.get('/member/attendances'),
  updateProfile: (payload) => api.put('/member/profile', payload),
};
