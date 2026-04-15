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
        'flex items-center gap-1 bg-gradient-to-r px-3 py-1 rounded-full text-white font-bold',
        colorClass,
        className
      )}>
        <Star className="w-4 h-4" />
        <span className="text-sm">{level}</span>
      </div>
    );
  }

  return (
    <div className={clsx(
      'bg-gradient-to-br rounded-lg p-4 text-white shadow-lg',
      colorClass,
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6" />
          <div>
            <p className="text-xs font-semibold opacity-90">Current Level</p>
            <p className="text-2xl font-bold">{level}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/20 rounded-lg px-3 py-1 inline-block mb-3">
        <span className="text-sm font-semibold">{tier}</span>
      </div>

      <p className="text-xs opacity-90">
        Keep learning to unlock new levels!
      </p>
    </div>
  );
};

export default LevelBadge;
