import React from 'react';
import { useParams } from 'react-router-dom';
import Topbar from '../components/common/Topbar';
import BackButton from '../components/common/BackButton';
import LessonSlot from '../components/subject/LessonSlot';
import AddLessonButton from '../components/subject/AddLessonButton';
import BulkAddLesson from '../components/subject/BulkAddLesson';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { getLessons } from '../services/lesson.service';
import { useAuth } from '../hooks/useAuth';

const SubjectPage = () => {
  const { id } = useParams();
  const { student } = useAuth();
  
  const { data: lessons, loading, setData: setLessons } = useFetch(
    () => getLessons(id),
    [id]
  );

  const refreshLessons = async () => {
    const fresh = await getLessons(id);
    setLessons(fresh);
  };

  return (
    <div style={styles.page}>
      <Topbar />
      
      <main style={styles.main}>
        <div style={styles.header}>
          <BackButton />
          <h1 style={styles.title}>Your Learning Adventure 🚀</h1>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={styles.lessonsContainer}>
            {lessons && lessons.map(lesson => (
              <LessonSlot key={lesson.id} lesson={lesson} subjectId={id} onUpdate={refreshLessons} />
            ))}
            
            {(!lessons || lessons.length === 0) && (
               <div style={styles.empty}>No lessons available right now! Check back later. 🌟</div>
            )}

            <BulkAddLesson subjectId={id} onAdded={refreshLessons} />
            <AddLessonButton subjectId={id} onAdded={refreshLessons} />
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    flex: 1,
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'flex-start',
    marginBottom: '30px'
  },
  title: {
    margin: 0,
    color: 'var(--dark)'
  },
  lessonsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '12px',
    color: '#666',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: '20px'
  }
};

export default SubjectPage;
