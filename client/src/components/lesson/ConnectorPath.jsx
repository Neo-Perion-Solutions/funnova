/**
 * ConnectorPath — Animated SVG dashed path connecting roadmap section cards.
 * Shows gold glow when the previous section is completed, muted when locked.
 */
export function ConnectorPath({ completed, direction }) {
  return (
    <div
      className={`flex ${direction === 'right' ? 'justify-start' : 'justify-end'} px-8 sm:px-16 h-16 items-center`}
    >
      <svg width="200" height="60" viewBox="0 0 200 60" fill="none" className="overflow-visible">
        <path
          d={
            direction === 'right'
              ? 'M 20 0 Q 100 60 180 60'
              : 'M 180 0 Q 100 60 20 60'
          }
          stroke={completed ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)'}
          strokeWidth="2.5"
          strokeDasharray="8 5"
          fill="none"
          style={
            completed
              ? {
                  filter: 'drop-shadow(0 0 6px var(--accent-gold))',
                  animation: 'pathGlow 1s ease-out forwards',
                }
              : {}
          }
        />
        {/* Endpoint dot */}
        <circle
          cx={direction === 'right' ? 180 : 20}
          cy="60"
          r="5"
          fill={completed ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'}
        />
      </svg>
    </div>
  );
}
