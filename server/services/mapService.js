const geocodeCache = new Map();

const fallbackCoordinates = {
  goa: { lat: 15.4989, lng: 73.8278 },
  manali: { lat: 32.2396, lng: 77.1887 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  kerala: { lat: 9.9312, lng: 76.2673 },
  coorg: { lat: 12.4244, lng: 75.7382 },
  shimla: { lat: 31.1048, lng: 77.1734 },
  mysore: { lat: 12.2958, lng: 76.6394 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  gokarna: { lat: 14.5479, lng: 74.3188 },
  rishikesh: { lat: 30.0869, lng: 78.2676 }
};

export const osrmRouteUrl = (places = []) => {
  const coords = places
    .filter((place) => place.coordinates?.lng && place.coordinates?.lat)
    .map((place) => `${place.coordinates.lng},${place.coordinates.lat}`)
    .join(';');
  return `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
};

const normalize = (value = '') => String(value).trim().toLowerCase();

export const geocodePlace = async ({ place, destination }) => {
  const query = [place, destination, 'India'].filter(Boolean).join(', ');
  const cacheKey = normalize(query);
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);

  const fallbackKey = Object.keys(fallbackCoordinates).find((key) => normalize(destination).includes(key));
  const fallback = fallbackCoordinates[fallbackKey] || fallbackCoordinates.delhi;

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('q', query);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TinyPlanetDemo/1.0 (local demo)',
        Accept: 'application/json'
      },
      signal: AbortSignal.timeout(3500)
    });
    if (!response.ok) throw new Error(`Nominatim failed with ${response.status}`);
    const data = await response.json();
    const coordinates = data[0]
      ? { lat: Number(data[0].lat), lng: Number(data[0].lon) }
      : fallback;
    geocodeCache.set(cacheKey, coordinates);
    return coordinates;
  } catch {
    geocodeCache.set(cacheKey, fallback);
    return fallback;
  }
};

export const geocodeItinerary = async ({ destination, itinerary = [] }) => {
  const slots = itinerary.flatMap((day) => day.slots || []);
  const uniquePlaces = [...new Set(slots.map((slot) => slot.place).filter(Boolean))].slice(0, 12);
  return Promise.all(uniquePlaces.map(async (place) => ({
    name: place,
    coordinates: await geocodePlace({ place, destination })
  })));
};

export const routeSummary = async (places = []) => {
  const usable = places.filter((place) => place.coordinates?.lat && place.coordinates?.lng);
  if (usable.length < 2) return { distanceKm: 0, durationMin: 0, source: 'none' };
  try {
    const response = await fetch(osrmRouteUrl(usable), { signal: AbortSignal.timeout(3500) });
    if (!response.ok) throw new Error(`OSRM failed with ${response.status}`);
    const data = await response.json();
    const route = data.routes?.[0];
    return {
      distanceKm: Number(((route?.distance || 0) / 1000).toFixed(1)),
      durationMin: Math.round((route?.duration || 0) / 60),
      source: 'osrm'
    };
  } catch {
    return { distanceKm: 0, durationMin: 0, source: 'fallback' };
  }
};
