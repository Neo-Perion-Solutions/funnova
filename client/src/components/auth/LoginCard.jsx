import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginCard = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!studentId || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(studentId, password);
    } catch (err) {
      console.error('Login Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Invalid Student ID or Password';
      setError(errorMsg + ' ❌');
    }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.logo}>🌟 FUNNOVA</h1>
      <p style={styles.tagline}>Your Super Fun Learning Adventure!</p>
      
      <div style={styles.emojis}>⭐ 🎨 📚 🚀 ⭐</div>
      
      {error && <p style={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="text" 
          placeholder="Student ID" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)}
          style={styles.input}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" className="btn-primary" style={styles.submitBtn}>
          🚀 Let's Learn!
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    animation: 'popIn 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    position: 'relative',
    zIndex: 10
  },
  logo: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, var(--purple), var(--pink))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px'
  },
  tagline: {
    color: '#666',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  emojis: {
    fontSize: '1.5rem',
    marginBottom: '25px',
    letterSpacing: '10px'
  },
  error: {
    color: 'var(--red)',
    fontWeight: 'bold',
    marginBottom: '15px',
    background: '#ffeeee',
    padding: '10px',
    borderRadius: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '15px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid #eee',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.3s'
  },
  submitBtn: {
    marginTop: '10px',
    padding: '15px'
  }
};

export default LoginCard;
