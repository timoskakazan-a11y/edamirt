import './globals.css';

export const metadata = {
  title: 'Bridge to Ling (BTL)',
  description: 'Bridge to Ling (BTL): совместная подготовка к IELTS и повышение уровня английского.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
