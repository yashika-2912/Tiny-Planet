import React from 'react';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BudgetChart from '../components/BudgetChart/BudgetChart';
import HotelCard from '../components/HotelCard/HotelCard';
import ItineraryTimeline from '../components/ItineraryTimeline/ItineraryTimeline';
import { getTrip } from '../services/tripService';

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  useEffect(() => { getTrip(id).then(({ data }) => setTrip(data.trip)).catch(() => {}); }, [id]);
  if (!trip) return <main className="page-shell"><div className="skeleton hero-skeleton" /></main>;

  return (
    <main className="page-shell stack">
      <div className="page-header">
        <div><span className="eyebrow">Trip plan</span><h2>{trip.destination}</h2></div>
        <div className="row">
          <span className="badge">{trip.days} days - Rs {Number(trip.budget).toLocaleString('en-IN')}</span>
          <button className="btn primary no-print" type="button" onClick={() => window.print()}><Download size={16} /> Export PDF</button>
        </div>
      </div>
      <section className="grid two-cols">
        <div className="panel"><ItineraryTimeline itinerary={trip.itinerary} destination={trip.destination} /></div>
        <div className="panel"><BudgetChart breakdown={trip.budgetBreakdown} /></div>
      </section>
      {trip.hotels?.length > 0 && (
        <section className="panel stack">
          <span className="eyebrow">Selected stays</span>
          <h3>Hotels added to this trip</h3>
          <div className="grid three-cols">
            {trip.hotels.map((hotel) => <HotelCard key={hotel.name} hotel={hotel} selected />)}
          </div>
        </section>
      )}
    </main>
  );
}
