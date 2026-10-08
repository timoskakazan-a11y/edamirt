const task2Checklist = [
  'Я ответил(а) на все части вопроса',
  'Моя позиция понятна во введении и в заключении',
  'В эссе 4–5 абзацев, в каждом одна главная идея',
  'Каждый абзац основной части начинается с topic sentence',
  'Каждая идея подкреплена объяснением и конкретным примером',
  'Связки разнообразные и не в каждом предложении',
  'Есть сложные предложения (although, which, if...)',
  'Я проверил(а) артикли, -s у глаголов и множественное число',
  'В тексте не меньше 250 слов',
];

const task1Checklist = [
  'Во введении перефразировано название графика',
  'Есть overview с двумя главными тенденциями без цифр',
  'Данные сгруппированы, а не перечислены подряд',
  'Есть сравнения (higher than, twice as, whereas)',
  'Использованы точные цифры и лексика трендов',
  'Нет собственного мнения и причин',
  'Правильные времена (здесь Past Simple)',
  'В тексте не меньше 150 слов',
];

export default [
  {
    slug: 'writing-task2-transport',
    section: 'writing',
    kind: 'writing',
    title: 'Writing Task 2: Free Public Transport',
    level: 'B2',
    minutes: 40,
    minWords: 250,
    description: 'Opinion essay. Таймер на 40 минут, счётчик слов, чек-лист самопроверки и образец ответа на 7.5+.',
    prompt:
      'Some people think that the best way to reduce traffic congestion in cities is to make public transport free of charge.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
    checklist: task2Checklist,
    model: `Traffic congestion has become one of the most pressing problems in modern cities, and some argue that abolishing fares on buses and trains would be the most effective remedy. While I accept that free public transport could encourage some drivers to leave their cars at home, I do not believe it is the best solution on its own.

Admittedly, removing fares would make public transport more attractive, particularly for lower-income commuters. For a family that spends a significant share of its budget on travel, free buses would represent a real saving, and some of these people might choose to give up their cars. Free travel would also speed up boarding, since passengers would no longer need to buy tickets, making services slightly faster and more reliable.

However, price is rarely the main reason people drive. Most commuters choose a car because it is quicker, more comfortable or more flexible than the alternatives. If buses are overcrowded, infrequent or do not reach the suburbs where people live, making them free will change very little. Moreover, eliminating fares would deprive transport operators of a major source of income, which could lead to cuts in services precisely when demand rises.

In my view, a more effective approach would combine better public transport with measures that discourage driving. Investing in frequent, reliable services and dedicated bus lanes would make public transport a genuine alternative, while congestion charges or higher parking fees would give drivers a clear incentive to switch. The revenue from such charges could even be used to keep fares low.

In conclusion, although free public transport might reduce traffic to a limited extent, I believe that improving the quality of services and making driving less convenient would be far more effective.`,
  },
  {
    slug: 'writing-task1-leisure',
    section: 'writing',
    kind: 'writing',
    title: 'Writing Task 1 Academic: Leisure Activities',
    level: 'B1–B2',
    minutes: 20,
    minWords: 150,
    description: 'Описание столбчатой диаграммы. Таймер на 20 минут, чек-лист и образец ответа.',
    prompt:
      'The chart below shows the average number of hours per week that young people aged 16–24 in one country spent on four leisure activities in 2005 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
    chart: {
      title: 'Hours per week spent on leisure activities (ages 16–24)',
      unit: 'hours',
      series: ['2005', '2020'],
      categories: [
        { label: 'Watching TV', values: [15, 8] },
        { label: 'Social media', values: [3, 14] },
        { label: 'Sport', values: [6, 5] },
        { label: 'Reading', values: [5, 3] },
      ],
    },
    checklist: task1Checklist,
    model: `The bar chart compares the average weekly time that people aged between 16 and 24 in a particular country devoted to four leisure activities in 2005 and 2020.

Overall, the most striking change was the dramatic rise in time spent on social media, which replaced television as the most popular pastime. By contrast, all the other activities declined, although the fall in sport was only marginal.

In 2005, young people watched television for 15 hours a week on average, far more than any other activity. Fifteen years later, this figure had almost halved, to 8 hours. Social media followed the opposite pattern: it occupied just 3 hours a week in 2005 but soared to 14 hours in 2020, more than four times the original level.

As for the remaining activities, time spent on sport remained relatively stable, dropping slightly from 6 to 5 hours. Reading, which accounted for 5 hours in 2005, fell to only 3 hours, making it the least popular of the four activities by the end of the period.`,
  },
  {
    slug: 'writing-letter-complaint',
    section: 'writing',
    kind: 'writing',
    title: 'Writing Task 1 General: Letter of Complaint',
    level: 'B1',
    minutes: 20,
    minWords: 150,
    description: 'Официальное письмо-жалоба для General Training. Таймер, счётчик слов и образец.',
    prompt:
      'You recently bought a piece of equipment for your kitchen, but it did not work. You phoned the shop, but no action was taken.\n\nWrite a letter to the shop manager. In your letter:\n– describe the problem with the equipment\n– explain what happened when you phoned the shop\n– say what you would like the manager to do\n\nWrite at least 150 words. You do NOT need to write any addresses.\n\nBegin your letter as follows: Dear Sir or Madam,',
    checklist: [
      'Тон формальный, без сокращений (I am, а не I\'m)',
      'Первый абзац сразу объясняет цель письма',
      'Раскрыт каждый из трёх пунктов задания',
      'Есть конкретные детали: дата, модель, номер заказа',
      'Ясно сказано, чего я хочу от менеджера',
      'Письмо закончено фразой Yours faithfully',
      'Не меньше 150 слов',
    ],
    model: `Dear Sir or Madam,

I am writing to complain about a coffee machine that I purchased from your store on 12 September and about the way my subsequent enquiry was handled.

When I unpacked the machine at home, I discovered that it would not heat water. I followed the instructions in the manual carefully and tried it on different sockets, but the indicator light remained red and the water stayed cold.

The following day I telephoned your customer service department. The assistant took my details and promised that someone would call me back within 48 hours to arrange a replacement. However, more than two weeks have passed and I have not heard anything, despite calling twice more.

I would therefore be grateful if you could arrange for the faulty machine to be collected and either replaced with a working model or refunded in full. I have kept my receipt, and the order number is 48215.

I look forward to hearing from you at your earliest convenience.

Yours faithfully,
Anna Petrova`,
  },
];
