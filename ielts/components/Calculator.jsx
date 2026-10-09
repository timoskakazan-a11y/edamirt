'use client';

import { useState } from 'react';
import { overallBand, formatBand, bandLabel, rawToBand } from '../lib/band';

const BANDS = [];
for (let b = 9; b >= 0; b -= 0.5) BANDS.push(b);
const MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'];

export default function Calculator() {
  const [scores, setScores] = useState({ Listening: 6.5, Reading: 6.5, Writing: 6, Speaking: 6 });
  const [raw, setRaw] = useState({ listening: 30, reading: 30 });
  const overall = overallBand(MODULES.map((m) => scores[m]));
  const avg = MODULES.reduce((s, m) => s + scores[m], 0) / 4;

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Общий балл</h2>
        {MODULES.map((m) => (
          <div key={m} className="result-row">
            <label htmlFor={`cal-${m}`}>{m}</label>
            <select
              id={`cal-${m}`}
              className="input"
              style={{ width: 110 }}
              value={scores[m]}
              onChange={(e) => setScores({ ...scores, [m]: Number(e.target.value) })}
            >
              {BANDS.map((b) => <option key={b} value={b}>{formatBand(b)}</option>)}
            </select>
          </div>
        ))}
        <div className="score-box" style={{ paddingBottom: 0 }}>
          <div className="muted small">Среднее: {avg.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}</div>
          <div className="score-big">Overall {formatBand(overall)}</div>
          <div>{bandLabel(overall)}</div>
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Перевод сырых баллов</h2>
        <p className="muted small">Сколько правильных ответов из 40 вы набрали в Listening и Academic Reading?</p>
        {[
          ['listening', 'Listening'],
          ['reading', 'Reading (Academic)'],
        ].map(([k, label]) => (
          <div key={k} className="result-row">
            <label htmlFor={`raw-${k}`}>{label}</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                id={`raw-${k}`}
                type="number"
                min="0"
                max="40"
                className="input"
                style={{ width: 80 }}
                value={raw[k]}
                onChange={(e) => setRaw({ ...raw, [k]: Math.max(0, Math.min(40, Number(e.target.value) || 0)) })}
              />
              <b style={{ minWidth: 70 }}>Band {formatBand(rawToBand(raw[k], 40, k))}</b>
            </div>
          </div>
        ))}
        <p className="muted small" style={{ marginTop: 12, marginBottom: 0 }}>
          Таблицы перевода ориентировочные: на реальном экзамене они немного меняются от теста к тесту.
        </p>
      </section>
    </div>
  );
}
