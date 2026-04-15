import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../../../components/shared/Modal';
import Button from '../../../../components/ui/Button';

const tfSchema = z.object({
  question_text: z.string().min(5, 'Question must be at least 5 characters'),
  correct_answer: z.enum(['True', 'False']),
});

const TrueFalseQuestionModal = ({ isOpen, onClose, onSave, question, isLoading }) => {
  const isEdit = !!question;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tfSchema),
    defaultValues: {
      question_text: '',
      correct_answer: 'True',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (question) {
        reset({
          question_text: question.question_text,
          correct_answer: question.correct_answer,
        });
      } else {
        reset({ question_text: '', correct_answer: 'True' });
      }
    }
  }, [isOpen, question, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit True/False Question' : 'Add True/False Question'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Update Question' : 'Add Question'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Question</label>
          <textarea
            {...register('question_text')}
            placeholder="Enter the statement"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            rows={2}
          />
          {errors.question_text && <p className="mt-1 text-sm text-red-600">{errors.question_text.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Correct Answer</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" {...register('correct_answer')} value="True" className="rounded-full" />
              <span className="text-sm font-medium text-gray-700">True</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" {...register('correct_answer')} value="False" className="rounded-full" />
              <span className="text-sm font-medium text-gray-700">False</span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TrueFalseQuestionModal;
