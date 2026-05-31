import api from './axios';

export const coachApi = {
  dashboard: () => api.get('/coach/dashboard'),
  schedule: (params = {}) => api.get('/coach/schedule', { params }),
  members: (params = {}) => api.get('/coach/members', { params }),
  member: (id) => api.get(`/coach/members/${id}`),
  attendances: (id) => api.get(`/coach/members/${id}/attendances`),
  notes: (id) => api.get(`/coach/members/${id}/notes`),
  createNote: (id, payload) => api.post(`/coach/members/${id}/notes`, payload),
  trainingPlans: (id) => api.get(`/coach/members/${id}/training-plans`),
  createTrainingPlan: (id, payload) => api.post(`/coach/members/${id}/training-plans`, payload),
};
