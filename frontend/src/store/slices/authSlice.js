import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

const savedUser = localStorage.getItem('fitmanager_user');
const savedToken = localStorage.getItem('fitmanager_token');

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return (await authApi.login(payload)).data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, 'login'));
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return (await authApi.register(payload)).data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, 'register'));
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.me();
    return response.data.data || response.data;
  } catch {
    return rejectWithValue(null);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch {
    // Demo mode: backend can be offline while Docker is unavailable.
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: savedToken,
    user: safeParseUser(savedUser),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        localStorage.removeItem('fitmanager_token');
        localStorage.removeItem('fitmanager_user');
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('fitmanager_user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('fitmanager_token');
        localStorage.removeItem('fitmanager_user');
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => ['auth/login/fulfilled', 'auth/register/fulfilled'].includes(action.type), (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('fitmanager_token', action.payload.token);
        localStorage.setItem('fitmanager_user', JSON.stringify(action.payload.user));
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected') && action.type !== fetchCurrentUser.rejected.type, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default authSlice.reducer;

function safeParseUser(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem('fitmanager_user');
    return null;
  }
}
