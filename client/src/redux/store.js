import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tripReducer from './slices/tripSlice';
import aiReducer from './slices/aiSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    ai: aiReducer,
    chat: chatReducer
  }
});
