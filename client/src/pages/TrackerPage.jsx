import React from 'react';
import Topbar from '../components/common/Topbar';
import BackButton from '../components/common/BackButton';
import PersonalTracker from '../components/tracker/PersonalTracker';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { getProgressSummary, getStudentScores } from '../services/progress.service';

const TrackerPage = () => {
  const { student } = useAuth();
  
  const { data: summary, loading: sumLoading } = useFetch(
    () => getProgressSummary(student.id),
    [student.id]
  );
  
  const { data: scores, loading: scLoading } = useFetch(
    () => getStudentScores(student.id),
    [student.id]
  );

  return (
    <div style={styles.page}>
      <Topbar />
      
      <main style={styles.main}>
        <div style={styles.header}>
          <BackButton />
          <h1 style={styles.title}>My Progress Tracker 📊</h1>
        </div>
        
        {(sumLoading || scLoading) ? (
          <LoadingSpinner />
        ) : (
          <PersonalTracker data={summary} scores={scores || []} />
        )}
      </main>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, padding: '30px', maxWidth: '1000px', margin: '0 auto', width: '100%' },
  header: { display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start', marginBottom: '30px' },
  title: { margin: 0, color: 'var(--dark)' }
};

export default TrackerPage;
