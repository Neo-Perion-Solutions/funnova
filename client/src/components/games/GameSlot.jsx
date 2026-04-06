import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateGame } from '../../services/lesson.service';

const GameSlot = ({ game, onUpdate }) => {
  const { student } = useAuth();

  const handlePlay = () => {
    window.open(game.game_url, '_blank');
  };

  const toggleHidden = async () => {
    try {
      await updateGame(game.id, { is_hidden: !game.is_hidden });
      onUpdate();
    } catch (err) {
      alert('Failed to update game visibility');
    }
  };

  return (
    <div style={{...styles.card, opacity: game.is_hidden ? 0.6 : 1}}>
      <div style={styles.header}>
        <span style={styles.icon}>{game.icon}</span>
        <div style={styles.info}>
          <h4 style={styles.title}>{game.title}</h4>
          {student?.role === 'admin' && (
             <span style={styles.url}>{game.game_url}</span>
          )}
        </div>
      </div>

      <div style={styles.actions}>
        {!game.is_hidden && (
          <button style={styles.playBtn} onClick={handlePlay}>▶ Play Now</button>
        )}
        
        {student?.role === 'admin' && (
          <button 
             style={game.is_hidden ? styles.unhideBtn : styles.hideBtn} 
             onClick={toggleHidden}
          >
            {game.is_hidden ? '👁️ Unhide' : '🚫 Hide'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  header: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    marginBottom: '15px'
  },
  icon: {
    fontSize: '2.5rem',
    background: 'rgba(255,255,255,0.2)',
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px'
  },
  info: {
    flex: 1,
    overflow: 'hidden'
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  url: {
    fontSize: '0.7rem',
    color: '#aaa',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  playBtn: {
    background: 'var(--yellow)',
    color: 'var(--dark)',
    padding: '10px',
    borderRadius: '8px',
    flex: 1,
    fontWeight: 'bold',
    boxShadow: '0 4px 0 #b48600'
  },
  hideBtn: {
    background: 'transparent',
    color: 'var(--red)',
    border: '1px solid var(--red)',
    padding: '10px',
    borderRadius: '8px',
  },
  unhideBtn: {
    background: 'var(--green)',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
  }
};

export default GameSlot;
