import React from 'react';

const ScoreModal = ({ score, total, onNext, onBack }) => {
  const getFeedback = () => {
    if (score === 3) return { 
      emoji: '🏆', 
      title: "Perfect Score!", 
      message: "Amazing! You got everything right! You're a superstar!" 
    };
    if (score === 2) return { 
      emoji: '🎉', 
      title: "Great Job!", 
      message: "Well done! You got 2 out of 3. You're almost there!" 
    };
    if (score === 1) return { 
      emoji: '👍', 
      title: "Keep Going!", 
      message: "Good try! You got 1 out of 3. Review the lesson and you'll do better!" 
    };
    return { 
      emoji: '💪', 
      title: "Don't Give Up!", 
      message: "You scored 0 this time. That's okay! Review the lesson and try again next time." 
    };
  };

  const feedback = getFeedback();

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.content}>
          <div style={styles.emoji}>{feedback.emoji}</div>
          <h2 style={styles.title}>{feedback.title}</h2>
          <div style={styles.scoreBoard}>
             You scored <span style={styles.scoreText}>{score} / {total}</span>
          </div>
          <p style={styles.message}>{feedback.message}</p>
        </div>
        
        <div style={styles.actions}>
          <button style={styles.nextBtn} onClick={onNext}>Next Lesson 🔓</button>
          <button style={styles.backBtn} onClick={onBack}>Back to List</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(5px)'
  },
  modal: {
    background: 'white', width: '90%', maxWidth: '400px', borderRadius: '24px',
    padding: '40px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  emoji: { fontSize: '5rem', marginBottom: '10px' },
  title: { fontSize: '2rem', color: 'var(--purple)', margin: '10px 0' },
  scoreBoard: { fontSize: '1.2rem', color: '#666', marginBottom: '20px' },
  scoreText: { fontWeight: 'bold', color: 'var(--dark)' },
  message: { fontSize: '1.1rem', color: '#444', lineHeight: '1.5', marginBottom: '30px' },
  actions: { display: 'flex', flexDirection: 'column', gap: '12px' },
  nextBtn: { 
    background: 'var(--green)', color: 'white', padding: '15px', borderRadius: '12px',
    border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  backBtn: {
    background: '#eee', color: '#666', padding: '15px', borderRadius: '12px',
    border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
  }
};

export default ScoreModal;
