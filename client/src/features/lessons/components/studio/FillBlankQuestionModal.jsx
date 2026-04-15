import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../../../components/shared/Modal';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

const fbSchema = z.object({
  question_text: z.string().regex(/____/, 'Question must contain ____').min(5),
  correct_answer: z
    .string()
    .min(1, 'Answer is required')
    .refine((val) => !val.includes(' '), 'Answer cannot contain spaces'),
});

const FillBlankQuestionModal = ({ isOpen, onClose, onSave, question, isLoading }) => {
  const isEdit = !!question;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fbSchema),
    defaultValues: {
      question_text: '',
      correct_answer: '',
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
        reset({ question_text: '', correct_answer: '' });
      }
    }
  }, [isOpen, question, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Fill Blank Question' : 'Add Fill Blank Question'}
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
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Question (include ____ for blank)
          </label>
          <textarea
            {...register('question_text')}
            placeholder="e.g., The capital of France is ____"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            rows={2}
          />
          {errors.question_text && <p className="mt-1 text-sm text-red-600">{errors.question_text.message}</p>}
        </div>

        <Input
          label="Correct Answer"
          placeholder="Single word (no spaces)"
          {...register('correct_answer')}
          error={errors.correct_answer?.message}
        />
      </div>
    </Modal>
  );
};

export default FillBlankQuestionModal;
