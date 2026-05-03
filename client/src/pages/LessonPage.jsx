import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { SectionRoadmap } from '../components/lesson/SectionRoadmap';
import { useLessonProgress } from '../hooks/useLessonProgress';
import RewardPopup from '../components/game/RewardPopup';
import GameEngine from '../game-engine/core/GameEngine';
import { hasGame } from '../game-engine/registry/gameRegistry';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import { toast } from 'sonner';

/**
 * LessonPage — Redesigned with zigzag section roadmap.
 * Route: /student/lesson/:lessonId
 *
 * Shows lesson header + recap, then the 4-section roadmap (MCQ → FIB → T/F → Game).
 * Clicking a section navigates to the section quiz page or game page.
 */
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
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState('correct');
  const [showGameInline, setShowGameInline] = useState(false);

  const handleGameFinish = useCallback(async (gameResult) => {
    try {
      await studentService.submitGameScore(gameResult.gameId, {
        score: gameResult.score,
        accuracy: gameResult.accuracy,
      });
      setCompletedGames((prev) => new Set(prev).add(gameResult.gameId));

      // Also mark game section as completed in roadmap
      await completeSection('game', gameResult.score, 100);
      toast.success(`Game complete! Score: ${gameResult.score} 🎮`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save game score');
    }
  }, [completeSection]);

  const handleSectionStart = (type) => {
    if (type === 'game') {
      // Show game inline if games exist, or navigate to game page
      if (games.length > 0) {
        setShowGameInline(true);
        // Scroll to game section
        setTimeout(() => {
          document.getElementById('game-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 rounded-full"
          style={{ border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-gold)' }}
        />
        <p
          className="mt-4 text-lg font-bold"
          style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-display)' }}
        >
          Loading adventure...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4 p-6"
        style={{ background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))' }}
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">
          🚫
        </motion.div>
        <h2 className="text-2xl font-extrabold text-white">Oops!</h2>
        <p className="text-center max-w-md" style={{ color: 'var(--text-muted)' }}>
          {error || 'Lesson not found'}
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/dashboard')}
          className="px-8 py-3 rounded-2xl font-bold shadow-lg"
          style={{
            background: 'var(--accent-gold)',
            color: '#1a1a1a',
            fontFamily: 'var(--font-display)',
          }}
        >
          Back to Home
        </motion.button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))' }}
    >
      {/* ======= HEADER ======= */}
      <header
        className="sticky top-0 z-50 px-4 py-3 shadow-lg"
        style={{
          background: 'rgba(15,12,41,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center justify-between mx-auto max-w-3xl">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-colors"
            style={{
              color: 'var(--accent-gold)',
              background: 'rgba(247,201,72,0.1)',
            }}
          >
            <ChevronLeft size={16} /> Back
          </motion.button>
          <div className="text-center flex-1 px-3">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--accent-gold)' }}
            >
              {lesson.unit_title}
            </p>
            <h1 className="text-sm sm:text-base font-extrabold text-white truncate">
              {lesson.title}
            </h1>
          </div>
          {/* Completed badge */}
          {lesson.is_completed && (
            <div
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background: 'rgba(34,197,94,0.2)',
                color: 'var(--accent-green)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              ✓ Done
            </div>
          )}
        </div>
      </header>

      {/* ======= MAIN ======= */}
      <main className="flex-1 mx-auto max-w-3xl px-4 py-6 sm:px-6 w-full">
        {/* Recap card */}
        {lesson?.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 mb-6 flex items-start gap-3"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--card-border)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <h2
                className="font-extrabold text-sm mb-1"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                Quick Recap
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {lesson.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Section tabs (topic sections, if any) */}
        {sections.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2">
            {sections.map((sec, i) => (
              <div
                key={i}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {sec.title || `Part ${i + 1}`}
              </div>
            ))}
          </div>
        )}

        {/* ======= ZIGZAG ROADMAP ======= */}
        {progressLoading ? (
          <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
            Loading sections...
          </div>
        ) : (
          <SectionRoadmap progress={progress} onSectionStart={handleSectionStart} />
        )}

        {/* ======= INLINE GAME SECTION ======= */}
        {showGameInline && games.length > 0 && (
          <div id="game-section" className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎮</span>
              <h2
                className="text-lg font-extrabold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                Game Challenge
              </h2>
            </div>
            {games.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-5 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(255,217,61,0.2))',
                  border: '1px solid rgba(255,107,107,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🧩</span>
                  <h3 className="font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {game.title}
                  </h3>
                  {completedGames.has(game.id) && (
                    <span
                      className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--accent-green)' }}
                    >
                      ✓ Done
                    </span>
                  )}
                </div>
                <GameEngine
                  gameId={game.game_url}
                  gameDbId={game.id}
                  lessonId={lessonId}
                  onFinish={handleGameFinish}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <RewardPopup isOpen={showReward} onClose={() => setShowReward(false)} type={rewardType} />
    </div>
  );
};

export default LessonPage;
