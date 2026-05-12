import React from 'react';
import { CalendarDays, IndianRupee, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TripCard({ trip }) {
  return (
    <Link className="card stack" to={`/trips/${trip._id || trip.id}`}>
      <div className="split">
        <h3 className="row"><MapPin size={18} /> {trip.destination}</h3>
        <span className="badge">{trip.travelType}</span>
      </div>
      <div className="row">
        <span className="badge row"><CalendarDays size={14} /> {trip.days} days</span>
        <span className="badge row"><IndianRupee size={14} /> {Number(trip.budget || 0).toLocaleString('en-IN')}</span>
      </div>
      <p>{trip.interests?.slice(0, 3).join(', ') || 'Curated route'} · {trip.itinerary?.length || 0} planned days</p>
    </Link>
  );
}
