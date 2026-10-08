import './globals.css';

export const metadata = {
  title: 'IELTS Prep',
  description: 'Совместная подготовка к IELTS и повышение уровня английского.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
