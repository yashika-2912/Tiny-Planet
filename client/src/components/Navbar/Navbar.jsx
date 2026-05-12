import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut, Menu, Rocket } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../../redux/slices/authSlice';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const links = isAuthenticated
    ? [['/dashboard', 'Dashboard'], ['/planner', 'Planner'], ['/profile', 'Profile']]
    : [['/login', 'Login'], ['/register', 'Register']];

  return (
    <header className="navbar">
      <Link className="brand" to="/"><Rocket size={22} /> Tiny Planet</Link>
      <button className="icon-btn nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu"><Menu /></button>
      <nav className={open ? 'open' : ''}>
        {links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        {isAuthenticated && (
          <button className="btn ghost" onClick={() => dispatch(logout())}>
            <LogOut size={16} /> {user?.name || 'Logout'}
          </button>
        )}
      </nav>
    </header>
  );
}
