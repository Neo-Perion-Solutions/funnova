import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useGradeContext } from '../../context/GradeContext';

const GreetingBanner = () => {
  const { student } = useAuth();
  const { activeGrade } = useGradeContext();

  const firstName = student?.name ? student.name.split(' ')[0] : 'Explorer';

  return (
    <div style={styles.banner}>
      <div style={styles.kicker}>Grade {activeGrade}</div>
      <h1 style={styles.title}>Welcome back, {firstName}</h1>
      <p style={styles.subtitle}>Choose a subject to continue your learning journey.</p>
    </div>
  );
};

const styles = {
  banner: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96))',
    padding: '28px 32px',
    borderRadius: '28px',
    border: '1px solid rgba(148, 163, 184, 0.16)',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
    marginBottom: '28px',
    animation: 'slideDown 0.5s ease',
    textAlign: 'left'
  },
  kicker: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    border: '1px solid rgba(37, 99, 235, 0.14)',
    background: 'rgba(37, 99, 235, 0.06)',
    color: '#2563EB',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '6px 12px',
    marginBottom: '14px'
  },
  title: {
    fontSize: '2rem',
    lineHeight: 1.1,
    color: '#0f172a',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '500',
    margin: 0
  }
};

export default GreetingBanner;

