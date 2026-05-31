import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { coachApi } from '../../api/coachApi';

const errorMessage = (error) => error.response?.data?.message || error.message || 'Request failed.';

export const fetchCoachNotes = createAsyncThunk('coachNotes/fetch', async (memberId, { rejectWithValue }) => {
  try {
    return (await coachApi.notes(memberId)).data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const createCoachNote = createAsyncThunk('coachNotes/create', async ({ memberId, note }, { rejectWithValue }) => {
  try {
    return (await coachApi.createNote(memberId, { note })).data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

const coachNotesSlice = createSlice({
  name: 'coachNotes',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoachNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(createCoachNote.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.data || action.payload);
      })
      .addMatcher((action) => action.type.startsWith('coachNotes/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('coachNotes/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default coachNotesSlice.reducer;
