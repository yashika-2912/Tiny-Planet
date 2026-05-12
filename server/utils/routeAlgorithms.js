export const haversine = (a, b) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2
    + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

export const nearestNeighborTSP = (places) => {
  if (!places?.length) return [];
  const visited = new Set();
  const route = [places[0]];
  visited.add(0);
  while (visited.size < places.length) {
    const last = route[route.length - 1];
    let nearest = -1;
    let minDist = Infinity;
    places.forEach((place, index) => {
      if (!visited.has(index)) {
        const d = haversine(last.coordinates, place.coordinates);
        if (d < minDist) {
          minDist = d;
          nearest = index;
        }
      }
    });
    visited.add(nearest);
    route.push(places[nearest]);
  }
  return route;
};
