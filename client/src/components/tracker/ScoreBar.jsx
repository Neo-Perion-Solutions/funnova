import React from 'react';

const ScoreBar = ({ score }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.name}>{score.icon} {score.subject_name}</span>
        <span style={styles.fraction}>{score.score} / {score.total}</span>
      </div>
      <div style={styles.barBg}>
        <div style={{ ...styles.barFill, width: `${score.percentage}%` }}>
          <span style={styles.percentText}>{score.percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  name: {
    color: 'var(--dark)'
  },
  fraction: {
    color: 'var(--purple)'
  },
  barBg: {
    height: '24px',
    background: '#f0f0f0',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--green), var(--blue))',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '10px',
    transition: 'width 1s ease-out'
  },
  percentText: {
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  }
};

export default ScoreBar;
