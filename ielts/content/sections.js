// Обзор частей экзамена IELTS. Порядок совпадает с порядком сдачи.
export const sections = [
  {
    id: 'listening',
    shortTime: 'около 40 минут',
    title: 'Listening',
    ru: 'Аудирование',
    icon: '🎧',
    time: '30 минут + 10 минут на перенос ответов (на бумаге) или 2 минуты проверки (на компьютере)',
    questions: 40,
    parts: 4,
    summary: 'Четыре записи, каждая звучит один раз. Сложность растёт от бытового диалога к академической лекции.',
    structure: [
      ['Part 1', 'Бытовой диалог двух людей: бронирование, запись на курс, аренда жилья. Чаще всего заполнение формы.'],
      ['Part 2', 'Монолог на бытовую тему: экскурсия, объявление, описание места. Часто карта или план.'],
      ['Part 3', 'Разговор 2–4 человек в учебном контексте: студенты обсуждают проект с преподавателем.'],
      ['Part 4', 'Академическая лекция одного спикера без пауз. Самая сложная часть, обычно заполнение конспекта.'],
    ],
    questionTypes: [
      'Multiple choice (выбор ответа)',
      'Form / note / table completion (заполнение формы, конспекта, таблицы)',
      'Map / plan / diagram labelling (подписи на карте или схеме)',
      'Matching (сопоставление)',
      'Sentence completion (дополнение предложений)',
      'Short answer questions (короткие ответы)',
    ],
    scoring:
      'Каждый правильный ответ даёт 1 балл из 40, затем сумма переводится в Band Score по таблице. 30 из 40 примерно соответствуют 7.0.',
    keyTips: [
      'Используйте паузы перед каждой частью, чтобы прочитать вопросы и подчеркнуть ключевые слова.',
      'Предугадывайте тип ответа: число, имя, существительное, прилагательное.',
      'Ошибки в написании стоят балла. Учите алфавит, числа, даты и типичные слова (accommodation, Wednesday).',
      'Ловушки: спикер часто называет один вариант, а потом исправляет себя. Слушайте до конца фразы.',
    ],
  },
  {
    id: 'reading',
    shortTime: '60 минут',
    title: 'Reading',
    ru: 'Чтение',
    icon: '📖',
    time: '60 минут, отдельного времени на перенос ответов нет',
    questions: 40,
    parts: 3,
    summary:
      'Три длинных текста общим объёмом около 2 750 слов. В Academic это статьи из журналов и книг, в General Training тексты из повседневной и рабочей жизни.',
    structure: [
      ['Passage 1', 'Самый простой текст, около 13 вопросов. Цель: 15–17 минут.'],
      ['Passage 2', 'Средний по сложности текст, около 13 вопросов. Цель: 20 минут.'],
      ['Passage 3', 'Самый сложный, часто с аргументацией автора, около 14 вопросов. Цель: 20–23 минуты.'],
    ],
    questionTypes: [
      'True / False / Not Given и Yes / No / Not Given',
      'Matching headings (заголовки к абзацам)',
      'Matching information / features / sentence endings',
      'Multiple choice',
      'Sentence / summary / note / table completion',
      'Diagram label completion',
      'Short answer questions',
    ],
    scoring: 'Как и в Listening, 40 вопросов, 1 балл за каждый. Для Academic 30 из 40 примерно равны 7.0.',
    keyTips: [
      'Не читайте текст целиком перед вопросами. Сначала просмотрите заголовок и первые строки абзацев (skimming).',
      'Ищите в тексте синонимы слов из вопроса, а не точные совпадения (scanning + paraphrase).',
      'Ответы на большинство типов вопросов идут в порядке текста. Исключение: matching headings и matching information.',
      'Не застревайте: если вопрос не даётся больше 90 секунд, отметьте его и идите дальше.',
    ],
  },
  {
    id: 'writing',
    shortTime: '60 минут',
    title: 'Writing',
    ru: 'Письмо',
    icon: '✍️',
    time: '60 минут на две задачи',
    questions: 2,
    parts: 2,
    summary:
      'Task 1 (минимум 150 слов) и Task 2 (минимум 250 слов). Task 2 весит вдвое больше, поэтому на неё стоит отводить 40 минут.',
    structure: [
      ['Task 1 Academic', 'Описание графика, таблицы, диаграммы, процесса или карты. 20 минут, от 150 слов.'],
      ['Task 1 General', 'Письмо: официальное, полуофициальное или личное. 20 минут, от 150 слов.'],
      ['Task 2', 'Эссе с аргументацией по общей теме. 40 минут, от 250 слов.'],
    ],
    questionTypes: [
      'Opinion (agree or disagree)',
      'Discussion (discuss both views and give your opinion)',
      'Advantages and disadvantages',
      'Problem and solution / cause and solution',
      'Two-part question (direct questions)',
    ],
    scoring:
      'Оценка по четырём критериям, каждый по 25%: Task Achievement / Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy.',
    keyTips: [
      'Тратьте 3–5 минут на план: позиция, две основные идеи, примеры.',
      'Каждый абзац начинайте с ясного topic sentence.',
      'Меньше 150 / 250 слов означает штраф за Task Achievement.',
      'Не учите эссе наизусть. Экзаменаторы распознают заготовки и снижают балл.',
    ],
  },
  {
    id: 'speaking',
    shortTime: '11–14 минут',
    title: 'Speaking',
    ru: 'Говорение',
    icon: '🗣️',
    time: '11–14 минут, живой разговор с экзаменатором',
    questions: 3,
    parts: 3,
    summary: 'Собеседование из трёх частей: от вопросов о вас до абстрактной дискуссии.',
    structure: [
      ['Part 1', '4–5 минут. Вопросы о вас: работа, учёба, дом, хобби, повседневные темы.'],
      ['Part 2', 'Карточка с темой, 1 минута на подготовку и 1–2 минуты монолога.'],
      ['Part 3', '4–5 минут. Обсуждение абстрактных вопросов, связанных с темой Part 2.'],
    ],
    questionTypes: ['Personal questions', 'Long turn (cue card)', 'Discussion questions'],
    scoring:
      'Четыре критерия: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation.',
    keyTips: [
      'В Part 1 отвечайте в 2–3 предложения: ответ, причина, пример.',
      'В Part 2 говорите все две минуты. Минута подготовки уходит на ключевые слова, а не на полные предложения.',
      'В Part 3 обобщайте: сравнивайте прошлое и настоящее, разные группы людей, плюсы и минусы.',
      'Если не поняли вопрос, переспросите: «Could you rephrase the question, please?» Это не снижает балл.',
    ],
  },
];

export function getSection(id) {
  return sections.find((s) => s.id === id);
}

export const sectionMeta = {
  start: { title: 'Старт', icon: '🚀' },
  listening: { title: 'Listening', icon: '🎧' },
  reading: { title: 'Reading', icon: '📖' },
  writing: { title: 'Writing', icon: '✍️' },
  speaking: { title: 'Speaking', icon: '🗣️' },
  grammar: { title: 'Грамматика', icon: '🧩' },
  vocabulary: { title: 'Лексика', icon: '💬' },
};

export const bandDescriptors = [
  ['9', 'Expert user', 'Полное владение языком: точно, уместно, бегло.'],
  ['8', 'Very good user', 'Свободное владение с редкими неточностями в незнакомых ситуациях.'],
  ['7', 'Good user', 'Уверенное владение, сложная речь, отдельные ошибки. Минимум для многих топ-вузов.'],
  ['6', 'Competent user', 'Эффективное владение, но с ошибками и непониманием. Порог для многих программ бакалавриата.'],
  ['5', 'Modest user', 'Частичное владение, понимание общего смысла в большинстве ситуаций.'],
  ['4', 'Limited user', 'Базовое владение только в знакомых ситуациях.'],
];
