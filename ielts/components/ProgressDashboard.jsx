'use client';

import Link from 'next/link';
import { useProgress, resetProgress } from '../lib/progress';
import { lessons, courseModules, lessonsForModule } from '../content/lessons';
import { tests } from '../content/tests';
import { vocabulary } from '../content/vocabulary';
import { formatBand } from '../lib/band';

export default function ProgressDashboard() {
  const { progress } = useProgress();
  if (!progress) return <div className="card muted">Загружаем прогресс…</div>;

  const doneLessons = lessons.filter((l) => progress.lessons[l.slug]?.done);
  const nextLesson = lessons.find((l) => !progress.lessons[l.slug]?.done);
  const totalWords = vocabulary.reduce((n, t) => n + t.words.length, 0);
  const knownWords = Object.keys(progress.words || {}).length;
  const testRows = tests.filter((t) => progress.tests[t.slug]);

  const bestOf = (section) => {
    const vals = tests
      .filter((t) => t.section === section && progress.tests[t.slug]?.best != null)
      .map((t) => progress.tests[t.slug].best);
    return vals.length ? Math.max(...vals) : null;
  };
  const L = bestOf('listening');
  const R = bestOf('reading');
  const pct = Math.round((doneLessons.length / lessons.length) * 100);

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="grid grid-4">
        <div className="card">
          <div className="muted small">Уроки</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{doneLessons.length}/{lessons.length}</div>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="card">
          <div className="muted small">Тесты выполнено</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{testRows.length}/{tests.length}</div>
        </div>
        <div className="card">
          <div className="muted small">Лучший Listening / Reading</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {L != null ? formatBand(L) : '—'} / {R != null ? formatBand(R) : '—'}
          </div>
        </div>
        <div className="card">
          <div className="muted small">Слов выучено</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{knownWords}/{totalWords}</div>
        </div>
      </div>

      {nextLesson && (
        <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="muted small">Следующий урок</div>
            <h3 style={{ margin: 0 }}>{nextLesson.title}</h3>
          </div>
          <Link className="btn" href={`/course/${nextLesson.slug}`}>Продолжить →</Link>
        </div>
      )}

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Модули курса</h2>
        {courseModules.map((m) => {
          const items = lessonsForModule(m);
          const d = items.filter((l) => progress.lessons[l.slug]?.done).length;
          return (
            <div key={m.id} className="result-row">
              <Link href={`/course#${m.id}`} style={{ minWidth: 170 }}>{m.title}</Link>
              <div className="bar"><i style={{ width: `${(d / items.length) * 100}%` }} /></div>
              <span className="small muted" style={{ minWidth: 40, textAlign: 'right' }}>{d}/{items.length}</span>
            </div>
          );
        })}
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Результаты тестов</h2>
        {testRows.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            Пока нет результатов. <Link href="/tests">Пройдите первый тест</Link>, чтобы узнать свой стартовый уровень.
          </p>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th>Тест</th><th>Последний</th><th>Лучший</th><th>Попыток</th></tr>
              </thead>
              <tbody>
                {testRows.map((t) => {
                  const r = progress.tests[t.slug];
                  return (
                    <tr key={t.slug}>
                      <td><Link href={`/tests/${t.slug}`}>{t.title}</Link></td>
                      <td>
                        {r.band != null ? `Band ${formatBand(r.band)} (${r.correct}/${r.total})` : r.words ? `${r.words} слов` : '✓'}
                      </td>
                      <td>{r.best != null ? `Band ${formatBand(r.best)}` : '—'}</td>
                      <td>{r.attempts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div>
        <p className="muted small">
          Прогресс хранится только в этом браузере. Если очистить данные сайта или открыть его на другом устройстве,
          прогресс начнётся заново.
        </p>
        <button
          className="btn secondary small"
          onClick={() => {
            if (window.confirm('Удалить весь прогресс в этом браузере?')) resetProgress();
          }}
        >
          Сбросить прогресс
        </button>
      </div>
    </div>
  );
}
