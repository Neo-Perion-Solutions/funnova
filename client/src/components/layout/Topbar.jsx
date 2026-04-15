import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/students': 'Students',
  '/admin/curriculum': 'Curriculum Manager',
  '/admin/questions': 'Questions',
  '/admin/admin-users': 'Admin Users',
  '/admin/profile': 'Profile',
};

const Topbar = () => {
  const location = useLocation();
  const { user: admin } = useAuth();

  // Determine current title - handle dynamic lesson route
  let currentTitle = pageTitles[location.pathname];
  if (!currentTitle) {
    if (location.pathname.includes('/lesson/')) {
      currentTitle = 'Lesson Studio';
    } else {
      currentTitle = 'Admin';
    }
  }

  // Determine role display label
  const roleLabel = admin?.role === 'main_admin' ? 'Main Admin' : admin?.role === 'sub_admin' ? 'Sub Admin' : 'Admin';

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Admin</p>
          <h2 className="truncate text-xl font-semibold tracking-tight text-gray-950">{currentTitle}</h2>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 sm:flex">
            {roleLabel}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-950">{admin?.name || 'Administrator'}</p>
            <p className="text-xs text-gray-500">{admin?.login_id || 'Admin'}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
            {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
