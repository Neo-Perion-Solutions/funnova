import React from 'react';
import MCQQuestion from './MCQQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import FillBlankQuestion from './FillBlankQuestion';

const QuestionList = ({ questions, answers, onAnswerChange, disabled }) => {
  if (!questions || questions.length === 0) {
    return <div style={styles.empty}>No questions yet — add MCQ or True/False below ⬇️</div>;
  }

  return (
    <div style={styles.list}>
      {questions.map((q, i) => {
        let QComponent = null;
        if (q.type === 'mcq') QComponent = MCQQuestion;
        if (q.type === 'true_false') QComponent = TrueFalseQuestion;
        if (q.type === 'fill_blank') QComponent = FillBlankQuestion;

        if (!QComponent) return null;

        return (
          <div key={q.id} style={styles.item}>
            <div style={styles.number}>Q{i + 1}</div>
            <div style={styles.content}>
               <QComponent 
                 question={q} 
                 value={answers[q.id]} 
                 onChange={onAnswerChange} 
                 disabled={disabled}
               />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  empty: {
    padding: '20px',
    background: '#fff3cd',
    color: '#856404',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  item: {
    display: 'flex',
    gap: '15px',
    background: 'white',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid #eee'
  },
  number: {
    background: 'linear-gradient(135deg, var(--blue), var(--purple))',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    flexShrink: 0
  },
  content: {
    flex: 1
  }
};

export default QuestionList;
