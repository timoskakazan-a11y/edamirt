'use client';

import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import { useCountdown, fmt } from '../lib/useTimer';
import { readProgress, updateProgress, useProgress } from '../lib/progress';

function countWords(text) {
  return (text.trim().match(/[A-Za-z0-9’'-]+/g) || []).length;
}

export default function WritingTest({ test }) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const [checks, setChecks] = useState({});
  const [showModel, setShowModel] = useState(false);
  const { saveTest } = useProgress();
  const timer = useCountdown(test.minutes * 60);

  // Черновик сохраняется в браузере.
  useEffect(() => {
    const saved = readProgress().writing?.[test.slug];
    if (saved?.text) setText(saved.text);
  }, [test.slug]);

  useEffect(() => {
    const id = setTimeout(() => {
      updateProgress((p) => ({ ...p, writing: { ...p.writing, [test.slug]: { text, at: Date.now() } } }));
    }, 600);
    return () => clearTimeout(id);
  }, [text, test.slug]);

  const words = countWords(text);
  const enough = words >= test.minWords;
  const checkedCount = Object.values(checks).filter(Boolean).length;

  function finish() {
    timer.pause();
    setDone(true);
    saveTest(test.slug, { band: null, words, done: true });
  }

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="toolbar">
        <span className={`timer${timer.left < 180 && timer.running ? ' low' : ''}`}>⏱ {fmt(timer.left)}</span>
        <div className="btn-row">
          {!timer.running ? (
            <button className="btn small secondary" onClick={timer.start}>
              {timer.left === test.minutes * 60 ? 'Запустить таймер' : 'Продолжить'}
            </button>
          ) : (
            <button className="btn small secondary" onClick={timer.pause}>Пауза</button>
          )}
          <button className="btn small" onClick={finish} disabled={words === 0}>Завершить</button>
        </div>
      </div>

      <div className="test-layout">
        <section className="card passage">
          <h2 style={{ marginTop: 0 }}>Задание</h2>
          {test.chart && <BarChart chart={test.chart} />}
          <div className="pre">{test.prompt}</div>
        </section>
        <section className="card">
          <label htmlFor="essay" className="sr-only">Ваш ответ</label>
          <textarea
            id="essay"
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Пишите ответ здесь. Черновик сохраняется автоматически в этом браузере."
            spellCheck={false}
          />
          <div className="small" style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span className={`word-count ${enough ? 'feedback ok' : 'muted'}`} style={{ marginTop: 0 }}>
              Слов: {words} / {test.minWords}
            </span>
            <span className="muted">Проверка орфографии отключена, как на экзамене</span>
          </div>
        </section>
      </div>

      {done && (
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Самопроверка</h2>
          <p className="muted">
            Отметьте честно, что выполнено. Каждый неотмеченный пункт это то, что стоит исправить в следующем тексте.
          </p>
          <div className="checklist">
            {test.checklist.map((c, i) => (
              <label key={i}>
                <input type="checkbox" checked={!!checks[i]} onChange={(e) => setChecks({ ...checks, [i]: e.target.checked })} />
                <span>{c}</span>
              </label>
            ))}
          </div>
          <p style={{ marginTop: 12 }}>
            <b>
              Выполнено {checkedCount} из {test.checklist.length}.
            </b>{' '}
            {checkedCount === test.checklist.length
              ? 'Отлично, структура и требования соблюдены. Сравните лексику и грамматику с образцом.'
              : 'Сравните свой текст с образцом и перепишите слабые абзацы.'}
          </p>
        </section>
      )}

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Образец ответа</h2>
          <button className="btn small secondary" onClick={() => setShowModel(!showModel)}>
            {showModel ? 'Скрыть' : done ? 'Показать' : 'Показать (лучше после своего ответа)'}
          </button>
        </div>
        {showModel && (
          <div style={{ marginTop: 16 }}>
            <div className="pre">{test.model}</div>
            <p className="muted small" style={{ marginTop: 12 }}>Слов в образце: {countWords(test.model)}</p>
          </div>
        )}
      </section>
    </div>
  );
}
