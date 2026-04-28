/**
 * SectionCard — Individual roadmap card for each assessment section.
 * Supports locked, unlocked, and completed states with distinct visuals.
 * Uses Tailwind CSS classes throughout per project rules.
 */

const SECTION_CONFIG = {
  mcq: {
    label: 'Multiple Choice',
    icon: '🎯',
    color: '#6C63FF',
    buttonLabel: 'START',
    description: 'Answer MCQs to proceed',
  },
  fill_blank: {
    label: 'Fill in the Blanks',
    icon: '✏️',
    color: '#3ECFCF',
    buttonLabel: 'START',
    description: 'Fill in the missing words',
  },
  true_false: {
    label: 'True or False',
    icon: '⚡',
    color: '#F59E0B',
    buttonLabel: 'START',
    description: 'Quick-fire true/false round',
  },
  game: {
    label: 'Game Challenge',
    icon: '🎮',
    color: '#FF6B6B',
    gradientTo: '#FFD93D',
    buttonLabel: 'PLAY GAME 🕹️',
    description: 'Boss level — play to win!',
    isBoss: true,
  },
};

export function SectionCard({ type, status, score, total, position, onStart }) {
  const cfg = SECTION_CONFIG[type];
  if (!cfg) return null;

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isBoss = cfg.isBoss;
  const pct = score !== null && total ? Math.round((score / total) * 100) : 0;

  return (
    <div
      className={`
        section-card relative overflow-hidden w-full max-w-[360px]
        ${position === 'right' ? 'self-end' : 'self-start'}
        ${isLocked ? 'cursor-not-allowed grayscale-[0.6]' : 'cursor-pointer'}
        ${status === 'unlocked' ? 'section-card-unlocked' : 'section-card-entrance'}
      `}
      style={{
        background: isLocked
          ? 'var(--locked-bg)'
          : isBoss
            ? `linear-gradient(135deg, ${cfg.color}, ${cfg.gradientTo})`
            : 'var(--card-glass)',
        border: isLocked
          ? '1px solid rgba(255,255,255,0.05)'
          : isCompleted
            ? '1px solid var(--accent-green)'
            : `1px solid ${cfg.color}55`,
        borderRadius: 'var(--card-radius)',
        padding: '24px',
        backdropFilter: 'blur(12px)',
        boxShadow: isCompleted
          ? '0 0 20px rgba(34,197,94,0.15)'
          : isBoss && !isLocked
            ? '0 8px 32px rgba(255,107,107,0.3)'
            : '0 4px 24px rgba(0,0,0,0.3)',
        fontFamily: 'var(--font-body)',
      }}
      onClick={!isLocked ? onStart : undefined}
      aria-disabled={isLocked}
      tabIndex={isLocked ? -1 : 0}
      onKeyDown={(e) => {
        if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onStart();
        }
      }}
      role="button"
      aria-label={`${cfg.label} — ${isLocked ? 'Locked' : isCompleted ? 'Completed' : 'Start'}`}
    >
      {/* Boss badge */}
      {isBoss && !isLocked && (
        <div className="absolute top-3 right-3 bg-black/40 rounded-full px-3 py-0.5 text-[11px] text-white font-bold">
          🏆 BOSS LEVEL
        </div>
      )}

      {/* Shimmer overlay for boss */}
      {isBoss && !isLocked && (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none section-shimmer" />
      )}

      {/* Icon + Completed badge */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-[14px] text-2xl"
          style={{
            background: isLocked ? 'rgba(255,255,255,0.05)' : `${cfg.color}33`,
          }}
        >
          {isLocked ? '🔒' : cfg.icon}
        </div>
        {isCompleted && (
          <div className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: 'var(--accent-green)' }}>
            ✓ {pct}%
          </div>
        )}
      </div>

      {/* Title + Description */}
      <div
        className="font-[var(--font-display)] font-extrabold text-lg mb-1"
        style={{
          fontFamily: 'var(--font-display)',
          color: isLocked ? 'var(--locked-text)' : isBoss ? '#1a1a1a' : 'var(--text-primary)',
        }}
      >
        {cfg.label}
      </div>
      <div
        className="text-[13px] mb-4"
        style={{
          color: isLocked ? '#4B4B6B' : isBoss ? 'rgba(0,0,0,0.7)' : 'var(--text-muted)',
        }}
      >
        {isLocked ? 'Complete previous section to unlock' : cfg.description}
      </div>

      {/* Progress bar (if has questions) */}
      {total > 0 && !isLocked && (
        <div className="mb-4">
          <div
            className="flex justify-between text-xs mb-1.5"
            style={{ color: isBoss ? '#333' : 'var(--text-muted)' }}
          >
            <span>Progress</span>
            <span>{isCompleted ? `${score}/${total}` : `0/${total}`}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-[800ms] ease-out"
              style={{
                width: `${isCompleted ? pct : 0}%`,
                background: isCompleted ? 'var(--accent-green)' : cfg.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Button */}
      {!isLocked && (
        <button
          className="w-full py-3 rounded-[10px] border-none text-white text-[15px] font-extrabold tracking-wide
                     transition-all duration-200 hover:opacity-85 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: isBoss ? 'rgba(0,0,0,0.25)' : cfg.color,
            fontFamily: 'var(--font-display)',
          }}
        >
          {isCompleted ? '↺ RETRY' : cfg.buttonLabel}
        </button>
      )}
    </div>
  );
}
