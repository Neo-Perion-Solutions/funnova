import React, { useState } from 'react';
import { ShieldAlert, Plus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import AdminUserTable from './components/AdminUserTable';
import AdminUserModal from './components/AdminUserModal';
import AdminUserFilters from './components/AdminUserFilters';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useAdminUsers, useAdminUserMutations } from './hooks/useAdminUsers';
import { useUIStore } from '../../store/uiStore';
import { useAuth } from '../../hooks/useAuth';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ search: '', role: '' });

  // Role-based access: only main_admin can access
  if (user?.role !== 'main_admin') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <PageHeader title="Admin Users" />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-amber-600" />
          <h3 className="mt-4 text-lg font-medium text-amber-900">Admin Access Required</h3>
          <p className="mt-2 text-sm text-amber-800">
            Only main administrators can manage admin users.
          </p>
        </div>
      </div>
    );
  }

  const { data: admins, isLoading } = useAdminUsers(filters);
  const { create, update, remove } = useAdminUserMutations();
  const { activeModal, modalData, openModal, closeModal } = useUIStore();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', role: '' });
  };

  const onSaveAdmin = async (data) => {
    if (activeModal === 'editAdmin') {
      await update.mutateAsync({ id: modalData.id, data });
    } else {
      await create.mutateAsync(data);
    }
    closeModal();
  };

  const onDeleteConfirm = async () => {
    await remove.mutateAsync(modalData.id);
    closeModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Admin Users"
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openModal('addAdmin')}
          >
            Add Admin
          </Button>
        }
      />

      <AdminUserFilters
        values={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <AdminUserTable
        data={admins || []}
        isLoading={isLoading}
        onEdit={(admin) => openModal('editAdmin', admin)}
        onDelete={(admin) => openModal('deleteAdmin', admin)}
      />

      {/* Add / Edit Modal */}
      <AdminUserModal
        isOpen={activeModal === 'addAdmin' || activeModal === 'editAdmin'}
        onClose={closeModal}
        onSave={onSaveAdmin}
        admin={activeModal === 'editAdmin' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={activeModal === 'deleteAdmin'}
        onClose={closeModal}
        onConfirm={onDeleteConfirm}
        isDangerous
        title="Remove Admin"
        message={`Are you sure you want to remove ${modalData?.name}? They will no longer have access to the admin panel.`}
        confirmLabel="Remove Permanently"
        isLoading={remove.isPending}
      />
    </div>
  );
};

export default AdminUsersPage;
