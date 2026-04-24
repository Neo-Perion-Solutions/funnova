// file: client/src/game-engine/games/number-builder/NumberBuilder.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { generateNumber, shuffleDigits, getDigits, validateAnswer, getPlaceLabel } from './logic';
import SoundSystem from '../../systems/SoundSystem';

/**
 * Number Builder Game
 *
 * The student sees a target number and shuffled digit buttons.
 * They must tap digits in the correct left-to-right order to "build" the number.
 * After 5 rounds the game ends and calls onFinish.
 */
const NumberBuilder = ({ state, actions, config }) => {
  const [targetNumber, setTargetNumber] = useState(null);
  const [shuffledDigits, setShuffledDigits] = useState([]);
  const [selectedDigits, setSelectedDigits] = useState([]);
  const [usedIndices, setUsedIndices] = useState(new Set());
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate a new round
  const startNewRound = useCallback(() => {
    const num = generateNumber(config.digits || 4);
    setTargetNumber(num);
    setShuffledDigits(shuffleDigits(num));
    setSelectedDigits([]);
    setUsedIndices(new Set());
    setFeedback(null);
    setIsTransitioning(false);
  }, [config.digits]);

  // Start first round on mount
  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Handle digit selection
  const handleDigitClick = (digit, index) => {
    if (usedIndices.has(index) || isTransitioning || feedback) return;

    SoundSystem.playClick();
    const newSelected = [...selectedDigits, digit];
    const newUsed = new Set(usedIndices);
    newUsed.add(index);

    setSelectedDigits(newSelected);
    setUsedIndices(newUsed);

    // Check if all digits have been placed
    const targetDigits = getDigits(targetNumber);
    if (newSelected.length === targetDigits.length) {
      const isCorrect = validateAnswer(newSelected, targetNumber);

      if (isCorrect) {
        setFeedback('correct');
        SoundSystem.playCorrect();
        actions.correct(config.pointsPerCorrect || 10);
      } else {
        setFeedback('wrong');
        SoundSystem.playWrong();
        actions.wrong();
      }

      // Transition to next round after delay
      setIsTransitioning(true);
      setTimeout(() => {
        actions.nextLevel(config.timePerRound);
        startNewRound();
      }, 1500);
    }
  };

  // Undo last digit
  const handleUndo = () => {
    if (selectedDigits.length === 0 || isTransitioning || feedback) return;

    const newSelected = [...selectedDigits];
    newSelected.pop();

    // Find the last used index to remove
    const lastUsedIndex = [...usedIndices].pop();
    const newUsed = new Set(usedIndices);
    newUsed.delete(lastUsedIndex);

    setSelectedDigits(newSelected);
    setUsedIndices(newUsed);
  };

  // Clear all selected digits
  const handleClear = () => {
    if (isTransitioning || feedback) return;
    setSelectedDigits([]);
    setUsedIndices(new Set());
  };

  if (!targetNumber) return null;

  const targetDigits = getDigits(targetNumber);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-500 font-medium">
          {config.instructions || 'Tap the digits in order to build the number!'}
        </p>
      </div>

      {/* Target Number Display */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border-2 border-indigo-100 text-center">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Build this number</p>
        <div className="text-4xl sm:text-5xl font-black text-indigo-800 tracking-[0.3em] font-mono">
          {targetNumber}
        </div>
        {/* Place value labels */}
        <div className="flex justify-center gap-2 mt-2">
          {targetDigits.map((_, idx) => (
            <span key={idx} className="text-[10px] text-indigo-400 font-semibold w-10 text-center">
              {getPlaceLabel(idx, targetDigits.length)}
            </span>
          ))}
        </div>
      </div>

      {/* Building Area — shows selected digits */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-4 min-h-[80px]">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">
          Your Number
        </p>
        <div className="flex justify-center gap-2 sm:gap-3">
          {targetDigits.map((_, idx) => (
            <div
              key={idx}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all duration-200 ${
                selectedDigits[idx]
                  ? feedback === 'correct'
                    ? 'border-green-400 bg-green-50 text-green-700 scale-105'
                    : feedback === 'wrong'
                    ? 'border-red-400 bg-red-50 text-red-700 animate-shake'
                    : 'border-indigo-400 bg-indigo-50 text-indigo-800 scale-105'
                  : 'border-gray-200 bg-gray-50 text-gray-300'
              }`}
            >
              {selectedDigits[idx] || '?'}
            </div>
          ))}
        </div>
      </div>

      {/* Digit Buttons — scrambled order */}
      <div className="flex flex-wrap justify-center gap-3">
        {shuffledDigits.map((digit, idx) => (
          <button
            key={`${digit}-${idx}`}
            onClick={() => handleDigitClick(digit, idx)}
            disabled={usedIndices.has(idx) || isTransitioning}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-2xl sm:text-3xl font-black transition-all duration-200 shadow-md ${
              usedIndices.has(idx)
                ? 'bg-gray-100 text-gray-300 border-2 border-gray-200 cursor-not-allowed scale-90 opacity-40'
                : 'bg-white text-indigo-800 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Undo / Clear Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleUndo}
          disabled={selectedDigits.length === 0 || isTransitioning || !!feedback}
          className="px-5 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          ↩ Undo
        </button>
        <button
          onClick={handleClear}
          disabled={selectedDigits.length === 0 || isTransitioning || !!feedback}
          className="px-5 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          ✕ Clear
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`text-center py-3 rounded-xl font-bold text-lg animate-in fade-in zoom-in duration-300 ${
            feedback === 'correct'
              ? 'bg-green-100 text-green-800 border-2 border-green-300'
              : 'bg-red-100 text-red-800 border-2 border-red-300'
          }`}
        >
          {feedback === 'correct' ? '✅ Correct! +10 points' : `❌ The number was ${targetNumber}`}
        </div>
      )}
    </div>
  );
};

export default NumberBuilder;
