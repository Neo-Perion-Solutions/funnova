import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import GradeSwitcher from './GradeSwitcher';
import ProfileDropdown from './ProfileDropdown';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { student } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={styles.header}>
      <Link to="/dashboard" style={styles.logoContainer}>
        <h1 style={styles.logo}>🌟 FUNNOVA</h1>
      </Link>
      
      <div style={styles.center}>
        <GradeSwitcher />
      </div>

      <div style={styles.right} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <div style={styles.profileWidget}>
          <span style={styles.avatar}>{student?.avatar_url || '👧'}</span>
          <div style={styles.userInfo}>
            <p style={styles.name}>{student?.name}</p>
            <p style={styles.role}>Grade {student?.grade} {student?.role === 'admin' && '(Admin)'}</p>
          </div>
        </div>
        {dropdownOpen && <ProfileDropdown />}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    background: 'var(--white)',
    boxShadow: 'var(--shadow-sm)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logoContainer: {
    textDecoration: 'none'
  },
  logo: {
    fontSize: '1.8rem',
    background: 'linear-gradient(135deg, var(--purple), var(--pink))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  right: {
    position: 'relative',
    cursor: 'pointer'
  },
  profileWidget: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--bg)',
    padding: '5px 15px 5px 5px',
    borderRadius: 'var(--radius-full)'
  },
  avatar: {
    fontSize: '2rem',
    background: 'white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    fontWeight: '700',
    fontSize: '0.9rem',
    margin: 0
  },
  role: {
    fontSize: '0.8rem',
    color: '#666',
    margin: 0
  }
};

export default Topbar;
