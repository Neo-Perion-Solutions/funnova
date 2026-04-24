import React from 'react';
import { Zap } from 'lucide-react';
import clsx from 'clsx';

export const XPIndicator = ({
  currentXP = 2400,
  xpToNextLevel = 3000,
  level = 5,
  compact = false,
  className = '',
}) => {
  const progressPercentage = (currentXP / xpToNextLevel) * 100;

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-900">{currentXP} XP</span>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm', className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Level {level}</p>
            <p className="font-bold tracking-tight text-slate-900">{currentXP} / {xpToNextLevel} XP</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {xpToNextLevel - currentXP} XP to level {level + 1}
      </p>
    </div>
  );
};

export default XPIndicator;
