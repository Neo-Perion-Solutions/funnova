import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useLessons } from '../hooks/useLessons';
import AccordionItem from '../components/studio/AccordionItem';
import LessonDetailsPanel from '../components/studio/LessonDetailsPanel';
import MCQPanel from '../components/studio/MCQPanel';
import TrueFalsePanel from '../components/studio/TrueFalsePanel';
import FillBlankPanel from '../components/studio/FillBlankPanel';
import GamesPanel from '../components/studio/GamesPanel';
import { useLessonQuestions } from '../hooks/useLessonQuestions';

const LessonStudio = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { data: lesson, isLoading: lessonLoading } = useLessons({ id: lessonId });

  // Accordion state management
  const [expandedPanels, setExpandedPanels] = useState({
    details: true,
    mcq: false,
    trueFalse: false,
    fillBlank: false,
    games: false,
  });

  // Fetch question counts for badges
  const { data: mcqQuestions = [] } = useLessonQuestions(lessonId, 'mcq');
  const { data: tfQuestions = [] } = useLessonQuestions(lessonId, 'true_false');
  const { data: fbQuestions = [] } = useLessonQuestions(lessonId, 'fill_blank');

  const togglePanel = (panel, open) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panel]: open,
    }));
  };

  if (lessonLoading) {
    return <div className="text-center py-8">Loading lesson...</div>;
  }

  if (!lesson) {
    return <div className="text-center py-8">Lesson not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{lesson.title}</h1>
          <p className="mt-1 text-sm text-gray-600">Edit lesson content and questions</p>
        </div>
      </div>

      {/* Accordion Panels */}
      <div className="space-y-4">
        {/* Lesson Details Panel */}
        <AccordionItem
          title="Lesson Details"
          count={null}
          isOpen={expandedPanels.details}
          onChange={(open) => togglePanel('details', open)}
        >
          <LessonDetailsPanel lessonId={lessonId} />
        </AccordionItem>

        {/* MCQ Panel */}
        <AccordionItem
          title="MCQ Questions"
          count={`${mcqQuestions.length}/20`}
          isOpen={expandedPanels.mcq}
          onChange={(open) => togglePanel('mcq', open)}
        >
          <MCQPanel lessonId={lessonId} />
        </AccordionItem>

        {/* True/False Panel */}
        <AccordionItem
          title="True/False Questions"
          count={`${tfQuestions.length}/20`}
          isOpen={expandedPanels.trueFalse}
          onChange={(open) => togglePanel('trueFalse', open)}
        >
          <TrueFalsePanel lessonId={lessonId} />
        </AccordionItem>

        {/* Fill Blank Panel */}
        <AccordionItem
          title="Fill in the Blank Questions"
          count={`${fbQuestions.length}/20`}
          isOpen={expandedPanels.fillBlank}
          onChange={(open) => togglePanel('fillBlank', open)}
        >
          <FillBlankPanel lessonId={lessonId} />
        </AccordionItem>

        {/* Games Panel */}
        <AccordionItem
          title="Games"
          count={null}
          isOpen={expandedPanels.games}
          onChange={(open) => togglePanel('games', open)}
        >
          <GamesPanel lessonId={lessonId} />
        </AccordionItem>
      </div>
    </div>
  );
};

export default LessonStudio;
