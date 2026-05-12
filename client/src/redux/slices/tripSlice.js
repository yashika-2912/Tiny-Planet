import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as tripService from '../../services/tripService';

export const fetchTrips = createAsyncThunk('trips/all', async (_, { rejectWithValue }) => {
  try {
    const { data } = await tripService.getTrips();
    return data.trips;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to load trips');
  }
});

export const saveTrip = createAsyncThunk('trips/save', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await tripService.createTrip(payload);
    return data.trip;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to save trip');
  }
});

const tripSlice = createSlice({
  name: 'trips',
  initialState: { trips: [], currentTrip: null, status: 'idle', error: null },
  reducers: {
    setCurrentTrip(state, action) { state.currentTrip = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = 'succeeded'; state.trips = action.payload || [];
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = 'failed'; state.error = action.payload;
      })
      .addCase(saveTrip.fulfilled, (state, action) => {
        state.trips.unshift(action.payload); state.currentTrip = action.payload;
      });
  }
});

export const { setCurrentTrip } = tripSlice.actions;
export default tripSlice.reducer;
