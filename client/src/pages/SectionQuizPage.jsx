import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MCQCard from '../components/question/MCQCard';
import TrueFalseCard from '../components/question/TrueFalseCard';
import FillBlankCard from '../components/question/FillBlankCard';
import DragDropCard from '../components/question/DragDropCard';
import { SectionCompleteModal } from '../components/lesson/SectionCompleteModal';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import api from '../lib/axios';
import { toast } from 'sonner';

// Quiz-specific styles
import '../styles/quiz.css';

/**
 * SectionQuizPage — Kid-friendly MCQ quiz runner.
 *
 * Route: /student/lesson/:lessonId/section/:sectionType
 *
 * Screen layout:
 *   ┌─────────────────────────────────────────────────────┐
 *   │  ← Back   |  Lesson Title (center)  |  Q 2 / 5    │  ← Header
 *   │  ████████████████░░░░░░░░░░░░░░░░░░░               │  ← Progress bar
 *   │                                                     │
 *   │         ┌─────────────────────────┐                │
 *   │         │  Question X             │                │
 *   │         │  "What is ...?"         │                │  ← Question card
 *   │         └─────────────────────────┘                │
 *   │                                                     │
 *   │     [ Option A ]       [ Option B ]                │
 *   │     [ Option C ]       [ Option D ]                │  ← 2×2 Options
 *   │                                                     │
 *   │  [ ← Previous ]              [ Next → / Finish! ] │  ← Bottom nav
 *   └─────────────────────────────────────────────────────┘
 *
 * No icons in answers. No hints. No sidebars. Everything centered.
 */

const SECTION_LABELS = {
  mcq:        'Multiple Choice',
  fill_blank: 'Fill in the Blanks',
  true_false: 'True or False',
};

/* ─────────────────────────────────────────────────────────────── */

const SectionQuizPage = () => {
  const navigate   = useNavigate();
  const { lessonId, sectionType } = useParams();

  /* Fetch full lesson content */
  const { data: lessonResponse, loading, error } = useFetch(() =>
    studentService.getLessonContent(lessonId)
  );

  const lessonData   = lessonResponse?.data;
  const lesson       = lessonData?.lesson;
  const allSections  = lessonData?.sections || [];

  /* Filter questions by section type */
  const questions = allSections
    .flatMap((s) => s.questions || [])
    .filter((q) => q.type && q.type.toLowerCase() === sectionType.toLowerCase());

  /* Quiz state */
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers,       setAnswers]       = useState({});
  const [submitting,    setSubmitting]    = useState(false);
  const [showModal,     setShowModal]     = useState(false);
  const [scoreResult,   setScoreResult]   = useState(null);
  /* key trick — changes every time questionIndex changes to re-trigger CSS animation */
  const [animKey,       setAnimKey]       = useState(0);

  /* Restore prior answers */
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
  const totalQuestions  = questions.length;
  const isLastQuestion  = questionIndex === totalQuestions - 1;
  const progressPct     = totalQuestions > 0
    ? ((questionIndex + 1) / totalQuestions) * 100
    : 0;

  /* ── Handlers ── */
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(questionIndex + 1);
      setAnimKey((k) => k + 1);
    }
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      setAnimKey((k) => k + 1);
    }
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
    setAnimKey((k) => k + 1);
  };

  const handleContinue = () => {
    setShowModal(false);
    navigate(`/student/lesson/${lessonId}`);
  };

  const goBack = () => navigate(`/student/lesson/${lessonId}`);

  /* ── Render question based on type ── */
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const commonProps = {
      question:       currentQuestion.question_text,
      selectedAnswer: answers[currentQuestion.id],
      onSelect:       (ans) => handleAnswerSelect(currentQuestion.id, ans),
      disabled:       !!currentQuestion?.prior_answer,
      questionNumber: questionIndex + 1,
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

  /* ════════════════════════════════════════════════════════════ */
  /* Loading state                                                */
  /* ════════════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-state-center">
          <div className="quiz-spinner" />
          <p className="quiz-state-title">Loading questions…</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════ */
  /* Error state                                                  */
  /* ════════════════════════════════════════════════════════════ */
  if (error || !lesson) {
    return (
      <div className="quiz-page">
        <div className="quiz-state-center">
          <span className="quiz-state-emoji">🚫</span>
          <p className="quiz-state-title">Oops! Something went wrong</p>
          <p className="quiz-state-sub">{error || 'Section not found'}</p>
          <button className="quiz-state-btn" onClick={goBack}>
            ← Back to Lesson
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════ */
  /* No questions state                                           */
  /* ════════════════════════════════════════════════════════════ */
  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-state-center">
          <span className="quiz-state-emoji">📝</span>
          <p className="quiz-state-title">No Questions Yet</p>
          <p className="quiz-state-sub">This section doesn&apos;t have any questions yet.</p>
          <button className="quiz-state-btn" onClick={goBack}>
            ← Back to Lesson
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════ */
  /* Quiz runner                                                  */
  /* ════════════════════════════════════════════════════════════ */
  return (
    <div className="quiz-page">

      {/* ── Header ── */}
      <header className="quiz-header">
        {/* Back button */}
        <button id="quiz-back-btn" className="quiz-back-btn" onClick={goBack} aria-label="Go back to lesson">
          &#8592; Back
        </button>

        {/* Lesson title — centered */}
        <h1 className="quiz-header-title" title={lesson.title}>
          {lesson.title}
        </h1>

        {/* Question counter */}
        <span className="quiz-counter" aria-label={`Question ${questionIndex + 1} of ${totalQuestions}`}>
          {questionIndex + 1} / {totalQuestions}
        </span>
      </header>

      {/* ── Progress bar ── */}
      <div
        className="quiz-progress-wrap"
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
      >
        <div
          className="quiz-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── Main content ── */}
      <main className="quiz-main">

        {/* Question card + options — keyed to re-animate on nav */}
        <div key={animKey} className="quiz-question-enter" style={{ width: '100%' }}>
          {renderQuestion()}
        </div>

        {/* ── Bottom navigation ── */}
        <nav className="quiz-nav" aria-label="Question navigation">
          {/* Previous */}
          <button
            id="quiz-prev-btn"
            className="quiz-prev-btn"
            onClick={handlePrevious}
            disabled={questionIndex === 0}
            aria-label="Previous question"
          >
            &#8592; Previous
          </button>

          {/* Next / Finish */}
          {isLastQuestion ? (
            <button
              id="quiz-finish-btn"
              className="quiz-next-btn quiz-finish-btn"
              onClick={handleSubmitSection}
              disabled={submitting}
              aria-label="Finish quiz"
            >
              {submitting ? 'Submitting…' : 'Finish! 🎉'}
            </button>
          ) : (
            <button
              id="quiz-next-btn"
              className="quiz-next-btn"
              onClick={handleNext}
              aria-label="Next question"
            >
              Next &#8594;
            </button>
          )}
        </nav>
      </main>

      {/* ── Completion modal ── */}
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
