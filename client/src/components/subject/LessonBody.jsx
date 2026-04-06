import React, { useEffect, useState } from 'react';
import { getLessonDetails } from '../../services/lesson.service';
import LoadingSpinner from '../common/LoadingSpinner';
import QuestionList from '../questions/QuestionList';
import GameSection from '../games/GameSection';
import AddQuestionButtons from '../questions/AddQuestionButtons';
import ScoreModal from './ScoreModal';
import { submitProgress } from '../../services/progress.service';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LessonBody = ({ lessonId, subjectId }) => {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { question_id: 'answer' }
  const [modal, setModal] = useState({ open: false, score: 0, total: 0, nextId: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onAnswerChange = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleQuizSubmit = async () => {
    if (Object.keys(answers).length < 3) return; // Basic validation
    setIsSubmitting(true);
    try {
      const answersArray = Object.keys(answers).map(id => ({
        question_id: parseInt(id),
        answer_given: answers[id]
      }));
      
      const res = await submitProgress(student.id, lessonId, answersArray);
      setModal({ open: true, score: res.score, total: res.total, nextId: res.nextLessonId });
    } catch (err) {
      alert('Failed to submit: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const details = await getLessonDetails(lessonId);
      setData(details);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    setAnswers({}); // Reset for new lesson
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div>Failed to load lesson.</div>;

  const canSubmit = Object.keys(answers).length === data.questions.length && data.questions.length >= 3;
  const isAdmin = student?.role === 'admin';

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h4 style={styles.label}>📝 Quiz Questions</h4>
        <QuestionList 
          questions={data.questions} 
          answers={answers} 
          onAnswerChange={onAnswerChange} 
          disabled={isSubmitting || isAdmin}
        />
        
        {!isAdmin && data.questions.length >= 3 && (
          <button 
            style={{...styles.submitBtn, opacity: canSubmit ? 1 : 0.5}}
            disabled={!canSubmit || isSubmitting}
            onClick={handleQuizSubmit}
          >
            {isSubmitting ? 'Checking...' : 'Submit Answers 🚀'}
          </button>
        )}

        <AddQuestionButtons lessonId={lessonId} onAdded={fetchDetails} />
      </div>

      {modal.open && (
        <ScoreModal 
          score={modal.score} 
          total={modal.total} 
          onNext={() => {
            setModal({...modal, open: false});
            if (modal.nextId) {
               navigate(`/subject/${subjectId}/lesson/${modal.nextId}`);
            } else {
               navigate(`/subject/${subjectId}`);
            }
          }}
          onBack={() => navigate(`/subject/${subjectId}`)}
        />
      )}

      <div style={styles.divider}></div>

      <div style={styles.section}>
        <GameSection games={data.games} lessonId={lessonId} onUpdate={fetchDetails} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  label: {
    fontSize: '1.2rem',
    fontFamily: 'var(--font-heading)',
    color: 'var(--purple)',
    margin: 0
  },
  divider: {
    height: '2px',
    background: '#eee',
    margin: '10px 0'
  },
  submitBtn: {
    background: 'var(--green)',
    color: 'white',
    padding: '20px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    boxShadow: 'var(--shadow-md)',
    transition: 'all 0.2s'
  }
};

export default LessonBody;
