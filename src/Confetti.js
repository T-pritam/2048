import React, { useEffect } from 'react';
import './Confetti.css';

const Confetti = ({ isActive }) => {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }));

  if (!isActive) return null;

  return (
    <div className="confetti-container">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            '--delay': `${piece.delay}s`,
            '--duration': `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
