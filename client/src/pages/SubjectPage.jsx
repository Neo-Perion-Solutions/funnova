import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../components/common/Topbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LessonRoadmap from '../features/subject/components/LessonRoadmap';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import { useAuth } from '../hooks/useAuth';

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useAuth();
  
  const { data: subjectResponse, loading, error } = useFetch(
    () => studentService.getSubjectUnits(id),
    [id]
  );

  const subjectData = subjectResponse?.data;
  const subjectName = subjectData?.subject?.name || 'Subject';
  const units = subjectData?.units || [];

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
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <LessonRoadmap
              units={units}
              currentLessonId={student?.current_lesson_id}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;
