import React from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LIGHT_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = 'OpenStreetMap contributors';

export default function RouteMap({ places = [] }) {
  const usable = places.filter((place) => place.coordinates?.lat && place.coordinates?.lng);
  const center = usable[0]?.coordinates || { lat: 28.6139, lng: 77.2090 };
  const line = usable.map((place) => [place.coordinates.lat, place.coordinates.lng]);

  return (
    <div className="map">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution={ATTRIBUTION} url={LIGHT_TILES} />
        {usable.map((place, index) => (
          <CircleMarker
            key={place.name}
            center={[place.coordinates.lat, place.coordinates.lng]}
            radius={index === 0 ? 9 : 7}
            pathOptions={{
              color: index === 0 ? '#1d4ed8' : '#0891b2',
              fillColor: index === 0 ? '#2563eb' : '#14b8a6',
              fillOpacity: 0.9,
              weight: 3
            }}
          >
            <Popup>{place.name}</Popup>
          </CircleMarker>
        ))}
        {line.length > 1 && <Polyline positions={line} color="#2563eb" weight={4} />}
      </MapContainer>
    </div>
  );
}
