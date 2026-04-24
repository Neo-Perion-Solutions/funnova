import React from 'react';

const ProgressRing = ({ percentage = 0, size = 120, label = 'Overall Progress' }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <svg width={size} height={size} className="mb-4">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={4}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2563eb"
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2 + 6}
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#0f172a"
        >
          {percentage}%
        </text>
      </svg>
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  );
};

export default ProgressRing;
