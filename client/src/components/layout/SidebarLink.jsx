import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/uiStore';

const SidebarLink = ({ to, icon: Icon, label, end = false }) => {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-gray-950 text-white shadow-sm'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-950'
        )
      }
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

export default SidebarLink;
