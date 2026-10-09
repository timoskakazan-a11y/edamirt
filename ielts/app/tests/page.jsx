import Link from 'next/link';
import { sections } from '../../content/sections';
import { tests, questionCount } from '../../content/tests';
import { TestStatus } from '../../components/Status';

export const metadata = { title: 'Тренировочные тесты IELTS' };

export default function TestsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs"><Link href="/">Главная</Link> / Тесты</div>
        <h1>Тренировочные тесты</h1>
        <p className="muted" style={{ maxWidth: 680 }}>
          Listening и Reading проверяются автоматически и переводятся в Band Score. В Writing есть таймер, счётчик слов,
          чек-лист и образец ответа. В Speaking таймеры для каждой части и примеры ответов.
        </p>
      </div>
      <div className="grid" style={{ gap: 32 }}>
        {sections.map((s) => {
          const list = tests.filter((t) => t.section === s.id);
          return (
            <section key={s.id}>
              <h2>{s.icon} {s.title}</h2>
              <div className="grid grid-2">
                {list.map((t) => {
                  const n = questionCount(t);
                  return (
                    <Link key={t.slug} href={`/tests/${t.slug}`} className="card">
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                        <span className={`badge tag-${t.section}`}>{s.title}</span>
                        <span className="badge">{t.minutes} мин</span>
                        {n && <span className="badge">{n} вопросов</span>}
                        <span className="badge">{t.level}</span>
                        <TestStatus slug={t.slug} />
                      </div>
                      <h3>{t.title}</h3>
                      <p className="muted small" style={{ margin: 0 }}>{t.description}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
