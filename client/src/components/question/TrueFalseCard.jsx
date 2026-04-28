import React from 'react';
import { motion } from 'framer-motion';

/**
 * TrueFalseCard — Big YES/NO (True/False) buttons for boolean questions.
 * Uses large, colorful buttons with expressive icons and bounce animations.
 */
const TrueFalseCard = ({
  question,
  selectedAnswer,
  onSelect,
  disabled = false,
  showFeedback = false,
  correctAnswer = null,
  questionNumber = 1,
  totalQuestions = 5,
}) => {
  const isCorrectTrue = showFeedback && correctAnswer?.toLowerCase() === 'true';
  const isCorrectFalse = showFeedback && correctAnswer?.toLowerCase() === 'false';
  const selectedTrue = String(selectedAnswer).toLowerCase() === 'true';
  const selectedFalse = String(selectedAnswer).toLowerCase() === 'false';

  const isWrongTrue = showFeedback && selectedTrue && correctAnswer?.toLowerCase() !== 'true';
  const isWrongFalse = showFeedback && selectedFalse && correctAnswer?.toLowerCase() !== 'false';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="w-full"
    >
      {/* Progress dots */}
      <div className="flex items-center gap-1 mb-4">
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

      {/* Question */}
      <motion.div
        className="bg-white rounded-3xl p-6 mb-6 shadow-lg border-2 border-teal-100"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full mb-3">
          True or False?
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug">
          {question}
        </h3>
      </motion.div>

      {/* True/False Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* TRUE */}
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.92 } : {}}
          animate={isWrongTrue ? { x: [0, -8, 8, -8, 8, 0] } : {}}
          onClick={() => !disabled && onSelect('true')}
          disabled={disabled}
          className={`
            relative rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3
            transition-all shadow-lg hover:shadow-xl
            ${isCorrectTrue ? 'bg-gradient-to-br from-green-400 to-emerald-500 ring-4 ring-green-300 ring-offset-2' : ''}
            ${isWrongTrue ? 'bg-gradient-to-br from-red-400 to-red-500 ring-4 ring-red-300 ring-offset-2' : ''}
            ${!showFeedback && selectedTrue ? 'bg-gradient-to-br from-green-400 to-emerald-500 ring-4 ring-green-300 ring-offset-2' : ''}
            ${!showFeedback && !selectedTrue ? 'bg-gradient-to-br from-green-400 to-emerald-500 opacity-80' : ''}
            ${disabled && !showFeedback ? 'cursor-not-allowed opacity-70' : ''}
          `}
        >
          <motion.span
            animate={selectedTrue && !showFeedback ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl sm:text-5xl"
          >
            {isCorrectTrue ? '🎉' : isWrongTrue ? '❌' : '👍'}
          </motion.span>
          <span className="text-xl sm:text-2xl font-extrabold text-white">TRUE</span>
        </motion.button>

        {/* FALSE */}
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.92 } : {}}
          animate={isWrongFalse ? { x: [0, -8, 8, -8, 8, 0] } : {}}
          onClick={() => !disabled && onSelect('false')}
          disabled={disabled}
          className={`
            relative rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3
            transition-all shadow-lg hover:shadow-xl
            ${isCorrectFalse ? 'bg-gradient-to-br from-green-400 to-emerald-500 ring-4 ring-green-300 ring-offset-2' : ''}
            ${isWrongFalse ? 'bg-gradient-to-br from-red-400 to-red-500 ring-4 ring-red-300 ring-offset-2' : ''}
            ${!showFeedback && selectedFalse ? 'bg-gradient-to-br from-red-400 to-pink-500 ring-4 ring-red-300 ring-offset-2' : ''}
            ${!showFeedback && !selectedFalse ? 'bg-gradient-to-br from-red-400 to-pink-500 opacity-80' : ''}
            ${disabled && !showFeedback ? 'cursor-not-allowed opacity-70' : ''}
          `}
        >
          <motion.span
            animate={selectedFalse && !showFeedback ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl sm:text-5xl"
          >
            {isCorrectFalse ? '🎉' : isWrongFalse ? '❌' : '👎'}
          </motion.span>
          <span className="text-xl sm:text-2xl font-extrabold text-white">FALSE</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TrueFalseCard;
