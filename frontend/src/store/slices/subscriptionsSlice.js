import { subscriptionsApi } from "../../api/subscriptionsApi";
import { createResourceSlice } from "./createResourceSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
const slice = createResourceSlice("subscriptions", subscriptionsApi);
export const {
  fetchItems: fetchSubscriptions,
  createItem: createSubscription,
  updateItem: updateSubscription,
  deleteItem: deleteSubscription,
} = slice.actions;
export const approveSubscription = createAsyncThunk("subscriptions/approve", async (id, { rejectWithValue }) => {
  try {
    return (await subscriptionsApi.approve(id)).data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});
export const confirmCashPayment = createAsyncThunk("subscriptions/confirmCashPayment", async (id, { rejectWithValue }) => {
  try {
    return (await subscriptionsApi.confirmCashPayment(id)).data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});
export const activateSubscription = createAsyncThunk("subscriptions/activate", async (id, { rejectWithValue }) => {
  try {
    return (await subscriptionsApi.activate(id)).data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});
export const rejectSubscription = createAsyncThunk("subscriptions/reject", async (id, { rejectWithValue }) => {
  try {
    return (await subscriptionsApi.reject(id)).data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});
export default slice.reducer;
