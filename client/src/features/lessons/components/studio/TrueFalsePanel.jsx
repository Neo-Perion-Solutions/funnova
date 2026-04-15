import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import { useLessonQuestions, useLessonQuestionMutations } from '../../hooks/useLessonQuestions';
import TrueFalseQuestionCard from './TrueFalseQuestionCard';
import TrueFalseQuestionModal from './TrueFalseQuestionModal';

const TrueFalsePanel = ({ lessonId }) => {
  const { data: questions = [], isLoading } = useLessonQuestions(lessonId, 'true_false');
  const { create, update, remove } = useLessonQuestionMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSave = async (data) => {
    if (selectedQuestion) {
      await update.mutateAsync({
        lessonId,
        id: selectedQuestion.id,
        data: { ...data, type: 'true_false' },
      });
    } else {
      await create.mutateAsync({ ...data, type: 'true_false', lesson_id: lessonId });
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

  return (
    <div className="space-y-4">
      {questions.length >= 20 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          You've reached the maximum of 20 True/False questions
        </div>
      )}

      <div className="space-y-2">
        {questions.map((q, idx) => (
          <TrueFalseQuestionCard
            key={q.id}
            question={q}
            index={idx + 1}
            onEdit={() => {
              setSelectedQuestion(q);
              setIsModalOpen(true);
            }}
            onDelete={() => setDeleteConfirm(q.id)}
          />
        ))}
      </div>

      {questions.length < 20 && (
        <Button
          onClick={() => {
            setSelectedQuestion(null);
            setIsModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add True/False Question
        </Button>
      )}

      <TrueFalseQuestionModal
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

export default TrueFalsePanel;
