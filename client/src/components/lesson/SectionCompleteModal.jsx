import { useState, useEffect } from 'react';

/**
 * SectionCompleteModal — Celebration modal shown after completing a section.
 * Displays score, XP earned (with counting animation), and options to retry or continue.
 */
export function SectionCompleteModal({ sectionLabel, score, total, xpEarned, onRetry, onContinue }) {
  const [displayXp, setDisplayXp] = useState(0);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    let start = 0;
    const step = Math.ceil((xpEarned || 0) / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, xpEarned || 0);
      setDisplayXp(start);
      if (start >= (xpEarned || 0)) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [xpEarned]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="section-card-entrance text-center w-[90%] max-w-[360px]"
        style={{
          background: 'linear-gradient(135deg, #1a1744, #302B63)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px 32px',
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* Celebration emoji */}
        <div className="text-[56px] mb-2">🎉</div>

        {/* Title */}
        <div className="text-2xl font-black text-white mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Section Complete!
        </div>
        <div className="mb-6" style={{ color: 'var(--text-muted)' }}>
          {sectionLabel}
        </div>

        {/* Score */}
        <div className="text-5xl font-black mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-gold)' }}
        >
          {score}/{total}
        </div>
        <div className="mb-2" style={{ color: 'var(--text-muted)' }}>
          {pct}% Score
        </div>

        {/* XP earned */}
        <div
          className="inline-block rounded-xl px-5 py-2.5 mb-7 font-extrabold"
          style={{
            background: 'rgba(247,201,72,0.15)',
            border: '1px solid rgba(247,201,72,0.3)',
            color: 'var(--accent-gold)',
            fontFamily: 'var(--font-display)',
          }}
        >
          ⭐ +{displayXp} XP Earned!
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-[10px] text-white font-bold transition-all hover:opacity-80"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              fontFamily: 'var(--font-display)',
            }}
          >
            ↺ RETRY
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 rounded-[10px] font-extrabold transition-all hover:opacity-90"
            style={{
              background: 'var(--accent-gold)',
              color: '#1a1a1a',
              border: 'none',
              fontFamily: 'var(--font-display)',
            }}
          >
            CONTINUE →
          </button>
        </div>
      </div>
    </div>
  );
}
