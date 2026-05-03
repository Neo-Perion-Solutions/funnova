import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Gem, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CurrentLessonCard = ({ lesson, unit }) => {
  const navigate = useNavigate();

  if (!lesson) {
    return (
      <div className="w-full h-full bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Lesson</h3>
        <p className="text-gray-500 text-sm">Click on a node in the map to see details.</p>
      </div>
    );
  }

  const isLocked = !lesson.is_unlocked;
  const isCompleted = lesson.is_completed;

  // Placeholder for lesson image - using subject emoji or hardcoded icon for now based on title
  const getLessonIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('plant')) return '🌱';
    if (t.includes('animal')) return '🐶';
    if (t.includes('air')) return '🌬️';
    if (t.includes('water')) return '💧';
    if (t.includes('living')) return '🌿';
    return '💧';
  };

  const handlePlay = () => {
    if (!isLocked) {
      navigate(`/student/lesson/${lesson.id}`);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col shadow-xl border border-gray-100">
      {/* Top Banner */}
      <div className="bg-[#7C3AED] py-3 px-4 flex items-center justify-center gap-2">
        <span className="text-xl">🎯</span>
        <h2 className="text-white font-bold tracking-wide uppercase text-sm">
          {isCompleted ? 'Review Lesson' : 'Current Lesson'}
        </h2>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Big Icon */}
        <div className="flex justify-center mb-6">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-32 h-32 flex items-center justify-center text-7xl drop-shadow-xl"
          >
            {getLessonIcon(lesson.title)}
          </motion.div>
        </div>

        {/* Title & Desc */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{lesson.title}</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            {lesson.description || "Learn amazing new concepts and complete challenges to earn rewards!"}
          </p>
        </div>

        {/* Rewards Box */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Star size={14} /> Reward
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <span className="text-lg">⏱️</span> Difficulty
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="font-extrabold text-[#F59E0B] flex items-center gap-1.5">
                ⭐ 30 XP
              </span>
              <span className="font-extrabold text-[#9333EA] flex items-center gap-1.5">
                💎 10 Stars
              </span>
            </div>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
              Easy
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={!isLocked ? { scale: 1.05 } : {}}
          whileTap={!isLocked ? { scale: 0.95 } : {}}
          onClick={handlePlay}
          disabled={isLocked}
          className={`
            w-full py-4 rounded-full font-extrabold text-lg flex items-center justify-center gap-2 transition-all mt-auto
            ${isLocked 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[#7C3AED] text-white shadow-lg shadow-purple-500/30 hover:bg-[#6D28D9]'}
          `}
        >
          {isLocked ? (
            <>
              <Lock size={20} /> Locked
            </>
          ) : (
            <>
              <Play fill="currentColor" size={20} /> {isCompleted ? 'Play Again' : 'Play Now'}
            </>
          )}
        </motion.button>
      </div>

      {/* Footer hint (Next unlock) */}
      {unit && (
        <div className="bg-gradient-to-r from-[#1e1b4b] to-[#312e81] p-4 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
            🎁
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-indigo-200 uppercase mb-0.5">Complete all lessons</p>
            <p className="text-xs font-medium text-white line-clamp-1">To get a special reward!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentLessonCard;
