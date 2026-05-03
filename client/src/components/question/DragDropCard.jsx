import React, { useState, useCallback, useRef } from 'react';

/**
 * DragDropCard — Kid-friendly "fill in the blank" with drag-and-drop.
 *
 * STRICT RULES (from design spec):
 *   ❌ No icons inside question or answer area
 *   ❌ No hints
 *   ❌ No streaks
 *   ✅ Text-only options (word chips)
 *   ✅ Native HTML5 drag-and-drop + tap-to-select fallback
 *
 * HOW BLANKS WORK:
 *   The question text uses "___" (three or more underscores) as blank markers.
 *   e.g. "Plants have ___ that help them make food."
 *   This component parses the text, splits on ___ tokens, and renders a
 *   <BlankDropZone> in each gap.
 *
 *   If no "___" is found in the question text, a SINGLE blank is placed at
 *   the end (legacy fallback for questions formatted without markers).
 *
 * INTERACTION:
 *   Desktop: drag chip → drop on blank
 *   Mobile:  tap chip to select → tap blank to place
 *   Filled blank: click/tap to clear (returns word to pool)
 *
 * FEEDBACK (props-driven, parent controls):
 *   Pass feedbackMap = { blankIndex: 'correct' | 'wrong' | null }
 *   Correct → green glow on blank
 *   Wrong   → red shake on blank, chip returns to pool on reset
 *
 * Props:
 *   question       {string}    — question text with ___ as blank markers
 *   options        {string[]}  — array of word strings
 *   selectedAnswer {string}    — legacy single-answer string (for SectionQuizPage compat)
 *   onSelect       {function}  — (answerString) => void  (joined by '|' for multi-blank)
 *   disabled       {boolean}
 *   questionNumber {number}
 *   feedbackMap    {object}    — { 0: 'correct', 1: 'wrong', ... }
 */

/* ── Parse question into segments ──────────────────────────── */
const BLANK_MARKER = /_{2,}/;  // two or more underscores

function parseQuestion(text) {
  // Split on blank markers — produces alternating [text, blank, text, blank...]
  const raw = text.split(BLANK_MARKER);
  const segments = [];
  raw.forEach((part, i) => {
    if (part) segments.push({ type: 'text', value: part, key: `t${i}` });
    if (i < raw.length - 1) {
      segments.push({ type: 'blank', index: segments.filter(s => s.type === 'blank').length, key: `b${i}` });
    }
  });
  // If no blanks found → single blank at end
  const hasBlank = segments.some(s => s.type === 'blank');
  if (!hasBlank) {
    return [{ type: 'text', value: text, key: 't0' }, { type: 'blank', index: 0, key: 'b0' }];
  }
  return segments;
}

/* ── Blank drop zone ───────────────────────────────────────── */
const BlankDropZone = ({ index, value, onDrop, onClear, disabled, feedback, snapKey }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const word = e.dataTransfer.getData('text/plain');
    if (word) onDrop(index, word);
  };

  const feedbackClass = feedback === 'correct' ? 'correct'
    : feedback === 'wrong' ? 'wrong'
    : value ? 'filled'
    : '';

  return (
    <span
      role="button"
      aria-label={value ? `Blank ${index + 1}: ${value}. Click to remove.` : `Blank ${index + 1}: empty. Drop a word here.`}
      tabIndex={disabled ? -1 : 0}
      key={snapKey}  /* forces re-mount snap animation */
      className={`quiz-blank ${feedbackClass} ${dragOver ? 'drag-over' : ''} ${value && snapKey ? 'quiz-blank-snap' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && value && onClear(index)}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && value) onClear(index); }}
    >
      {value ? (
        <>
          {value}
          {!disabled && (
            <span className="quiz-blank-clear" aria-hidden="true">✕</span>
          )}
        </>
      ) : (
        <span className="quiz-blank-placeholder">drop here</span>
      )}
    </span>
  );
};

/* ── Draggable word chip ───────────────────────────────────── */
const WordChip = ({ word, index, isUsed, isTapSelected, disabled, onDragStart, onDragEnd, onTap }) => {
  const colorClass = `quiz-chip-${index % 6}`;
  const stateClass = isUsed ? 'used' : isTapSelected ? 'tap-selected' : '';

  return (
    <button
      type="button"
      aria-label={`Word: ${word}${isUsed ? ' (already placed)' : ''}`}
      aria-disabled={disabled || isUsed}
      draggable={!disabled && !isUsed}
      className={`quiz-chip ${colorClass} ${stateClass}`}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', word);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(word);
      }}
      onDragEnd={onDragEnd}
      onClick={() => !disabled && !isUsed && onTap(word)}
    >
      {word}
    </button>
  );
};

/* ── Main DragDropCard ─────────────────────────────────────── */
const DragDropCard = ({
  question,
  options = [],
  selectedAnswer,
  onSelect,
  disabled = false,
  questionNumber = 1,
  feedbackMap = {},
  // Legacy compat — unused but received from SectionQuizPage
  totalQuestions,
  showFeedback,
  correctAnswer,
}) => {
  const segments = parseQuestion(question || '');
  const blankCount = segments.filter(s => s.type === 'blank').length;

  /* answers[i] = word placed in blank i, or null */
  const [answers, setAnswers] = useState(() => {
    // Restore from selectedAnswer string (joined by '|')
    if (selectedAnswer) {
      const parts = selectedAnswer.split('|');
      return Array.from({ length: blankCount }, (_, i) => parts[i] || null);
    }
    return Array(blankCount).fill(null);
  });

  /* For tap-to-select (mobile) */
  const [tapSelected, setTapSelected] = useState(null);
  /* Track which chip key is "dragging" for opacity */
  const [draggingWord, setDraggingWord] = useState(null);
  /* Snap animation keys per blank (increment to re-trigger) */
  const snapKeys = useRef(Array(blankCount).fill(0));

  /* Emit to parent whenever answers change */
  const emit = useCallback((nextAnswers) => {
    onSelect(nextAnswers.join('|'));
  }, [onSelect]);

  /* Place a word into a blank */
  const placeWord = useCallback((blankIndex, word) => {
    setAnswers(prev => {
      const next = [...prev];
      // If word is already placed somewhere else, remove it from there first
      const existingIndex = prev.indexOf(word);
      if (existingIndex !== -1 && existingIndex !== blankIndex) {
        next[existingIndex] = null;
      }
      next[blankIndex] = word;
      snapKeys.current[blankIndex] = (snapKeys.current[blankIndex] || 0) + 1;
      emit(next);
      return next;
    });
    setTapSelected(null);
  }, [emit]);

  /* Clear a blank */
  const clearBlank = useCallback((blankIndex) => {
    setAnswers(prev => {
      const next = [...prev];
      next[blankIndex] = null;
      emit(next);
      return next;
    });
  }, [emit]);

  /* Tap handler: select chip OR place into blank */
  const handleChipTap = useCallback((word) => {
    setTapSelected(prev => prev === word ? null : word);
  }, []);

  const handleBlankDrop = useCallback((blankIndex, word) => {
    placeWord(blankIndex, word);
  }, [placeWord]);

  const handleBlankClick = useCallback((blankIndex) => {
    if (tapSelected) {
      placeWord(blankIndex, tapSelected);
    } else {
      clearBlank(blankIndex);
    }
  }, [tapSelected, placeWord, clearBlank]);

  /* Which words are currently placed (to dim chips) */
  const usedWords = new Set(answers.filter(Boolean));

  return (
    <div className="quiz-question-enter" style={{ width: '100%' }}>

      {/* ── Question card with inline blanks ── */}
      <div className="quiz-fill-card">
        <span className="quiz-question-label">Question {questionNumber} — Fill in the Blank</span>

        <div className="quiz-fill-sentence" aria-live="polite">
          {segments.map((seg) => {
            if (seg.type === 'text') {
              // Split on spaces so each word wraps naturally
              return seg.value.split(' ').filter(Boolean).map((w, wi) => (
                <span key={`${seg.key}-${wi}`} className="quiz-fill-word">{w}</span>
              ));
            }

            const val = answers[seg.index] ?? null;
            const fb = feedbackMap[seg.index] ?? null;

            return (
              <BlankDropZone
                key={seg.key}
                index={seg.index}
                value={val}
                feedback={fb}
                disabled={disabled}
                snapKey={val ? snapKeys.current[seg.index] : 0}
                onDrop={handleBlankDrop}
                onClear={handleBlankClick}
              />
            );
          })}
        </div>

        {/* Tap-select prompt (shows only if a word is tap-selected) */}
        {tapSelected && !disabled && (
          <p
            style={{
              marginTop: 16,
              textAlign: 'center',
              fontFamily: 'var(--quiz-font-display)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--quiz-primary)',
              opacity: 0.8,
            }}
            aria-live="polite"
          >
            Now tap a blank to place &ldquo;{tapSelected}&rdquo;
          </p>
        )}
      </div>

      {/* ── Word chips ── */}
      <p className="quiz-chips-label">Choose a word</p>
      <div className="quiz-chips-grid" role="list">
        {options.map((word, idx) => (
          <WordChip
            key={word}
            word={word}
            index={idx}
            isUsed={usedWords.has(word)}
            isTapSelected={tapSelected === word}
            disabled={disabled}
            onDragStart={setDraggingWord}
            onDragEnd={() => setDraggingWord(null)}
            onTap={handleChipTap}
          />
        ))}
      </div>
    </div>
  );
};

export default DragDropCard;
