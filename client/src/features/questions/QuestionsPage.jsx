import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import LessonSelector from './components/LessonSelector';
import LessonQuestionCard from './components/LessonQuestionCard';
import QuestionEditorModal from './components/QuestionEditorModal';
import { useLessons } from '../lessons/hooks/useLessons';
import { useSubjects } from '../subjects/hooks/useSubjects';
import { useQuestions, useSaveQuestions } from './hooks/useQuestions';
import { useUIStore } from '../../store/uiStore';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import { HelpCircle } from 'lucide-react';

const QuestionsPage = () => {
  const [grade, setGrade] = useState('4');
  const [subjectId, setSubjectId] = useState('');

  const { data: subjects } = useSubjects({ grade });
  const { data: lessons, isLoading: lessonsLoading } = useLessons({ grade, subject_id: subjectId });
  const { data: questions, isLoading: questionsLoading, refetch: refetchQuestions } = useQuestions(useUIStore(s => s.modalData?.id));
  const saveQuestions = useSaveQuestions();
  
  const { activeModal, modalData, openModal, closeModal } = useUIStore();

  // Auto-select first subject
  useEffect(() => {
    if (subjects && subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id.toString());
    }
  }, [subjects, subjectId]);

  const onHandleSave = async (quizData) => {
    const payload = [];

    quizData.mcq.forEach(q => {
      payload.push({
        type: 'mcq',
        question_text: q.question_text,
        correct_answer: q.correct_answer,
        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d,
        }
      });
    });

    quizData.fill_blank.forEach(q => {
      payload.push({
        type: 'fill_blank',
        question_text: q.question_text,
        correct_answer: q.correct_answer,
      });
    });

    quizData.true_false.forEach(q => {
      payload.push({
        type: 'true_false',
        question_text: q.question_text,
        correct_answer: q.correct_answer,
      });
    });

    await saveQuestions.mutateAsync({ 
      lessonId: modalData.id, 
      data: { questions: payload } 
    });
    closeModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Assessment Builder"
        action={
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-700">
            <HelpCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Multi-Question Quizzes</span>
          </div>
        }
      />

      <LessonSelector
        grade={grade}
        setGrade={setGrade}
        subjects={subjects || []}
        subjectId={subjectId}
        setSubjectId={setSubjectId}
      />

      {lessonsLoading ? (
        <Spinner className="h-48" />
      ) : !subjectId ? (
        <EmptyState
          icon={HelpCircle}
          title="Curriculum Selection Needed"
          description="Please select a grade and subject level to view lesson quiz modules."
        />
      ) : lessons.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No Lessons Found"
          description="This subject module has no lessons yet. Add lessons first before defining quizzes."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map(lesson => (
            <LessonQuestionCard
              key={lesson.id}
              lesson={lesson}
              onEdit={(l) => openModal('editQuiz', l)}
            />
          ))}
        </div>
      )}

      {/* Atomic Quiz Editor */}
      <QuestionEditorModal
        isOpen={activeModal === 'editQuiz'}
        onClose={closeModal}
        onSave={onHandleSave}
        lesson={modalData}
        existingQuestions={questions || []}
        isLoading={saveQuestions.isPending || questionsLoading}
      />
    </div>
  );
};

export default QuestionsPage;
