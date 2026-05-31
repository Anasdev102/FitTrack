import { create, list, remove, update } from "./resourceApi";
const path = "/admin/subscriptions";
export const subscriptionsApi = {
  list: (p) => list(path, p),
  create: (d) => create(path, d),
  update: (id, d) => update(path, id, d),
  remove: (id) => remove(path, id),
  approve: (id) => create(`${path}/${id}/approve`, {}),
  confirmCashPayment: (id) => create(`${path}/${id}/confirm-cash-payment`, {}),
  activate: (id) => create(`${path}/${id}/activate`, {}),
  reject: (id) => create(`${path}/${id}/reject`, {}),
};
