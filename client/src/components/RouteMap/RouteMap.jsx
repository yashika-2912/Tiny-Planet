import React from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '© OpenStreetMap © CARTO';

export default function RouteMap({ places = [] }) {
  const usable = places.filter((place) => place.coordinates?.lat && place.coordinates?.lng);
  const center = usable[0]?.coordinates || { lat: 28.6139, lng: 77.2090 };
  const line = usable.map((place) => [place.coordinates.lat, place.coordinates.lng]);

  return (
    <div className="map">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution={ATTRIBUTION} url={DARK_TILES} />
        {usable.map((place) => (
          <Marker key={place.name} position={[place.coordinates.lat, place.coordinates.lng]}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
        {line.length > 1 && <Polyline positions={line} color="#00D4AA" weight={4} />}
      </MapContainer>
    </div>
  );
}
