import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BudgetChart from '../components/BudgetChart/BudgetChart';
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
        <span className="badge">{trip.days} days · ₹{Number(trip.budget).toLocaleString('en-IN')}</span>
      </div>
      <section className="grid two-cols">
        <div className="panel"><ItineraryTimeline itinerary={trip.itinerary} destination={trip.destination} /></div>
        <div className="panel"><BudgetChart breakdown={trip.budgetBreakdown} /></div>
      </section>
    </main>
  );
}
