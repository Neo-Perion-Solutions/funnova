import React from 'react';
import { useGradeContext } from '../../context/GradeContext';
import { useAuth } from '../../hooks/useAuth';

const GradeSwitcher = () => {
  const { activeGrade } = useGradeContext();
  const { student } = useAuth();

  // Students can only view their assigned grade - no switching allowed
  // Extract grade number from grade string (e.g., "3" from "Grade 3")
  const gradeNumber = student?.grade ? String(student.grade).replace('Grade ', '') : activeGrade;

  return (
    <div style={styles.container}>
      <span style={styles.gradeDisplay}>
        📚 Grade {gradeNumber}
      </span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 24px',
    borderRadius: 'var(--radius-full)',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
    border: '2px solid rgba(139, 92, 246, 0.2)',
  },
  gradeDisplay: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#1E40AF',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }
};

export default GradeSwitcher;
