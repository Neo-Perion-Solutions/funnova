import React from 'react';
import ScoreBar from './ScoreBar';

const PersonalTracker = ({ data, scores }) => {
  if (!data) return null;

  const correctRate = data.totalQuestionsAnswered > 0 
    ? Math.round((data.correctAnswers / data.totalQuestionsAnswered) * 100) 
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, background: '#e0e7ff'}}>
          <div style={styles.icon}>📚</div>
          <h3>{data.lessonsCompleted}</h3>
          <p>Lessons Completed</p>
        </div>
        <div style={{...styles.statCard, background: '#fce7f3'}}>
          <div style={styles.icon}>❓</div>
          <h3>{data.totalQuestionsAnswered}</h3>
          <p>Questions Answered</p>
        </div>
        <div style={{...styles.statCard, background: '#dcfce7'}}>
          <div style={styles.icon}>🎯</div>
          <h3>{correctRate}%</h3>
          <p>Correct Rate</p>
        </div>
      </div>

      <div style={styles.scoreSection}>
        <h2 style={styles.title}>Subject Progress</h2>
        <div style={styles.scoresList}>
          {scores.map((score, idx) => (
             <ScoreBar key={idx} score={score} />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  statCard: {
    padding: '30px',
    borderRadius: 'var(--radius-xl)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  scoreSection: {
    background: 'white',
    padding: '30px',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-sm)'
  },
  title: {
    fontFamily: 'var(--font-heading)',
    marginBottom: '20px',
    color: 'var(--purple)'
  },
  scoresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }
};

export default PersonalTracker;
