import React, { useState, useEffect, useCallback } from 'react';

const MIN = -50;
const MAX = 50;

const readStoredValue = (key, fallback, parser) => {
  try {
    if (typeof window === 'undefined') return fallback;

    const rawValue = window.localStorage.getItem(key);
    if (rawValue === null) return fallback;

    const parsedValue = parser(rawValue);
    return parsedValue ?? fallback;
  } catch {
    return fallback;
  }
};

export default function Counter() {
  const [count, setCount] = useState(() =>
    readStoredValue('mon_compteur_valeur', 0, (value) => {
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    })
  );

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('Aucun clic pour le moment');
  const [totalClics, setTotalClics] = useState(0);
  const [historique, setHistorique] = useState(() =>
    readStoredValue('mon_compteur_historique', [], (value) => {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    })
  );

  useEffect(() => {
    document.title = `Compteur : ${count}`;
  }, [count]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mon_compteur_valeur', String(count));
    }
  }, [count]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'mon_compteur_historique',
        JSON.stringify(historique)
      );
    }
  }, [historique]);

  const handleIncrement = useCallback(() => {
    setCount((currentCount) => {
      const nextCount = currentCount + step;

      if (nextCount > MAX) {
        setMessage('Seuil maximal de 50 atteint !');
        return currentCount;
      }

      setMessage(`Ajout de ${step}`);
      setTotalClics((prev) => prev + 1);
      setHistorique((prev) => [...prev, `+${step}`]);

      return nextCount;
    });
  }, [step]);

  const handleDecrement = useCallback(() => {
    setCount((currentCount) => {
      const nextCount = currentCount - step;

      if (nextCount < MIN) {
        setMessage('Seuil minimal de -50 atteint !');
        return currentCount;
      }

      setMessage(`Retrait de ${step}`);
      setTotalClics((prev) => prev + 1);
      setHistorique((prev) => [...prev, `-${step}`]);

      return nextCount;
    });
  }, [step]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        handleIncrement();
      }

      if (event.key === 'ArrowDown') {
        handleDecrement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleIncrement, handleDecrement]);

  const handleReset = () => {
    setCount(0);
    setMessage('Remise à zéro');
    setTotalClics((prev) => prev + 1);
    setHistorique([]);
  };

  const getStyleClass = () => {
    if (count > 0) return 'counter-display positive';
    if (count < 0) return 'counter-display negative';

    return 'counter-display zero';
  };

  return (
    <div className="counter-card">
      <div className={getStyleClass()}>{count}</div>

      <div className="btn-group">
        <button
          className="btn btn-dec"
          onClick={handleDecrement}
          disabled={count - step < MIN}
        >
          -{step}
        </button>

        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>

        <button
          className="btn btn-inc"
          onClick={handleIncrement}
          disabled={count + step > MAX}
        >
          +{step}
        </button>
      </div>

      <div className="step-control">
        <label>Pas d'incrémentation :</label>

        <select
          value={step}
          onChange={(event) => setStep(Number.parseInt(event.target.value, 10))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="history-card">
        <p>
          <strong>Dernière action :</strong> {message}
        </p>

        <p>
          <strong>Total des clics :</strong> {totalClics}
        </p>

        {historique.length > 0 && (
          <p>
            <strong>Historique :</strong> {historique.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}
