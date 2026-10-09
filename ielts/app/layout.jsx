import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: {
    default: 'Bridge to Ling (BTL): подготовка к IELTS',
    template: '%s · Bridge to Ling',
  },
  description:
    'Bridge to Ling (BTL): онлайн-школа подготовки к IELTS. Уроки по всем четырём частям экзамена, тренировочные тесты с автопроверкой, словарь и грамматика.',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f7fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1016' },
  ],
};

// Применяем сохранённую тему до отрисовки, чтобы не было мигания.
const themeScript = `try{var t=localStorage.getItem('btl-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
