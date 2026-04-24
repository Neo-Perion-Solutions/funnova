import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Consolidate tracker and profile into one unified gamification page
const TrackerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/student/profile', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Redirecting to Learning Profile...</p>
    </div>
  );
};

export default TrackerPage;
