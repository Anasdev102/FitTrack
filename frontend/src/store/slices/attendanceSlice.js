import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { attendanceApi } from '../../api/attendanceApi';
import { mockAttendance } from '../../api/mockData';

function apiErrorMessage(error) {
  const errors = error.response?.data?.errors;
  if (errors) return Object.values(errors).flat().join(' ');
  return error.response?.data?.message || error.message || 'Request failed.';
}

export const fetchAttendance = createAsyncThunk('attendance/fetch', async (params, { rejectWithValue }) => {
  try {
    return (await attendanceApi.list(params)).data;
  } catch (error) {
    if (error.response) return rejectWithValue(apiErrorMessage(error));
    return { data: mockAttendance };
  }
});

export const markAttendance = createAsyncThunk('attendance/mark', async (payload, { rejectWithValue }) => {
  try {
    return (await attendanceApi.mark(payload)).data;
  } catch (error) {
    if (error.response) return rejectWithValue(apiErrorMessage(error));
    return { data: { id: Date.now(), member: { name: 'Demo Member' }, date: '2026-05-22', time: '09:30 AM', ...payload } };
  }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.data || action.payload);
      })
      .addMatcher((action) => action.type.startsWith('attendance/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith('attendance/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default attendanceSlice.reducer;
