import api from './api';

export const geocodeItinerary = (payload) => api.post('/api/maps/geocode-itinerary', payload);
export const routeSummary = (places) => api.post('/api/maps/route-summary', { places });
