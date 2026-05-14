import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BudgetChart from '../components/BudgetChart/BudgetChart';
import ItineraryTimeline from '../components/ItineraryTimeline/ItineraryTimeline';
import HotelCard from '../components/HotelCard/HotelCard';
import PlannerForm from '../components/PlannerForm/PlannerForm';
import RouteMap from '../components/RouteMap/RouteMap';
import { generateAiItinerary } from '../redux/slices/aiSlice';
import { saveTrip, setCurrentTrip } from '../redux/slices/tripSlice';
import { geocodeItinerary } from '../services/mapService';
import { getHotelRecommendations } from '../services/hotelService';

export default function Planner() {
  const dispatch = useDispatch();
  const { itinerary, budgetBreakdown, tips, generating, error } = useSelector((state) => state.ai);
  const { currentTrip } = useSelector((state) => state.trips);
  const [routePlaces, setRoutePlaces] = useState([]);
  const [routeStatus, setRouteStatus] = useState('idle');
  const [hotels, setHotels] = useState([]);
  const [hotelStatus, setHotelStatus] = useState('idle');
  const [selectedHotels, setSelectedHotels] = useState([]);

  useEffect(() => {
    if (!itinerary?.length || !currentTrip?.destination) return;
    let cancelled = false;
    setRouteStatus('loading');
    geocodeItinerary({ destination: currentTrip.destination, itinerary })
      .then(({ data }) => {
        if (!cancelled) {
          setRoutePlaces(data.places || []);
          setRouteStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setRouteStatus('failed');
      });
    return () => { cancelled = true; };
  }, [itinerary, currentTrip?.destination]);

  useEffect(() => {
    if (!currentTrip?.destination || !currentTrip?.budget) return;
    let cancelled = false;
    setHotelStatus('loading');
    getHotelRecommendations({ destination: currentTrip.destination, budget: currentTrip.budget })
      .then(({ data }) => {
        if (!cancelled) {
          setHotels(data.hotels || []);
          setHotelStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setHotelStatus('failed');
      });
    return () => { cancelled = true; };
  }, [currentTrip?.destination, currentTrip?.budget]);

  const generate = async (form) => {
    setRoutePlaces([]);
    setRouteStatus('idle');
    setHotels([]);
    setSelectedHotels([]);
    setHotelStatus('idle');
    const action = await dispatch(generateAiItinerary(form));
    if (action.type.endsWith('/fulfilled')) {
      const trip = { ...form, ...action.payload };
      dispatch(setCurrentTrip(trip));
    }
  };

  const save = () => {
    if (currentTrip) dispatch(saveTrip({ ...currentTrip, hotels: selectedHotels }));
  };

  const addHotel = (hotel) => {
    setSelectedHotels((current) => {
      if (current.some((item) => item.name === hotel.name)) return current;
      const next = [...current, hotel];
      dispatch(setCurrentTrip({ ...currentTrip, hotels: next }));
      return next;
    });
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
          {routeStatus === 'loading' && <p>Finding map coordinates for the generated places...</p>}
          {routeStatus === 'failed' && <div className="error">Could not geocode this itinerary. Showing the map without a route.</div>}
          <RouteMap places={routePlaces} />
        </div>
      </section>
      {currentTrip && (
        <section className="panel stack">
          <div className="split">
            <div>
              <span className="eyebrow">Stay picks</span>
              <h3>Hotel recommendations near {currentTrip.destination}</h3>
            </div>
            {selectedHotels.length > 0 && <span className="badge">{selectedHotels.length} selected</span>}
          </div>
          {hotelStatus === 'loading' && <p>Finding hotels that fit this budget...</p>}
          {hotelStatus === 'failed' && <div className="error">Could not load hotel recommendations.</div>}
          {hotelStatus === 'ready' && hotels.length === 0 && <p>No seeded hotels found for this destination yet. Try Goa, Jaipur, Manali, Delhi, Mumbai, Kerala, Coorg, Shimla, Mysore, Chennai, Udaipur, Gokarna, or Rishikesh.</p>}
          <div className="grid three-cols">
            {hotels.slice(0, 6).map((hotel) => (
              <HotelCard
                key={hotel.name}
                hotel={hotel}
                onAdd={addHotel}
                selected={selectedHotels.some((item) => item.name === hotel.name)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
