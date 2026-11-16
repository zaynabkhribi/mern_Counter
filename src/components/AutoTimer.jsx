import React, { useState, useEffect } from 'react';

export default function AutoTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId = null;

    if (isRunning) {
      // 1. Démarrage du timer
      intervalId = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // 2. Fonction de nettoyage :
    // appelée quand isRunning change ou au démontage du composant
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  return (
    <div className="timer-box">
      <span>
        Chronomètre automatique : <strong>{seconds}s</strong>
      </span>

      <button
        className="btn"
        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? 'Pause' : 'Reprendre'}
      </button>
    </div>
  );
}
