'use client';

import { useState } from 'react';
import { useCountdown, fmt } from '../lib/useTimer';
import { useProgress } from '../lib/progress';

function say(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB';
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

function Sample({ sample }) {
  return (
    <details style={{ marginTop: 12 }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Пример ответа</summary>
      <div className="example" style={{ marginTop: 10 }}>
        {sample.q && <div className="muted small" style={{ marginBottom: 6 }}>{sample.q}</div>}
        <div className="en">{sample.a}</div>
      </div>
    </details>
  );
}

function QuestionList({ questions }) {
  const [i, setI] = useState(0);
  const timer = useCountdown(40);
  return (
    <div>
      <div className="card" style={{ background: 'var(--surface-2)', boxShadow: 'none' }}>
        <div className="muted small">Вопрос {i + 1} из {questions.length}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, margin: '6px 0 12px' }}>{questions[i]}</div>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <button className="btn small secondary" onClick={() => say(questions[i])}>🔊 Прослушать вопрос</button>
          <button
            className="btn small secondary"
            onClick={() => {
              timer.reset();
              timer.start();
            }}
          >
            ⏱ Отвечать ({fmt(timer.left)})
          </button>
          <button
            className="btn small"
            disabled={i === questions.length - 1}
            onClick={() => {
              setI(i + 1);
              timer.reset();
            }}
          >
            Следующий →
          </button>
        </div>
      </div>
    </div>
  );
}

function CueCard({ part2 }) {
  const prep = useCountdown(60, { onEnd: () => talk.start() });
  const talk = useCountdown(120);
  const phase = talk.running || talk.left < 120 ? 'talk' : prep.running || prep.left < 60 ? 'prep' : 'idle';

  return (
    <div>
      <div className="cue-card">
        <h3>{part2.card}</h3>
        <div className="muted small">You should say:</div>
        <ul style={{ margin: '6px 0' }}>
          {part2.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div>{part2.explain}</div>
      </div>
      <div className="btn-row" style={{ marginTop: 16, alignItems: 'center' }}>
        {phase === 'idle' && (
          <button className="btn" onClick={prep.start}>Начать минуту подготовки</button>
        )}
        {phase === 'prep' && (
          <>
            <span className="timer">Подготовка: {fmt(prep.left)}</span>
            <button
              className="btn small secondary"
              onClick={() => {
                prep.pause();
                talk.start();
              }}
            >
              Начать говорить раньше
            </button>
          </>
        )}
        {phase === 'talk' && (
          <>
            <span className={`timer${talk.left > 60 && !talk.running ? ' low' : ''}`}>Речь: {fmt(talk.left)}</span>
            {talk.left === 0 && <span className="feedback ok">Отлично, две минуты!</span>}
            {talk.running && (
              <button className="btn small secondary" onClick={talk.pause}>Стоп</button>
            )}
            {!talk.running && talk.left > 60 && talk.left > 0 && (
              <span className="small muted">Старайтесь говорить хотя бы 1,5–2 минуты.</span>
            )}
            <button
              className="btn small ghost"
              onClick={() => {
                prep.reset();
                talk.reset();
              }}
            >
              Заново
            </button>
          </>
        )}
      </div>
      <Sample sample={{ a: part2.sample }} />
    </div>
  );
}

export default function SpeakingTest({ test }) {
  const { progress, saveTest } = useProgress();
  const done = progress?.tests?.[test.slug];

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="callout tip">
        <b>Как заниматься</b>
        Отвечайте вслух. Лучше всего записывать себя на диктофон телефона и переслушивать: так слышно паузы, ошибки и
        повторы. Вопросы можно прослушать голосом «экзаменатора».
      </div>

      <section className="card">
        <span className="badge tag-speaking">Part 1 · 4–5 минут</span>
        <h2 style={{ marginTop: 10 }}>Topic: {test.part1.topic}</h2>
        <p className="muted small">Отвечайте в 2–3 предложения: ответ, причина, пример. На каждый вопрос около 20–30 секунд.</p>
        <QuestionList questions={test.part1.questions} />
        <Sample sample={test.part1.sample} />
      </section>

      <section className="card">
        <span className="badge tag-speaking">Part 2 · 3–4 минуты</span>
        <h2 style={{ marginTop: 10 }}>Карточка</h2>
        <p className="muted small">Минута на подготовку (пишите только ключевые слова), затем до двух минут речи.</p>
        <CueCard part2={test.part2} />
      </section>

      <section className="card">
        <span className="badge tag-speaking">Part 3 · 4–5 минут</span>
        <h2 style={{ marginTop: 10 }}>Discussion: {test.part3.topic}</h2>
        <p className="muted small">Развёрнутые ответы: позиция, объяснение, пример, другая точка зрения.</p>
        <QuestionList questions={test.part3.questions} />
        <Sample sample={test.part3.sample} />
      </section>

      <div className="center">
        {done ? (
          <span className="badge done">✓ Пробный Speaking пройден</span>
        ) : (
          <button className="btn" onClick={() => saveTest(test.slug, { band: null, done: true })}>
            Отметить как пройденный
          </button>
        )}
      </div>
    </div>
  );
}
