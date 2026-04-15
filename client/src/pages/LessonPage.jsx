import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionTabs from '../features/lessons/components/SectionTabs';
import CompletionCelebration from '../features/lessons/components/CompletionCelebration';
import { useFetch } from '../hooks/useFetch';
import { getLessonDetails } from '../services/lesson.service';
import { progressService } from '../services/progress.service';
import { toast } from 'sonner';

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  // Fetch lesson data
  const { data: lesson, loading: lessonLoading } = useFetch(() =>
    getLessonDetails(lessonId)
  );

  // State management
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset question index when section changes
  useEffect(() => {
    setQuestionIndex(0);
  }, [sectionIndex]);

  if (lessonLoading) {
    return <div className="flex items-center justify-center py-12">Loading lesson...</div>;
  }

  if (!lesson) {
    return <div className="flex items-center justify-center py-12">Lesson not found</div>;
  }

  const sections = lesson.sections || [];
  const currentSection = sections[sectionIndex] || { questions: [] };
  const currentQuestion = currentSection.questions[questionIndex];
  const totalQuestions = currentSection.questions.length;

  const handleAnswerSelect = (questionId, answer) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
    }
  };

  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const response = await progressService.submitQuiz({
        lesson_id: parseInt(lessonId),
        section_id: currentSection.id,
        answers,
        timestamp: new Date().toISOString(),
      });

      setScore(response);
      setSubmitted(true);
      toast.success('Quiz submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext_AfterScore = () => {
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 text-center flex-1 px-2">{lesson.title}</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {!submitted && currentQuestion ? (
          // Quiz View
          <div className="space-y-6">
            {/* Section Tabs */}
            <SectionTabs
              sections={sections}
              activeIndex={sectionIndex}
              onSectionChange={setSectionIndex}
              disabled={submitted}
            />

            {/* Progress */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Q{questionIndex + 1} of {totalQuestions}
              </span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <p className="text-base sm:text-lg font-semibold text-gray-900">{currentQuestion.question_text}</p>

              {/* Question Type Specific Rendering */}
              {currentQuestion.type === 'mcq' && (
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`w-full rounded-lg border-2 p-3 sm:p-4 text-left transition-colors active:scale-95 ${
                        answers[currentQuestion.id] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0 ${
                            answers[currentQuestion.id] === option
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {answers[currentQuestion.id] === option && '✓'}
                        </div>
                        <span className="text-sm sm:text-base font-medium">{option}</span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {currentQuestion.options?.[option] || `Option ${option}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'true_false' && (
                <div className="space-y-2">
                  {['true', 'false'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`w-full rounded-lg border-2 p-3 sm:p-4 text-left transition-colors active:scale-95 ${
                        answers[currentQuestion.id] === option
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-sm sm:text-base font-medium capitalize">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'fill_blank' && (
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  disabled={submitted}
                  placeholder="Type your answer..."
                  className={`w-full rounded-lg border-2 px-3 sm:px-4 py-2 sm:py-3 text-base ${
                    submitted ? 'cursor-not-allowed bg-gray-50' : ''
                  }`}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handlePrevious}
                disabled={questionIndex === 0}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 active:scale-95 min-h-11"
              >
                <ChevronLeft size={18} className="hidden sm:block" />
                <span className="sm:hidden">← Prev</span>
                <span className="hidden sm:inline">Previous</span>
              </button>

              {questionIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleNext}
                  className="ml-auto inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white transition-colors hover:bg-blue-700 active:scale-95 min-h-11"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next →</span>
                  <ChevronRight size={18} className="hidden sm:block" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="ml-auto inline-flex items-center justify-center gap-1 rounded-lg bg-green-600 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-11"
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        ) : submitted && score ? (
          // Score Reveal View - Using Enhanced Celebration Component
          <CompletionCelebration
            score={score}
            streak={lesson.streak || 0}
            nextLesson={lesson.nextLesson}
            onContinue={handleNext_AfterScore}
            onRetry={() => {
              setSubmitted(false);
              setScore(null);
              setAnswers({});
              setQuestionIndex(0);
            }}
          />
        ) : null}
      </main>
    </div>
  );
};

export default LessonPage;
