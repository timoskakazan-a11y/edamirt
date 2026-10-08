'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/course', label: 'Курс' },
  { href: '/exam', label: 'Об экзамене' },
  { href: '/tests', label: 'Тесты' },
  { href: '/vocabulary', label: 'Словарь' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/progress', label: 'Мой прогресс' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme'));
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  function toggleTheme() {
    const isDark =
      theme === 'dark' || (theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('btl-theme', next);
    } catch (e) {}
    setTheme(next);
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Bridge to Ling, на главную">
          <span className="logo-mark">BTL</span>
          <span>Bridge to Ling</span>
        </Link>
        <button className="icon-btn menu-btn" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(!open)}>
          ☰
        </button>
        <nav className={`nav${open ? ' open' : ''}`} aria-label="Основная навигация">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname?.startsWith(l.href) ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
          <button className="icon-btn" onClick={toggleTheme} aria-label="Сменить тему" title="Сменить тему">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
