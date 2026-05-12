import React from 'react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <main className="page-shell">
      <form className="panel stack" style={{ maxWidth: 460, margin: '40px auto' }} onSubmit={(event) => { event.preventDefault(); dispatch(loginUser(form)); }}>
        <span className="eyebrow">Welcome back</span>
        <h2>Log in</h2>
        {error && <div className="error">{error}</div>}
        <label className="label">Email<input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label className="label">Password<input className="input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
        <button className="btn primary" disabled={loading}>{loading ? 'Launching...' : 'Log in'}</button>
        <p>No account yet? <Link to="/register">Create one</Link></p>
      </form>
    </main>
  );
}
