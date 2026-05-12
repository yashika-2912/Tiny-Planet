const seededHotels = [
  { name: 'Orbit Stay Panaji', location: 'Goa', coordinates: { lat: 15.4989, lng: 73.8278 }, pricePerNight: 3200, rating: 4.4, distance: '1.8 km', amenities: ['Wi-Fi', 'Breakfast', 'Pool'], source: 'seeded' },
  { name: 'Nebula Nest Baga', location: 'Goa', coordinates: { lat: 15.5527, lng: 73.7517 }, pricePerNight: 4400, rating: 4.6, distance: '3.2 km', amenities: ['Beach access', 'Wi-Fi'], source: 'seeded' },
  { name: 'Station House Jaipur', location: 'Jaipur', coordinates: { lat: 26.9124, lng: 75.7873 }, pricePerNight: 2800, rating: 4.2, distance: '2.1 km', amenities: ['Breakfast', 'Parking'], source: 'seeded' }
];

export const searchHotels = async ({ destination = '', budget = 100000, rating = 0 }) => {
  const maxNightly = Number(budget) / 3 || Number(budget) || 100000;
  return seededHotels.filter((hotel) => (
    hotel.location.toLowerCase().includes(String(destination).toLowerCase())
    && hotel.pricePerNight <= maxNightly
    && hotel.rating >= Number(rating || 0)
  ));
};
