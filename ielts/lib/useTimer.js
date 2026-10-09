'use client';

import { useEffect, useRef, useState } from 'react';

// Обратный отсчёт. Возвращает оставшиеся секунды и управление.
export function useCountdown(initialSeconds, { onEnd } = {}) {
  const [left, setLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          endRef.current?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return {
    left,
    running,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: (s = initialSeconds) => {
      setRunning(false);
      setLeft(s);
    },
  };
}

export function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
