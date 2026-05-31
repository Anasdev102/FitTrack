import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { coachApi } from '../../api/coachApi';

const errorMessage = (error) => error.response?.data?.message || error.message || 'Request failed.';

export const fetchCoachDashboard = createAsyncThunk('coachDashboard/fetch', async (_, { rejectWithValue }) => {
  try {
    return (await coachApi.dashboard()).data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

const coachDashboardSlice = createSlice({
  name: 'coachDashboard',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoachDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCoachDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default coachDashboardSlice.reducer;
