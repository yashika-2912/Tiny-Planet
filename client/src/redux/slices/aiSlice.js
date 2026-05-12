import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as aiService from '../../services/aiService';

export const generateAiItinerary = createAsyncThunk('ai/generate', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await aiService.generateItinerary(payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to generate itinerary');
  }
});

const aiSlice = createSlice({
  name: 'ai',
  initialState: { itinerary: null, budgetBreakdown: null, tips: [], generating: false, error: null },
  reducers: {
    clearAi(state) {
      state.itinerary = null; state.budgetBreakdown = null; state.tips = []; state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAiItinerary.pending, (state) => {
        state.generating = true; state.error = null;
      })
      .addCase(generateAiItinerary.fulfilled, (state, action) => {
        state.generating = false;
        state.itinerary = action.payload.itinerary;
        state.budgetBreakdown = action.payload.budgetBreakdown;
        state.tips = action.payload.tips || [];
      })
      .addCase(generateAiItinerary.rejected, (state, action) => {
        state.generating = false; state.error = action.payload;
      });
  }
});

export const { clearAi } = aiSlice.actions;
export default aiSlice.reducer;
