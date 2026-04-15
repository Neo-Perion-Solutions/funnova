import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../../../components/shared/Modal';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

const mcqSchema = z.object({
  question_text: z.string().min(5, 'Question must be at least 5 characters'),
  option_a: z.string().min(1, 'Option A is required'),
  option_b: z.string().min(1, 'Option B is required'),
  option_c: z.string().min(1, 'Option C is required'),
  option_d: z.string().min(1, 'Option D is required'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']),
});

const MCQQuestionModal = ({ isOpen, onClose, onSave, question, isLoading }) => {
  const isEdit = !!question;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mcqSchema),
    defaultValues: {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (question) {
        const options = question.options || {};
        reset({
          question_text: question.question_text,
          option_a: options.A || '',
          option_b: options.B || '',
          option_c: options.C || '',
          option_d: options.D || '',
          correct_answer: question.correct_answer,
        });
      } else {
        reset({
          question_text: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_answer: 'A',
        });
      }
    }
  }, [isOpen, question, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit MCQ Question' : 'Add MCQ Question'}
      size="lg"
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
            placeholder="Enter the question text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            rows={2}
          />
          {errors.question_text && <p className="mt-1 text-sm text-red-600">{errors.question_text.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Options</label>
          <div className="space-y-2">
            {['option_a', 'option_b', 'option_c', 'option_d'].map((option, idx) => (
              <Input
                key={option}
                label={`Option ${String.fromCharCode(65 + idx)}`}
                placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                {...register(option)}
                error={errors[option]?.message}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Correct Answer</label>
          <div className="flex gap-4">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <label key={letter} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('correct_answer')}
                  value={letter}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{letter}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MCQQuestionModal;
