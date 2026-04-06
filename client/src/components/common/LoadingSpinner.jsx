import React from 'react';

const LoadingSpinner = () => (
  <div style={styles.container}>
    <div style={styles.spinner}></div>
    <h2 style={styles.text}>Loading magic... ✨</h2>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '6px solid var(--bg)',
    borderTop: '6px solid var(--purple)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  text: {
    marginTop: '20px',
    fontFamily: 'var(--font-heading)',
    color: 'var(--purple)'
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default LoadingSpinner;
