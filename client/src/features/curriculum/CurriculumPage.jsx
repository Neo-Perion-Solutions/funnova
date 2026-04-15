import React from 'react';
import { useParams } from 'react-router-dom';
import GradeSelection from './components/GradeSelection';
import SubjectTabs from './components/SubjectTabs';
import UnitCards from '../units/components/UnitCards';
import LessonListForUnit from '../lessons/components/LessonListForUnit';
import LessonStudio from '../lessons/pages/LessonStudio';

const CurriculumPage = () => {
  const { gradeId, subjectId, unitId, lessonId } = useParams();

  // Drill-down navigation: Grade → Subject → Unit → Lesson Studio
  if (!gradeId) {
    return <GradeSelection />;
  }

  if (!subjectId) {
    return <SubjectTabs gradeId={gradeId} />;
  }

  if (!unitId) {
    return <UnitCards gradeId={gradeId} subjectId={subjectId} />;
  }

  if (!lessonId) {
    return <LessonListForUnit gradeId={gradeId} subjectId={subjectId} unitId={unitId} />;
  }

  return <LessonStudio />;
};

export default CurriculumPage;
