import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import GameTopbar from '../components/common/GameTopbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import { useAuth } from '../hooks/useAuth';

import SidebarUnitList from '../components/roadmap/SidebarUnitList';
import LessonRoadmap from '../components/roadmap/LessonRoadmap';
import CurrentLessonCard from '../components/roadmap/CurrentLessonCard';

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useAuth();

  const { data: subjectResponse, loading, error } = useFetch(
    () => studentService.getSubjectUnits(id),
    [id]
  );

  const subjectData = subjectResponse?.data;
  const units = subjectData?.units || [];

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    if (units.length > 0 && !selectedUnitId) {
      let initialUnit = units[0];
      if (student?.current_lesson_id) {
        const u = units.find(u => u.lessons?.some(l => l.id === student.current_lesson_id));
        if (u) initialUnit = u;
      }
      setSelectedUnitId(initialUnit.id);
    }
  }, [units, student, selectedUnitId]);

  useEffect(() => {
    if (selectedUnitId) {
      const unit = units.find(u => u.id === selectedUnitId);
      if (unit && unit.lessons?.length > 0) {
        // Just set the current lesson, don't force reset if user clicked around
        if (!selectedLessonId || !unit.lessons.some(l => l.id === selectedLessonId)) {
          const active = unit.lessons.find(l => l.is_unlocked && !l.is_completed) || unit.lessons[0];
          setSelectedLessonId(active.id);
        }
      } else {
        setSelectedLessonId(null);
      }
    }
  }, [selectedUnitId, units, selectedLessonId]);

  const selectedUnit = units.find(u => u.id === selectedUnitId);
  const selectedLesson = selectedUnit?.lessons?.find(l => l.id === selectedLessonId);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#F5F3FF] overflow-hidden">
      {/* Top Bar */}
      <GameTopbar />

      {/* Main Content Area */}
      <main className="flex-1 flex gap-4 lg:gap-6 p-4 lg:p-6 overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border-2 border-red-200 bg-red-50 p-8 text-center"
            >
              <span className="text-4xl mb-3 block">😿</span>
              <p className="text-red-600 font-bold">{error}</p>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Left Sidebar */}
            <div className="hidden lg:block w-72 xl:w-80 shrink-0 h-full">
              <SidebarUnitList 
                units={units} 
                selectedUnitId={selectedUnitId} 
                onSelectUnit={setSelectedUnitId} 
              />
            </div>

            {/* Center Map */}
            <div className="flex-1 min-w-0 h-full flex flex-col items-center justify-center overflow-hidden">
              <LessonRoadmap 
                unit={selectedUnit} 
                selectedLessonId={selectedLessonId} 
                onSelectLesson={(l) => setSelectedLessonId(l.id)} 
              />
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block w-80 shrink-0 h-full">
              <CurrentLessonCard 
                lesson={selectedLesson}
                unit={selectedUnit}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SubjectPage;
