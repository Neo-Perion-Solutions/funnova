import React from 'react';

const FloatingBubbles = () => {
  const bubbles = [
    { bg: 'var(--yellow)', size: 100, x: '10%', y: '20%', delay: '0s' },
    { bg: 'var(--blue)', size: 150, x: '80%', y: '10%', delay: '1s' },
    { bg: 'var(--pink)', size: 80, x: '70%', y: '80%', delay: '2s' },
    { bg: 'var(--green)', size: 120, x: '20%', y: '70%', delay: '1.5s' },
    { bg: 'var(--orange)', size: 90, x: '50%', y: '85%', delay: '0.5s' }
  ];

  return (
    <div style={styles.container}>
      {bubbles.map((b, i) => (
        <div key={i} style={{
          ...styles.bubble,
          background: b.bg,
          width: b.size,
          height: b.size,
          top: b.y,
          left: b.x,
          animationDelay: b.delay
        }} />
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none'
  },
  bubble: {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.6,
    filter: 'blur(8px)',
    animation: 'float 6s infinite ease-in-out'
  }
};

export default FloatingBubbles;
