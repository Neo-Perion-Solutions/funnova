import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const RecentActivityFeed = ({ activities = [] }) => {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-950">
        <span className="h-5 w-1 rounded-full bg-emerald-500" />
        Lesson Completion Trends
      </h3>

      <div className="flex-1 space-y-4">
        {activities.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
            No recent activity tracked.
          </div>
        ) : (
          activities.map((item, idx) => (
            <div key={idx} className="group flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                  <CheckCircle2 size={20} />
                </div>
                {idx !== activities.length - 1 && (
                  <div className="mt-2 h-full w-0.5 bg-gray-100" />
                )}
              </div>
              <div className="pb-6 pt-1">
                <p className="text-sm font-semibold text-gray-950">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {item.completions} completions
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    Overall popularity
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
