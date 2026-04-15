import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../../components/shared/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const sectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  type: z.string().min(1, 'Section type is required'),
});

const SectionModal = ({ isOpen, onClose, onSave, section = null, isLoading = false }) => {
  const isEdit = !!section;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: '', type: 'quiz' },
  });

  useEffect(() => {
    if (isOpen) {
      if (section) {
        reset({ title: section.title, type: section.type });
      } else {
        reset({ title: '', type: 'quiz' });
      }
    }
  }, [isOpen, section, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Section' : 'Add New Section'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Update Section' : 'Create Section'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Section Title"
          placeholder="e.g., Quiz, Introduction, etc."
          {...register('title')}
          error={errors.title?.message}
        />
        <Select
          label="Type"
          {...register('type')}
          error={errors.type?.message}
          options={[
            { label: 'Quiz', value: 'quiz' },
            { label: 'Video', value: 'video' },
            { label: 'Game', value: 'game' },
            { label: 'Reading', value: 'reading' },
          ]}
        />
      </div>
    </Modal>
  );
};

export default SectionModal;
