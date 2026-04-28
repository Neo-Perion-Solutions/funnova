import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * MCQCard — Colorful multiple choice question card with big tap targets.
 * Each option is a vibrant colored button with scale-on-tap animation.
 */
const optionColors = [
  { bg: 'bg-gradient-to-r from-red-400 to-pink-500', selected: 'ring-4 ring-red-300 ring-offset-2', text: 'text-white' },
  { bg: 'bg-gradient-to-r from-blue-400 to-indigo-500', selected: 'ring-4 ring-blue-300 ring-offset-2', text: 'text-white' },
  { bg: 'bg-gradient-to-r from-green-400 to-emerald-500', selected: 'ring-4 ring-green-300 ring-offset-2', text: 'text-white' },
  { bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', selected: 'ring-4 ring-yellow-300 ring-offset-2', text: 'text-white' },
];

const MCQCard = ({
  question,
  options,
  selectedAnswer,
  onSelect,
  disabled = false,
  showFeedback = false,
  correctAnswer = null,
  questionNumber = 1,
  totalQuestions = 5,
}) => {
  const optionKeys = Object.keys(options || {});

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="w-full"
    >
      {/* Question number indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < questionNumber
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                  : i === questionNumber
                  ? 'w-8 bg-purple-300'
                  : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question text */}
      <motion.div
        className="bg-white rounded-3xl p-6 mb-6 shadow-lg border-2 border-purple-100"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-3">
          Question {questionNumber}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug">
          {question}
        </h3>
      </motion.div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {optionKeys.map((key, index) => {
          const color = optionColors[index % optionColors.length];
          const isSelected = selectedAnswer === key;
          const isCorrect = showFeedback && correctAnswer === key;
          const isWrong = showFeedback && isSelected && correctAnswer !== key;

          return (
            <motion.button
              key={key}
              whileHover={!disabled ? { scale: 1.03 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={isWrong ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => !disabled && onSelect(key)}
              disabled={disabled}
              className={`
                relative w-full rounded-2xl p-4 sm:p-5 text-left transition-all
                ${isCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-500 ring-4 ring-green-300 ring-offset-2' : ''}
                ${isWrong ? 'bg-gradient-to-r from-red-400 to-red-500 ring-4 ring-red-300 ring-offset-2' : ''}
                ${!showFeedback && isSelected ? `${color.bg} ${color.selected}` : ''}
                ${!showFeedback && !isSelected ? `${color.bg} opacity-90` : ''}
                ${disabled && !showFeedback ? 'cursor-not-allowed opacity-70' : ''}
                shadow-lg hover:shadow-xl
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-extrabold text-lg
                  ${isSelected || isCorrect ? 'bg-white/30 text-white' : 'bg-white/20 text-white'}
                `}>
                  {isCorrect ? '✓' : isWrong ? '✗' : key}
                </div>
                <span className="text-base sm:text-lg font-bold text-white leading-snug">
                  {options[key]}
                </span>
              </div>

              {/* Selection indicator */}
              {isSelected && !showFeedback && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-sm">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MCQCard;
