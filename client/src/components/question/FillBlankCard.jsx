import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * FillBlankCard — Fun keyboard-style input for fill-in-the-blank.
 * Large, kid-friendly input with animated placeholder and character counter.
 */
const FillBlankCard = ({
  question,
  selectedAnswer,
  onSelect,
  disabled = false,
  placeholder = 'Type your answer...',
  questionNumber = 1,
  totalQuestions = 5,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (!disabled) {
      onSelect(e.target.value);
    }
  };

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
        className="bg-white rounded-3xl p-6 mb-6 shadow-lg border-2 border-blue-100"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3">
          Fill in the Blank
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug">
          {question}
        </h3>
      </motion.div>

      {/* Input Area */}
      <motion.div
        animate={{
          borderColor: isFocused ? '#6C5CE7' : '#E2E8F0',
          boxShadow: isFocused ? '0 0 0 4px rgba(108, 92, 231, 0.15)' : '0 4px 16px rgba(0,0,0,0.06)',
        }}
        onClick={() => inputRef.current?.focus()}
        className="bg-white rounded-3xl p-6 border-3 cursor-text transition-all"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">✏️</span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Your Answer</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={selectedAnswer || ''}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full text-xl sm:text-2xl font-bold text-gray-800
            border-0 outline-none bg-transparent
            placeholder:text-gray-300 placeholder:font-medium
            ${disabled ? 'cursor-not-allowed text-gray-400' : ''}
          `}
        />
        <motion.div
          className="mt-3 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Character hint */}
      {selectedAnswer && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-400 mt-3 font-medium"
        >
          {selectedAnswer.length} characters typed
        </motion.p>
      )}
    </motion.div>
  );
};

export default FillBlankCard;
