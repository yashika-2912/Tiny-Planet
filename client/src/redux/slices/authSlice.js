import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(payload);
    localStorage.setItem('tiny_planet_token', data.token);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to log in');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.register(payload);
    localStorage.setItem('tiny_planet_token', data.token);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to register');
  }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authService.profile();
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'No active session');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('tiny_planet_token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload; state.isAuthenticated = true;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
