import React from 'react';

/**
 * MCQCard — Kid-friendly multiple-choice question card.
 *
 * Rules:
 * - No icons inside options
 * - No hints, no sidebars
 * - 2×2 pastel grid layout
 * - Text-only answers (A/B/C/D labels removed from inside buttons)
 * - Large, rounded buttons with soft pastel colors
 *
 * Props:
 *   question       {string}   — question text
 *   options        {object}   — { A: "...", B: "...", C: "...", D: "..." }
 *   selectedAnswer {string}   — currently selected key e.g. "A"
 *   onSelect       {function} — (key) => void
 *   disabled       {boolean}  — disable all interaction
 *   questionNumber {number}   — 1-based index (for label display only)
 */

/* Map option index → CSS slot class */
const SLOT_CLASSES = ['quiz-opt-a', 'quiz-opt-b', 'quiz-opt-c', 'quiz-opt-d'];

const MCQCard = ({
  question,
  options,
  selectedAnswer,
  onSelect,
  disabled = false,
  questionNumber = 1,
  // Unused legacy props — kept for API compatibility
  totalQuestions,
  showFeedback,
  correctAnswer,
}) => {
  const optionKeys = Object.keys(options || {});

  return (
    <div className="quiz-question-enter" style={{ width: '100%' }}>
      {/* ── Question card ── */}
      <div className="quiz-question-card">
        <span className="quiz-question-label">Question {questionNumber}</span>
        <p className="quiz-question-text">{question}</p>
      </div>

      {/* ── 2×2 Options grid ── */}
      <div className="quiz-options-grid">
        {optionKeys.map((key, index) => {
          const slotClass = SLOT_CLASSES[index % SLOT_CLASSES.length];
          const isSelected = selectedAnswer === key;

          return (
            <button
              key={key}
              onClick={() => !disabled && onSelect(key)}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`Option: ${options[key]}`}
              className={`quiz-option-btn ${slotClass}${isSelected ? ' selected' : ''}`}
            >
              {options[key]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MCQCard;
