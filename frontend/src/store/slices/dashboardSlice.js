import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardApi } from '../../api/dashboardApi';
import { mockDashboard } from '../../api/mockData';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  try {
    return (await dashboardApi.get()).data;
  } catch (error) {
    if (error.response) throw error;
    return mockDashboard;
  }
});

export const fetchMemberDashboard = createAsyncThunk('dashboard/member', async () => {
  try {
    return (await dashboardApi.member()).data;
  } catch (error) {
    throw error;
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher((action) => action.type.startsWith('dashboard/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('dashboard/') && action.type.endsWith('/fulfilled'), (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addMatcher((action) => action.type.startsWith('dashboard/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default dashboardSlice.reducer;
