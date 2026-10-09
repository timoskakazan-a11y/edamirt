import Link from 'next/link';
import { sections, bandDescriptors } from '../../content/sections';

export const metadata = { title: 'Об экзамене IELTS' };

export default function ExamPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs"><Link href="/">Главная</Link> / Об экзамене</div>
        <h1>Всё об экзамене IELTS</h1>
        <p className="muted" style={{ maxWidth: 680 }}>
          Четыре модуля, общее время около 2 часов 45 минут. Выберите модуль, чтобы узнать его структуру, типы вопросов,
          оценивание и главные советы.
        </p>
      </div>

      <div className="grid grid-4">
        {sections.map((s) => (
          <Link key={s.id} href={`/exam/${s.id}`} className="card">
            <div className={`section-icon tag-${s.id}`}>{s.icon}</div>
            <h3 style={{ marginBottom: 2 }}>{s.title}</h3>
            <div className="muted small" style={{ marginBottom: 10 }}>{s.ru}</div>
            <p className="small" style={{ margin: 0 }}>{s.summary}</p>
          </Link>
        ))}
      </div>

      <section className="section">
        <h2>Шкала Band Score</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Band</th><th>Уровень</th><th>Что это значит</th></tr>
            </thead>
            <tbody>
              {bandDescriptors.map(([b, n, d]) => (
                <tr key={b}><td><b>{b}</b></td><td>{n}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          Ориентировочное соответствие CEFR: 4.0–5.0 ≈ B1, 5.5–6.5 ≈ B2, 7.0–8.0 ≈ C1, 8.5–9.0 ≈ C2.
        </p>
      </section>
    </div>
  );
}
