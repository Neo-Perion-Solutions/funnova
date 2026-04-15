import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ChevronLeft, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/shared/DataTable';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useUIStore } from '../../../store/uiStore';
import { useLessons, useLessonMutations } from '../../lessons/hooks/useLessons';
import LessonModal from '../../lessons/components/LessonModal';

const LessonListForUnit = ({ gradeId, subjectId, unitId }) => {
  const navigate = useNavigate();
  const { activeModal, modalData, openModal, closeModal } = useUIStore();
  const { data: lessons = [], isLoading } = useLessons({ unit_id: unitId });
  const { create, update, remove } = useLessonMutations();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSave = async (data) => {
    if (activeModal === 'editLesson') {
      await update.mutateAsync({ id: modalData.id, data });
    } else {
      await create.mutateAsync({ ...data, unit_id: unitId });
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await remove.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleToggleActive = async (lesson) => {
    await update.mutateAsync({
      id: lesson.id,
      data: { ...lesson, is_deleted: !lesson.is_deleted },
    });
  };

  const columns = [
    {
      key: 'sequence',
      label: '#',
      width: '60px',
      render: (row) => <span className="font-semibold text-gray-900">{row.lesson_order}</span>,
    },
    {
      key: 'title',
      label: 'Lesson',
      render: (row) => (
        <div
          className="cursor-pointer hover:text-blue-600"
          onClick={() =>
            navigate(
              `/admin/curriculum/grade/${gradeId}/subject/${subjectId}/unit/${unitId}/lesson/${row.id}`
            )
          }
        >
          <span className="font-medium text-gray-900">{row.title}</span>
          {row.description && <p className="text-sm text-gray-600">{row.description}</p>}
        </div>
      ),
    },
    {
      key: 'sections',
      label: 'Sections',
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.section_count || 0} section{row.section_count !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'video',
      label: 'Video',
      width: '60px',
      render: (row) => row.video_url ? <span className="text-lg">🎥</span> : <span className="text-gray-400">-</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <button
          onClick={() => handleToggleActive(row)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            row.is_deleted
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {row.is_deleted ? 'Inactive' : 'Active'}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openModal('editLesson', row)}
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
    return <div className="text-center py-8">Loading lessons...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(
                `/admin/curriculum/grade/${gradeId}/subject/${subjectId}`
              )
            }
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Lessons</h1>
            <p className="mt-1 text-sm text-gray-600">{lessons.length} lesson(s) in this unit</p>
          </div>
        </div>
        <Button onClick={() => openModal('addLesson')} className="flex items-center gap-2">
          <Plus size={16} />
          Add Lesson
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={lessons}
        isLoading={isLoading}
        emptyMessage="No lessons yet. Create one to get started."
      />

      {/* Modal */}
      <LessonModal
        isOpen={activeModal === 'addLesson' || activeModal === 'editLesson'}
        onClose={closeModal}
        onSave={handleSave}
        lesson={activeModal === 'editLesson' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Lesson?"
        message="This will delete the lesson and all its sections. This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
        isLoading={remove.isPending}
      />
    </div>
  );
};

export default LessonListForUnit;
