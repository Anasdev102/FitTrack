import { paymentsApi } from "../../api/paymentsApi";
import { createResourceSlice } from "./createResourceSlice";
const slice = createResourceSlice("payments", paymentsApi);
export const {
  fetchItems: fetchPayments,
  createItem: createPayment,
  updateItem: updatePayment,
  deleteItem: deletePayment,
} = slice.actions;
export default slice.reducer;
