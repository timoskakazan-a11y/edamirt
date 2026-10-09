import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <b style={{ color: 'var(--fg)' }}>Bridge to Ling (BTL)</b>
          <div>Онлайн-подготовка к IELTS и прокачка английского.</div>
          <div className="small" style={{ marginTop: 8 }}>
            IELTS является зарегистрированной торговой маркой British Council, IDP и Cambridge English. Сайт не связан с
            ними; все задания составлены командой BTL.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/course">Курс</Link>
          <Link href="/tests">Тесты</Link>
          <Link href="/vocabulary">Словарь</Link>
          <Link href="/exam">Об экзамене</Link>
        </div>
      </div>
    </footer>
  );
}
