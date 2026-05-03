import React from 'react';

/**
 * TrueFalseCard — Kid-friendly True / False decision screen.
 *
 * STRICT DESIGN RULES:
 *   ❌ No icons anywhere (no 👍 👎 🎉 ❌ emojis)
 *   ❌ No hints
 *   ❌ No streaks / XP / stars
 *   ✅ Two giant text-only decision cards
 *   ✅ CSS-driven states: default → selected → correct/wrong
 *   ✅ Shake animation on wrong, pop animation on correct
 *   ✅ Dimmed opponent card when one is selected
 *
 * STATES PER CARD:
 *   default  → soft pastel background, coloured text
 *   hover    → scale(1.04) lift — CSS only
 *   selected → strong solid fill (green for TRUE, red for FALSE)
 *   correct  → green fill + pop animation
 *   wrong    → red fill + shake animation
 *   dimmed   → other card fades when one is chosen
 *
 * Props:
 *   question       {string}   — question text
 *   selectedAnswer {string}   — 'true' | 'false' | null | undefined
 *   onSelect       {function} — ('true' | 'false') => void
 *   disabled       {boolean}  — lock after prior answer
 *   showFeedback   {boolean}  — reveal correct/wrong colours
 *   correctAnswer  {string}   — 'true' | 'false' (only used with showFeedback)
 *   questionNumber {number}
 */
const TrueFalseCard = ({
  question,
  selectedAnswer,
  onSelect,
  disabled = false,
  showFeedback = false,
  correctAnswer = null,
  questionNumber = 1,
  // Legacy compat — received but not rendered
  totalQuestions,
}) => {
  const sel = String(selectedAnswer ?? '').toLowerCase();
  const cor = String(correctAnswer  ?? '').toLowerCase();

  const trueSelected  = sel === 'true';
  const falseSelected = sel === 'false';
  const hasSelection  = trueSelected || falseSelected;

  /* Feedback state per button */
  const trueState = (() => {
    if (!hasSelection) return '';
    if (showFeedback) {
      if (cor === 'true')                    return 'correct';
      if (trueSelected && cor !== 'true')    return 'wrong';
      return '';
    }
    if (trueSelected)  return 'selected';
    if (falseSelected) return 'dimmed';
    return '';
  })();

  const falseState = (() => {
    if (!hasSelection) return '';
    if (showFeedback) {
      if (cor === 'false')                   return 'correct';
      if (falseSelected && cor !== 'false')  return 'wrong';
      return '';
    }
    if (falseSelected) return 'selected';
    if (trueSelected)  return 'dimmed';
    return '';
  })();

  const handleSelect = (value) => {
    if (disabled || showFeedback) return;
    onSelect(value);
  };

  return (
    <div className="quiz-question-enter" style={{ width: '100%' }}>

      {/* ── Question card ── */}
      <div className="quiz-question-card">
        <span className="quiz-question-label">Question {questionNumber} — True or False</span>
        <p className="quiz-question-text">{question}</p>
      </div>

      {/* ── Decision cards ── */}
      <div className="quiz-tf-grid" role="group" aria-label="True or False choices">

        {/* TRUE */}
        <button
          id={`tf-true-q${questionNumber}`}
          type="button"
          className={`quiz-tf-card quiz-tf-true ${trueState}`}
          onClick={() => handleSelect('true')}
          disabled={disabled}
          aria-pressed={trueSelected}
          aria-label="True"
          aria-disabled={disabled || showFeedback}
        >
          TRUE
        </button>

        {/* FALSE */}
        <button
          id={`tf-false-q${questionNumber}`}
          type="button"
          className={`quiz-tf-card quiz-tf-false ${falseState}`}
          onClick={() => handleSelect('false')}
          disabled={disabled}
          aria-pressed={falseSelected}
          aria-label="False"
          aria-disabled={disabled || showFeedback}
        >
          FALSE
        </button>

      </div>
    </div>
  );
};

export default TrueFalseCard;
