'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Question from './Question';
import ListeningPlayer from './ListeningPlayer';
import { isCorrect, rawToBand, formatBand, bandLabel } from '../lib/band';
import { useCountdown, fmt } from '../lib/useTimer';
import { useProgress } from '../lib/progress';

function Groups({ groups, offset, answers, setAnswer, checked }) {
  let n = offset;
  return groups.map((g, gi) => (
    <div key={gi} style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 4 }}>{g.title}</h3>
      <p className="muted small" style={{ marginBottom: 6 }}>{g.instructions}</p>
      {g.list && (
        <div className="list-box">
          {g.list.map((l) => <div key={l}>{l}</div>)}
        </div>
      )}
      {g.questions.map((q) => {
        n += 1;
        const id = n;
        return (
          <Question
            key={id}
            q={q}
            num={id}
            name={`q-${id}`}
            value={answers[id]}
            checked={checked}
            onChange={(v) => setAnswer(id, v)}
          />
        );
      })}
    </div>
  ));
}

export default function ObjectiveTest({ test }) {
  const [started, setStarted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [practice, setPractice] = useState(false);
  const { progress, saveTest } = useProgress();
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const checkedRef = useRef(false);
  const timer = useCountdown(test.minutes * 60, { onEnd: () => submit() });

  // Плоский список вопросов с их сквозными номерами.
  const flat = useMemo(() => {
    const list = [];
    const groups = test.kind === 'reading' ? test.groups : test.parts.flatMap((p) => p.groups);
    groups.forEach((g) => g.questions.forEach((q) => list.push(q)));
    return list;
  }, [test]);

  const total = flat.length;
  const answered = Object.values(answers).filter((v) => v !== undefined && v !== '').length;
  const correct = flat.filter((q, i) => isCorrect(q, answers[i + 1])).length;
  const band = rawToBand(correct, total, test.section);
  const prev = progress?.tests?.[test.slug];

  function setAnswer(id, v) {
    setAnswers((a) => ({ ...a, [id]: v }));
  }

  function submit() {
    if (checkedRef.current) return;
    checkedRef.current = true;
    timer.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setChecked(true);
    const a = answersRef.current;
    const c = flat.filter((q, i) => isCorrect(q, a[i + 1])).length;
    saveTest(test.slug, { correct: c, total, band: rawToBand(c, total, test.section) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    checkedRef.current = false;
    setAnswers({});
    setChecked(false);
    timer.reset();
    timer.start();
  }

  if (!started) {
    return (
      <div className="card narrow" style={{ margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>Перед началом</h2>
        <ul>
          <li>Вопросов: <b>{total}</b>. Рекомендуемое время: <b>{test.minutes} минут</b>.</li>
          {test.kind === 'listening' && (
            <>
              <li>Запись озвучивается голосом браузера. Включите звук и прочитайте вопросы до начала каждой части.</li>
              <li>Как на экзамене, каждая запись звучит один раз. Для тренировки можно включить повтор.</li>
            </>
          )}
          {test.kind === 'reading' && <li>Текст слева, вопросы справа. На телефоне текст идёт первым.</li>}
          <li>Когда время выйдет, ответы проверятся автоматически.</li>
        </ul>
        {test.kind === 'listening' && (
          <div className="checklist" style={{ marginBottom: 12 }}>
            <label>
              <input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} />
              <span>Тренировочный режим: разрешить повторное прослушивание и показывать скрипт</span>
            </label>
          </div>
        )}
        {prev && (
          <p className="muted small">
            Ваш лучший результат: Band {formatBand(prev.best)} (попыток: {prev.attempts}).
          </p>
        )}
        <button
          className="btn"
          onClick={() => {
            setStarted(true);
            timer.start();
          }}
        >
          Начать тест
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="toolbar">
        <span className={`timer${timer.left < 120 && !checked ? ' low' : ''}`}>⏱ {fmt(timer.left)}</span>
        <span className="muted small">
          Отвечено {answered} из {total}
        </span>
        {!checked ? (
          <button className="btn small" onClick={submit}>
            Завершить и проверить
          </button>
        ) : (
          <button className="btn small secondary" onClick={restart}>
            Пройти заново
          </button>
        )}
      </div>

      {checked && (
        <div className="card score-box" style={{ marginBottom: 24 }}>
          <div className="muted">Ваш результат</div>
          <div className="score-big">Band {formatBand(band)}</div>
          <div>
            Правильных ответов: <b>{correct}</b> из {total} · {bandLabel(band)}
          </div>
          <p className="muted small" style={{ marginTop: 10, marginBottom: 0 }}>
            Балл пересчитан на шкалу из 40 вопросов и ориентировочный. Разберите ошибки ниже: правильные ответы подсвечены зелёным.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
            <Link className="btn secondary" href="/tests">Все тесты</Link>
            <Link className="btn secondary" href="/progress">Мой прогресс</Link>
          </div>
        </div>
      )}

      {test.kind === 'reading' && (
        <div className="test-layout">
          <article className="card passage">
            <h2 style={{ marginTop: 0 }}>{test.passage.title}</h2>
            {test.passage.paragraphs.map((p) => (
              <p key={p.label}>
                <span className="para-label">{p.label}</span>
                {p.text}
              </p>
            ))}
          </article>
          <div className="card">
            <Groups groups={test.groups} offset={0} answers={answers} setAnswer={setAnswer} checked={checked} />
          </div>
        </div>
      )}

      {test.kind === 'listening' &&
        (() => {
          let offset = 0;
          return test.parts.map((part, pi) => {
            const start = offset;
            offset += part.groups.reduce((n, g) => n + g.questions.length, 0);
            return (
              <section key={pi} className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ marginTop: 0 }}>{part.title}</h2>
                <p className="muted">{part.intro}</p>
                {!checked && <ListeningPlayer script={part.script} allowReplay={practice} />}
                <div style={{ marginTop: 16 }}>
                  <Groups groups={part.groups} offset={start} answers={answers} setAnswer={setAnswer} checked={checked} />
                </div>
                {(checked || practice) && (
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Скрипт записи</summary>
                    <div style={{ marginTop: 10 }}>
                      {part.script.map((l, i) => (
                        <div key={i} className="speaker-line">
                          <b>{l.s === 'A' ? 'Speaker 1:' : 'Speaker 2:'}</b>
                          {l.text}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </section>
            );
          });
        })()}

      {!checked && (
        <div className="center" style={{ marginTop: 16 }}>
          <button className="btn" onClick={submit}>
            Завершить и проверить
          </button>
        </div>
      )}
    </div>
  );
}
