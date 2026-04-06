import React, { useState } from 'react';
import LessonBody from './LessonBody';

const LessonSlot = ({ lesson, subjectId, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setExpanded(!expanded)}>
        <div style={styles.titleInfo}>
          <span style={styles.number}>{lesson.lesson_order}</span>
          <h3 style={styles.title}>{lesson.title}</h3>
        </div>
        <button style={styles.toggleBtn}>
          {expanded ? '▲ Close' : '▼ View Lesson'}
        </button>
      </div>

      {expanded && (
        <div style={styles.body}>
          <LessonBody lessonId={lesson.id} subjectId={subjectId} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    marginBottom: '20px',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    cursor: 'pointer',
    background: 'var(--white)',
    borderBottom: '2px solid var(--bg)',
    transition: 'background 0.3s'
  },
  titleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  number: {
    background: 'var(--yellow)',
    color: 'var(--dark)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4rem'
  },
  toggleBtn: {
    background: 'var(--bg)',
    color: 'var(--purple)',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  body: {
    padding: '20px',
    background: '#fafafa',
    animation: 'slideDown 0.3s ease'
  }
};

export default LessonSlot;
