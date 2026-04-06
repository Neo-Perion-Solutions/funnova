import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button style={styles.btn} onClick={() => navigate(-1)}>
      <FaArrowLeft style={styles.icon} /> Back
    </button>
  );
};

const styles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    padding: '10px 20px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--dark)'
  },
  icon: {
    color: 'var(--purple)'
  }
};

export default BackButton;
