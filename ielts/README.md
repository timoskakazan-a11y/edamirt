# Bridge to Ling (BTL)

Онлайн-школа подготовки к IELTS. Next.js 14 (App Router), JavaScript, без базы данных: весь контент лежит в `content/`, прогресс ученика хранится в `localStorage` браузера.

## Запуск
```bash
cd ielts
npm install
npm run dev
```

## Что есть на сайте
- `/course`: курс из 6 модулей (старт, Listening, Reading, Writing, Speaking, грамматика и лексика), в каждом уроке мини-тест.
- `/exam`: формат каждого модуля, типы заданий, оценивание, шкала Band Score.
- `/tests`: тесты Listening и Reading с таймером, автопроверкой и переводом в Band Score; Writing с таймером, счётчиком слов, чек-листом и образцом; Speaking с таймерами для всех трёх частей.
- `/vocabulary`: карточки слов по 6 темам с озвучкой.
- `/calculator`: калькулятор общего балла и перевод сырых баллов.
- `/progress`: пройденные уроки, результаты тестов, выученные слова.

## Как добавлять контент
- Урок: добавьте объект в нужный файл `content/lessons/*.js`. Блоки: `p`, `h`, `list`, `ol`, `tip`, `warn`, `example`, `table`; `**жирный**` поддерживается.
- Тест: `content/tests/*.js`. Типы вопросов: `mc` (индекс ответа), `tfng`, `select`, `gap` (список допустимых ответов).
- Listening озвучивается Web Speech API браузера, аудиофайлы не нужны.

Все тексты и задания авторские; официальные материалы IELTS не используются.

## Безопасность
- Заголовки в `next.config.mjs`: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- `poweredByHeader` выключен.
- Секреты только в переменных окружения Vercel, в git их не кладём (см. `.env.example`).

## Деплой на Vercel
Root Directory проекта: `ielts`. Framework: Next.js.
