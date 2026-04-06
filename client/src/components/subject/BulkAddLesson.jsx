import React, { useState } from 'react';
import { createLessonBulk } from '../../services/lesson.service';
import { useAuth } from '../../hooks/useAuth';

const BulkAddLesson = ({ subjectId, onAdded }) => {
  const { student } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Lesson Info
  const [lesson, setLesson] = useState({ title: '', subtitle: '', difficulty: 'easy', lesson_order: '' });
  
  // MCQ Info
  const [mcq, setMcq] = useState({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' });
  
  // Fill Blank Info
  const [fillBlank, setFillBlank] = useState({ question_text: '', correct_answer: '' });
  
  // True/False Info
  const [trueFalse, setTrueFalse] = useState({ question_text: '', correct_answer: 'True' });

  if (student?.role !== 'admin') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLessonBulk({
        lesson: { ...lesson, subject_id: subjectId, lesson_order: parseInt(lesson.lesson_order) || 1 },
        mcq,
        fill_blank: fillBlank,
        true_false: trueFalse
      });
      setIsOpen(false);
      onAdded();
    } catch (err) {
      alert('Error creating bulk lesson content');
    }
  };

  if (!isOpen) {
    return (
      <button style={styles.bulkBtn} onClick={() => setIsOpen(true)}>
        🚀 Create Full Lesson (Template)
      </button>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>New Lesson: Template Process</h2>
          <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.scrollArea}>
            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>1. Lesson Details</h4>
              <input 
                style={styles.input} type="text" placeholder="Lesson Name (e.g. Understanding Place Value)" required
                value={lesson.title} onChange={e => setLesson({...lesson, title: e.target.value})} 
              />
              <input 
                style={styles.input} type="text" placeholder="Subtitle / Short Description" required
                value={lesson.subtitle} onChange={e => setLesson({...lesson, subtitle: e.target.value})} 
              />
              <div style={styles.row}>
                <select style={styles.select} value={lesson.difficulty} onChange={e => setLesson({...lesson, difficulty: e.target.value})}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input 
                  style={styles.input} type="number" placeholder="Order (1-10)" required
                  value={lesson.lesson_order} onChange={e => setLesson({...lesson, lesson_order: e.target.value})} 
                />
              </div>
            </section>

            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>2. MCQ Question</h4>
              <input 
                style={styles.input} type="text" placeholder="Question Text" required
                value={mcq.question_text} onChange={e => setMcq({...mcq, question_text: e.target.value})} 
              />
              <div style={styles.grid}>
                <input style={styles.input} placeholder="Option A" required value={mcq.option_a} onChange={e => setMcq({...mcq, option_a: e.target.value})} />
                <input style={styles.input} placeholder="Option B" required value={mcq.option_b} onChange={e => setMcq({...mcq, option_b: e.target.value})} />
                <input style={styles.input} placeholder="Option C" required value={mcq.option_c} onChange={e => setMcq({...mcq, option_c: e.target.value})} />
                <input style={styles.input} placeholder="Option D" required value={mcq.option_d} onChange={e => setMcq({...mcq, option_d: e.target.value})} />
              </div>
              <label>Correct Choice:
                <select style={styles.select} value={mcq.correct_answer} onChange={e => setMcq({...mcq, correct_answer: e.target.value})}>
                  <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                </select>
              </label>
            </section>

            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>3. Fill in the Blank</h4>
              <input 
                style={styles.input} type="text" placeholder="Question Text (use ____ for blank)" required
                value={fillBlank.question_text} onChange={e => setFillBlank({...fillBlank, question_text: e.target.value})} 
              />
              <input 
                style={styles.input} type="text" placeholder="Exact Correct Answer" required
                value={fillBlank.correct_answer} onChange={e => setFillBlank({...fillBlank, correct_answer: e.target.value})} 
              />
            </section>

            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>4. True or False</h4>
              <input 
                style={styles.input} type="text" placeholder="Statement" required
                value={trueFalse.question_text} onChange={e => setTrueFalse({...trueFalse, question_text: e.target.value})} 
              />
              <select style={styles.select} value={trueFalse.correct_answer} onChange={e => setTrueFalse({...trueFalse, correct_answer: e.target.value})}>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </section>
          </div>

          <div style={styles.footer}>
            <button type="submit" style={styles.submitBtn}>Create Complete Lesson</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  bulkBtn: {
    width: '100%', padding: '15px', background: 'var(--purple)', color: 'white',
    border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '1.1rem', fontWeight: 'bold',
    marginBottom: '20px', cursor: 'pointer', boxShadow: 'var(--shadow-md)'
  },
  overlay: {
    position: 'fixed', top: 0, left: 0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: 'white', width: '90%', maxWidth: '600px', maxHeight: '90vh',
    borderRadius: '16px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
  },
  header: {
    padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  closeBtn: { background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' },
  form: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  scrollArea: { padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '25px' },
  section: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '12px' },
  sectionTitle: { margin: 0, color: 'var(--purple)', borderBottom: '2px solid #eee', paddingBottom: '5px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: 'white' },
  row: { display: 'flex', gap: '10px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  footer: { padding: '20px', borderTop: '1px solid #eee' },
  submitBtn: { width: '100%', padding: '15px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }
};

export default BulkAddLesson;
