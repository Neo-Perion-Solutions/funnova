import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { useUIStore } from '../../../store/uiStore';
import { useUnits, useUnitMutations } from '../hooks/useUnits';
import UnitModal from './UnitModal';
import { useState } from 'react';

const UnitCards = ({ gradeId, subjectId }) => {
  const navigate = useNavigate();
  const { activeModal, modalData, openModal, closeModal } = useUIStore();
  const { data: units = [], isLoading } = useUnits({ subject_id: subjectId });
  const { create, update, remove } = useUnitMutations();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSave = async (data) => {
    if (activeModal === 'editUnit') {
      await update.mutateAsync({ id: modalData.id, data });
    } else {
      await create.mutateAsync({ ...data, subject_id: subjectId });
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await remove.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleMoveUp = async (unit) => {
    const idx = units.findIndex((u) => u.id === unit.id);
    if (idx <= 0) return;

    const reorderedIds = units.map((u) => u.id);
    [reorderedIds[idx - 1], reorderedIds[idx]] = [reorderedIds[idx], reorderedIds[idx - 1]];

    const unitsMutation = useUnitMutations();
    await unitsMutation.reorder.mutateAsync({
      subject_id: subjectId,
      ordered_unit_ids: reorderedIds,
    });
  };

  const handleMoveDown = async (unit) => {
    const idx = units.findIndex((u) => u.id === unit.id);
    if (idx >= units.length - 1) return;

    const reorderedIds = units.map((u) => u.id);
    [reorderedIds[idx], reorderedIds[idx + 1]] = [reorderedIds[idx + 1], reorderedIds[idx]];

    const unitsMutation = useUnitMutations();
    await unitsMutation.reorder.mutateAsync({
      subject_id: subjectId,
      ordered_unit_ids: reorderedIds,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading units...</div>;
  }

  if (!units || units.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={Plus}
          title="No Units Yet"
          description="Create your first unit to organize lessons for this subject."
          action={<Button onClick={() => openModal('addUnit')}>Add Unit</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Units</h3>
          <p className="text-sm text-gray-600">{units.length} unit(s) in this subject</p>
        </div>
        <Button onClick={() => openModal('addUnit')} className="flex items-center gap-2">
          <Plus size={16} />
          Add Unit
        </Button>
      </div>

      {/* Unit Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {units.map((unit, idx) => (
          <div
            key={unit.id}
            className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() =>
              navigate(
                `/admin/curriculum/grade/${gradeId}/subject/${subjectId}/unit/${unit.id}`
              )
            }
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {unit.unit_order}
                  </span>
                  <h4 className="font-semibold text-gray-900 truncate">{unit.title}</h4>
                </div>
              </div>
            </div>

            {/* Lesson Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {unit.lesson_count || 0} lesson{unit.lesson_count !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveUp(unit);
                }}
                disabled={idx === 0}
                title="Move up"
              >
                <ChevronUp size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveDown(unit);
                }}
                disabled={idx === units.length - 1}
                title="Move down"
              >
                <ChevronDown size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('editUnit', unit);
                }}
                title="Edit"
              >
                <Edit2 size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm(unit.id);
                }}
                title="Delete"
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <UnitModal
        isOpen={activeModal === 'addUnit' || activeModal === 'editUnit'}
        onClose={closeModal}
        onSave={handleSave}
        unit={activeModal === 'editUnit' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Unit?"
        message="This will delete the unit and all its lessons. This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
        isLoading={remove.isPending}
      />
    </div>
  );
};

export default UnitCards;
