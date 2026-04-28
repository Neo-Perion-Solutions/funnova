import React from 'react';

const WaterDrops = () => {
  const drops = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 14 + Math.random() * 12,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-30px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        .water-drop {
          position: absolute;
          animation: fall linear infinite;
          user-select: none;
        }
      `}</style>

      {drops.map((drop) => (
        <div
          key={drop.id}
          className="water-drop"
          style={{
            left: `${drop.left}%`,
            fontSize: `${drop.size}px`,
            opacity: drop.opacity,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        >
          💧
        </div>
      ))}
    </div>
  );
};

export default WaterDrops;
