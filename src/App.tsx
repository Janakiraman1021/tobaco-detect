import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from './lib/store';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'admin' | 'data-entry' }) => {
  const { isAuthenticated, role } = useAuthStore();
  
  if (!isAuthenticated || role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data-entry" 
            element={
              <ProtectedRoute allowedRole="data-entry">
                <DataEntry />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;