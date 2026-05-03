import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Target, User } from 'lucide-react';

/**
 * MobileFooterNav — Fixed bottom nav, visible ONLY on mobile (max-width: 768px).
 * 4 tabs: Home · Subjects · Missions · Profile. NO GAMES TAB.
 */
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/student/dashboard' },
  { id: 'subjects', label: 'Subjects', icon: BookOpen, path: '/student/dashboard' },
  { id: 'missions', label: 'Missions', icon: Target, path: '/student/dashboard' },
  { id: 'profile', label: 'Profile', icon: User, path: '/student/profile' },
];

const MobileFooterNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item) => {
    if (item.id === 'home' && location.pathname === '/student/dashboard') return true;
    if (item.id === 'profile' && location.pathname === '/student/profile') return true;
    return false;
  };

  return (
    <nav className="dash-mobile-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`dash-nav-item ${active ? 'active' : ''}`}
          >
            <Icon
              size={22}
              strokeWidth={2.5}
              style={{ color: active ? 'var(--dash-primary)' : 'var(--dash-text-muted)' }}
            />
            <span
              style={{
                color: active ? 'var(--dash-primary)' : 'var(--dash-text-muted)',
                fontWeight: active ? 800 : 600,
                fontFamily: 'var(--dash-font-body)',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileFooterNav;
