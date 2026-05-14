import React from 'react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <main className="page-shell">
      <form className="panel stack" style={{ maxWidth: 500, margin: '40px auto' }} onSubmit={(event) => { event.preventDefault(); dispatch(registerUser(form)); }}>
        <span className="eyebrow">Create your command profile</span>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <label className="label">Name<input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label className="label">Email<input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label className="label">Password<input className="input" type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
        <button className="btn primary" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <a className="btn ghost" href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`}>Continue with Google</a>
        <p>Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
