'use client';

import Link from 'next/link';
import { useProgress } from '../lib/progress';
import { lessons, courseModules, lessonsForModule } from '../content/lessons';

export default function HeroPanel() {
  const { progress } = useProgress();
  const started = progress && Object.keys(progress.lessons).length > 0;
  const next = progress ? lessons.find((l) => !progress.lessons[l.slug]?.done) : lessons[0];

  return (
    <div className="card hero-panel">
      <div className="muted small" style={{ fontWeight: 600 }}>{started ? 'Ваш прогресс' : 'Программа курса'}</div>
      {courseModules.map((m) => {
        const items = lessonsForModule(m);
        const d = progress ? items.filter((l) => progress.lessons[l.slug]?.done).length : 0;
        return (
          <div key={m.id} className="mini-row">
            <span style={{ minWidth: 150, fontSize: '0.92rem' }}>{m.title}</span>
            <div className="bar"><i style={{ width: `${(d / items.length) * 100}%` }} /></div>
            <span className="small muted">{d}/{items.length}</span>
          </div>
        );
      })}
      {next && (
        <Link href={`/course/${next.slug}`} className="btn" style={{ marginTop: 6 }}>
          {started ? 'Продолжить' : 'Первый урок'}: {next.title.length > 34 ? next.title.slice(0, 32) + '…' : next.title}
        </Link>
      )}
    </div>
  );
}
