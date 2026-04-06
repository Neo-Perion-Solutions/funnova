import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { getStudentScores } from '../../services/progress.service';

const ProfileDropdown = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (student) {
      getStudentScores(student.id).then(setScores).catch(console.error);
    }
  }, [student]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.dropdown}>
      <div style={styles.header}>
        <div style={styles.avatarLarge}>{student?.avatar_url || '👧'}</div>
        <h3 style={styles.name}>{student?.name}</h3>
        <p style={styles.details}>Grade {student?.grade} | Section {student?.section}</p>
      </div>
      
      <div style={styles.scoreSection}>
        <h4 style={styles.scoreTitle}>My Progress</h4>
        {scores.map((s, i) => (
          <div key={i} style={styles.scoreItem}>
            <div style={styles.scoreHeader}>
              <span>{s.icon} {s.subject_name}</span>
              <span>{s.percentage}%</span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${s.percentage}%` }}></div>
            </div>
          </div>
        ))}
        <Link to="/tracker" style={styles.trackerLink}>View Full Tracker 📊</Link>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>Logout 👋</button>
    </div>
  );
};

const styles = {
  dropdown: {
    position: 'absolute',
    top: '60px',
    right: '0',
    width: '300px',
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '20px',
    zIndex: 1000,
    animation: 'slideDown 0.3s ease'
  },
  header: {
    textAlign: 'center',
    borderBottom: '2px dashed #eee',
    paddingBottom: '15px'
  },
  avatarLarge: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  name: {
    margin: '0 0 5px 0',
    fontSize: '1.2rem',
    fontFamily: 'var(--font-heading)'
  },
  details: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem'
  },
  scoreSection: {
    padding: '15px 0'
  },
  scoreTitle: {
    margin: '0 0 10px 0',
    fontSize: '1rem'
  },
  scoreItem: {
    marginBottom: '10px'
  },
  scoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    marginBottom: '4px',
    fontWeight: 'bold'
  },
  barBg: {
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--green), var(--blue))',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  trackerLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '15px',
    color: 'var(--purple)',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: '#ffeeee',
    color: 'var(--red)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: 'bold',
    marginTop: '10px',
    cursor: 'pointer'
  }
};

export default ProfileDropdown;
