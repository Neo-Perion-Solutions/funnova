/**
 * LessonPageRedesigned — Adventure Game Themed Lesson Page
 *
 * Layout (Desktop):
 *   Left 65%  → Adventure zone with background, section roadmap nodes, boss card
 *   Right 35% → Lesson Progress panel (sections, XP, stars, encouragement)
 *
 * Uses existing hooks: useLessonProgress, useFetch, studentService
 * Route: /student/lesson/:lessonId
 */

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLessonProgress } from '../hooks/useLessonProgress';
import RewardPopup from '../components/game/RewardPopup';
import GameEngine from '../game-engine/core/GameEngine';
import { hasGame } from '../game-engine/registry/gameRegistry';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import '../styles/lesson-adventure.css';

/* ---------- Section metadata ---------- */
const SECTION_META = [
  { type: 'mcq',        label: 'Multiple Choice',    icon: '📋', nodeColor: '#3D8B37' },
  { type: 'fill_blank', label: 'Fill in the Blanks',  icon: '✏️', nodeColor: '#2196F3' },
  { type: 'true_false', label: 'True or False',       icon: 'T/F', nodeColor: '#9C27B0' },
  { type: 'game',       label: 'Game Challenge',      icon: '🎮', nodeColor: '#F5A623' },
];

/* ============================================================
   COMPONENT
   ============================================================ */
const LessonPageRedesigned = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { student } = useAuth();

  // Data
  const { data: lessonResponse, loading: lessonLoading, error } = useFetch(() =>
    studentService.getLessonContent(lessonId)
  );
  const { progress, loading: progressLoading, completeSection } = useLessonProgress(lessonId);

  const lessonData = lessonResponse?.data;
  const lesson = lessonData?.lesson;
  const games = (lessonData?.games || []).filter((g) => g.is_active && hasGame(g.game_url));

  // State
  const [completedGames, setCompletedGames] = useState(new Set());
  const [showGameFullscreen, setShowGameFullscreen] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Derived
  const totalSections = Object.keys(progress).length;
  const completedSections = Object.values(progress).filter((s) => s.status === 'completed').length;
  const studentName = student?.name || 'Explorer';
  const studentGrade = student?.grade || 3;
  const totalStars = (lessonData?.student?.total_stars) || 230;
  const totalXP = (lessonData?.student?.total_xp) || 1250;
  const xpEarned = completedSections * 100;
  const starsEarned = completedSections * 10;

  /* ---------- Handlers ---------- */
  const handleGameFinish = useCallback(async (gameResult) => {
    try {
      if (gameResult.gameId !== 999) {
        await studentService.submitGameScore(gameResult.gameId, {
          score: gameResult.score,
          accuracy: gameResult.accuracy,
        });
      }
      setCompletedGames((prev) => new Set(prev).add(gameResult.gameId));
      await completeSection('game', gameResult.score, 100);
      toast.success(`Game complete! Score: ${gameResult.score} 🎮`);
      setShowGameFullscreen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save game score');
    }
  }, [completeSection]);

  const handleSectionClick = (type) => {
    const sec = progress[type];
    
    // DEV OVERRIDE: Always allow game access for testing
    if (type !== 'game' && (!sec || sec.status === 'locked')) {
      toast('Complete the previous section to unlock this one! 🔒');
      return;
    }
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

  /* ---------- Loading ---------- */
  if (lessonLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(180deg, #87CEEB, #4CAF50)' }}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Loading adventure...
          </p>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6" style={{ background: 'linear-gradient(180deg, #87CEEB, #4CAF50)' }}>
        <div className="text-6xl">🚫</div>
        <h2 className="text-2xl font-bold text-white">Oops!</h2>
        <p className="text-white/80 text-center max-w-md">{error || 'Lesson not found'}</p>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="bg-white text-green-700 font-bold px-8 py-3 rounded-2xl hover:scale-105 transition-transform shadow-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen" style={{ background: '#F0F4FF' }}>
      {/* ====== HEADER ====== */}
      <header className="adv-header">
        <button className="adv-header__back" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={18} /> Back
        </button>

        <div className="adv-header__center">
          <div className="adv-header__unit">{lesson.unit_title || 'Unit 1'}</div>
          <h1 className="adv-header__title">{lesson.title}</h1>
        </div>

        <div className="adv-header__badges">
          <div className="adv-badge adv-badge--gold">⭐ {totalStars}</div>
          <div className="adv-badge adv-badge--xp">XP {totalXP.toLocaleString()}</div>
          <div className="adv-avatar-section">
            <div className="adv-avatar-circle">{studentName.charAt(0).toUpperCase()}</div>
            <div className="adv-avatar-info">
              <div className="adv-avatar-name">{studentName}</div>
              <div className="adv-avatar-grade">Grade {studentGrade}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ====== MAIN 2-COLUMN ====== */}
      <div className="adv-main">

        {/* ---- LEFT: Adventure Zone ---- */}
        <div className="adv-left">
          <img
            src="/assets/lesson/adventure-bg.png"
            alt=""
            className="adv-left__bg-img"
            loading="lazy"
          />

          {/* Decorative emojis */}
          <span className="adv-deco adv-deco--rainbow">🌈</span>
          <span className="adv-deco adv-deco--water">💧</span>
          <span className="adv-deco adv-deco--flower">🌸</span>
          <span className="adv-deco adv-deco--mushroom">🍄</span>

          {/* Today's Lesson Card */}
          <div className="adv-today-card">
            <div className="adv-today-card__header">
              <span>⭐</span>
              <span className="adv-today-card__badge">Today's Lesson</span>
            </div>
            <div className="adv-today-card__body">
              {lesson.description || "Let's explore how plants look different and grow in amazing ways!"}
            </div>
            <div className="adv-today-card__footer">
              ⭐ Complete all sections to earn stars and XP!
            </div>
          </div>

          {/* ---- SECTION ROADMAP ---- */}
          {progressLoading ? (
            <div className="text-center py-12 text-white font-bold text-lg">Loading sections...</div>
          ) : (
            <div className="adv-roadmap">
              {/* START sign */}
              <div className="adv-start-sign">
                <div className="adv-start-sign__board">START</div>
                <div className="adv-start-sign__pole" />
              </div>

              {SECTION_META.map((sec, idx) => {
                const status = progress[sec.type]?.status || 'locked';
                const isCompleted = status === 'completed';
                const isUnlocked = status === 'unlocked';
                const isLocked = status === 'locked';

                return (
                  <React.Fragment key={sec.type}>
                    {/* Connector line */}
                    {idx > 0 && (
                      <div
                        className={`adv-connector ${
                          progress[SECTION_META[idx - 1].type]?.status === 'completed'
                            ? 'adv-connector--done'
                            : 'adv-connector--pending'
                        }`}
                      />
                    )}

                    {/* Node button */}
                    <button
                      className={`adv-node ${
                        isCompleted ? 'adv-node--completed' :
                        isUnlocked  ? 'adv-node--unlocked'  :
                                      'adv-node--locked'
                      }`}
                      onClick={() => handleSectionClick(sec.type)}
                      aria-label={`${sec.label} — ${status}`}
                      aria-disabled={sec.type !== 'game' && isLocked}
                    >
                      <div className="adv-node__circle" style={{ borderColor: (sec.type !== 'game' && isLocked) ? '#9E9E9E' : sec.nodeColor }}>
                        {/* Icon / text inside */}
                        <span style={{ fontSize: sec.icon.length <= 2 ? '28px' : '18px', fontWeight: 900, color: isLocked ? '#999' : '#fff' }}>
                          {sec.icon}
                        </span>

                        {/* Completed stars */}
                        {isCompleted && (
                          <div className="adv-node__stars">
                            <span className="adv-node__star">⭐</span>
                            <span className="adv-node__star">⭐</span>
                          </div>
                        )}

                        {/* Completed checkmark */}
                        {isCompleted && <div className="adv-node__check">✓</div>}

                        {/* Locked padlock */}
                        {(sec.type !== 'game' && isLocked) && <div className="adv-node__lock">🔒</div>}

                        {/* Unlocked / locked number badge */}
                        {!isCompleted && (
                          <div
                            className="adv-node__number"
                            style={{ background: isUnlocked ? sec.nodeColor : '#9E9E9E' }}
                          >
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="adv-node__label">{sec.label}</div>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Decorative images */}
          <img src="/assets/lesson/student-character.png" alt="" className="adv-left__character" />
          <img src="/assets/lesson/treasure-chest.png" alt="" className="adv-left__treasure" />

          {/* ---- BOSS LEVEL CARD ---- */}
          <div className="adv-boss">
            <div className="adv-boss__info">
              <div className="adv-boss__label">🔥 BOSS LEVEL</div>
              <div className="adv-boss__title">Game Challenge</div>
              <div className="adv-boss__desc">Test your knowledge and win big rewards!</div>
            </div>
            <button
              className="adv-boss__btn"
              onClick={() => handleSectionClick('game')}
              aria-label="Play Game Challenge"
            >
              🎮 Play Game
            </button>
          </div>
        </div>

        {/* ---- RIGHT: Lesson Progress Panel ---- */}
        <div className="adv-right">
          <div className="adv-progress-panel">
            <div className="adv-progress-panel__title">🏆 Lesson Progress</div>

            {/* Sections Completed */}
            <div className="adv-stat adv-animate-in">
              <div className="adv-stat__header">
                <div className="adv-stat__left">
                  <span className="adv-stat__icon">⭐</span>
                  <span className="adv-stat__label">Sections Completed</span>
                </div>
                <span className="adv-stat__value">{completedSections}/{totalSections}</span>
              </div>
              <div className="adv-segments">
                {Object.keys(progress).map((key, i) => (
                  <div
                    key={key}
                    className={`adv-segment ${progress[key].status === 'completed' ? 'adv-segment--filled' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* XP Earned */}
            <div className="adv-stat adv-animate-in">
              <div className="adv-stat__header">
                <div className="adv-stat__left">
                  <span className="adv-stat__icon" style={{ color: '#6C63FF' }}>🔷</span>
                  <span className="adv-stat__label">XP Earned</span>
                </div>
                <span className="adv-stat__value">{xpEarned} / 400</span>
              </div>
              <div className="adv-stat__bar">
                <div
                  className="adv-stat__fill adv-stat__fill--xp"
                  style={{ width: `${Math.min((xpEarned / 400) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Stars Earned */}
            <div className="adv-stat adv-animate-in">
              <div className="adv-stat__header">
                <div className="adv-stat__left">
                  <span className="adv-stat__icon">⭐</span>
                  <span className="adv-stat__label">Stars Earned</span>
                </div>
                <span className="adv-stat__value">{starsEarned} / 40</span>
              </div>
              <div className="adv-stat__bar">
                <div
                  className="adv-stat__fill adv-stat__fill--stars"
                  style={{ width: `${Math.min((starsEarned / 40) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Section detail list */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#6B7280', marginBottom: 12, fontFamily: "'Nunito', sans-serif" }}>
                SECTION DETAILS
              </h4>
              {SECTION_META.map((sec) => {
                const s = progress[sec.type] || { status: 'locked' };
                return (
                  <div
                    key={sec.type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 12,
                      marginBottom: 8,
                      background: s.status === 'completed' ? '#E8F5E9' : s.status === 'unlocked' ? '#E3F2FD' : '#F5F5F5',
                      border: s.status === 'completed' ? '1px solid #A5D6A7' : s.status === 'unlocked' ? '1px solid #90CAF9' : '1px solid #E0E0E0',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{sec.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#333', fontFamily: "'Nunito', sans-serif" }}>
                      {sec.label}
                    </span>
                    <span style={{ fontSize: 16 }}>
                      {s.status === 'completed' ? '✅' : s.status === 'unlocked' ? '▶️' : '🔒'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Encouragement */}
            <div className="adv-encourage">
              <div className="adv-encourage__text">Keep going! You're doing great! 👍</div>
              <img
                src="/assets/lesson/tiger-mascot.png"
                alt="Tiger mascot"
                className="adv-encourage__mascot"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====== FULLSCREEN GAME OVERLAY ====== */}
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
                <button
                  onClick={() => setShowGameFullscreen(false)}
                  className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center font-bold text-2xl backdrop-blur-sm transition-colors"
                  aria-label="Close game"
                >
                  ✕
                </button>
                <div className="h-full overflow-auto">
                  {games.map((game) => (
                    <div key={game.id}>
                      <GameEngine
                        gameId={game.game_url}
                        gameDbId={game.id}
                        onFinish={handleGameFinish}
                      />
                    </div>
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

export default LessonPageRedesigned;
