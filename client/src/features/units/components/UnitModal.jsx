import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../../components/shared/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const unitSchema = z.object({
  title: z.string().min(1, 'Unit title is required').min(2, 'Title must be at least 2 characters'),
});

const UnitModal = ({ isOpen, onClose, onSave, unit = null, isLoading = false }) => {
  const isEdit = !!unit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues: { title: '' },
  });

  useEffect(() => {
    if (isOpen) {
      if (unit) {
        reset({ title: unit.title });
      } else {
        reset({ title: '' });
      }
    }
  }, [isOpen, unit, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Unit' : 'Add New Unit'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Update Unit' : 'Create Unit'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Unit Title"
          placeholder="e.g., Fractions, Ecosystems, etc."
          {...register('title')}
          error={errors.title?.message}
        />
      </div>
    </Modal>
  );
};

export default UnitModal;
