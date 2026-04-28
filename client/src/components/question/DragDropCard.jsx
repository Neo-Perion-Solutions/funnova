import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

/**
 * DragDropCard — Core interaction for kids.
 * Presents draggable word chips that can be placed into blank slots.
 * Falls back to tap-to-select on mobile for accessibility.
 */
const DragDropCard = ({
  question,
  options = [],
  selectedAnswer,
  onSelect,
  disabled = false,
  questionNumber = 1,
  totalQuestions = 5,
}) => {
  const [selectedChip, setSelectedChip] = useState(selectedAnswer || null);

  const handleChipClick = useCallback((option) => {
    if (disabled) return;
    const newValue = selectedChip === option ? null : option;
    setSelectedChip(newValue);
    onSelect(newValue || '');
  }, [disabled, selectedChip, onSelect]);

  const chipColors = [
    'from-purple-400 to-purple-600',
    'from-blue-400 to-blue-600',
    'from-pink-400 to-pink-600',
    'from-orange-400 to-orange-600',
    'from-teal-400 to-teal-600',
    'from-green-400 to-green-600',
  ];

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

      {/* Question with blank */}
      <motion.div
        className="bg-white rounded-3xl p-6 mb-6 shadow-lg border-2 border-orange-100"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-3">
          Fill in the Blank
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug">
          {question}
        </h3>

        {/* Answer slot */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-gray-500 font-medium">Your answer:</span>
          <motion.div
            layout
            className={`
              min-h-[48px] min-w-[120px] rounded-2xl border-3 border-dashed flex items-center justify-center px-4 py-2
              ${selectedChip
                ? 'border-purple-400 bg-purple-50'
                : 'border-gray-300 bg-gray-50'
              }
            `}
          >
            <AnimatePresence mode="wait">
              {selectedChip ? (
                <motion.span
                  key={selectedChip}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 10 }}
                  className="text-lg font-bold text-purple-700"
                >
                  {selectedChip}
                </motion.span>
              ) : (
                <motion.span
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="text-gray-400 text-sm font-medium"
                >
                  Tap a word below ↓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Word chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {options.map((option, index) => {
          const isSelected = selectedChip === option;
          const colorClass = chipColors[index % chipColors.length];

          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={!disabled ? { scale: 1.08, y: -2 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              onClick={() => handleChipClick(option)}
              disabled={disabled}
              className={`
                relative rounded-2xl px-5 py-3 text-base sm:text-lg font-bold text-white
                shadow-lg transition-all
                bg-gradient-to-r ${colorClass}
                ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-purple-100 scale-95 opacity-60' : ''}
                ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-xl'}
              `}
            >
              {option}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-xs text-purple-600">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DragDropCard;
