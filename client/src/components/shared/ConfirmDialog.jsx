import React from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  isDangerous = false,
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        {isDangerous && (
          <div className="shrink-0 rounded-lg bg-red-100 p-3 text-red-600">
            <AlertTriangle size={24} />
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed py-1">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
