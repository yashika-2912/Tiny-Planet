import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as aiService from '../../services/aiService';

export const sendMessage = createAsyncThunk('chat/send', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await aiService.sendChatMessage(payload);
    return data.messages;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Tiny is offline');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], loading: false, error: null },
  reducers: {
    hydrateChat(state, action) { state.messages = action.payload || []; },
    clearChat(state) { state.messages = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true; state.error = null;
        state.messages.push({ role: 'user', content: action.meta.arg.message });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false; state.messages = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });
  }
});

export const { hydrateChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
