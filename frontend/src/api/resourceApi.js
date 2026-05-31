import api from './axios';

export const list = (path, params = {}) => api.get(path, { params });
export const create = (path, payload) => api.post(path, payload);
export const update = (path, id, payload) => api.put(`${path}/${id}`, payload);
export const remove = (path, id) => api.delete(`${path}/${id}`);
