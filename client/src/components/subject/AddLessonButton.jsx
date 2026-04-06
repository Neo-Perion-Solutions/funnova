import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createLesson } from '../../services/lesson.service';

const AddLessonButton = ({ subjectId, onAdded }) => {
  const { student } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState('');

  if (student?.role !== 'admin') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLesson({
        subject_id: subjectId,
        title,
        lesson_order: parseInt(order) || 1
      });
      setIsOpen(false);
      setTitle('');
      setOrder('');
      onAdded();
    } catch (err) {
      alert('Error creating lesson');
    }
  };

  if (!isOpen) {
    return (
      <button style={styles.addBtn} onClick={() => setIsOpen(true)}>
        ＋ Add New Lesson
      </button>
    );
  }

  return (
    <div style={styles.formCard}>
      <h3>Create New Lesson</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          style={styles.input} type="text" placeholder="Lesson Title" required
          value={title} onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          style={styles.input} type="number" placeholder="Order (e.g. 1)" required
          value={order} onChange={(e) => setOrder(e.target.value)} 
        />
        <div style={styles.actions}>
          <button type="submit" style={styles.saveBtn}>Save</button>
          <button type="button" style={styles.cancelBtn} onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  addBtn: {
    width: '100%',
    padding: '20px',
    background: 'rgba(124, 58, 237, 0.1)',
    border: '2px dashed var(--purple)',
    color: 'var(--purple)',
    borderRadius: 'var(--radius-lg)',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    cursor: 'pointer'
  },
  formCard: {
    background: 'white',
    padding: '20px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    marginBottom: '20px',
    border: '2px solid var(--purple)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '15px'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  saveBtn: {
    background: 'var(--green)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    flex: 1
  },
  cancelBtn: {
    background: '#eee',
    color: 'var(--dark)',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    flex: 1
  }
};

export default AddLessonButton;
