import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoadmapNode = ({ lesson, index, isCompleted, isUnlocked, isActive, position, onSelect, isSelected }) => {
  const isLocked = !isUnlocked;

  // Visual styles for different states
  const getNodeConfig = () => {
    if (isCompleted) {
      return {
        bg: 'bg-gradient-to-br from-green-400 to-emerald-500',
        ring: 'ring-4 ring-green-300 ring-offset-4 ring-offset-transparent',
        shadow: 'shadow-lg shadow-green-500/50',
        icon: <Star className="w-6 h-6 text-white fill-white" />,
        label: 'text-green-600 bg-green-100',
      };
    }
    if (isActive) {
      return {
        bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        ring: 'ring-4 ring-purple-300 ring-offset-4 ring-offset-transparent',
        shadow: 'shadow-xl shadow-purple-500/60',
        icon: <Sparkles className="w-6 h-6 text-white" />,
        label: 'text-purple-600 bg-purple-100',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-gray-400 to-gray-500',
      ring: 'ring-2 ring-gray-300 ring-offset-2 ring-offset-transparent',
      shadow: 'shadow-md',
      icon: <Lock className="w-5 h-5 text-white/80" />,
      label: 'text-gray-500 bg-gray-200',
    };
  };

  const config = getNodeConfig();

  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{ 
        top: `${position.top}%`, 
        left: `${position.left}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 10 : 1
      }}
    >
      {/* Node Button */}
      <motion.button
        onClick={() => onSelect(lesson)}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.15 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        animate={isActive ? {
          y: [0, -8, 0],
          boxShadow: [
            '0 0 0 0 rgba(124, 58, 237, 0.4)',
            '0 0 0 15px rgba(124, 58, 237, 0)',
          ],
        } : {}}
        transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
        className={`
          relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
          ${config.bg} ${config.ring} ${config.shadow}
          ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
          ${isSelected ? 'ring-yellow-400 ring-offset-4 ring-4 scale-110' : ''}
          transition-all duration-300
        `}
      >
        {config.icon}
        
        {/* Lesson Number Badge */}
        <div className="absolute -left-2 -top-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-extrabold text-gray-700 shadow-sm border-2 border-gray-200">
          {index + 1}
        </div>
      </motion.button>

      {/* Label Box underneath */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg max-w-[120px] text-center"
      >
        <p className="text-[10px] sm:text-xs font-bold text-gray-800 leading-tight line-clamp-2">
          {lesson.title}
        </p>
        {isCompleted && <div className="absolute -right-2 -top-2 text-sm">✅</div>}
      </motion.div>
    </div>
  );
};

const LessonRoadmap = ({ unit, selectedLessonId, onSelectLesson }) => {
  if (!unit) return null;

  const lessons = unit.lessons || [];

  // Exact coordinates matching the grassy pedestals along the curving dirt path
  const pathPositions = [
    { top: 60, left: 28 }, // Node 1: Bottom left
    { top: 80, left: 55 }, // Node 2: Bottom middle
    { top: 60, left: 75 }, // Node 3: Bottom right
    { top: 35, left: 65 }, // Node 4: Middle right
    { top: 25, left: 45 }, // Node 5: Top middle
    { top: 20, left: 20 }, // Node 6 (if needed): Top left
    { top: 40, left: 15 }, // Node 7 (if needed): Middle left
  ];

  // Draw smooth curved SVG path between points
  const drawPath = () => {
    return (
      <svg 
        viewBox="0 0 400 300" 
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 0 }}
      >
        {lessons.map((lesson, i) => {
          if (i === lessons.length - 1) return null;
          const p1 = pathPositions[i % pathPositions.length];
          const p2 = pathPositions[(i + 1) % pathPositions.length];
          
          const x1 = (p1.left / 100) * 400;
          const y1 = (p1.top / 100) * 300;
          const x2 = (p2.left / 100) * 400;
          const y2 = (p2.top / 100) * 300;

          // Define explicit control points for a smooth organic S-curve matching the dirt path
          let cx, cy;
          if (i === 0) { cx = 160; cy = 230; } // 1 -> 2 (curves down-right)
          else if (i === 1) { cx = 280; cy = 230; } // 2 -> 3 (curves up-right)
          else if (i === 2) { cx = 320; cy = 140; } // 3 -> 4 (curves up-left)
          else if (i === 3) { cx = 220; cy = 80;  } // 4 -> 5 (curves up-left)
          else if (i === 4) { cx = 120; cy = 60;  } // 5 -> 6 (curves left)
          else { cx = (x1 + x2) / 2; cy = (y1 + y2) / 2 - 30; } // Generic curve

          const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke={lesson.is_completed ? '#4ADE80' : 'rgba(255,255,255,0.7)'}
              strokeWidth="8"
              strokeDasharray="14 14"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {/* 4:3 Aspect Ratio Container */}
      <div 
        className="relative w-full max-w-4xl mx-auto rounded-[32px] overflow-hidden shadow-2xl border-4 border-white"
        style={{ aspectRatio: '4/3' }}
      >
        {/* Background Image generated */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/science-unit1-bg.png)' }}
        />

        {/* Map Header Overlay */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <div className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg border-2 border-green-400 text-center">
            <p className="text-xs font-bold uppercase text-green-200">Unit {unit.unit_order}</p>
            <h2 className="text-lg sm:text-xl font-extrabold">{unit.title}</h2>
          </div>
        </div>

        {/* Path SVG */}
        {drawPath()}

        {/* Nodes */}
        {lessons.map((lesson, idx) => {
          const isActive = lesson.is_unlocked && !lesson.is_completed;
          const pos = pathPositions[idx % pathPositions.length];

          return (
            <RoadmapNode
              key={lesson.id}
              lesson={lesson}
              index={idx}
              isCompleted={lesson.is_completed}
              isUnlocked={lesson.is_unlocked}
              isActive={isActive}
              isSelected={lesson.id === selectedLessonId}
              position={pos}
              onSelect={onSelectLesson}
            />
          );
        })}

        {/* Bottom Banner */}
        <div className="absolute bottom-4 left-4 right-4 bg-[#1e1b4b]/80 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between text-white border border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <p className="font-bold text-sm">Complete this lesson to <span className="text-yellow-400">unlock</span> the next one! ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonRoadmap;
