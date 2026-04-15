import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { AlertCircle } from 'lucide-react';

const passwordResetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const PasswordResetModal = ({ isOpen, onClose, onConfirm, student = null, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    await onConfirm(student.id, data.password);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Reset Student Password"
      size="md"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
          >
            Reset Password
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Student Info */}
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Student</p>
          <p className="text-lg font-semibold text-gray-900">{student?.name}</p>
          <p className="text-sm text-gray-600">{student?.email}</p>
        </div>

        {/* Warning */}
        <div className="flex gap-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Important</p>
            <p className="text-xs text-amber-800">
              This will immediately change the student's password. They will need to use the new password to login.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </form>
      </div>
    </Modal>
  );
};

export default PasswordResetModal;
