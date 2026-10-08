'use client';

import { useCallback, useEffect, useState } from 'react';

// Прогресс хранится только в браузере ученика (localStorage).
const KEY = 'btl-progress-v1';
const EVENT = 'btl-progress-change';

const empty = { lessons: {}, tests: {}, words: {}, writing: {} };

export function readProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const data = JSON.parse(raw);
    return { ...empty, ...data };
  } catch (e) {
    return { ...empty };
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {}
  window.dispatchEvent(new Event(EVENT));
}

export function updateProgress(fn) {
  const next = fn(readProgress());
  write(next);
  return next;
}

export function resetProgress() {
  write({ ...empty });
}

export function useProgress() {
  const [progress, setProgress] = useState(null);
  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const markLesson = useCallback((slug, done = true) => {
    updateProgress((p) => {
      const lessons = { ...p.lessons };
      if (done) lessons[slug] = { done: true, at: Date.now() };
      else delete lessons[slug];
      return { ...p, lessons };
    });
  }, []);

  const saveTest = useCallback((slug, result) => {
    updateProgress((p) => {
      const prev = p.tests[slug];
      const attempts = (prev?.attempts || 0) + 1;
      const best = prev?.best == null || result.band > prev.best ? result.band : prev.best;
      return { ...p, tests: { ...p.tests, [slug]: { ...result, attempts, best, at: Date.now() } } };
    });
  }, []);

  return { progress, markLesson, saveTest };
}
