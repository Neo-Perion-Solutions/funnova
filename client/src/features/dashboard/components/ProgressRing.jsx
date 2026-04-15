import React from 'react';

const ProgressRing = ({ percentage = 0, size = 120, label = 'Overall Progress' }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 p-6">
      <svg width={size} height={size} className="mb-4">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={4}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3b82f6"
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
          fill="#1f2937"
        >
          {percentage}%
        </text>
      </svg>
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
};

export default ProgressRing;
