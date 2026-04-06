import React from 'react';
import GameSlot from './GameSlot';
import AddGameButton from './AddGameButton';

const GameSection = ({ games, lessonId, onUpdate }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.badge}>🎮 Learning Games</h3>
      
      {(!games || games.length === 0) ? (
        <p style={{ color: '#aaa' }}>No games added to this lesson yet.</p>
      ) : (
        <div style={styles.grid}>
          {games.map(game => (
            <GameSlot key={game.id} game={game} onUpdate={onUpdate} />
          ))}
        </div>
      )}
      
      <AddGameButton lessonId={lessonId} onAdded={onUpdate} />
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
    padding: '20px',
    borderRadius: 'var(--radius-lg)',
    color: 'white'
  },
  badge: {
    fontFamily: 'var(--font-heading)',
    margin: '0 0 20px 0',
    color: 'var(--yellow)',
    fontSize: '1.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  }
};

export default GameSection;
