import React, { useState } from 'react';
import { UserPlus, BookOpen, HelpCircle, Trash2, Clock } from 'lucide-react';

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const ActivityTimeline = ({ activities = [] }) => {
  const [expanded, setExpanded] = useState(false);

  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <Clock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No recent activity</p>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    const iconProps = { size: 16, className: 'shrink-0' };
    switch (type) {
      case 'student_created':
        return <UserPlus {...iconProps} className="text-blue-600" />;
      case 'lesson_completed':
        return <BookOpen {...iconProps} className="text-green-600" />;
      case 'question_added':
        return <HelpCircle {...iconProps} className="text-purple-600" />;
      case 'lesson_deleted':
        return <Trash2 {...iconProps} className="text-red-600" />;
      default:
        return <Clock {...iconProps} className="text-gray-600" />;
    }
  };

  const getActivityLabel = (activity) => {
    switch (activity.type) {
      case 'student_created':
        return `Student "${activity.name}" created`;
      case 'lesson_completed':
        return `Student "${activity.student_name}" completed "${activity.lesson_name}"`;
      case 'question_added':
        return `Questions added to "${activity.lesson_name}"`;
      case 'lesson_deleted':
        return `Lesson "${activity.name}" deleted`;
      default:
        return 'Unknown activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'student_created':
        return 'bg-blue-50 border-blue-200';
      case 'lesson_completed':
        return 'bg-green-50 border-green-200';
      case 'question_added':
        return 'bg-purple-50 border-purple-200';
      case 'lesson_deleted':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const displayedActivities = expanded ? activities : activities.slice(0, 5);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-indigo-600" />
        Recent Activity
      </h3>

      <div className="space-y-3">
        {displayedActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={`relative rounded-lg border p-3 transition-all hover:shadow-sm ${getActivityColor(activity.type)}`}
          >
            <div className="flex items-start gap-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 break-word">
                  {getActivityLabel(activity)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {index < displayedActivities.length - 1 && (
              <div className="absolute left-7 top-full h-3 w-0.5 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {activities.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors py-2 rounded-lg hover:bg-indigo-50"
        >
          {expanded ? '← Show Less' : `Show ${activities.length - 5} More`}
        </button>
      )}
    </div>
  );
};

export default ActivityTimeline;
