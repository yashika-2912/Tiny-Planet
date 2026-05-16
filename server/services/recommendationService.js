const seededHotels = [
  { name: 'Orbit Stay Panaji', location: 'Goa', coordinates: { lat: 15.4989, lng: 73.8278 }, pricePerNight: 3200, rating: 4.4, distance: '1.8 km', amenities: ['Wi-Fi', 'Breakfast', 'Pool'], source: 'seeded' },
  { name: 'Nebula Nest Baga', location: 'Goa', coordinates: { lat: 15.5527, lng: 73.7517 }, pricePerNight: 4400, rating: 4.6, distance: '3.2 km', amenities: ['Beach access', 'Wi-Fi'], source: 'seeded' },
  { name: 'Station House Jaipur', location: 'Jaipur', coordinates: { lat: 26.9124, lng: 75.7873 }, pricePerNight: 2800, rating: 4.2, distance: '2.1 km', amenities: ['Breakfast', 'Parking'], source: 'seeded' },
  { name: 'Amber Sky Haveli', location: 'Jaipur', coordinates: { lat: 26.9855, lng: 75.8513 }, pricePerNight: 5200, rating: 4.7, distance: '4.4 km', amenities: ['Rooftop', 'Heritage rooms', 'Breakfast'], source: 'seeded' },
  { name: 'Mall Road Basecamp', location: 'Manali', coordinates: { lat: 32.2432, lng: 77.1892 }, pricePerNight: 2500, rating: 4.3, distance: '0.9 km', amenities: ['Heater', 'Mountain view', 'Wi-Fi'], source: 'seeded' },
  { name: 'Solang Ridge Lodge', location: 'Manali', coordinates: { lat: 32.3165, lng: 77.1575 }, pricePerNight: 3900, rating: 4.5, distance: '7.2 km', amenities: ['Bonfire', 'Parking', 'Breakfast'], source: 'seeded' },
  { name: 'Fort Metro Stay', location: 'Delhi', coordinates: { lat: 28.6562, lng: 77.2410 }, pricePerNight: 3400, rating: 4.1, distance: '2.0 km', amenities: ['Metro nearby', 'Wi-Fi', 'Breakfast'], source: 'seeded' },
  { name: 'Aerocity Pod Plus', location: 'Delhi', coordinates: { lat: 28.5562, lng: 77.1000 }, pricePerNight: 4600, rating: 4.4, distance: '10.8 km', amenities: ['Airport shuttle', 'Workspace'], source: 'seeded' },
  { name: 'Colaba Transit House', location: 'Mumbai', coordinates: { lat: 18.9067, lng: 72.8147 }, pricePerNight: 5600, rating: 4.2, distance: '1.6 km', amenities: ['Sea link access', 'Wi-Fi'], source: 'seeded' },
  { name: 'Bandra Art Stay', location: 'Mumbai', coordinates: { lat: 19.0607, lng: 72.8362 }, pricePerNight: 6200, rating: 4.6, distance: '8.0 km', amenities: ['Cafe', 'Workspace', 'Breakfast'], source: 'seeded' },
  { name: 'Fort Kochi Courtyard', location: 'Kerala', coordinates: { lat: 9.9656, lng: 76.2422 }, pricePerNight: 4100, rating: 4.7, distance: '2.8 km', amenities: ['Heritage stay', 'Breakfast'], source: 'seeded' },
  { name: 'Alleppey Backwater Inn', location: 'Kerala', coordinates: { lat: 9.4981, lng: 76.3388 }, pricePerNight: 3600, rating: 4.4, distance: '5.1 km', amenities: ['Backwater view', 'Boat desk'], source: 'seeded' },
  { name: 'Madikeri Mist Rooms', location: 'Coorg', coordinates: { lat: 12.4244, lng: 75.7382 }, pricePerNight: 3300, rating: 4.5, distance: '1.4 km', amenities: ['Coffee estate', 'Parking'], source: 'seeded' },
  { name: 'Abbey Falls Retreat', location: 'Coorg', coordinates: { lat: 12.4580, lng: 75.7247 }, pricePerNight: 4800, rating: 4.6, distance: '6.0 km', amenities: ['Nature trail', 'Breakfast'], source: 'seeded' },
  { name: 'Ridge View Shimla', location: 'Shimla', coordinates: { lat: 31.1048, lng: 77.1734 }, pricePerNight: 3700, rating: 4.3, distance: '1.2 km', amenities: ['Valley view', 'Heater'], source: 'seeded' },
  { name: 'Kufri Pine Lodge', location: 'Shimla', coordinates: { lat: 31.0982, lng: 77.2679 }, pricePerNight: 4300, rating: 4.4, distance: '9.5 km', amenities: ['Bonfire', 'Parking'], source: 'seeded' },
  { name: 'Palace Road Mysore', location: 'Mysore', coordinates: { lat: 12.3052, lng: 76.6552 }, pricePerNight: 2900, rating: 4.2, distance: '1.1 km', amenities: ['Breakfast', 'Family rooms'], source: 'seeded' },
  { name: 'Chamundi Garden Stay', location: 'Mysore', coordinates: { lat: 12.2726, lng: 76.6704 }, pricePerNight: 3500, rating: 4.5, distance: '4.7 km', amenities: ['Garden', 'Parking'], source: 'seeded' },
  { name: 'Marina City Rooms', location: 'Chennai', coordinates: { lat: 13.0475, lng: 80.2824 }, pricePerNight: 3100, rating: 4.1, distance: '2.3 km', amenities: ['Beach nearby', 'Wi-Fi'], source: 'seeded' },
  { name: 'Udaipur Lake Quarter', location: 'Udaipur', coordinates: { lat: 24.5854, lng: 73.7125 }, pricePerNight: 5400, rating: 4.7, distance: '1.9 km', amenities: ['Lake view', 'Rooftop'], source: 'seeded' },
  { name: 'Gokarna Shore Hostel', location: 'Gokarna', coordinates: { lat: 14.5479, lng: 74.3188 }, pricePerNight: 1800, rating: 4.3, distance: '2.6 km', amenities: ['Beach access', 'Dorms'], source: 'seeded' },
  { name: 'Rishikesh Ghat Stay', location: 'Rishikesh', coordinates: { lat: 30.0869, lng: 78.2676 }, pricePerNight: 2600, rating: 4.4, distance: '1.5 km', amenities: ['Yoga deck', 'River access'], source: 'seeded' }
];

const imageByLocation = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
  coorg: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=80',
  shimla: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
  mysore: 'https://images.unsplash.com/photo-1600112356915-089abb8fc71a?auto=format&fit=crop&w=900&q=80',
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
  udaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
  gokarna: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=900&q=80'
};

const withImage = (hotel) => {
  const key = hotel.location.toLowerCase();
  return { ...hotel, images: hotel.images?.length ? hotel.images : [imageByLocation[key] || imageByLocation.goa] };
};

export const searchHotels = async ({ destination = '', budget = 100000, rating = 0 }) => {
  const maxNightly = Number(budget) / 3 || Number(budget) || 100000;
  return seededHotels.filter((hotel) => (
    hotel.location.toLowerCase().includes(String(destination).toLowerCase())
    && hotel.pricePerNight <= maxNightly
    && hotel.rating >= Number(rating || 0)
  )).map(withImage);
};
