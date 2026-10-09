import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sections, getSection } from '../../../content/sections';
import { lessons } from '../../../content/lessons';
import { tests } from '../../../content/tests';

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.id }));
}

export function generateMetadata({ params }) {
  const s = getSection(params.section);
  return s ? { title: `IELTS ${s.title}: формат и стратегии` } : {};
}

export default function SectionPage({ params }) {
  const s = getSection(params.section);
  if (!s) notFound();
  const relatedLessons = lessons.filter((l) => l.section === s.id);
  const relatedTests = tests.filter((t) => t.section === s.id);

  return (
    <div className="container narrow" style={{ maxWidth: 860 }}>
      <div className="page-head">
        <div className="crumbs"><Link href="/exam">Об экзамене</Link> / {s.title}</div>
        <div className={`section-icon tag-${s.id}`}>{s.icon}</div>
        <h1>IELTS {s.title}</h1>
        <p className="muted">{s.summary}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge">⏱ {s.time}</span>
        </div>
      </div>

      <div className="prose">
        <h2>Структура</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <tbody>
              {s.structure.map(([k, v]) => (
                <tr key={k}><th style={{ width: 160 }}>{k}</th><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Типы заданий</h2>
        <ul>{s.questionTypes.map((q) => <li key={q}>{q}</li>)}</ul>

        <h2>Как оценивается</h2>
        <p>{s.scoring}</p>

        <h2>Главные советы</h2>
        {s.keyTips.map((t) => (
          <div key={t} className="callout tip">{t}</div>
        ))}
      </div>

      {relatedLessons.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2>Уроки по {s.title}</h2>
          <div className="grid grid-2">
            {relatedLessons.map((l) => (
              <Link key={l.slug} href={`/course/${l.slug}`} className="card">
                <h3>{l.title}</h3>
                <p className="muted small" style={{ margin: 0 }}>{l.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedTests.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2>Потренироваться</h2>
          <div className="grid grid-2">
            {relatedTests.map((t) => (
              <Link key={t.slug} href={`/tests/${t.slug}`} className="card">
                <h3>{t.title}</h3>
                <p className="muted small" style={{ margin: 0 }}>{t.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
