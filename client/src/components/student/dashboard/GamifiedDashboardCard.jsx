import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers3, GraduationCap } from 'lucide-react';
import clsx from 'clsx';

// Color mapping for subjects
const subjectColors = {
  'Mathematics': 'from-blue-500 to-blue-600',
  'English': 'from-purple-500 to-purple-600',
  'Science': 'from-green-500 to-green-600',
  'History': 'from-amber-500 to-amber-600',
  'Geography': 'from-teal-500 to-teal-600',
  'Art': 'from-pink-500 to-pink-600',
  'Sports': 'from-red-500 to-red-600',
};

const subjectIcons = {
  'Mathematics': '🔢',
  'English': '📚',
  'Science': '🔬',
  'History': '📜',
  'Geography': '🌍',
  'Art': '🎨',
  'Sports': '⚽',
};

export const GamifiedDashboardCard = ({
  subject,
  unit_count = 0,
  lesson_count = 0,
  progress = 0,
  completedLessons = 0,
  onClick,
}) => {
  const navigate = useNavigate();
  const colors = subjectColors[subject?.name] || 'from-slate-700 to-slate-900';
  const icon = subjectIcons[subject?.name] || '📖';
  const progressPercentage = Math.min(
    100,
    lesson_count > 0 ? Math.round((completedLessons / lesson_count) * 100) : 0
  );
  const remainingLessons = Math.max(lesson_count - completedLessons, 0);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/subject/${subject?.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg">
        <div className={clsx('h-1.5 bg-linear-to-r', colors)} />

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                <GraduationCap size={12} />
                Subject
              </div>
              <h3 className="truncate text-xl font-bold tracking-tight text-slate-900">
                {subject?.name || 'Unknown'}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Structured learning path with lessons and progress tracking.
              </p>
            </div>

            <div className={clsx('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-xl shadow-sm', colors)}>
              <span>{icon}</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Layers3 size={14} />
                Units
              </div>
              <p className="mt-2 text-lg font-bold text-slate-900">{unit_count}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <BookOpen size={14} />
                Lessons
              </div>
              <p className="mt-2 text-lg font-bold text-slate-900">{lesson_count}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span className="font-medium">Progress</span>
              <span className="font-semibold text-slate-900">{progressPercentage}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100">
              <div
                className={clsx('h-full rounded-full transition-all duration-500', 'bg-linear-to-r', colors)}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {remainingLessons === 0 ? 'All lessons complete' : `${remainingLessons} lessons remaining`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-slate-700">
              Open
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamifiedDashboardCard;
