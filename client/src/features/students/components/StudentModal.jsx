import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const avatarOptions = [
  { label: '👨‍🏫 teacher', value: '👨‍🏫' },
  { label: '👦 boy', value: '👦' },
  { label: '👧 girl', value: '👧' },
  { label: '🐱 cat', value: '🐱' },
  { label: '🦊 fox', value: '🦊' },
  { label: '🐼 panda', value: '🐼' },
];

const studentSchema = z.object({
  login_id: z.string().min(3, 'Login ID must be at least 3 characters').optional().or(z.literal('')),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().min(1, 'Section is required').max(5, 'Section too long'),
  avatar_url: z.string().optional(),
});

const StudentModal = ({ isOpen, onClose, onSave, student = null, isLoading = false }) => {
  const isEdit = !!student;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      login_id: '',
      name: '',
      email: '',
      password: '',
      grade: '4',
      section: 'A',
      avatar_url: '👦',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (student) {
        reset({
          login_id: student.login_id || '',
          name: student.name,
          email: student.email,
          password: '', // Don't pre-fill password
          grade: student.grade?.toString() || '4',
          section: student.section || 'A',
          avatar_url: student.avatar_url || '👦',
        });
      } else {
        reset({
          login_id: '',
          name: '',
          email: '',
          password: '',
          grade: '4',
          section: 'A',
          avatar_url: '👦',
        });
      }
    }
  }, [isOpen, student, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Student' : 'Add New Student'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Update Student' : 'Create Student'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        {isEdit && student?.login_id && (
          <div className="rounded-lg bg-indigo-50 p-3 border border-indigo-200">
            <label className="text-xs font-semibold text-gray-700">Login ID</label>
            <p className="text-lg font-mono font-bold text-indigo-600 mt-1">{student.login_id}</p>
          </div>
        )}

        {!isEdit && (
          <Input
            label="Login ID"
            placeholder="e.g. STUDENT-001"
            error={errors.login_id?.message}
            {...register('login_id')}
          />
        )}

        <div className="flex gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="w-1/3">
            <Select
              label="Grade"
              options={[
                { label: 'Grade 3', value: '3' },
                { label: 'Grade 4', value: '4' },
                { label: 'Grade 5', value: '5' },
              ]}
              {...register('grade')}
            />
          </div>
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="student@school.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex gap-4">
          <Input
            label={isEdit ? 'Password (leave blank for no change)' : 'Initial Password'}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="w-1/3">
            <Input
              label="Section"
              placeholder="e.g. A"
              error={errors.section?.message}
              {...register('section')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Choose Avatar</label>
          <div className="grid grid-cols-6 gap-2">
            {avatarOptions.map((opt) => (
              <label 
                key={opt.value}
                className={cn(
                  "flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all hover:bg-indigo-50",
                  "has-checked:border-indigo-600 has-checked:bg-indigo-50 has-checked:shadow-inner"
                )}
              >
                <input
                  type="radio"
                  className="hidden"
                  value={opt.value}
                  {...register('avatar_url')}
                />
                <span className="text-2xl">{opt.value}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

import { cn } from '../../../lib/utils';

export default StudentModal;
