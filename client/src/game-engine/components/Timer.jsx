// file: client/src/game-engine/components/Timer.jsx

import React from 'react';
import { formatTime } from '../utils/helpers';

/**
 * Visual countdown timer with circular progress indicator.
 * Changes color from green → yellow → red as time runs low.
 */
const Timer = ({ timeLeft, maxTime = 30 }) => {
  const pct = maxTime > 0 ? (timeLeft / maxTime) * 100 : 0;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const getColor = () => {
    if (pct > 50) return { stroke: '#10B981', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (pct > 25) return { stroke: '#F59E0B', text: 'text-amber-600', bg: 'bg-amber-50' };
    return { stroke: '#EF4444', text: 'text-red-600', bg: 'bg-red-50' };
  };

  const color = getColor();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${color.bg} transition-colors duration-300`}>
      <svg width="28" height="28" viewBox="0 0 48 48" className="shrink-0">
        <circle
          cx="24" cy="24" r={radius}
          fill="none" stroke="#E5E7EB" strokeWidth="4"
        />
        <circle
          cx="24" cy="24" r={radius}
          fill="none" stroke={color.stroke} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 24 24)"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className={`text-sm font-bold tabular-nums ${color.text}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Timer;
