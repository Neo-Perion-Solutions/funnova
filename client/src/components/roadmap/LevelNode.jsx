import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * LevelNode — A single node on the zig-zag level roadmap.
 * States: locked (grey+lock), active (glow+pulse), completed (star burst)
 */
const LevelNode = ({
  lesson,
  index,
  isCompleted,
  isUnlocked,
  isActive,
  side = 'left',
  delay = 0,
}) => {
  const navigate = useNavigate();
  const isLocked = !isUnlocked;

  const handleClick = () => {
    if (isLocked) return;
    navigate(`/student/lesson/${lesson.id}`);
  };

  // Node appearance config
  const getNodeConfig = () => {
    if (isCompleted) {
      return {
        bg: 'bg-gradient-to-br from-green-400 to-emerald-500',
        ring: 'ring-4 ring-green-300 ring-offset-4 ring-offset-[#F0F4FF]',
        shadow: 'shadow-xl shadow-green-500/30',
        icon: <Star className="w-6 h-6 text-white fill-white" />,
        label: 'Done!',
        labelColor: 'text-green-600 bg-green-100',
      };
    }
    if (isActive) {
      return {
        bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        ring: 'ring-4 ring-purple-300 ring-offset-4 ring-offset-[#F0F4FF]',
        shadow: 'shadow-xl shadow-purple-500/40',
        icon: <Sparkles className="w-6 h-6 text-white" />,
        label: 'Play!',
        labelColor: 'text-purple-600 bg-purple-100',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
      ring: 'ring-2 ring-gray-200 ring-offset-2 ring-offset-[#F0F4FF]',
      shadow: 'shadow-md',
      icon: <Lock className="w-5 h-5 text-white/70" />,
      label: 'Locked',
      labelColor: 'text-gray-400 bg-gray-100',
    };
  };

  const config = getNodeConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className={`flex items-center gap-4 ${side === 'right' ? 'flex-row-reverse' : ''}`}
    >
      {/* The Node Circle */}
      <motion.button
        onClick={handleClick}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.12 } : {}}
        whileTap={!isLocked ? { scale: 0.9 } : {}}
        animate={isActive ? {
          boxShadow: [
            '0 0 0 0 rgba(108, 92, 231, 0.4)',
            '0 0 0 16px rgba(108, 92, 231, 0)',
          ],
        } : {}}
        transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
        className={`
          relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
          ${config.bg} ${config.ring} ${config.shadow}
          ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-300
        `}
      >
        {config.icon}

        {/* Completion stars */}
        {isCompleted && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: 'spring' }}
              className="absolute -top-1 -right-1 text-lg"
            >
              ⭐
            </motion.div>
          </>
        )}

        {/* Lesson number */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 text-xs font-extrabold text-gray-700 shadow-sm border border-gray-200">
          {lesson.lesson_order || index + 1}
        </div>
      </motion.button>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, x: side === 'right' ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.1 }}
        className={`max-w-[180px] sm:max-w-[220px] ${side === 'right' ? 'text-right' : 'text-left'}`}
      >
        <h4 className={`text-sm sm:text-base font-bold text-gray-800 leading-tight line-clamp-2 ${isLocked ? 'opacity-50' : ''}`}>
          {lesson.title || 'Untitled Lesson'}
        </h4>
        <span className={`inline-block mt-1 text-xs font-bold rounded-full px-2 py-0.5 ${config.labelColor}`}>
          {config.label}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default LevelNode;
