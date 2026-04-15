import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useUIStore } from '../../../store/uiStore';
import { useSections, useSectionMutations } from '../hooks/useSections';
import SectionModal from './SectionModal';

const SectionListForLesson = ({ lessonId }) => {
  const { activeModal, modalData, openModal, closeModal } = useUIStore();
  const { data: sections = [], isLoading } = useSections({ lesson_id: lessonId });
  const { create, update, remove } = useSectionMutations();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSave = async (data) => {
    if (activeModal === 'editSection') {
      await update.mutateAsync({ id: modalData.id, data });
    } else {
      await create.mutateAsync({ ...data, lesson_id: lessonId });
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await remove.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const columns = [
    {
      key: 'sequence',
      label: '#',
      width: '60px',
      render: (row) => <span className="font-semibold text-gray-900">{row.section_order}</span>,
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => <span className="font-medium text-gray-900">{row.title}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700">
          {row.type || 'quiz'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openModal('editSection', row)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteConfirm(row.id)}
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading sections...</div>;
  }

  return (
    <div className="space-y-6">
      {sections.length === 0 ? (
        <EmptyState
          icon={Edit2}
          title="No Sections"
          description="Add sections to organize content for this lesson."
          action={<Button onClick={() => openModal('addSection')}>Add Section</Button>}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
              <p className="text-sm text-gray-600">{sections.length} section(s)</p>
            </div>
            <Button onClick={() => openModal('addSection')}>Add Section</Button>
          </div>

          <DataTable
            columns={columns}
            data={sections}
            isLoading={isLoading}
            emptyMessage="No sections found"
          />
        </>
      )}

      {/* Modal */}
      <SectionModal
        isOpen={activeModal === 'addSection' || activeModal === 'editSection'}
        onClose={closeModal}
        onSave={handleSave}
        section={activeModal === 'editSection' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Section?"
        message="This will delete the section and all its questions. This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
        isLoading={remove.isPending}
      />
    </div>
  );
};

export default SectionListForLesson;
