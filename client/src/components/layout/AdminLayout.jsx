import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import StudentImpersonationPanel from '../../features/admin/components/StudentImpersonationPanel';

const AdminLayout = () => {
  return (
    <div className="admin-shell flex min-h-screen bg-[#f6f8fb] text-gray-950 overflow-hidden">
      <Sidebar />
      <div className="min-w-0 flex-1 flex flex-col relative">
        <StudentImpersonationPanel />
        <Topbar />
        <main className="min-w-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
