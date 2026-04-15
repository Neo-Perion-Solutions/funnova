import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import { useLessonQuestions, useLessonQuestionMutations } from '../../hooks/useLessonQuestions';
import MCQQuestionCard from './MCQQuestionCard';
import MCQQuestionModal from './MCQQuestionModal';

const MCQPanel = ({ lessonId }) => {
  const { data: questions = [], isLoading } = useLessonQuestions(lessonId, 'mcq');
  const { create, update, remove } = useLessonQuestionMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSave = async (data) => {
    if (selectedQuestion) {
      await update.mutateAsync({
        lessonId,
        id: selectedQuestion.id,
        data: { ...data, type: 'mcq' },
      });
    } else {
      await create.mutateAsync({ ...data, type: 'mcq', lesson_id: lessonId });
    }
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await remove.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading questions...</div>;
  }

  return (
    <div className="space-y-4">
      {questions.length >= 20 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          You've reached the maximum of 20 MCQ questions
        </div>
      )}

      <div className="space-y-2">
        {questions.map((q, idx) => (
          <MCQQuestionCard
            key={q.id}
            question={q}
            index={idx + 1}
            onEdit={() => handleEdit(q)}
            onDelete={() => setDeleteConfirm(q.id)}
          />
        ))}
      </div>

      {questions.length < 20 && (
        <Button onClick={handleAddNew} className="w-full flex items-center justify-center gap-2">
          <Plus size={16} />
          Add MCQ Question
        </Button>
      )}

      <MCQQuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuestion(null);
        }}
        onSave={handleSave}
        question={selectedQuestion}
        isLoading={create.isPending || update.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Question?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
        isLoading={remove.isPending}
      />
    </div>
  );
};

export default MCQPanel;
