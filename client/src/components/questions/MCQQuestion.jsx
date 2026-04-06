import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { submitProgress } from '../../services/progress.service';

const MCQQuestion = ({ question, value, onChange, disabled }) => {
  const handleSelect = (optKey) => {
    if (disabled) return;
    onChange(question.id, question[`option_${optKey}`]);
  };

  const getStyle = (optKey) => {
    if (value === question[`option_${optKey}`]) {
      return { ...styles.option, ...styles.selected };
    }
    return styles.option;
  };

  return (
    <div>
      <h4 style={styles.text}>{question.question_text}</h4>
      <div style={styles.optionsGrid}>
        {['a', 'b', 'c', 'd'].map(opt => (
          question[`option_${opt}`] && (
            <button 
              key={opt}
              style={getStyle(opt)} 
              onClick={() => handleSelect(opt)}
              disabled={disabled}
            >
               {question[`option_${opt}`]}
            </button>
          )
        ))}
      </div>
    </div>
  );
};

const styles = {
  text: {
    margin: '0 0 15px 0',
    fontSize: '1.1rem'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  option: {
    padding: '15px',
    background: '#f8f9fa',
    border: '2px solid #e9ecef',
    borderRadius: '12px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left'
  },
  selected: {
    background: 'rgba(124, 58, 237, 0.1)',
    borderColor: 'var(--purple)',
    color: 'var(--purple)',
    fontWeight: 'bold'
  },
  feedback: {
    marginTop: '15px',
    fontWeight: 'bold',
    animation: 'fadeIn 0.3s'
  }
};

export default MCQQuestion;
