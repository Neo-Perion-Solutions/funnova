import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { submitProgress } from '../../services/progress.service';

const FillBlankQuestion = ({ question, value, onChange, disabled }) => {
  return (
    <div>
      <h4 style={styles.text}>{question.question_text}</h4>
      <div style={styles.form}>
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder="Type your answer here..."
          disabled={disabled}
          style={{
            ...styles.input,
            borderColor: value ? 'var(--purple)' : '#ccc'
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  text: { margin: '0 0 15px 0', fontSize: '1.1rem' },
  form: { display: 'flex', gap: '10px' },
  input: {
    flex: 1, padding: '12px 15px', borderRadius: '8px', border: '2px solid',
    fontSize: '1rem', outline: 'none'
  },
  btn: {
    background: 'var(--blue)', color: 'white', padding: '0 20px', 
    borderRadius: '8px', fontWeight: 'bold'
  },
  feedbackContainer: { marginTop: '15px', animation: 'fadeIn 0.3s' },
  feedback: { margin: 0, fontWeight: 'bold' },
  correctAnswerInfo: { margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }
};

export default FillBlankQuestion;
