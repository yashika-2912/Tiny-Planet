import React from 'react';
import { Hotel, Star } from 'lucide-react';

export default function HotelCard({ hotel, onAdd, selected = false }) {
  return (
    <article className="card stack">
      <div className="split">
        <h3 className="row"><Hotel size={18} /> {hotel.name}</h3>
        <span className="badge row"><Star size={14} /> {hotel.rating}</span>
      </div>
      <p>{hotel.location} - {hotel.distance || '2.4 km'} from center</p>
      <div className="row">
        {hotel.amenities?.map((amenity) => <span className="badge" key={amenity}>{amenity}</span>)}
      </div>
      <div className="split">
        <strong>Rs {Number(hotel.pricePerNight || 0).toLocaleString('en-IN')}/night</strong>
        <button className={`btn ${selected ? 'ghost' : 'primary'}`} type="button" onClick={() => onAdd?.(hotel)}>
          {selected ? 'Selected' : 'Add'}
        </button>
      </div>
    </article>
  );
}
