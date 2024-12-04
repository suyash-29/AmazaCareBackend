import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const location = useLocation();

  if (location.pathname === '/login' && isAuthenticated) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
