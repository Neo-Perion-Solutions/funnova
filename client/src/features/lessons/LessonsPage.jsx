import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import { Plus, ListOrdered, ChevronRight } from 'lucide-react';
import FilterBar from '../../components/shared/FilterBar';
import LessonTable from './components/LessonTable';
import LessonModal from './components/LessonModal';
import LessonReorderPanel from './components/LessonReorderPanel';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useLessons, useLessonMutations } from './hooks/useLessons';
import { useSubjects } from '../subjects/hooks/useSubjects';
import { useUIStore } from '../../store/uiStore';
import EmptyState from '../../components/shared/EmptyState';
import { BookOpen } from 'lucide-react';

const LessonsPage = () => {
  // Cascading filters
  const [grade, setGrade] = useState('4');
  const [subjectId, setSubjectId] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const { data: subjects } = useSubjects({ grade });
  const { data: lessons, isLoading } = useLessons({ grade, subject_id: subjectId, includeDeleted: showDeleted });
  const { create, update, remove, restore, reorder } = useLessonMutations();
  const { activeModal, modalData, openModal, closeModal } = useUIStore();

  const [isReordering, setIsReordering] = useState(false);

  // Auto-select first subject when grade changes
  useEffect(() => {
    if (subjects && subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id.toString());
    }
  }, [subjects, subjectId]);

  const onSaveLesson = async (data) => {
    const payload = { ...data, subject_id: parseInt(subjectId) };
    if (activeModal === 'editLesson') {
      await update.mutateAsync({ id: modalData.id, data: payload });
    } else {
      await create.mutateAsync(payload);
    }
    closeModal();
  };

  const handleReorder = async (orderedIds) => {
    await reorder.mutateAsync({ orderedIds });
    setIsReordering(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Curriculum: Lessons"
        action={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={ListOrdered}
              disabled={!subjectId || lessons?.length < 2}
              onClick={() => setIsReordering(!isReordering)}
            >
              {isReordering ? 'Cancel Reordering' : 'Reorder Lessons'}
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              disabled={!subjectId}
              onClick={() => openModal('addLesson')}
            >
              Add Lesson
            </Button>
          </div>
        }
      />

      {/* Cascading Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
        <div className="w-full sm:w-48">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">1. Select Grade</label>
          <div className="flex gap-2">
            {['3', '4', '5'].map(g => (
              <button
                key={g}
                onClick={() => { setGrade(g); setSubjectId(''); }}
                className={cn(
                  "flex-1 py-2 rounded-xl text-sm font-bold transition-all border-2",
                  grade === g ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                )}
              >
                G{g}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:block">
          <ChevronRight size={20} className="text-gray-200 mt-6" />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">2. Select Subject</label>
          <div className="flex flex-wrap gap-2">
            {!subjects || subjects.length === 0 ? (
              <span className="text-sm text-gray-400 italic py-2">No subjects found for this grade.</span>
            ) : (
              subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubjectId(s.id.toString())}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 flex items-center gap-2",
                    subjectId === s.id.toString() 
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  )}
                >
                  <span className="text-lg">{s.icon_url}</span>
                  {s.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto mt-auto pt-2 sm:pt-0">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors uppercase tracking-wider">Show Deleted</span>
          </label>
        </div>
      </div>

      {/* Reorder Panel */}
      <LessonReorderPanel
        isOpen={isReordering}
        onClose={() => setIsReordering(false)}
        lessons={lessons || []}
        onSave={handleReorder}
        isLoading={reorder.isPending}
      />

      {/* Main Table */}
      {!subjectId ? (
        <EmptyState
          icon={BookOpen}
          title="Select a Subject"
          description="Choose a grade and subject above to manage lessons for that curriculum module."
        />
      ) : (
        <LessonTable
          data={lessons || []}
          isLoading={isLoading}
          onEdit={(lesson) => openModal('editLesson', lesson)}
          onDelete={(lesson) => openModal('deleteLesson', lesson)}
          onRestore={(lesson) => restore.mutate(lesson.id)}
        />
      )}

      {/* Modals */}
      <LessonModal
        isOpen={activeModal === 'addLesson' || activeModal === 'editLesson'}
        onClose={closeModal}
        onSave={onSaveLesson}
        lesson={activeModal === 'editLesson' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />

      <ConfirmDialog
        isOpen={activeModal === 'deleteLesson'}
        onClose={closeModal}
        onConfirm={() => { remove.mutate(modalData.id); closeModal(); }}
        isDangerous
        title="Hide Lesson"
        message={`Are you sure you want to hide "${modalData?.title}" from students? You can restore it later.`}
        confirmLabel="Hide Lesson"
        isLoading={remove.isPending}
      />
    </div>
  );
};

import { cn } from '../../lib/utils';

export default LessonsPage;
