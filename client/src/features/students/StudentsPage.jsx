import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import { Plus, UserPlus } from 'lucide-react';
import StudentFilters from './components/StudentFilters';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import PasswordResetModal from './components/PasswordResetModal';
import StudentProgressPanel from './components/StudentProgressPanel';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useStudents, useStudentMutations } from './hooks/useStudents';
import { useUIStore } from '../../store/uiStore';

const StudentsPage = () => {
  // Local filter state
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    section: '',
  });

  const { data: students, isLoading } = useStudents(filters);
  const { create, update, remove, resetPassword } = useStudentMutations();

  // Modal tracking
  const { activeModal, modalData, openModal, closeModal } = useUIStore();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', grade: '', section: '' });
  };

  const onSaveStudent = async (data) => {
    if (activeModal === 'editStudent') {
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

  const onResetPassword = (student) => {
    openModal('resetPassword', student);
  };

  const onPasswordResetConfirm = async (studentId, newPassword) => {
    await resetPassword.mutateAsync({ id: studentId, password: newPassword });
    closeModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Student Management"
        action={
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => openModal('addStudent')}
          >
            Add Student
          </Button>
        }
      />

      <StudentFilters
        values={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <StudentTable
        data={students || []}
        isLoading={isLoading}
        onEdit={(student) => openModal('editStudent', student)}
        onDelete={(student) => openModal('deleteStudent', student)}
        onProgress={(student) => openModal('viewProgress', student)}
        onResetPassword={onResetPassword}
      />

      {/* Add / Edit Modal */}
      <StudentModal
        isOpen={activeModal === 'addStudent' || activeModal === 'editStudent'}
        onClose={closeModal}
        onSave={onSaveStudent}
        student={activeModal === 'editStudent' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={activeModal === 'deleteStudent'}
        onClose={closeModal}
        onConfirm={onDeleteConfirm}
        isDangerous
        title="Remove Student"
        message={`Are you sure you want to remove ${modalData?.name}? This will permanently delete their progress history and account.`}
        confirmLabel="Remove Permanently"
        isLoading={remove.isPending}
      />

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={activeModal === 'resetPassword'}
        onClose={closeModal}
        onConfirm={onPasswordResetConfirm}
        student={modalData}
        isLoading={resetPassword.isPending}
      />

      {/* Progress Slide-over */}
      <StudentProgressPanel
        isOpen={activeModal === 'viewProgress'}
        student={modalData}
        onClose={closeModal}
      />
    </div>
  );
};

export default StudentsPage;
