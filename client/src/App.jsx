import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoanProvider } from './context/LoanContext';

import Login from './pages/Login';
import Register from './pages/Register';
import BorrowerDashboard from './pages/BorrowerDashboard';
import LenderDashboard from './pages/LenderDashboard';
import Marketplace from './pages/Marketplace';
import CreateLoan from './pages/CreateLoan';
import Navbar from './components/common/Navbar';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {user?.role === 'borrower' ? <BorrowerDashboard /> : <LenderDashboard />}
        </ProtectedRoute>
      } />
      
      <Route path="/marketplace" element={
        <ProtectedRoute allowedRoles={['lender']}>
          <Marketplace />
        </ProtectedRoute>
      } />
      
      <Route path="/create-loan" element={
        <ProtectedRoute allowedRoles={['borrower']}>
          <CreateLoan />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoanProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </LoanProvider>
    </AuthProvider>
  );
}

export default App;