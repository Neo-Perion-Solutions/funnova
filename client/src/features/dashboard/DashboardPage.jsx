import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import StatsGrid from './components/StatsGrid';
import StudentsByGradeChart from './components/StudentsByGradeChart';
import TopStudentsTable from './components/TopStudentsTable';
import MissingQuestionsAlert from './components/MissingQuestionsAlert';
import RecentActivityFeed from './components/RecentActivityFeed';
import ActivityTimeline from './components/ActivityTimeline';
import { useDashboardStats } from './hooks/useDashboardStats';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { RefreshCw, Download } from 'lucide-react';

const DashboardPage = () => {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) return <Spinner className="h-96" />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="text-red-500 font-bold text-lg">Failed to load platform statistics.</p>
        <Button 
          variant="secondary" 
          className="mt-4" 
          onClick={() => refetch()}
          icon={RefreshCw}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-400 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Platform Overview"
        description="Track students, lesson coverage, content completeness, and platform metrics."
        action={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => refetch()}
              icon={RefreshCw}
              className="hidden sm:inline-flex"
            >
              Sync Data
            </Button>
            <Button
              variant="primary"
              icon={Download}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* Critical Alerts - Top Priority */}
      {stats.lessons_missing_questions && stats.lessons_missing_questions.length > 0 && (
        <div className="animate-in slide-in-from-top duration-500">
          <MissingQuestionsAlert lessons={stats.lessons_missing_questions} />
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="animate-in slide-in-from-top duration-500 delay-100">
        <StatsGrid stats={stats} />
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 animate-in slide-in-from-top duration-500 delay-200">
        <StudentsByGradeChart data={stats.students_by_grade} />
        <TopStudentsTable students={stats.top_performing_students} />
      </div>

      {/* Bottom Section: Activity & Feed */}
      <div className="grid grid-cols-1 gap-6 pb-10 xl:grid-cols-3 animate-in slide-in-from-top duration-500 delay-300">
        <div className="xl:col-span-2">
          <ActivityTimeline activities={stats.recent_activities || []} />
        </div>
        <div>
          <RecentActivityFeed activities={stats.most_completed_lessons} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
