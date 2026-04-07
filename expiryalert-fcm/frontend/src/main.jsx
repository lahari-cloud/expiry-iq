import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import './index.css';

// Register service worker for FCM background messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(reg => console.log('SW registered', reg.scope))
    .catch(err => console.error('SW registration failed', err));
}

const Guard = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white text-sm">Loading…</div>;
  return <Routes><Route path="/" element={user ? <Dashboard /> : <Auth />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider><Guard /></AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
