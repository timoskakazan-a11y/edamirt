'use client';

import { useState } from 'react';
import Question from './Question';
import { isCorrect } from '../lib/band';
import { useProgress } from '../lib/progress';

export default function LessonQuiz({ slug, quiz }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const { progress, markLesson } = useProgress();
  const done = progress?.lessons?.[slug]?.done;

  const correct = quiz.filter((q, i) => isCorrect(q, answers[i])).length;

  function check() {
    setChecked(true);
    if (correct === quiz.length) markLesson(slug, true);
  }

  return (
    <section className="card" style={{ marginTop: 32 }} id="quiz">
      <h2 style={{ marginTop: 0 }}>Проверьте себя</h2>
      <p className="muted small">Ответьте на все вопросы без ошибок, и урок отметится как пройденный.</p>
      {quiz.map((q, i) => (
        <Question
          key={i}
          q={q}
          num={i + 1}
          name={`lq-${i}`}
          value={answers[i]}
          checked={checked}
          onChange={(v) => setAnswers({ ...answers, [i]: v })}
        />
      ))}
      <div className="btn-row" style={{ marginTop: 16, alignItems: 'center' }}>
        {!checked ? (
          <button className="btn" onClick={check} disabled={Object.keys(answers).length === 0}>
            Проверить
          </button>
        ) : (
          <>
            <b>
              Результат: {correct} из {quiz.length}
            </b>
            <button
              className="btn secondary"
              onClick={() => {
                setAnswers({});
                setChecked(false);
              }}
            >
              Пройти заново
            </button>
          </>
        )}
        {done && <span className="badge done">✓ Урок пройден</span>}
        {!done && checked && correct < quiz.length && (
          <button className="btn ghost" onClick={() => markLesson(slug, true)}>
            Всё равно отметить пройденным
          </button>
        )}
      </div>
    </section>
  );
}
