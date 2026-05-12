import api from './api';

export const createTrip = (payload) => api.post('/api/trips/create', payload);
export const getTrips = () => api.get('/api/trips/all');
export const getTrip = (id) => api.get(`/api/trips/${id}`);
export const updateTrip = (id, payload) => api.put(`/api/trips/${id}`, payload);
export const deleteTrip = (id) => api.delete(`/api/trips/${id}`);
export const getSharedTrip = (token) => api.get(`/api/trips/share/${token}`);
