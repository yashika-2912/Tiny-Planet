import api from './api';

export const getHotelRecommendations = ({ destination, budget }) => (
  api.get('/api/hotels/recommendations', { params: { destination, budget } })
);
