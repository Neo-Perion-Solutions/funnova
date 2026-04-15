import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const MissingQuestionsAlert = ({ lessons }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!lessons || lessons.length === 0 || dismissed) return null;

  // Categorize by severity (critical = 0 questions)
  const criticalLessons = lessons || [];

  // Sort by creation date (most recent first)
  const sortedLessons = [...criticalLessons].sort((a, b) =>
    new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  const showMore = sortedLessons.length > 3;
  const displayedLessons = sortedLessons.slice(0, 3);

  return (
    <div className="relative overflow-hidden rounded-lg border-l-4 border-l-red-500 border border-red-200 bg-red-50 p-5 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-red-100 p-2 text-red-700 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-red-950">
              Critical: {sortedLessons.length} {sortedLessons.length === 1 ? 'Lesson' : 'Lessons'} Needs Attention
            </h3>
            <span className="inline-flex items-center rounded-full bg-red-200 px-2.5 py-0.5 text-xs font-bold text-red-800">
              {sortedLessons.length}
            </span>
          </div>
          <p className="mb-4 mt-2 text-sm text-red-800">
            These lessons have no questions yet. Students cannot progress until questions are added.
          </p>

          <div className="space-y-2 mb-4">
            {displayedLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="group flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-white/80 p-3 hover:bg-white transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded px-2 py-1 text-xs font-bold bg-red-100 text-red-800">
                      NO Q
                    </span>
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {lesson.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    ID: {lesson.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/questions?lessonId=${lesson.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 transition-colors"
                  >
                    Add Q
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
            {showMore && (
              <p className="text-xs text-red-700 px-3 py-2 bg-red-100/50 rounded">
                +{sortedLessons.length - displayedLessons.length} more lessons need questions
              </p>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/questions">
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                View All Missing
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="text-red-700 hover:bg-red-100"
            >
              Dismiss
            </Button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
          title="Dismiss alert"
        >
          <X size={18} />
        </button>
      </div>

      {/* Pulsing indicator */}
      <div className="absolute top-4 right-10 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
    </div>
  );
};

export default MissingQuestionsAlert;
