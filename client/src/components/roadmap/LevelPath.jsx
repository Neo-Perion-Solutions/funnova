import React from 'react';
import { motion } from 'framer-motion';
import LevelNode from './LevelNode';

/**
 * LevelPath — Candy Crush-style zig-zag level roadmap.
 * Renders lessons as nodes on a winding path with connecting dotted lines.
 */
const LevelPath = ({ units = [], currentLessonId }) => {
  if (!units || units.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4 fun-bounce">🗺️</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Adventures Yet!</h3>
        <p className="text-gray-400 font-medium">Check back soon for new lessons!</p>
      </motion.div>
    );
  }

  // Calculate overall progress
  let totalCount = 0;
  let completedCount = 0;
  units.forEach(unit => {
    unit.lessons?.forEach(lesson => {
      totalCount++;
      if (lesson.is_completed) completedCount++;
    });
  });
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Flatten lessons with unit markers
  let nodeIndex = 0;

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      {/* Progress header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-100"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Journey Progress</span>
          </div>
          <span className="text-2xl font-extrabold text-purple-600">{progressPercentage}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 font-medium">
          {completedCount} of {totalCount} lessons completed
        </p>
      </motion.div>

      {/* Units & Lessons */}
      {units.map((unit, unitIdx) => (
        <div key={unit.id} className="mb-10">
          {/* Unit Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: unitIdx * 0.15 }}
            className="flex items-center gap-3 mb-6 ml-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg shadow-md">
              🌟
            </div>
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Unit {unit.unit_order}</p>
              <h3 className="text-lg font-extrabold text-gray-800">{unit.title}</h3>
            </div>
          </motion.div>

          {/* Zig-zag lesson nodes */}
          {unit.lessons && unit.lessons.length > 0 ? (
            <div className="relative">
              {/* Connecting path SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {unit.lessons.map((_, lessonIdx) => {
                  if (lessonIdx === unit.lessons.length - 1) return null;
                  const side = lessonIdx % 2 === 0 ? 'left' : 'right';
                  const nextSide = (lessonIdx + 1) % 2 === 0 ? 'left' : 'right';
                  const y1 = lessonIdx * 120 + 40;
                  const y2 = (lessonIdx + 1) * 120 + 40;
                  const x1 = side === 'left' ? 80 : 240;
                  const x2 = nextSide === 'left' ? 80 : 240;

                  return (
                    <motion.path
                      key={lessonIdx}
                      d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1 + 40}, ${(x1 + x2) / 2} ${y2 - 40}, ${x2} ${y2}`}
                      fill="none"
                      stroke={unit.lessons[lessonIdx].is_completed ? '#00B894' : '#E2E8F0'}
                      strokeWidth="4"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: (nodeIndex + lessonIdx) * 0.1 + 0.3, duration: 0.5 }}
                    />
                  );
                })}
              </svg>

              {/* Lesson nodes */}
              <div className="relative" style={{ minHeight: unit.lessons.length * 120 }}>
                {unit.lessons.map((lesson, lessonIdx) => {
                  const side = lessonIdx % 2 === 0 ? 'left' : 'right';
                  const isActive = lesson.is_unlocked && !lesson.is_completed;
                  const globalIdx = nodeIndex++;

                  return (
                    <div
                      key={lesson.id}
                      className={`
                        absolute w-full flex
                        ${side === 'right' ? 'justify-end pr-4' : 'justify-start pl-4'}
                      `}
                      style={{ top: lessonIdx * 120 }}
                    >
                      <LevelNode
                        lesson={lesson}
                        index={globalIdx}
                        isCompleted={lesson.is_completed}
                        isUnlocked={lesson.is_unlocked}
                        isActive={isActive}
                        side={side}
                        delay={globalIdx * 0.08}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic ml-4 mb-6">No lessons assigned yet.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default LevelPath;
