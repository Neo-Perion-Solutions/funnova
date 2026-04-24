import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import GradeSwitcher from './GradeSwitcher';
import ProfileDropdown from './ProfileDropdown';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const Topbar = () => {
  const { student } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={styles.header}>
      <Link to="/student/dashboard" style={styles.logoContainer}>
        <div style={styles.brand}>
          <div style={styles.brandMark}>F</div>
          <div>
            <h1 style={styles.logo}>FUNNOVA</h1>
            <p style={styles.brandSub}>Student learning portal</p>
          </div>
        </div>
      </Link>
      
      <div style={styles.center}>
        <GradeSwitcher />
      </div>

      <div style={styles.right} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <div style={styles.profileWidget}>
          <span style={styles.avatar}>{student?.avatar_url || 'S'}</span>
          <div style={styles.userInfo}>
            <p style={styles.name}>{student?.name}</p>
            <p style={styles.role}>Grade {student?.grade}</p>
          </div>
          <ChevronDown size={16} color="#64748b" />
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
    gap: '24px',
    padding: '18px 28px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logoContainer: {
    textDecoration: 'none'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  brandMark: {
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
    color: 'white',
    fontWeight: 800,
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.18)'
  },
  logo: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0
  },
  brandSub: {
    margin: 0,
    fontSize: '0.78rem',
    color: '#64748b',
    fontWeight: 500
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
    gap: '12px',
    background: 'white',
    padding: '6px 10px 6px 6px',
    borderRadius: '9999px',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)'
  },
  avatar: {
    fontSize: '1rem',
    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    borderRadius: '50%',
    width: '38px',
    height: '38px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#0f172a',
    fontWeight: 700
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    fontWeight: '700',
    fontSize: '0.92rem',
    color: '#0f172a',
    margin: 0
  },
  role: {
    fontSize: '0.8rem',
    color: '#64748b',
    margin: 0
  }
};

export default Topbar;
