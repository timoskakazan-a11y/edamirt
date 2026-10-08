# IELTS Prep — базовая структура сайта

Next.js (App Router), JavaScript. Папка `ielts/` в репозитории `edamirt`, которая не затрагивает существующее приложение в корне.

## Запуск
```bash
cd ielts
npm install
npm run dev
```

## Безопасность
- Заголовки в `next.config.mjs`: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- `poweredByHeader` выключен.
- Секреты только в переменных окружения Vercel, в git их не кладём (см. `.env.example`).

## Деплой на Vercel
Root Directory проекта: `ielts`. Framework: Next.js.
