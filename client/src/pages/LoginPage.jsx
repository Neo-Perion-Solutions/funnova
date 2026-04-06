import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginCard from '../components/auth/LoginCard';
import FloatingBubbles from '../components/auth/FloatingBubbles';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || isAuthenticated) return null;

  return (
    <div style={styles.container}>
      <FloatingBubbles />
      <div style={styles.content}>
        <LoginCard />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  content: {
    padding: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
};

export default LoginPage;
