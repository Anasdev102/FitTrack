import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { aiApi } from '../../api/aiApi';
import { reminderMessage } from '../../api/mockData';

export const generateReminder = createAsyncThunk('ai/reminder', async (payload) => {
  try {
    return (await aiApi.reminder(payload)).data;
  } catch (error) {
    if (error.response) throw error;
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
        state.message = action.payload.message;
      })
      .addMatcher((action) => action.type.startsWith('ai/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith('ai/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default aiSlice.reducer;
