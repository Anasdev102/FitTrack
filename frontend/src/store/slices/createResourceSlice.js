import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mockResources } from '../../api/mockData';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export function createResourceSlice(name, api) {
  const fetchItems = createAsyncThunk(`${name}/fetch`, async (params, { rejectWithValue }) => {
    try {
      return (await api.list(params)).data;
    } catch (error) {
      if (error.response) return rejectWithValue(getApiErrorMessage(error));
      return { data: mockResources[name] || [] };
    }
  });
  const createItem = createAsyncThunk(`${name}/create`, async (payload, { rejectWithValue }) => {
    try {
      return (await api.create(payload)).data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  });
  const updateItem = createAsyncThunk(`${name}/update`, async ({ id, data }, { rejectWithValue }) => {
    try {
      return (await api.update(id, data)).data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  });
  const deleteItem = createAsyncThunk(`${name}/delete`, async (id, { rejectWithValue }) => {
    try {
      await api.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  });

  const slice = createSlice({
    name,
    initialState: { items: [], meta: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchItems.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload.data || action.payload;
          state.meta = action.payload.meta || null;
        })
        .addCase(createItem.fulfilled, (state, action) => {
          state.loading = false;
          state.items.unshift(action.payload.data || action.payload);
        })
        .addCase(updateItem.fulfilled, (state, action) => {
          state.loading = false;
          const item = action.payload.data || action.payload;
          state.items = state.items.map((current) => (current.id === item.id ? item : current));
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
          state.loading = false;
          state.items = state.items.filter((item) => item.id !== action.payload);
        })
        .addMatcher((action) => action.type.startsWith(`${name}/`) && action.type.endsWith('/pending'), (state) => {
          state.loading = true;
          state.error = null;
        })
        .addMatcher((action) => action.type.startsWith(`${name}/`) && action.type.endsWith('/rejected'), (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        });
    },
  });

  return { reducer: slice.reducer, actions: { fetchItems, createItem, updateItem, deleteItem } };
}
