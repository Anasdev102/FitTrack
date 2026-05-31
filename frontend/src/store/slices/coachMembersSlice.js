import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { coachApi } from '../../api/coachApi';

const errorMessage = (error) => error.response?.data?.message || error.message || 'Request failed.';

export const fetchCoachMembers = createAsyncThunk('coachMembers/fetch', async (params, { rejectWithValue }) => {
  try {
    return (await coachApi.members(params)).data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const fetchCoachMember = createAsyncThunk('coachMembers/show', async (id, { rejectWithValue }) => {
  try {
    const [member, attendances] = await Promise.all([coachApi.member(id), coachApi.attendances(id)]);
    return { member: member.data.data || member.data, attendances: attendances.data.data || [] };
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

const coachMembersSlice = createSlice({
  name: 'coachMembers',
  initialState: { items: [], selected: null, attendances: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoachMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(fetchCoachMember.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload.member;
        state.attendances = action.payload.attendances;
      })
      .addMatcher((action) => action.type.startsWith('coachMembers/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('coachMembers/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default coachMembersSlice.reducer;
