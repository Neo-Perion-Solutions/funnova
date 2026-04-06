import React from 'react';
import Topbar from '../components/common/Topbar';
import GreetingBanner from '../components/dashboard/GreetingBanner';
import SubjectCard from '../components/dashboard/SubjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useGradeContext } from '../context/GradeContext';
import { useFetch } from '../hooks/useFetch';
import { getSubjects } from '../services/lesson.service';

const DashboardPage = () => {
  const { activeGrade } = useGradeContext();
  
  const { data: subjects, loading } = useFetch(
    () => getSubjects(activeGrade),
    [activeGrade]
  );

  return (
    <div style={styles.page}>
      <Topbar />
      
      <main style={styles.main}>
        <GreetingBanner />
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={styles.grid}>
            {subjects && subjects.map(sub => (
              <SubjectCard key={sub.id} subject={sub} />
            ))}
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
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '20px'
  }
};

export default DashboardPage;
