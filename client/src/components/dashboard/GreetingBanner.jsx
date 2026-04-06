import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useGradeContext } from '../../context/GradeContext';

const GreetingBanner = () => {
  const { student } = useAuth();
  const { activeGrade } = useGradeContext();

  return (
    <div style={styles.banner}>
      <h1 style={styles.title}>Hi {student?.name.split(' ')[0]}! 🎉</h1>
      <p style={styles.subtitle}>Grade {activeGrade} — Choose a subject to start your adventure!</p>
    </div>
  );
};

const styles = {
  banner: {
    background: 'white',
    padding: '30px',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
    marginBottom: '30px',
    animation: 'slideDown 0.5s ease',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    color: 'var(--dark)',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    fontWeight: 'bold',
    margin: 0
  }
};

export default GreetingBanner;
