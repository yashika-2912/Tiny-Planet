import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BudgetChart from '../components/BudgetChart/BudgetChart';
import ItineraryTimeline from '../components/ItineraryTimeline/ItineraryTimeline';
import PlannerForm from '../components/PlannerForm/PlannerForm';
import RouteMap from '../components/RouteMap/RouteMap';
import { generateAiItinerary } from '../redux/slices/aiSlice';
import { saveTrip, setCurrentTrip } from '../redux/slices/tripSlice';

const samplePlaces = [
  { name: 'Gateway checkpoint', coordinates: { lat: 15.4989, lng: 73.8278 } },
  { name: 'Beach sector', coordinates: { lat: 15.5527, lng: 73.7517 } },
  { name: 'Market orbit', coordinates: { lat: 15.5937, lng: 73.8142 } }
];

export default function Planner() {
  const dispatch = useDispatch();
  const { itinerary, budgetBreakdown, tips, generating, error } = useSelector((state) => state.ai);
  const { currentTrip } = useSelector((state) => state.trips);

  const generate = async (form) => {
    const action = await dispatch(generateAiItinerary(form));
    if (action.type.endsWith('/fulfilled')) {
      const trip = { ...form, ...action.payload };
      dispatch(setCurrentTrip(trip));
    }
  };

  const save = () => {
    if (currentTrip) dispatch(saveTrip(currentTrip));
  };

  return (
    <main className="page-shell stack">
      <div className="page-header">
        <div><span className="eyebrow">Planner</span><h2>Generate a route worth waking up for</h2></div>
        {currentTrip && <button className="btn primary" onClick={save}>Save trip</button>}
      </div>
      <section className="grid two-cols">
        <PlannerForm onSubmit={generate} generating={generating} />
        <div className="panel stack">
          <h3>Budget telemetry</h3>
          <BudgetChart breakdown={budgetBreakdown || currentTrip?.budgetBreakdown || { hotel: 10000, food: 5000, transport: 3500, activities: 6500 }} />
          {error && <div className="error">{error}</div>}
          {tips?.length > 0 && <div className="stack">{tips.map((tip) => <div className="badge" key={tip}>{tip}</div>)}</div>}
        </div>
      </section>
      <section className="grid two-cols">
        <div className="panel"><ItineraryTimeline itinerary={itinerary} destination={currentTrip?.destination} /></div>
        <div className="panel stack">
          <h3>Route preview</h3>
          <RouteMap places={samplePlaces} />
        </div>
      </section>
    </main>
  );
}
