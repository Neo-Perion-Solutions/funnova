import React from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user: admin } = useAuth();

  // Determine role display
  const roleLabel = admin?.role === 'main_admin' ? 'Main Administrator' : admin?.role === 'sub_admin' ? 'Sub Administrator' : 'Administrator';
  const roleColor = admin?.role === 'main_admin' ? 'orange' : 'blue';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>
              <p className="mt-1 text-sm text-gray-500">View and manage your admin account.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-950 text-xl font-bold text-white">
            {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{admin?.name || 'Administrator'}</h2>
            <p className="text-sm text-gray-600">{admin?.login_id || 'Admin Account'}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${roleColor === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                <Shield size={14} />
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <User size={18} />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="mt-1 text-base text-gray-900">{admin?.name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Login ID</label>
              <p className="mt-1 font-mono text-base text-gray-900">{admin?.login_id || 'Not set'}</p>
            </div>
            {admin?.grade && (
              <div>
                <label className="text-sm font-medium text-gray-600">Grade</label>
                <p className="mt-1 text-base text-gray-900">Grade {admin.grade}</p>
              </div>
            )}
            {admin?.section && (
              <div>
                <label className="text-sm font-medium text-gray-600">Section</label>
                <p className="mt-1 text-base text-gray-900">{admin.section}</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Role & Permissions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Shield size={18} />
            Role & Permissions
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Admin Role</label>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${roleColor === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                  <Shield size={16} />
                  {roleLabel}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Access Level</label>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {admin?.role === 'main_admin' ? (
                  <>
                    <li>✓ Dashboard access</li>
                    <li>✓ Manage students</li>
                    <li>✓ Manage curriculum</li>
                    <li>✓ Manage questions</li>
                    <li>✓ Manage admin users</li>
                    <li>✓ View profile</li>
                  </>
                ) : (
                  <>
                    <li>✓ Dashboard access</li>
                    <li>✓ Manage students</li>
                    <li>✓ Manage questions</li>
                    <li>✓ View profile</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            Edit Profile
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            Change Password
          </button>
        </div>
      </div>

      {/* Member Since */}
      {admin?.created_at && (
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <p>
            Member since{' '}
            <span className="font-semibold text-gray-900">
              {new Date(admin.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
