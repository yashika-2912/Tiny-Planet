import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ItineraryTimeline from '../components/ItineraryTimeline/ItineraryTimeline';
import { getSharedTrip } from '../services/tripService';

export default function SharedTrip() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  useEffect(() => { getSharedTrip(token).then(({ data }) => setTrip(data.trip)).catch(() => {}); }, [token]);
  return (
    <main className="page-shell stack">
      <div className="page-header">
        <div><span className="eyebrow">Shared route</span><h2>{trip?.destination || 'Loading trip'}</h2></div>
      </div>
      <ItineraryTimeline itinerary={trip?.itinerary || []} destination={trip?.destination} />
    </main>
  );
}
