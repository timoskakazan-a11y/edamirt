import Link from 'next/link';
import Flashcards from '../../components/Flashcards';

export const metadata = { title: 'Словарь IELTS по темам' };

export default function VocabularyPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs"><Link href="/">Главная</Link> / Словарь</div>
        <h1>Словарь по темам IELTS</h1>
        <p className="muted" style={{ maxWidth: 680 }}>
          Лексика для эссе и Speaking Part 3 по шести самым частым темам. Переворачивайте карточки, слушайте
          произношение и отмечайте выученные слова. Клавиши: <span className="kbd">Пробел</span> переворот,{' '}
          <span className="kbd">←</span> <span className="kbd">→</span> навигация.
        </p>
      </div>
      <Flashcards />
    </div>
  );
}
