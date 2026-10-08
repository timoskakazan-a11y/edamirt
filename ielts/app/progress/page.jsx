import Link from 'next/link';
import ProgressDashboard from '../../components/ProgressDashboard';

export const metadata = { title: 'Мой прогресс' };

export default function ProgressPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs"><Link href="/">Главная</Link> / Мой прогресс</div>
        <h1>Мой прогресс</h1>
      </div>
      <ProgressDashboard />
    </div>
  );
}
