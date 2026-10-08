'use client';

import { useMemo, useState } from 'react';
import { vocabulary } from '../content/vocabulary';
import { useProgress, updateProgress } from '../lib/progress';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

export default function Flashcards() {
  const [topicId, setTopicId] = useState(vocabulary[0].id);
  const [mode, setMode] = useState('cards');
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hideKnown, setHideKnown] = useState(false);
  const { progress } = useProgress();

  const topic = vocabulary.find((t) => t.id === topicId);
  const known = progress?.words || {};
  const deck = useMemo(() => {
    const base = hideKnown ? topic.words.filter((w) => !known[w.en]) : topic.words;
    return seed ? shuffle(base) : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, seed, hideKnown]);
  const card = deck[Math.min(i, deck.length - 1)];
  const knownCount = topic.words.filter((w) => known[w.en]).length;

  function mark(word, value) {
    updateProgress((p) => {
      const words = { ...p.words };
      if (value) words[word] = true;
      else delete words[word];
      return { ...p, words };
    });
  }

  function go(d) {
    setFlipped(false);
    setI((x) => (deck.length ? (x + d + deck.length) % deck.length : 0));
  }

  return (
    <div>
      <div className="pill-tabs" role="tablist">
        {vocabulary.map((t) => (
          <button
            key={t.id}
            className={t.id === topicId ? 'active' : ''}
            onClick={() => {
              setTopicId(t.id);
              setI(0);
              setFlipped(false);
            }}
          >
            {t.title} · {t.ru}
          </button>
        ))}
      </div>

      <div className="btn-row" style={{ marginBottom: 16, alignItems: 'center' }}>
        <button className={`btn small ${mode === 'cards' ? '' : 'secondary'}`} onClick={() => setMode('cards')}>Карточки</button>
        <button className={`btn small ${mode === 'list' ? '' : 'secondary'}`} onClick={() => setMode('list')}>Список</button>
        <span className="muted small" style={{ marginLeft: 'auto' }}>Выучено {knownCount} из {topic.words.length}</span>
      </div>

      {mode === 'cards' && (
        <div className="narrow" style={{ margin: '0 auto' }}>
          {deck.length === 0 ? (
            <div className="card center">
              <h3>Все слова темы выучены 🎉</h3>
              <button className="btn secondary" onClick={() => setHideKnown(false)}>Показать все</button>
            </div>
          ) : (
            <>
              <div
                className="card flash"
                onClick={() => setFlipped(!flipped)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setFlipped(!flipped);
                  }
                  if (e.key === 'ArrowRight') go(1);
                  if (e.key === 'ArrowLeft') go(-1);
                }}
              >
                {!flipped ? (
                  <div>
                    <div className="word">{card.en}</div>
                    <div className="muted small" style={{ marginTop: 10 }}>Нажмите, чтобы увидеть перевод</div>
                  </div>
                ) : (
                  <div>
                    <div className="tr">{card.ru}</div>
                    <div className="en" style={{ marginTop: 12, fontStyle: 'italic' }}>{card.ex}</div>
                  </div>
                )}
              </div>
              <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
                <button className="btn secondary small" onClick={() => go(-1)}>←</button>
                <button className="btn secondary small" onClick={() => speak(card.en)}>🔊</button>
                {known[card.en] ? (
                  <button className="btn secondary small" onClick={() => mark(card.en, false)}>Вернуть в изучение</button>
                ) : (
                  <button className="btn small" onClick={() => { mark(card.en, true); go(1); }}>✓ Знаю</button>
                )}
                <button className="btn secondary small" onClick={() => go(1)}>→</button>
              </div>
              <div className="btn-row" style={{ justifyContent: 'center', marginTop: 12, alignItems: 'center' }}>
                <span className="muted small">{Math.min(i, deck.length - 1) + 1} / {deck.length}</span>
                <button className="btn ghost small" onClick={() => { setSeed(seed + 1); setI(0); setFlipped(false); }}>Перемешать</button>
                <label className="small muted" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="checkbox" checked={hideKnown} onChange={(e) => { setHideKnown(e.target.checked); setI(0); }} />
                  Скрыть выученные
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {mode === 'list' && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Слово</th><th>Перевод</th><th>Пример</th><th /></tr>
            </thead>
            <tbody>
              {topic.words.map((w) => (
                <tr key={w.en}>
                  <td><b>{w.en}</b></td>
                  <td>{w.ru}</td>
                  <td className="muted"><i>{w.ex}</i></td>
                  <td>{known[w.en] ? <span className="badge done">✓</span> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
