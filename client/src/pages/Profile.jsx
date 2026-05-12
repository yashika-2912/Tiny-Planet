import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  return (
    <main className="page-shell">
      <section className="panel stack" style={{ maxWidth: 680 }}>
        <span className="eyebrow">Profile</span>
        <h2>{user?.name || 'Traveler'}</h2>
        <p>{user?.email}</p>
        <div className="grid two-cols">
          <label className="label">Preferred style<input className="input" defaultValue={user?.preferences?.travelStyle || 'solo'} /></label>
          <label className="label">Interests<input className="input" defaultValue={user?.preferences?.interests?.join(', ') || 'Food, Nature'} /></label>
        </div>
        <button className="btn primary" type="button">Update profile</button>
      </section>
    </main>
  );
}
