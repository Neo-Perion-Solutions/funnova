/**
 * SectionRoadmap - Improved Centered Vertical Journey
 *
 * Features:
 * - Vertical centered flow
 * - Animated connector lines
 * - Hover scale effects
 * - Status indicators (locked, active, completed)
 */

import React from 'react';
import { motion } from 'framer-motion';

const SECTIONS = ['mcq', 'fill_blank', 'true_false', 'game'];

const SECTION_CONFIG = {
  mcq: {
    title: 'Multiple Choice',
    icon: '🎯',
    description: 'Answer quiz questions',
    color: 'from-blue-400 to-blue-600',
    bgLight: 'bg-blue-50',
  },
  fill_blank: {
    title: 'Fill in the Blanks',
    icon: '📝',
    description: 'Complete the sentences',
    color: 'from-amber-400 to-amber-600',
    bgLight: 'bg-amber-50',
  },
  true_false: {
    title: 'True or False',
    icon: '✓',
    description: 'Quick true/false round',
    color: 'from-emerald-400 to-emerald-600',
    bgLight: 'bg-emerald-50',
  },
  game: {
    title: 'Game Challenge',
    icon: '🎮',
    description: 'Play interactive game',
    color: 'from-rose-400 to-rose-600',
    bgLight: 'bg-rose-50',
  },
};

export function SectionRoadmap({ progress, onSectionStart, currentLevel }) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 border-2 border-yellow-300 mb-3">
          <span className="text-lg">🗺️</span>
          <p className="text-xs font-black text-yellow-700 uppercase tracking-wider">Assessment Roadmap</p>
        </div>
        <p className="text-sm text-gray-600 font-semibold">Complete each section to unlock the next</p>
      </motion.div>

      {/* Journey */}
      <div className="relative">
        {SECTIONS.map((type, idx) => {
          const config = SECTION_CONFIG[type];
          const sec = progress[type] || { status: 'locked', score: null, total: 0 };
          const isLocked = sec.status === 'locked';
          const isActive = sec.status === 'active';
          const isCompleted = sec.status === 'completed';

          return (
            <motion.div key={type} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>
              {/* Connector Line */}
              {idx < SECTIONS.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 0.6 }}
                  className={`h-12 w-1 mx-auto origin-top ${isCompleted ? 'bg-emerald-500' : 'bg-gray-300'}`}
                />
              )}

              {/* Section Card */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.1, type: 'spring' }}
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                onClick={() => !isLocked && onSectionStart(type)}
                className={`mb-6 cursor-pointer group ${isLocked ? 'opacity-70' : ''}`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                    isLocked
                      ? 'border-gray-300 bg-gray-50'
                      : isActive
                        ? `border-4 border-gradient-to-r ${config.color}`
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Gradient Background */}
                  {!isLocked && (
                    <div className={`absolute inset-0 opacity-5 bg-gradient-to-r ${config.color}`} />
                  )}

                  {/* Card Content */}
                  <div className="relative p-6 flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                        isLocked
                          ? 'bg-gray-200'
                          : isCompleted
                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-4xl'
                            : `bg-gradient-to-br ${config.color} text-white shadow-lg`
                      }`}
                    >
                      {isCompleted ? '✓' : config.icon}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-black ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                          {config.title}
                        </h3>
                        {isCompleted && (
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-emerald-600 font-black"
                          >
                            ✓
                          </motion.span>
                        )}
                      </div>
                      <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                        {config.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0 text-right">
                      {isLocked && (
                        <div className="text-2xl">🔒</div>
                      )}
                      {isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="flex items-center gap-1 font-black text-blue-600"
                        >
                          <span className="text-sm">START</span>
                          <span>→</span>
                        </motion.div>
                      )}
                      {isCompleted && sec.score !== null && (
                        <div>
                          <p className="text-xs text-gray-500 font-bold">Score</p>
                          <p className="text-2xl font-black text-emerald-600">{sec.score}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  {!isLocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/5 pointer-events-none transition-opacity"
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Completion Message */}
        {SECTIONS.every((type) => progress[type]?.status === 'completed') && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            className="text-center mt-12 p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl border-2 border-purple-300"
          >
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-lg font-black text-purple-700">Lesson Completed!</p>
            <p className="text-sm text-purple-600 mt-2">Great job! You've completed all sections.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SectionRoadmap;
