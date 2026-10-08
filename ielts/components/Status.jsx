'use client';

import { useProgress } from '../lib/progress';
import { formatBand } from '../lib/band';

export function LessonStatus({ slug }) {
  const { progress } = useProgress();
  if (!progress?.lessons?.[slug]?.done) return null;
  return <span className="badge done">✓ Пройден</span>;
}

export function TestStatus({ slug }) {
  const { progress } = useProgress();
  const t = progress?.tests?.[slug];
  if (!t) return null;
  return <span className="badge done">{t.best != null ? `Лучший: Band ${formatBand(t.best)}` : '✓ Выполнен'}</span>;
}

export function ModuleProgress({ slugs }) {
  const { progress } = useProgress();
  const done = slugs.filter((s) => progress?.lessons?.[s]?.done).length;
  const pct = Math.round((done / slugs.length) * 100);
  return (
    <div className="mini-row" style={{ marginTop: 12 }}>
      <div className="bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
      <span className="small muted">{done}/{slugs.length}</span>
    </div>
  );
}
