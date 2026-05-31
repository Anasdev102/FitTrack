import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { coachApi } from '../../api/coachApi';

const errorMessage = (error) => error.response?.data?.message || error.message || 'Request failed.';

export const fetchTrainingPlans = createAsyncThunk('trainingPlans/fetch', async (memberId, { rejectWithValue }) => {
  try {
    return (await coachApi.trainingPlans(memberId)).data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const createTrainingPlan = createAsyncThunk('trainingPlans/create', async ({ memberId, data }, { rejectWithValue }) => {
  try {
    return (await coachApi.createTrainingPlan(memberId, data)).data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

const trainingPlansSlice = createSlice({
  name: 'trainingPlans',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(createTrainingPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.data || action.payload);
      })
      .addMatcher((action) => action.type.startsWith('trainingPlans/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('trainingPlans/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default trainingPlansSlice.reducer;
