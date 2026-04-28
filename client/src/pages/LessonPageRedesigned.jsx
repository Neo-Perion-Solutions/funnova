/**
 * LessonPage - Redesigned Modern Layout
 *
 * Layout:
 * - Left (8 cols): Learning journey with roadmap
 * - Right (4 cols): Student stats, avatar, progress
 * - Full-screen game mode overlay
 * - Max-width container centered
 */

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { SectionRoadmap } from '../components/lesson/SectionRoadmap';
import { StudentStatsPanel } from '../components/lesson/StudentStatsPanel';
import { useLessonProgress } from '../hooks/useLessonProgress';
import RewardPopup from '../components/game/RewardPopup';
import GameEngine from '../game-engine/core/GameEngine';
import { hasGame } from '../game-engine/registry/gameRegistry';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import { toast } from 'sonner';

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  // Fetch lesson metadata
  const { data: lessonResponse, loading: lessonLoading, error } = useFetch(() =>
    studentService.getLessonContent(lessonId)
  );

  // Section progress (roadmap state)
  const { progress, loading: progressLoading, completeSection } = useLessonProgress(lessonId);

  const lessonData = lessonResponse?.data;
  const lesson = lessonData?.lesson;
  const sections = lessonData?.sections || [];
  const games = (lessonData?.games || []).filter((g) => g.is_active && hasGame(g.game_url));

  const [completedGames, setCompletedGames] = useState(new Set());
  const [showGameInline, setShowGameInline] = useState(false);
  const [showGameFullscreen, setShowGameFullscreen] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const handleGameFinish = useCallback(async (gameResult) => {
    try {
      await studentService.submitGameScore(gameResult.gameId, {
        score: gameResult.score,
        accuracy: gameResult.accuracy,
      });
      setCompletedGames((prev) => new Set(prev).add(gameResult.gameId));
      await completeSection('game', gameResult.score, 100);
      toast.success(`Game complete! Score: ${gameResult.score} 🎮`);
      setShowGameFullscreen(false);
      setShowGameInline(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save game score');
    }
  }, [completeSection]);

  const handleSectionStart = (type) => {
    if (type === 'game') {
      if (games.length > 0) {
        setShowGameFullscreen(true);
      } else {
        toast.info('No game available for this lesson yet');
      }
      return;
    }
    navigate(`/student/lesson/${lessonId}/section/${type}`);
  };

  // Loading state
  if (lessonLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg font-bold">Loading adventure...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-indigo-700 p-4">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="mb-6">{error || 'Lesson not found'}</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-white text-purple-600 font-bold px-8 py-3 rounded-2xl hover:scale-105 transition-transform"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold hover:bg-purple-200 transition-colors"
          >
            <ChevronLeft size={20} /> Back
          </motion.button>

          <div className="text-center flex-1 px-3">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              {lesson.unit_title}
            </p>
            <h1 className="text-xl font-extrabold text-gray-900">
              {lesson.title}
            </h1>
          </div>

          {lesson.is_completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm"
            >
              ✓ Completed
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT SIDE: Learning Journey (8 cols) */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Lesson Description Card */}
              <div className="bg-white rounded-3xl border-2 border-gradient-to-r from-purple-200 to-blue-200 p-6 mb-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎓</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-2">Today's Lesson</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {lesson.description || 'Complete all sections to master this topic and unlock rewards!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assessment Roadmap */}
              {progressLoading ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="inline-block animate-pulse text-2xl mb-2">⏳</div>
                  <p>Loading sections...</p>
                </div>
              ) : (
                <SectionRoadmap
                  progress={progress}
                  onSectionStart={handleSectionStart}
                  currentLevel={lesson.is_completed ? null : Object.keys(progress).find(k => progress[k].status !== 'completed')}
                />
              )}

              {/* Boss Level / Game Challenge - Sticky Bottom */}
              {games.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <div
                    onClick={() => handleSectionStart('game')}
                    className="relative cursor-pointer group"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity" />

                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 rounded-3xl p-8 transform group-hover:scale-105 transition-transform duration-300 shadow-2xl border-4 border-white">
                      <div className="absolute top-4 right-6 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        🏆 Boss Level
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-3xl font-black text-white mb-2">Game Challenge</h3>
                          <p className="text-white/90 font-bold text-lg">
                            Test your knowledge with Plant or Animal!
                          </p>
                          <p className="text-white/70 text-sm mt-2">Complete all sections to unlock this challenge</p>
                        </div>

                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-6xl shrink-0"
                        >
                          🎮
                        </motion.div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 w-full bg-white text-orange-600 font-black py-4 px-6 rounded-2xl text-lg hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        ⚡ PLAY GAME
                      </motion.button>

                      {completedGames.size > 0 && (
                        <div className="mt-4 text-center text-white/80 text-sm">
                          ✓ Completed! Score: {completedGames.size}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* RIGHT SIDE: Student Stats (4 cols) */}
          <div className="col-span-12 lg:col-span-4">
            <StudentStatsPanel
              lessonData={lessonData}
              progress={progress}
              completedGames={completedGames}
            />
          </div>
        </div>
      </main>

      {/* Full-Screen Game Mode */}
      <AnimatePresence>
        {showGameFullscreen && games.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          >
            <div className="h-full w-full flex items-center justify-center p-4">
              <div className="w-full max-w-4xl h-full max-h-[90vh] relative">
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGameFullscreen(false)}
                  className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center font-bold text-2xl backdrop-blur-sm transition-colors"
                >
                  ✕
                </motion.button>

                {/* Game container */}
                <div className="h-full overflow-auto">
                  {games.map((game) => (
                    <motion.div
                      key={game.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                    >
                      <GameEngine
                        gameId={game.game_url}
                        gameDbId={game.id}
                        onFinish={handleGameFinish}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RewardPopup isOpen={showReward} onClose={() => setShowReward(false)} type="coins" coins={10} />
    </div>
  );
};

export default LessonPage;
