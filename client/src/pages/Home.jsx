import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Map, WalletCards } from 'lucide-react';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">AI-powered travel command center</span>
          <h1>Tiny Planet</h1>
          <p>Generate Indian traveler-friendly itineraries, tune budgets, map routes, compare hotels, and keep a context-aware assistant close while you plan.</p>
          <div className="row">
            <Link className="btn primary" to="/planner">Start planning <ArrowRight size={18} /></Link>
            <Link className="btn ghost" to="/dashboard">Open dashboard</Link>
          </div>
          <div className="stats-strip">
            <div className="stat"><strong>15s</strong><span>AI itinerary target</span></div>
            <div className="stat"><strong>₹</strong><span>Smart budget splits</span></div>
            <div className="stat"><strong>OSM</strong><span>Free maps</span></div>
            <div className="stat"><strong>Gemini</strong><span>Free-tier AI core</span></div>
          </div>
        </div>
      </section>
      <main className="page-shell grid three-cols">
        {[
          [BrainCircuit, 'AI itinerary engine', 'Gemini produces structured day-by-day routes with slots, costs, and practical tips.'],
          [WalletCards, 'Budget optimizer', 'Ratios adapt to budget per day, travel type, and interest profile with live chart feedback.'],
          [Map, 'Route cockpit', 'Leaflet, OpenStreetMap, and Haversine TSP keep route planning free-tier friendly.']
        ].map(([Icon, title, copy]) => (
          <article className="panel stack" key={title}>
            <Icon color="#06B6D4" />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </main>
    </>
  );
}
