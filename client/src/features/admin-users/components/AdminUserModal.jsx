import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { AlertCircle } from 'lucide-react';

const adminUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['main_admin', 'sub_admin'], 'Select a valid role'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

const AdminUserModal = ({ isOpen, onClose, onSave, admin = null, isLoading = false }) => {
  const isEdit = !!admin;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'sub_admin',
      password: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (admin) {
        reset({
          name: admin.name,
          email: admin.email,
          role: admin.role || 'sub_admin',
          password: '', // Don't pre-fill password
        });
      } else {
        reset({
          name: '',
          email: '',
          role: 'sub_admin',
          password: '',
        });
      }
    }
  }, [isOpen, admin, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Admin User' : 'Add New Admin'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Update Admin' : 'Create Admin'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        {isEdit && (
          <div className="flex gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Changing the role will affect admin permissions and access levels.
            </p>
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="admin@school.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              label="Role"
              options={[
                { label: 'Main Admin (Full Access)', value: 'main_admin' },
                { label: 'Sub Admin (Limited Access)', value: 'sub_admin' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />
          </div>
        </div>

        <Input
          label={isEdit ? 'Password (leave blank for no change)' : 'Initial Password'}
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </form>
    </Modal>
  );
};

export default AdminUserModal;
