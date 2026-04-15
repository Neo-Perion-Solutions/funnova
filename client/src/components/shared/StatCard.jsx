import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) => {
  const colors = {
    indigo: 'bg-gray-950 text-white',
    blue: 'bg-sky-50 text-sky-700',
    purple: 'bg-fuchsia-50 text-fuchsia-700',
    green: 'bg-teal-50 text-teal-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', colors[color])}>
          <Icon size={22} />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold',
              trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            )}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
