import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createQuestion } from '../../services/lesson.service';

const AddQuestionButtons = ({ lessonId, onAdded }) => {
  const { student } = useAuth();
  const [activeForm, setActiveForm] = useState(null);

  // Form states
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  if (student?.role !== 'admin') return null;

  const resetForm = () => {
    setActiveForm(null);
    setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setCorrectAnswer('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        lesson_id: lessonId,
        type: activeForm,
        question_text: qText,
        correct_answer: correctAnswer
      };
      
      if (activeForm === 'mcq') {
        payload.option_a = optA; payload.option_b = optB;
        payload.option_c = optC; payload.option_d = optD;
      }
      
      await createQuestion(payload);
      resetForm();
      onAdded();
    } catch (err) {
      alert('Failed to save question');
    }
  };

  return (
    <div style={styles.container}>
      {!activeForm ? (
        <div style={styles.btnGroup}>
          <button style={styles.addBtn} onClick={() => setActiveForm('mcq')}>＋ MCQ</button>
          <button style={styles.addBtn} onClick={() => setActiveForm('true_false')}>＋ True / False</button>
          <button style={styles.addBtn} onClick={() => setActiveForm('fill_blank')}>＋ Fill in Blank</button>
        </div>
      ) : (
        <div style={styles.formCard}>
          <h4>Add {activeForm.toUpperCase()} Question</h4>
          <form onSubmit={handleSave} style={styles.form}>
            <input 
              style={styles.input} type="text" placeholder="Question Text" required
              value={qText} onChange={(e) => setQText(e.target.value)} 
            />
            
            {activeForm === 'mcq' && (
              <>
                <input style={styles.input} type="text" placeholder="Option A" required value={optA} onChange={e => setOptA(e.target.value)} />
                <input style={styles.input} type="text" placeholder="Option B" required value={optB} onChange={e => setOptB(e.target.value)} />
                <input style={styles.input} type="text" placeholder="Option C" required value={optC} onChange={e => setOptC(e.target.value)} />
                <input style={styles.input} type="text" placeholder="Option D" required value={optD} onChange={e => setOptD(e.target.value)} />
                
                <p style={{margin: '5px 0 0'}}>Select Correct Option:</p>
                <div style={{display: 'flex', gap:'10px'}}>
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <label key={opt}>
                      <input 
                        type="radio" name="correctOpt" required
                        onChange={() => {
                          if (opt==='A') setCorrectAnswer(optA);
                          if (opt==='B') setCorrectAnswer(optB);
                          if (opt==='C') setCorrectAnswer(optC);
                          if (opt==='D') setCorrectAnswer(optD);
                        }}
                      /> Option {opt}
                    </label>
                  ))}
                </div>
              </>
            )}

            {activeForm === 'true_false' && (
              <>
                <p style={{margin: '5px 0 0'}}>Correct Answer:</p>
                <div style={{display: 'flex', gap:'10px'}}>
                  <label><input type="radio" name="tfOpt" required onChange={() => setCorrectAnswer('True')} /> True</label>
                  <label><input type="radio" name="tfOpt" required onChange={() => setCorrectAnswer('False')} /> False</label>
                </div>
              </>
            )}

            {activeForm === 'fill_blank' && (
              <input 
                style={styles.input} type="text" placeholder="Exact Correct Answer" required
                value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} 
              />
            )}

            <div style={styles.actions}>
              <button type="submit" style={styles.saveBtn}>Save Question</button>
              <button type="button" style={styles.cancelBtn} onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { marginTop: '15px' },
  btnGroup: { display: 'flex', gap: '10px' },
  addBtn: {
    flex: 1, padding: '12px', background: 'var(--bg)', color: 'var(--purple)',
    border: '2px dashed var(--purple)', borderRadius: '8px', fontWeight: 'bold'
  },
  formCard: {
    background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #dee2e6'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' },
  actions: { display: 'flex', gap: '10px', marginTop: '10px' },
  saveBtn: { background: 'var(--green)', color: 'white', padding: '10px', borderRadius: '6px', flex:1, fontWeight: 'bold' },
  cancelBtn: { background: '#ccc', color: '#333', padding: '10px', borderRadius: '6px', flex:1, fontWeight: 'bold' }
};

export default AddQuestionButtons;
