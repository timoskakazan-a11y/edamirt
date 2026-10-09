import Link from 'next/link';
import HeroPanel from '../components/HeroPanel';
import { sections } from '../content/sections';
import { lessons } from '../content/lessons';
import { tests } from '../content/tests';
import { vocabulary } from '../content/vocabulary';

const faq = [
  ['Сколько нужно готовиться?', 'При занятиях около часа в день рост на 0.5–1 балла занимает около двух месяцев. Начните с диагностических тестов, чтобы увидеть стартовую точку.'],
  ['Подходит ли курс для General Training?', 'Да. Listening и Speaking одинаковые для обоих форматов, а в разделе Writing есть отдельный урок и тест на письмо для General Training.'],
  ['Нужна ли регистрация?', 'Нет. Прогресс сохраняется в вашем браузере автоматически. Личные кабинеты появятся позже.'],
  ['Как работает аудирование без аудиофайлов?', 'Записи озвучивает синтезатор речи вашего браузера с британским акцентом, если он доступен. Лучше всего это работает в Chrome, Safari и Edge.'],
];

export default function HomePage() {
  const wordCount = vocabulary.reduce((n, t) => n + t.words.length, 0);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge tag-start" style={{ marginBottom: 16 }}>Онлайн-школа подготовки к IELTS</span>
            <h1>
              Ваш мост к <span>IELTS 7.0+</span>
            </h1>
            <p className="lead">
              Понятные уроки по всем четырём модулям, тренировочные тесты с автопроверкой и подсчётом Band Score,
              словарь по темам и личный прогресс. Всё в одном месте и бесплатно.
            </p>
            <div className="btn-row">
              <Link className="btn" href="/course">Начать курс</Link>
              <Link className="btn secondary" href="/tests">Проверить уровень</Link>
            </div>
            <div className="stats">
              <div className="stat"><b>{lessons.length}</b><span>уроков</span></div>
              <div className="stat"><b>{tests.length}</b><span>тестов</span></div>
              <div className="stat"><b>{wordCount}</b><span>слов по темам</span></div>
              <div className="stat"><b>4</b><span>модуля IELTS</span></div>
            </div>
          </div>
          <HeroPanel />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Четыре модуля экзамена</h2>
          <p className="muted">Разберитесь в формате каждой части и получите стратегии от первого до последнего вопроса.</p>
          <div className="grid grid-4">
            {sections.map((s) => (
              <Link key={s.id} href={`/exam/${s.id}`} className="card">
                <div className={`section-icon tag-${s.id}`}>{s.icon}</div>
                <h3 style={{ marginBottom: 2 }}>{s.title}</h3>
                <div className="muted small" style={{ marginBottom: 10 }}>{s.ru} · {s.shortTime}</div>
                <p className="small" style={{ margin: 0 }}>{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Как проходит обучение</h2>
          <div className="steps">
            <div className="card step">
              <h3>Диагностика</h3>
              <p className="muted small" style={{ margin: 0 }}>Пройдите тесты по Listening и Reading и узнайте текущий Band Score.</p>
            </div>
            <div className="card step">
              <h3>Уроки</h3>
              <p className="muted small" style={{ margin: 0 }}>Короткие уроки по 10–20 минут со стратегиями, примерами и мини-тестом в конце.</p>
            </div>
            <div className="card step">
              <h3>Практика</h3>
              <p className="muted small" style={{ margin: 0 }}>Тесты на время, эссе с чек-листом и образцом, Speaking с таймерами как на экзамене.</p>
            </div>
            <div className="card step">
              <h3>Прогресс</h3>
              <p className="muted small" style={{ margin: 0 }}>Следите за пройденными уроками, лучшими результатами и выученными словами.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h2>Популярные уроки</h2>
              <p className="muted" style={{ margin: 0 }}>С них стоит начать, если до экзамена мало времени.</p>
            </div>
            <Link href="/course" className="btn secondary small">Все уроки</Link>
          </div>
          <div className="grid grid-popular" style={{ marginTop: 20 }}>
            {['reading-tfng', 'writing-task2-structure', 'listening-distractors', 'speaking-part2', 'writing-task1-academic', 'grammar-articles'].map((slug) => {
              const l = lessons.find((x) => x.slug === slug);
              return (
                <Link key={slug} href={`/course/${slug}`} className="card">
                  <span className={`badge tag-${l.section}`} style={{ marginBottom: 10 }}>{l.section === 'grammar' ? 'Грамматика' : l.section[0].toUpperCase() + l.section.slice(1)}</span>
                  <h3 style={{ marginTop: 10 }}>{l.title}</h3>
                  <p className="muted small" style={{ margin: 0 }}>{l.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2>Частые вопросы</h2>
          {faq.map(([q, a]) => (
            <details key={q} className="card" style={{ marginBottom: 10, padding: '16px 20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{q}</summary>
              <p className="muted" style={{ margin: '10px 0 0' }}>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
