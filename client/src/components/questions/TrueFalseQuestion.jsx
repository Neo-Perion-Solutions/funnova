import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { submitProgress } from '../../services/progress.service';

const TrueFalseQuestion = ({ question, value, onChange, disabled }) => {
  const handleSelect = (optVal) => {
    if (disabled) return;
    onChange(question.id, optVal);
  };

  const getStyle = (optVal) => {
    if (value === optVal) {
      return { ...styles.option, ...styles.selected };
    }
    return styles.option;
  };

  return (
    <div>
      <h4 style={styles.text}>{question.question_text}</h4>
      <div style={styles.optionsGrid}>
        <button 
          style={getStyle('True')} 
          onClick={() => handleSelect('True')}
          disabled={disabled}
        >
          ✅ True
        </button>
        <button 
          style={getStyle('False')} 
          onClick={() => handleSelect('False')}
          disabled={disabled}
        >
          ❌ False
        </button>
      </div>
    </div>
  );
};

const styles = {
  text: { margin: '0 0 15px 0', fontSize: '1.1rem' },
  optionsGrid: { display: 'flex', gap: '15px' },
  option: {
    flex: 1, padding: '15px', background: '#f8f9fa', border: '2px solid #e9ecef',
    borderRadius: '12px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold'
  },
  selected: { 
    background: 'rgba(124, 58, 237, 0.1)', 
    borderColor: 'var(--purple)',
    color: 'var(--purple)'
  },
  feedback: { marginTop: '15px', fontWeight: 'bold', animation: 'fadeIn 0.3s' }
};

export default TrueFalseQuestion;
