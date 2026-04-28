import { SectionCard } from './SectionCard';
import { ConnectorPath } from './ConnectorPath';

/**
 * SectionRoadmap — Zigzag vertical roadmap of the 4 assessment sections.
 * Cards alternate left/right positions with animated connector paths.
 */
const SECTIONS = ['mcq', 'fill_blank', 'true_false', 'game'];

export function SectionRoadmap({ progress, onSectionStart }) {
  return (
    <div className="flex flex-col px-4 py-8 gap-0 max-w-[700px] mx-auto">
      {/* Roadmap header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider"
          style={{
            background: 'rgba(247,201,72,0.15)',
            color: 'var(--accent-gold)',
            border: '1px solid rgba(247,201,72,0.3)',
            fontFamily: 'var(--font-display)',
          }}
        >
          🗺️ ASSESSMENT ROADMAP
        </div>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          Complete each section to unlock the next
        </p>
      </div>

      {SECTIONS.map((type, idx) => {
        const position = idx % 2 === 0 ? 'left' : 'right';
        const sec = progress[type] || { status: 'locked', score: null, total: 0 };

        return (
          <div key={type} className="flex flex-col">
            <SectionCard
              type={type}
              status={sec.status}
              score={sec.score}
              total={sec.total}
              position={position}
              onStart={() => onSectionStart(type)}
            />
            {idx < SECTIONS.length - 1 && (
              <ConnectorPath
                completed={sec.status === 'completed'}
                direction={position === 'left' ? 'right' : 'left'}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
