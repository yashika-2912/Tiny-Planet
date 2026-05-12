import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BudgetChart from '../components/BudgetChart/BudgetChart';
import TripCard from '../components/TripCard/TripCard';
import { fetchTrips } from '../redux/slices/tripSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { trips } = useSelector((state) => state.trips);
  useEffect(() => { dispatch(fetchTrips()); }, [dispatch]);
  const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.budget || 0), 0);
  const favorite = trips[0]?.destination || 'No destination yet';
  const chart = trips[0]?.budgetBreakdown || { hotel: totalBudget * 0.4, food: totalBudget * 0.2, transport: totalBudget * 0.15, activities: totalBudget * 0.25 };

  return (
    <main className="page-shell stack">
      <div className="page-header">
        <div><span className="eyebrow">Dashboard</span><h2>Travel analytics</h2></div>
      </div>
      <section className="grid three-cols">
        <div className="panel"><span className="eyebrow">Trips planned</span><h2>{trips.length}</h2></div>
        <div className="panel"><span className="eyebrow">Budget mapped</span><h2>₹{totalBudget.toLocaleString('en-IN')}</h2></div>
        <div className="panel"><span className="eyebrow">Favorite signal</span><h2>{favorite}</h2></div>
      </section>
      <section className="grid two-cols">
        <div className="panel"><BudgetChart breakdown={chart} /></div>
        <div className="panel stack">
          <h3>Recent trips</h3>
          {trips.length ? trips.slice(0, 3).map((trip) => <TripCard key={trip._id} trip={trip} />) : <p>Your generated trips will appear here.</p>}
        </div>
      </section>
    </main>
  );
}
