import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useImpersonation } from '../../context/ImpersonationContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isImpersonating } = useImpersonation();

  if (loading) return <LoadingSpinner />;

  // Allow access if authenticated OR if impersonating (admin pretending to be student)
  return isAuthenticated || isImpersonating ? children : <Navigate to="/student/login" />;
};

export default PrivateRoute;
