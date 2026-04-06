import React from 'react';
import { Link } from 'react-router-dom';

const SubjectCard = ({ subject }) => {
  const isMath = subject.name.toLowerCase().includes('math');
  const gradient = isMath 
    ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
    : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

  return (
    <Link to={`/subject/${subject.id}`} style={{...styles.card, background: gradient}}>
      <div style={styles.icon}>{subject.icon}</div>
      <h2 style={styles.name}>{subject.name}</h2>
      <p style={styles.count}>{subject.lesson_count} Lessons</p>
      <div style={styles.btn}>Let's Go ➔</div>
    </Link>
  );
};

const styles = {
  card: {
    borderRadius: 'var(--radius-xl)',
    padding: '40px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    boxShadow: 'var(--shadow-md)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  icon: {
    fontSize: '4rem',
    background: 'rgba(255,255,255,0.2)',
    width: '100px',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    marginBottom: '20px'
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2rem',
    margin: '0 0 10px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  count: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    background: 'rgba(0,0,0,0.1)',
    padding: '5px 15px',
    borderRadius: '20px',
    marginBottom: '20px'
  },
  btn: {
    background: 'white',
    color: 'var(--dark)',
    padding: '10px 30px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};

// Add hover effect via a small injected style since inline doesn't support pseudo classes well
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  a[style*="border-radius: var(--radius-xl)"]:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg) !important; }
`;
document.head.appendChild(styleSheet);

export default SubjectCard;
