export const osrmRouteUrl = (places = []) => {
  const coords = places
    .filter((place) => place.coordinates?.lng && place.coordinates?.lat)
    .map((place) => `${place.coordinates.lng},${place.coordinates.lat}`)
    .join(';');
  return `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
};
