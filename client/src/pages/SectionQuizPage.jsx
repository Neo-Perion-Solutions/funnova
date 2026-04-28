import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MCQCard from '../components/question/MCQCard';
import TrueFalseCard from '../components/question/TrueFalseCard';
import FillBlankCard from '../components/question/FillBlankCard';
import DragDropCard from '../components/question/DragDropCard';
import { SectionCompleteModal } from '../components/lesson/SectionCompleteModal';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import api from '../lib/axios';
import { toast } from 'sonner';

/**
 * SectionQuizPage — Renders the question runner for a specific section type.
 * Route: /student/lesson/:lessonId/section/:sectionType
 * Filters questions by section type, handles answering + submit, shows completion modal.
 */

const SECTION_LABELS = {
  mcq: 'Multiple Choice',
  fill_blank: 'Fill in the Blanks',
  true_false: 'True or False',
};

const SectionQuizPage = () => {
  const navigate = useNavigate();
  const { lessonId, sectionType } = useParams();

  // Fetch full lesson content (reuses existing endpoint)
  const { data: lessonResponse, loading, error } = useFetch(() =>
    studentService.getLessonContent(lessonId)
  );

  const lessonData = lessonResponse?.data;
  const lesson = lessonData?.lesson;
  const allSections = lessonData?.sections || [];

  // Filter questions by matching type across ALL sections
  const questions = allSections
    .flatMap((s) => s.questions || [])
    .filter((q) => q.type && q.type.toLowerCase() === sectionType.toLowerCase());

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Restore prior answers
  useEffect(() => {
    if (questions.length > 0) {
      const initial = {};
      questions.forEach((q) => {
        if (q.prior_answer?.answer_given) {
          initial[q.id] = q.prior_answer.answer_given;
        }
      });
      if (Object.keys(initial).length > 0) setAnswers(initial);
    }
  }, [allSections]);

  const currentQuestion = questions[questionIndex] || null;
  const totalQuestions = questions.length;

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) setQuestionIndex(questionIndex + 1);
  };

  const handlePrevious = () => {
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
  };

  const handleSubmitSection = async () => {
    try {
      setSubmitting(true);
      const answerPayload = Object.entries(answers).map(([qId, ans]) => ({
        question_id: parseInt(qId),
        answer_given: ans,
      }));

      if (answerPayload.length === 0 && totalQuestions > 0) {
        toast.error('Please answer at least one question');
        setSubmitting(false);
        return;
      }

      // Submit section via the new endpoint
      const response = await api.post(
        `/student/lessons/${lessonId}/section/${sectionType}/complete`,
        { answers: answerPayload }
      );

      if (response?.success) {
        setScoreResult(response.data);
        setShowModal(true);
      } else {
        toast.error(response?.message || 'Failed to submit');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setShowModal(false);
    setAnswers({});
    setQuestionIndex(0);
    setScoreResult(null);
  };

  const handleContinue = () => {
    setShowModal(false);
    navigate(`/student/lesson/${lessonId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 rounded-full"
          style={{ border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-gold)' }}
        />
        <p className="mt-4 text-lg font-bold" style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-display)' }}>
          Loading questions...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6"
        style={{ background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))' }}
      >
        <div className="text-6xl">🚫</div>
        <h2 className="text-2xl font-extrabold text-white">Oops!</h2>
        <p className="text-center max-w-md" style={{ color: 'var(--text-muted)' }}>
          {error || 'Section not found'}
        </p>
        <button
          onClick={() => navigate(`/student/lesson/${lessonId}`)}
          className="px-8 py-3 rounded-2xl font-bold text-white shadow-lg"
          style={{ background: 'var(--accent-gold)', color: '#1a1a1a', fontFamily: 'var(--font-display)' }}
        >
          Back to Lesson
        </button>
      </div>
    );
  }

  // No questions for this section type
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6"
        style={{ background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))' }}
      >
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-xl font-extrabold text-white">No Questions Yet</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          This section doesn&apos;t have any questions yet.
        </p>
        <button
          onClick={() => navigate(`/student/lesson/${lessonId}`)}
          className="px-8 py-3 rounded-2xl font-bold shadow-lg"
          style={{ background: 'var(--accent-gold)', color: '#1a1a1a', fontFamily: 'var(--font-display)' }}
        >
          Back to Lesson
        </button>
      </div>
    );
  }

  const isLastQuestion = questionIndex === totalQuestions - 1;

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    const commonProps = {
      question: currentQuestion.question_text,
      selectedAnswer: answers[currentQuestion.id],
      onSelect: (ans) => handleAnswerSelect(currentQuestion.id, ans),
      disabled: !!currentQuestion?.prior_answer,
      questionNumber: questionIndex,
      totalQuestions,
    };

    switch (currentQuestion.type) {
      case 'mcq':
        return <MCQCard {...commonProps} options={currentQuestion.options || {}} />;
      case 'true_false':
        return <TrueFalseCard {...commonProps} />;
      case 'fill_blank':
        return currentQuestion.options && Object.keys(currentQuestion.options).length > 0
          ? <DragDropCard {...commonProps} options={Object.values(currentQuestion.options)} />
          : <FillBlankCard {...commonProps} />;
      default:
        return <MCQCard {...commonProps} options={currentQuestion.options || {}} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 shadow-lg"
        style={{
          background: 'rgba(15,12,41,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center justify-between mx-auto max-w-3xl">
          <button
            onClick={() => navigate(`/student/lesson/${lessonId}`)}
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-colors"
            style={{
              color: 'var(--accent-gold)',
              background: 'rgba(247,201,72,0.1)',
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="text-center flex-1 px-3">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-gold)' }}>
              {SECTION_LABELS[sectionType] || sectionType}
            </p>
            <h1 className="text-sm sm:text-base font-extrabold text-white truncate">
              {lesson.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              {questionIndex + 1}/{totalQuestions}
            </span>
            <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--accent-gold)' }}
                animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto max-w-2xl px-4 py-6 sm:px-6 w-full">
        <AnimatePresence mode="wait">
          <div key={questionIndex}>
            {renderQuestion()}
          </div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 justify-between pt-6">
          <button
            onClick={handlePrevious}
            disabled={questionIndex === 0}
            className="flex items-center gap-1 rounded-2xl px-5 py-3 font-bold transition-shadow disabled:opacity-30 shadow-sm hover:shadow-md"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ChevronLeft size={18} /> Prev
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitSection}
              disabled={submitting}
              className="flex items-center gap-2 rounded-2xl px-8 py-3 font-extrabold text-[#1a1a1a] shadow-lg disabled:opacity-50 transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: 'var(--accent-gold)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {submitting ? 'Submitting...' : 'Finish! 🎉'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 rounded-2xl px-8 py-3 font-extrabold text-white shadow-lg transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      </main>

      {/* Completion modal */}
      {showModal && scoreResult && (
        <SectionCompleteModal
          sectionLabel={SECTION_LABELS[sectionType] || sectionType}
          score={scoreResult.score}
          total={scoreResult.total}
          xpEarned={scoreResult.xpEarned || 0}
          onRetry={handleRetry}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default SectionQuizPage;
