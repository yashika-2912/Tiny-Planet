import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import { fetchProfile } from './redux/slices/authSlice';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Planner = lazy(() => import('./pages/Planner'));
const TripDetails = lazy(() => import('./pages/TripDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Chat = lazy(() => import('./pages/Chat'));
const SharedTrip = lazy(() => import('./pages/SharedTrip'));

const PageLoader = () => (
  <main className="page-shell">
    <div className="skeleton hero-skeleton" />
    <div className="grid two-cols">
      <div className="skeleton panel-skeleton" />
      <div className="skeleton panel-skeleton" />
    </div>
  </main>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('token');
    if (oauthToken) {
      localStorage.setItem('tiny_planet_token', oauthToken);
      window.history.replaceState({}, '', window.location.pathname);
    }
    dispatch(fetchProfile());
    const id = window.setInterval(() => {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/health`).catch(() => {});
    }, 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [dispatch]);

  return (
    <div className="app">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/share/:token" element={<SharedTrip />} />
        </Routes>
      </Suspense>
      {isAuthenticated && <Chatbot />}
      <Footer />
    </div>
  );
}
