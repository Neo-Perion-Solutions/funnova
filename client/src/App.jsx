import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GradeProvider } from './context/GradeContext';
import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubjectPage from './pages/SubjectPage';
import TrackerPage from './pages/TrackerPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GradeProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/subject/:id" 
              element={
                <PrivateRoute>
                  <SubjectPage />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/tracker" 
              element={
                <PrivateRoute>
                  <TrackerPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </GradeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
