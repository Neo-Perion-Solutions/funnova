import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../components/common/Topbar';
import BackButton from '../components/common/BackButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LessonRoadmap from '../features/subject/components/LessonRoadmap';
import { useFetch } from '../hooks/useFetch';
import { getLessons } from '../services/lesson.service';
import { useAuth } from '../hooks/useAuth';
import { progressService } from '../services/progress.service';

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useAuth();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [subjectName, setSubjectName] = useState('Subject');

  const { data: lessons, loading } = useFetch(
    () => getLessons(id),
    [id]
  );

  // Fetch progress data to determine which lessons are completed
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        if (student?.id) {
          const progressData = await progressService.getStudentScores();

          // Find completed lessons in this subject
          if (progressData && Array.isArray(progressData)) {
            const subjectScores = progressData.find(s => s.subject_id === parseInt(id));
            if (subjectScores && subjectScores.completed_lessons) {
              setCompletedLessons(subjectScores.completed_lessons);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load progress data:', err);
      }
    };

    fetchProgressData();
  }, [student?.id, id]);

  // Extract subject name from first lesson or use default
  useEffect(() => {
    if (lessons && lessons.length > 0 && lessons[0].subject_name) {
      setSubjectName(lessons[0].subject_name);
    }
  }, [lessons]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 active:scale-95 w-fit"
            >
              ← Back
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{subjectName} - Lesson Roadmap</h1>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <LessonRoadmap
              lessons={lessons}
              currentLessonId={student?.current_lesson_id}
              completedLessonIds={completedLessons}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;
