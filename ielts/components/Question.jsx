'use client';

import { isCorrect } from '../lib/band';

const TFNG = ['TRUE', 'FALSE', 'NOT GIVEN'];

function correctText(q) {
  if (q.type === 'mc') return q.options[q.answer];
  if (q.type === 'gap') return Array.isArray(q.answer) ? q.answer[0] : q.answer;
  return q.answer;
}

export default function Question({ q, num, value, onChange, checked, name }) {
  const ok = checked ? isCorrect(q, value) : null;
  const options = q.type === 'tfng' ? TFNG : q.options;

  return (
    <div className="q">
      <div className="q-text">
        <span className="q-num">{num}.</span>
        {q.type !== 'gap' && q.q}
      </div>

      {(q.type === 'mc' || q.type === 'tfng') && (
        <div className="options" role="radiogroup">
          {options.map((opt, i) => {
            const val = q.type === 'mc' ? i : opt;
            const selected = value === val;
            let cls = 'option';
            if (checked && val === q.answer) cls += ' correct';
            else if (checked && selected) cls += ' wrong';
            return (
              <label key={i} className={cls}>
                <input
                  type="radio"
                  name={name}
                  checked={selected}
                  disabled={checked}
                  onChange={() => onChange(val)}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'select' && (
        <div className="inline-q" style={{ marginTop: 8 }}>
          <select
            className={`input${checked ? (ok ? ' correct' : ' wrong') : ''}`}
            value={value ?? ''}
            disabled={checked}
            onChange={(e) => onChange(e.target.value || undefined)}
            aria-label={`Ответ на вопрос ${num}`}
          >
            <option value="">Выберите…</option>
            {q.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      {q.type === 'gap' && (
        <div style={{ marginTop: 6 }}>
          <div style={{ marginBottom: 8 }}>{q.q}</div>
          <input
            className={`input${checked ? (ok ? ' correct' : ' wrong') : ''}`}
            value={value ?? ''}
            disabled={checked}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ваш ответ"
            autoComplete="off"
            spellCheck={false}
            aria-label={`Ответ на вопрос ${num}`}
          />
        </div>
      )}

      {checked && (
        <div className={`feedback ${ok ? 'ok' : 'bad'}`}>
          {ok ? '✓ Верно' : `✗ Правильный ответ: ${correctText(q)}`}
          {q.explain && <div className="explain">{q.explain}</div>}
        </div>
      )}
    </div>
  );
}
