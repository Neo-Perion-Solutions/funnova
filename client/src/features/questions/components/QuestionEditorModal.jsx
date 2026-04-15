import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Button from '../../../components/ui/Button';
import MCQEditor from './MCQEditor';
import FillBlankEditor from './FillBlankEditor';
import TrueFalseEditor from './TrueFalseEditor';
import { FileQuestion, Save } from 'lucide-react';

const quizSchema = z.object({
  mcq: z.object({
    question_text: z.string().min(5, 'Question 1 statement is too short'),
    option_a: z.string().min(1, 'All MCQ options must be filled'),
    option_b: z.string().min(1, 'All MCQ options must be filled'),
    option_c: z.string().min(1, 'All MCQ options must be filled'),
    option_d: z.string().min(1, 'All MCQ options must be filled'),
    correct_answer: z.enum(['A', 'B', 'C', 'D']),
  }),
  fill_blank: z.object({
    question_text: z.string().min(5, 'Question 2 statement is too short').includes('____', { message: 'Must include ____ for the blank' }),
    correct_answer: z.string().min(1, 'Fill-in-the-blank answer is required').regex(/^\S+$/, 'Answer must be a single word (no spaces)'),
  }),
  true_false: z.object({
    question_text: z.string().min(5, 'Question 3 statement is too short'),
    correct_answer: z.enum(['True', 'False']),
  }),
});

const QuestionEditorModal = ({ isOpen, onClose, onSave, lesson = null, existingQuestions = [], isLoading = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      mcq: { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' },
      fill_blank: { question_text: '', correct_answer: '' },
      true_false: { question_text: '', correct_answer: 'True' },
    },
  });

  useEffect(() => {
    if (isOpen && existingQuestions.length === 3) {
      // Map existing DB questions back to form state based on their type
      const mcq = existingQuestions.find(q => q.type === 'mcq') || {};
      const fill = existingQuestions.find(q => q.type === 'fill_blank') || {};
      const tf = existingQuestions.find(q => q.type === 'true_false') || {};

      reset({
        mcq: {
          question_text: mcq.question_text || '',
          option_a: mcq.options?.A || '',
          option_b: mcq.options?.B || '',
          option_c: mcq.options?.C || '',
          option_d: mcq.options?.D || '',
          correct_answer: mcq.correct_answer || 'A',
        },
        fill_blank: {
          question_text: fill.question_text || '',
          correct_answer: fill.correct_answer || '',
        },
        true_false: {
          question_text: tf.question_text || '',
          correct_answer: tf.correct_answer || 'True',
        },
      });
    } else if (isOpen) {
       reset({
        mcq: { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' },
        fill_blank: { question_text: '', correct_answer: '' },
        true_false: { question_text: '', correct_answer: 'True' },
      });
    }
  }, [isOpen, existingQuestions, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Atomic Quiz Editor: ${lesson?.title || 'Lesson'}`}
      size="xl"
      footer={
        <>
          <div className="flex-1 flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest pl-2">
            <FileQuestion size={14} />
            Exactly 3 questions required
          </div>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Discard Changes
          </Button>
          <Button 
            onClick={handleSubmit(onSave)} 
            loading={isLoading}
            icon={Save}
          >
            Save Atomic Quiz
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
            <FileQuestion size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900">Atomic Save Rule</h4>
            <p className="text-xs text-indigo-700/70 mt-0.5 font-medium leading-relaxed">
              Every lesson must have exactly one MCQ, one Fill-in-the-Blank, and one True/False question. 
              The quiz will not save unless all three sections pass validation.
            </p>
          </div>
        </div>

        <form className="space-y-10">
          <MCQEditor register={register} errors={errors} />
          <FillBlankEditor register={register} errors={errors} />
          <TrueFalseEditor register={register} watch={watch} errors={errors} />
        </form>
      </div>
    </Modal>
  );
};

export default QuestionEditorModal;
