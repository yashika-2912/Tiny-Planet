import React from 'react';
import { Clock3, MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ItineraryTimeline({ itinerary = [], destination = 'Your destination' }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const cards = rootRef.current?.querySelectorAll('.slot-card') || [];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [itinerary]);

  if (!itinerary?.length) {
    return <div className="panel">Generate an itinerary to see the daily route timeline.</div>;
  }

  return (
    <div className="timeline" ref={rootRef}>
      {itinerary.map((day) => (
        <section className="day-block" key={day.day}>
          <div className="day-header">Day {day.day} — {destination}</div>
          {day.slots?.map((slot, index) => (
            <article className="card slot-card" key={`${day.day}-${slot.time}-${index}`}>
              <div className="split">
                <div className="row"><Clock3 size={18} /> <strong>{slot.time}</strong></div>
                <span className="badge cost">₹{Number(slot.estimatedCost || 0).toLocaleString('en-IN')}</span>
              </div>
              <h3 className="row"><MapPin size={18} /> {slot.place}</h3>
              <p>{slot.description}</p>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
