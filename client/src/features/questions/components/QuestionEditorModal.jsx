import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Button from '../../../components/ui/Button';
import MCQEditor from './MCQEditor';
import FillBlankEditor from './FillBlankEditor';
import TrueFalseEditor from './TrueFalseEditor';
import { FileQuestion, Save, Plus } from 'lucide-react';

const mcqSchema = z.object({
  question_text: z.string().min(5, 'Question statement is too short'),
  option_a: z.string().min(1, 'All MCQ options must be filled'),
  option_b: z.string().min(1, 'All MCQ options must be filled'),
  option_c: z.string().min(1, 'All MCQ options must be filled'),
  option_d: z.string().min(1, 'All MCQ options must be filled'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']),
});

const fillBlankSchema = z.object({
  question_text: z.string().min(5, 'Question statement is too short').includes('____', { message: 'Must include ____ for the blank' }),
  correct_answer: z.string().min(1, 'Answer is required').regex(/^\S+$/, 'Answer must be a single word (no spaces)'),
});

const trueFalseSchema = z.object({
  question_text: z.string().min(5, 'Question statement is too short'),
  correct_answer: z.enum(['True', 'False']),
});

const quizSchema = z.object({
  mcq: z.array(mcqSchema).max(20, "Maximum 20 MCQs allowed"),
  fill_blank: z.array(fillBlankSchema).max(15, "Maximum 15 Fill-in-Blanks allowed"),
  true_false: z.array(trueFalseSchema).max(15, "Maximum 15 True/False allowed"),
}).refine(data => {
  return data.mcq.length > 0 || data.fill_blank.length > 0 || data.true_false.length > 0;
}, {
  message: "At least one question is required for an assessment.",
  path: ["mcq"]
});

const QuestionEditorModal = ({ isOpen, onClose, onSave, lesson = null, existingQuestions = [], isLoading = false }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      mcq: [],
      fill_blank: [],
      true_false: [],
    },
  });

  const { fields: mcqFields, append: appendMcq, remove: removeMcq } = useFieldArray({ control, name: "mcq" });
  const { fields: fillFields, append: appendFill, remove: removeFill } = useFieldArray({ control, name: "fill_blank" });
  const { fields: tfFields, append: appendTf, remove: removeTf } = useFieldArray({ control, name: "true_false" });

  useEffect(() => {
    if (isOpen) {
      if (existingQuestions.length > 0) {
        // Map existing DB questions back to form state
        const mcqs = existingQuestions.filter(q => q.type === 'mcq').map(q => ({
          question_text: q.question_text || '',
          option_a: q.options?.A || '',
          option_b: q.options?.B || '',
          option_c: q.options?.C || '',
          option_d: q.options?.D || '',
          correct_answer: q.correct_answer || 'A',
        }));
        
        const fills = existingQuestions.filter(q => q.type === 'fill_blank').map(q => ({
          question_text: q.question_text || '',
          correct_answer: q.correct_answer || '',
        }));

        const tfs = existingQuestions.filter(q => q.type === 'true_false').map(q => ({
          question_text: q.question_text || '',
          correct_answer: q.correct_answer || 'True',
        }));

        reset({
          mcq: mcqs.length ? mcqs : [],
          fill_blank: fills.length ? fills : [],
          true_false: tfs.length ? tfs : [],
        });
      } else {
        // Empty state starts with nothing, forcing user to pick
        reset({ mcq: [], fill_blank: [], true_false: [] });
      }
    }
  }, [isOpen, existingQuestions, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assessment Editor: ${lesson?.title || 'Lesson'}`}
      size="2xl"
      footer={
        <>
          <div className="flex-1 flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest pl-2">
            <span className="text-gray-500">Total: {mcqFields.length + fillFields.length + tfFields.length}</span>
          </div>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Discard Changes
          </Button>
          <Button 
            onClick={handleSubmit(onSave)} 
            loading={isLoading}
            icon={Save}
          >
            Save Assessment
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        
        {errors.mcq?.message && typeof errors.mcq.message === 'string' && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 font-bold text-sm text-center">
            {errors.mcq.message}
          </div>
        )}

        <form className="space-y-10">
          
          {/* MCQ Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">Multiple Choice Questions</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => appendMcq({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' })}
                disabled={mcqFields.length >= 20}
                className="text-xs py-1"
              >
                <Plus size={14} className="mr-1"/> Add MCQ ({mcqFields.length}/20)
              </Button>
            </div>
            {mcqFields.map((field, index) => (
              <MCQEditor key={field.id} register={register} errors={errors} index={index} remove={removeMcq} />
            ))}
            {mcqFields.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No MCQ questions added.</p>}
          </div>

          {/* Fill in the Blank Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">Fill in the Blanks</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => appendFill({ question_text: '', correct_answer: '' })}
                disabled={fillFields.length >= 15}
                className="text-xs py-1"
              >
                <Plus size={14} className="mr-1"/> Add Blank ({fillFields.length}/15)
              </Button>
            </div>
            {fillFields.map((field, index) => (
              <FillBlankEditor key={field.id} register={register} errors={errors} index={index} remove={removeFill} />
            ))}
            {fillFields.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No Fill-in-the-Blank questions added.</p>}
          </div>

          {/* True / False Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">True or False</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => appendTf({ question_text: '', correct_answer: 'True' })}
                disabled={tfFields.length >= 15}
                className="text-xs py-1"
              >
                <Plus size={14} className="mr-1"/> Add T/F ({tfFields.length}/15)
              </Button>
            </div>
            {tfFields.map((field, index) => (
              <TrueFalseEditor key={field.id} register={register} watch={watch} errors={errors} index={index} remove={removeTf} />
            ))}
            {tfFields.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No True/False questions added.</p>}
          </div>

        </form>
      </div>
    </Modal>
  );
};

export default QuestionEditorModal;
