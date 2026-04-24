import React from 'react';
import { Award, Star } from 'lucide-react';
import clsx from 'clsx';

const levelColors = {
  1: 'from-gray-400 to-gray-500',
  2: 'from-amber-400 to-amber-500',
  3: 'from-orange-400 to-orange-500',
  4: 'from-pink-400 to-pink-500',
  5: 'from-purple-400 to-purple-500',
  6: 'from-blue-400 to-blue-500',
  7: 'from-teal-400 to-teal-500',
  10: 'from-yellow-300 to-yellow-500',
};

const getTierLabel = (level) => {
  if (level < 3) return 'Novice';
  if (level < 5) return 'Skilled';
  if (level < 7) return 'Expert';
  if (level < 10) return 'Master';
  return 'Legend';
};

export const LevelBadge = ({
  level = 5,
  xp = 2400,
  compact = false,
  className = '',
}) => {
  const colorClass = levelColors[level] || levelColors[5];
  const tier = getTierLabel(level);

  if (compact) {
    return (
      <div className={clsx(
        'flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-900 shadow-sm',
        colorClass,
        className
      )}>
        <Star className="w-4 h-4 text-amber-500" />
        <span className="text-sm">Level {level}</span>
      </div>
    );
  }

  return (
    <div className={clsx(
      'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
      colorClass,
      className
    )}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-slate-900 p-2 text-white shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Current Level</p>
            <p className="text-2xl font-bold tracking-tight text-slate-900">{level}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
        <span className="text-sm font-semibold text-slate-700">{tier}</span>
      </div>

      <p className="text-sm text-slate-500">
        Keep learning to unlock new levels!
      </p>
    </div>
  );
};

export default LevelBadge;
