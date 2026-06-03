import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { aiApi } from '../../api/aiApi';
import { reminderMessage } from '../../api/mockData';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export const generateReminder = createAsyncThunk('ai/reminder', async (payload, { rejectWithValue }) => {
  try {
    return (await aiApi.reminder(payload)).data;
  } catch (error) {
    if (error.response) return rejectWithValue(getApiErrorMessage(error));
    return { message: reminderMessage(payload) };
  }
});

const aiSlice = createSlice({
  name: 'ai',
  initialState: { message: '', loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addMatcher((action) => action.type.startsWith('ai/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('ai/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default aiSlice.reducer;
