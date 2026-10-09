import Link from 'next/link';
import { courseModules, lessonsForModule } from '../../content/lessons';
import { sectionMeta } from '../../content/sections';
import { LessonStatus, ModuleProgress } from '../../components/Status';

export const metadata = { title: 'Курс подготовки к IELTS' };

export default function CoursePage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs"><Link href="/">Главная</Link> / Курс</div>
        <h1>Курс подготовки к IELTS</h1>
        <p className="muted" style={{ maxWidth: 640 }}>
          Шесть модулей от устройства экзамена до стратегий на 7.0+. Каждый урок заканчивается мини-тестом: ответьте без
          ошибок, и урок отметится пройденным.
        </p>
      </div>

      <div className="grid" style={{ gap: 32 }}>
        {courseModules.map((mod, mi) => {
          const items = lessonsForModule(mod);
          const meta = sectionMeta[mod.id];
          return (
            <section key={mod.id} id={mod.id}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                <div className={`section-icon tag-${mod.id}`} style={{ marginBottom: 0 }}>{meta.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="muted small">Модуль {mi + 1}</div>
                  <h2 style={{ margin: 0 }}>{mod.title}</h2>
                  <div className="muted small">{mod.description}</div>
                </div>
                <div style={{ width: 140 }}><ModuleProgress slugs={items.map((l) => l.slug)} /></div>
              </div>
              <div className="grid grid-2">
                {items.map((l, i) => (
                  <Link key={l.slug} href={`/course/${l.slug}`} className="card">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span className="badge">Урок {i + 1}</span>
                      <span className="badge">{l.minutes} мин</span>
                      <span className="badge">{l.level}</span>
                      <LessonStatus slug={l.slug} />
                    </div>
                    <h3>{l.title}</h3>
                    <p className="muted small" style={{ margin: 0 }}>{l.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
