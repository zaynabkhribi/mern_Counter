import React, { useEffect, useState } from 'react';

const formatFrenchDate = (date = new Date()) =>
  date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function App() {
  const [count, setCount] = useState(-4);
  const [step, setStep] = useState(2);
  const [lastAction, setLastAction] = useState('Retrait de 2');
  const [clickCount, setClickCount] = useState(6);
  const [history, setHistory] = useState([-2, -2]);
  const [timerVisible, setTimerVisible] = useState(true);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(3);

  useEffect(() => {
    if (!timerVisible || !timerRunning) return undefined;

    const timer = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerVisible, timerRunning]);

  const changeCount = (delta) => {
    setCount((prev) => prev + delta);
    setClickCount((prev) => prev + 1);

    if (delta < 0) {
      setLastAction(`Retrait de ${Math.abs(delta)}`);
    } else if (delta > 0) {
      setLastAction(`Ajout de ${delta}`);
    } else {
      setLastAction('Réinitialisation');
    }

    setHistory((prev) => [...prev, delta].slice(-3));
  };

  const handleReset = () => {
    setCount(0);
    setLastAction('Réinitialisation');
    setClickCount((prev) => prev + 1);
    setHistory((prev) => [...prev, 0].slice(-3));
  };

  const formattedHistory = history.join(', ');

  return (
    <div className="dashboard-shell">
      <div className="app-card">
        <header className="app-header">
          <div className="header-copy">
            <h1>Mon Super Compteur React</h1>
            <p>Séance 5 : Maîtrise fondamentale des Hooks useState et useEffect</p>
          </div>

          <div className="date-row" aria-label="Date de séance">
            <span className="calendar-icon" aria-hidden="true">📅</span>
            <span>{formatFrenchDate()}</span>
          </div>
        </header>

        <main className="counter-panel">
          <div className="counter-box">
            <div className="counter-value" aria-live="polite">
              {count}
            </div>

            <div className="button-row">
              <button
                type="button"
                className="action-btn danger"
                onClick={() => changeCount(-step)}
              >
                -{step}
              </button>

              <button type="button" className="action-btn muted" onClick={handleReset}>
                Reset
              </button>

              <button
                type="button"
                className="action-btn primary"
                onClick={() => changeCount(step)}
              >
                +{step}
              </button>
            </div>

            <div className="step-row">
              <label htmlFor="step-selector">Pas d’incrémentation :</label>
              <select
                id="step-selector"
                value={step}
                onChange={(event) => setStep(Number(event.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
          </div>

          <div className="status-card">
            <div className="status-row">
              <span className="status-icon blue" aria-hidden="true">●</span>
              <span>Dernière action : {lastAction}</span>
            </div>

            <div className="status-row">
              <span className="status-icon orange" aria-hidden="true">●</span>
              <span>Nombre total de clics : {clickCount}</span>
            </div>

            <div className="status-row">
              <span className="status-icon green" aria-hidden="true">●</span>
              <span>Historique simple : {formattedHistory}</span>
            </div>
          </div>

          <div className="timer-section">
            <button
              type="button"
              className="timer-toggle"
              onClick={() => setTimerVisible((prev) => !prev)}
            >
              {timerVisible ? 'Masquer le Chronomètre' : 'Afficher le Chronomètre'}
            </button>

            {timerVisible && (
              <>
                <div className="timer-bar" aria-label="Barre du chronomètre">
                  <span
                    className="timer-progress"
                    style={{ width: `${(timerSeconds / 3) * 100}%` }}
                  />
                </div>

                <div className="timer-footer">
                  <span>Chronomètre automatique : {timerSeconds}s</span>
                  <button
                    type="button"
                    className="pause-btn"
                    onClick={() => setTimerRunning((prev) => !prev)}
                  >
                    {timerRunning ? 'Pause' : 'Reprendre'}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
