import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createGame } from '../../services/lesson.service';

const AddGameButton = ({ lessonId, onAdded }) => {
  const { student } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('🎮');

  if (student?.role !== 'admin') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGame({ lesson_id: lessonId, title, game_url: url, icon });
      setTitle(''); setUrl(''); setIcon('🎮'); setIsOpen(false);
      onAdded();
    } catch (err) {
      alert('Error creating game');
    }
  };

  if (!isOpen) {
    return <button style={styles.addBtn} onClick={() => setIsOpen(true)}>＋ Add Game URL</button>;
  }

  return (
    <div style={styles.formCard}>
      <h4>Add New Game</h4>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{display: 'flex', gap:'10px'}}>
           <input style={{...styles.input, width:'60px'}} type="text" placeholder="Emoji" required
             value={icon} onChange={(e) => setIcon(e.target.value)} />
           <input style={{...styles.input, flex:1}} type="text" placeholder="Game Title" required
             value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <input style={styles.input} type="url" placeholder="Direct Game URL (https://...)" required
          value={url} onChange={(e) => setUrl(e.target.value)} />
        
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
    width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)',
    color: 'var(--yellow)', border: '2px dashed var(--yellow)', borderRadius: '12px',
    fontWeight: 'bold', cursor: 'pointer'
  },
  formCard: {
    background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  input: {
    padding: '10px', borderRadius: '6px', border: 'none', background: 'white', fontFamily: 'var(--font-body)'
  },
  actions: { display: 'flex', gap: '10px' },
  saveBtn: { background: 'var(--green)', color: 'white', padding: '10px', borderRadius: '6px', flex:1, fontWeight: 'bold' },
  cancelBtn: { background: 'transparent', color: 'white', border: '1px solid white', padding: '10px', borderRadius: '6px', flex:1 }
};

export default AddGameButton;
