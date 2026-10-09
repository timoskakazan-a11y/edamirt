import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container center section">
      <h1>Страница не найдена</h1>
      <p className="muted">Возможно, урок переехал. Начните с каталога курса.</p>
      <Link className="btn" href="/course">К курсу</Link>
    </div>
  );
}
