import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  User,
} from 'lucide-react';
import SidebarLink from './SidebarLink';
import { useUIStore } from '../../store/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

// Navigation items with role-based visibility
const ALL_NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, roles: ['main_admin', 'sub_admin'] },
  { to: '/admin/students', label: 'Students', icon: Users, roles: ['main_admin', 'sub_admin'] },
  { to: '/admin/curriculum', label: 'Curriculum', icon: BookOpen, roles: ['main_admin'] },
  { to: '/admin/questions', label: 'Questions', icon: HelpCircle, roles: ['main_admin', 'sub_admin'] },
  { to: '/admin/admin-users', label: 'Admin Users', icon: ShieldCheck, roles: ['main_admin'] },
  { to: '/admin/profile', label: 'Profile', icon: User, roles: ['main_admin', 'sub_admin'] },
];

const Sidebar = () => {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Filter navigation items based on user role
  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    localStorage.removeItem('funnova-admin-auth');
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside
      className={cn(
        'sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-gray-200 bg-white text-gray-600 transition-[width] duration-300',
        collapsed ? 'w-19' : 'w-72'
      )}
    >
      <div className="flex h-20 items-center justify-between px-4">
        <div className={cn('flex min-w-0 items-center gap-3', collapsed && 'justify-center')}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-base font-bold text-white">
            F
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-gray-950">FUNNOVA</h1>
              <p className="text-xs font-medium text-gray-500">Admin console</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}

        {collapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute -right-3 top-7 flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm hover:text-gray-950"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="mx-4 mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Workspace</p>
              <p className="text-sm font-semibold text-gray-950">Learning operations</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      <div className="border-t border-gray-200 px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors',
            'hover:bg-rose-50 hover:text-rose-600',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
