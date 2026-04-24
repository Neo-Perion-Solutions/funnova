import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionTabs from '../features/lessons/components/SectionTabs';
import CompletionCelebration from '../features/lessons/components/CompletionCelebration';
import GameEngine from '../game-engine/core/GameEngine';
import { hasGame } from '../game-engine/registry/gameRegistry';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import { toast } from 'sonner';

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  // Fetch lesson data and full lock check
  const { data: lessonResponse, loading: lessonLoading, error } = useFetch(() =>
    studentService.getLessonContent(lessonId)
  );

  const lessonData = lessonResponse?.data;
  const lesson = lessonData?.lesson;
  const sections = lessonData?.sections || [];
  const games = (lessonData?.games || []).filter(g => g.is_active && hasGame(g.game_url));

  // State management
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completedGames, setCompletedGames] = useState(new Set());

  // Handle game completion — submit score to backend
  const handleGameFinish = useCallback(async (gameResult) => {
    try {
      await studentService.submitGameScore(gameResult.gameId, {
        score: gameResult.score,
        accuracy: gameResult.accuracy,
      });
      setCompletedGames(prev => new Set(prev).add(gameResult.gameId));
      toast.success(`Game complete! Score: ${gameResult.score} 🎮`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save game score');
    }
  }, []);

  // Reset question index when section changes
  useEffect(() => {
    setQuestionIndex(0);
  }, [sectionIndex]);

  // Pre-fill answers from previous attempts if they exist
  useEffect(() => {
    if (sections.length > 0) {
      const initialAnswers = {};
      sections.forEach(sec => {
        sec.questions?.forEach(q => {
          if (q.prior_answer && q.prior_answer.answer_given) {
            initialAnswers[q.id] = q.prior_answer.answer_given;
          }
        });
      });
      if (Object.keys(initialAnswers).length > 0) {
        setAnswers(initialAnswers);
      }
      if (lesson?.is_completed) {
        setSubmitted(true);
      }
    }
  }, [sections, lesson]);

  if (lessonLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading lesson...</div>;
  }

  if (error || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-xl text-red-600 font-bold">🚫 Access Denied</div>
        <p className="text-gray-600 max-w-md text-center">{error || 'Lesson not found'}</p>
        <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const currentSection = sections[sectionIndex] || { questions: [] };
  const currentQuestion = currentSection.questions ? currentSection.questions[questionIndex] : null;
  const totalQuestions = currentSection.questions ? currentSection.questions.length : 0;

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
    } else if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1);
      setQuestionIndex(sections[sectionIndex - 1].questions.length - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Transform answers map into array:
      const answerPayload = Object.entries(answers).map(([qId, ans]) => ({
        question_id: parseInt(qId),
        answer_given: ans
      }));

      if (answerPayload.length === 0) {
        toast.error('Please answer at least one question');
        setSubmitting(false);
        return;
      }

      const response = await studentService.submitLesson(lessonId, answerPayload);

      setScoreData(response.data);
      setSubmitted(true);
      toast.success('Lesson completed! 🌟');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext_AfterScore = () => {
    if (scoreData?.next_lesson) {
      // Small reload to the new lesson component route trick
      navigate(`/student/lesson/${scoreData.next_lesson.id}`, { replace: true });
      window.location.reload(); 
    } else {
      navigate('/student/dashboard');
    }
  };

  // If there are literally no questions, provide an automatic completion path
  const noQuestionsAvailable = sections.length === 0 || sections.every(s => !s.questions || s.questions.length === 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 shadow-sm z-10 sticky top-0">
        <div className="flex items-center justify-between mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm sm:text-base border border-gray-200"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <div className="flex-1 px-4 text-center">
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">{lesson.unit_title}</span>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{lesson.title}</h1>
          </div>
          <div className="w-22" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-2xl px-4 py-8 sm:px-6 w-full">
        {/* Lesson Description/Video Block Placeholder */}
        {lesson?.description && !submitted && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="font-semibold text-gray-800 mb-2">Lesson Overview</h2>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
        )}

        {/* Games Section — rendered from backend game registry */}
        {games.length > 0 && !submitted && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎮</span>
              <h2 className="text-lg font-bold text-gray-800">Interactive Games</h2>
            </div>
            {games.map((game) => (
              <div key={game.id} className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-2 border-indigo-100 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🧩</span>
                  <h3 className="font-bold text-indigo-800">{game.title}</h3>
                  {completedGames.has(game.id) && (
                    <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓ Completed</span>
                  )}
                </div>
                <GameEngine
                  gameId={game.game_url}
                  gameDbId={game.id}
                  onFinish={handleGameFinish}
                />
              </div>
            ))}
          </div>
        )}

        {noQuestionsAvailable && !submitted ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">No Quiz Required</h3>
            <p className="text-gray-600 mb-6">Review the lesson content above and click complete to continue your journey!</p>
            <Button onClick={() => handleSubmit()} disabled={submitting} className="w-full sm:w-auto px-8">
              {submitting ? 'Completing...' : 'Mark as Complete ✓'}
            </Button>
          </div>
        ) : !submitted && currentQuestion ? (
          // Quiz View
          <div className="space-y-6">
            <SectionTabs
              sections={sections}
              activeIndex={sectionIndex}
              onSectionChange={setSectionIndex}
              disabled={submitted}
            />

            {/* Progress */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Q{calculateAbsoluteIndex(sections, sectionIndex, questionIndex) + 1} of {calculateTotalQuestions(sections)}
              </span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${((calculateAbsoluteIndex(sections, sectionIndex, questionIndex) + 1) / calculateTotalQuestions(sections)) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-8 shadow-md">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-2">Question</span>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug">{currentQuestion.question_text}</p>

              {/* Question Type Specific Rendering */}
              {currentQuestion.type === 'mcq' && (
                <div className="space-y-3 mt-6">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                        answers[currentQuestion.id] === option
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50'
                      } ${currentQuestion?.prior_answer ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                      disabled={!!currentQuestion?.prior_answer}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0 transition-colors ${
                            answers[currentQuestion.id] === option
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {answers[currentQuestion.id] === option && '✓'}
                        </div>
                        <span className="text-base font-bold">{option}</span>
                        <span className="text-base text-gray-700 font-medium">
                          {currentQuestion.options?.[option] || `Option ${option}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {(currentQuestion.type === 'true_false' || currentQuestion.type === 'boolean') && (
                <div className="space-y-3 mt-6">
                  {['true', 'false'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                        String(answers[currentQuestion.id]).toLowerCase() === option
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50'
                      } ${currentQuestion?.prior_answer ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                      disabled={!!currentQuestion?.prior_answer}
                    >
                      <span className="text-base sm:text-lg font-bold capitalize">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'fill_blank' && (
                <div className="mt-6">
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    disabled={!!currentQuestion?.prior_answer}
                    placeholder="Type your answer here..."
                    className={`w-full rounded-xl border-2 px-4 py-4 text-lg transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                      currentQuestion?.prior_answer ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 sm:gap-3 justify-between pt-4">
              <button
                onClick={handlePrevious}
                disabled={sectionIndex === 0 && questionIndex === 0}
                className="inline-flex items-center justify-center gap-1 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-base font-bold text-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-95"
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              {(sectionIndex === sections.length - 1 && questionIndex === totalQuestions - 1) ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || lesson?.is_completed}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-base font-bold text-white transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:shadow-lg hover:shadow-green-500/20"
                >
                  {submitting ? 'Submitting...' : lesson?.is_completed ? 'Already Completed' : 'Submit Lesson'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-8 py-3 text-base font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-blue-500/30"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        ) : submitted && (scoreData || lesson?.is_completed) ? (
          // Score Reveal View - Using Enhanced Celebration Component
          <CompletionCelebration
            score={{
              score: scoreData?.score || 0,
              total: scoreData?.total || 0,
              score_pct: scoreData?.score_pct || 100,
              message: scoreData?.message || 'Lesson completed!',
            }}
            streak={0} 
            nextLesson={scoreData?.next_lesson}
            onContinue={handleNext_AfterScore}
            onRetry={() => {
              if (lesson?.is_completed) return; // Prevent retry if strictly completed server-side
              setSubmitted(false);
              setScoreData(null);
            }}
          />
        ) : null}
      </main>
    </div>
  );
};

// Helpers for progress bar
function calculateAbsoluteIndex(sections, currentSec, currentQ) {
  let count = 0;
  for (let i = 0; i < currentSec; i++) {
    count += sections[i].questions?.length || 0;
  }
  return count + currentQ;
}

function calculateTotalQuestions(sections) {
  return sections.reduce((sum, sec) => sum + (sec.questions?.length || 0), 0);
}

export default LessonPage;
