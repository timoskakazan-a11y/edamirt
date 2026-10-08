import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lessons, getLesson, neighbours, courseModules, lessonsForModule } from '../../../content/lessons';
import { sectionMeta } from '../../../content/sections';
import LessonBlocks from '../../../components/LessonBlocks';
import LessonQuiz from '../../../components/LessonQuiz';
import { LessonStatus } from '../../../components/Status';

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }) {
  const lesson = getLesson(params.slug);
  return lesson ? { title: lesson.title, description: lesson.summary } : {};
}

export default function LessonPage({ params }) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();
  const { prev, next } = neighbours(lesson.slug);
  const mod = courseModules.find((m) => (m.match || [m.id]).includes(lesson.section));
  const siblings = lessonsForModule(mod);
  const meta = sectionMeta[lesson.section];

  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs">
          <Link href="/course">Курс</Link> / <Link href={`/course#${mod.id}`}>{mod.title}</Link>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span className={`badge tag-${lesson.section}`}>{meta.icon} {meta.title}</span>
          <span className="badge">{lesson.minutes} мин</span>
          <span className="badge">Уровень {lesson.level}</span>
          <LessonStatus slug={lesson.slug} />
        </div>
        <h1>{lesson.title}</h1>
        <p className="muted" style={{ maxWidth: 700 }}>{lesson.summary}</p>
      </div>

      <div className="lesson-layout">
        <article>
          <LessonBlocks blocks={lesson.blocks} />
          {lesson.quiz?.length > 0 && <LessonQuiz slug={lesson.slug} quiz={lesson.quiz} />}
          <div className="btn-row" style={{ justifyContent: 'space-between', marginTop: 32 }}>
            {prev ? <Link className="btn secondary" href={`/course/${prev.slug}`}>← {prev.title}</Link> : <span />}
            {next && <Link className="btn" href={`/course/${next.slug}`}>{next.title} →</Link>}
          </div>
        </article>
        <aside className="lesson-aside card" style={{ padding: 14 }}>
          <div className="muted small" style={{ padding: '4px 10px 8px', fontWeight: 600 }}>{mod.title}</div>
          <nav className="toc">
            {siblings.map((l) => (
              <Link key={l.slug} href={`/course/${l.slug}`} className={l.slug === lesson.slug ? 'current' : ''}>
                {l.title}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
