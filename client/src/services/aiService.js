import api from './api';

export const generateItinerary = (payload) => api.post('/api/ai/generate-itinerary', payload);
export const sendChatMessage = (payload) => api.post('/api/ai/chat', payload);
export const getChatHistory = (tripId) => api.get(`/api/ai/chat/${tripId}`);
