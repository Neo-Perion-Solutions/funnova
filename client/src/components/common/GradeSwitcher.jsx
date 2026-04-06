import React from 'react';
import { useGradeContext } from '../../context/GradeContext';

const GradeSwitcher = () => {
  const { activeGrade, setActiveGrade } = useGradeContext();

  return (
    <div style={styles.container}>
      <button 
        style={{ ...styles.btn, ...(activeGrade === 4 ? styles.active : styles.inactive) }}
        onClick={() => setActiveGrade(4)}
      >
        Grade 4
      </button>
      <button 
        style={{ ...styles.btn, ...(activeGrade === 5 ? styles.active : styles.inactive) }}
        onClick={() => setActiveGrade(5)}
      >
        Grade 5
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    background: '#f0f0f0',
    borderRadius: 'var(--radius-full)',
    padding: '4px',
    gap: '4px'
  },
  btn: {
    padding: '8px 24px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  active: {
    background: 'linear-gradient(135deg, var(--purple), var(--pink))',
    color: 'white',
    boxShadow: 'var(--shadow-sm)'
  },
  inactive: {
    background: 'transparent',
    color: '#666'
  }
};

export default GradeSwitcher;
