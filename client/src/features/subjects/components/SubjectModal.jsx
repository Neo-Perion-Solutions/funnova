import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const iconOptions = [
  { label: 'Calculations', value: '🧮' },
  { label: 'Books', value: '📚' },
  { label: 'Science', value: '🧪' },
  { label: 'Art', value: '🎨' },
  { label: 'Globe', value: '🌍' },
  { label: 'Brain', value: '🧠' },
];

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name is required'),
  grade: z.string().min(1, 'Grade is required'),
  icon_url: z.string().min(1, 'Icon is required'),
});

const SubjectModal = ({ isOpen, onClose, onSave, subject = null, isLoading = false }) => {
  const isEdit = !!subject;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      grade: '4',
      icon_url: '📚',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (subject) {
        reset({
          name: subject.name,
          grade: subject.grade?.toString() || '4',
          icon_url: subject.icon_url || '📚',
        });
      } else {
        reset({
          name: '',
          grade: '4',
          icon_url: '📚',
        });
      }
    }
  }, [isOpen, subject, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Subject' : 'Add New Subject'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Update Subject' : 'Create Subject'}
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        <Input
          label="Subject Name"
          placeholder="e.g. Mathematics"
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label="Grade Level"
          options={[
            { label: 'Grade 3', value: '3' },
            { label: 'Grade 4', value: '4' },
            { label: 'Grade 5', value: '5' },
          ]}
          disabled={isEdit} // Grade is usually fixed once created
          {...register('grade')}
        />

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Subject Icon</label>
          <div className="grid grid-cols-6 gap-3">
            {iconOptions.map((opt) => (
              <label 
                key={opt.value}
                className={cn(
                  "flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-indigo-50",
                  "has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:checked]:shadow-inner"
                )}
              >
                <input
                  type="radio"
                  className="hidden"
                  value={opt.value}
                  {...register('icon_url')}
                />
                <span className="text-3xl">{opt.value}</span>
              </label>
            ))}
          </div>
          {errors.icon_url && <p className="text-xs text-red-500 font-medium">{errors.icon_url.message}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default SubjectModal;
