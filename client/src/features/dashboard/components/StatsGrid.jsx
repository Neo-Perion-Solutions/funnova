import { Users, BookOpen, HelpCircle, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import StatCard from '../../../components/shared/StatCard';

const StatsGrid = ({ stats }) => {
  if (!stats) return null;

  const avgScore = Number(stats.avg_score_pct || 0);
  const completionRate = stats.total_lessons > 0
    ? Math.round((stats.total_completions / stats.total_lessons) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Total Students"
        value={stats.total_students}
        icon={Users}
        color="indigo"
        suffix={`${stats.total_students > 0 ? '📚' : '—'}`}
      />
      <StatCard
        title="Total Lessons"
        value={stats.total_lessons}
        icon={BookOpen}
        color="blue"
        suffix={stats.total_lessons > 0 ? '✓' : '—'}
      />
      <StatCard
        title="Total Questions"
        value={stats.total_answers_submitted || 0}
        subtitle={`${stats.total_correct_answers || 0} correct`}
        icon={HelpCircle}
        color="cyan"
      />
      <StatCard
        title="Avg Score"
        value={`${avgScore.toFixed(1)}%`}
        icon={TrendingUp}
        color="green"
        subtitle="Platform average"
      />
      <StatCard
        title="Completion Rate"
        value={`${completionRate}%`}
        icon={CheckCircle}
        color="emerald"
        subtitle={`${stats.total_completions} total`}
      />
      <StatCard
        title="Lessons Need Help"
        value={stats.lessons_without_questions}
        subtitle={stats.lessons_without_questions > 0 ? '⚠️ Action needed' : '✓ All set'}
        icon={AlertTriangle}
        color={stats.lessons_without_questions > 0 ? 'amber' : 'green'}
      />
    </div>
  );
};

export default StatsGrid;
