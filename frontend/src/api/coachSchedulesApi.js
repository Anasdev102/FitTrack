import { create, list, remove, update } from './resourceApi';

const path = '/admin/coach-schedules';

export const coachSchedulesApi = {
  list: (params) => list(path, params),
  create: (data) => create(path, data),
  update: (id, data) => update(path, id, data),
  remove: (id) => remove(path, id),
};
