import { create, list, remove, update } from './resourceApi';
const path = '/admin/payments';
export const paymentsApi = { list: (p) => list(path, p), create: (d) => create(path, d), update: (id, d) => update(path, id, d), remove: (id) => remove(path, id) };
