// Тексты и задания составлены командой BTL специально для тренировки.
export default [
  {
    slug: 'reading-sleep-memory',
    section: 'reading',
    kind: 'reading',
    title: 'Reading Practice 1: Sleep and Memory',
    level: 'B2',
    minutes: 20,
    description: 'Научно-популярный текст о сне и памяти. Matching headings, True / False / Not Given и заполнение пропусков. 13 вопросов.',
    passage: {
      title: 'Why We Sleep on It',
      paragraphs: [
        { label: 'A', text: 'For centuries, people have advised one another to “sleep on” a difficult decision. Only in the past few decades, however, have scientists begun to understand why this advice might be sound. Research in laboratories around the world now suggests that sleep is not simply a period of rest for the brain, but an active state during which newly acquired information is sorted, strengthened and connected to existing knowledge.' },
        { label: 'B', text: 'Early studies of sleep and memory date back to 1924, when two American psychologists, John Jenkins and Karl Dallenbach, asked students to learn lists of nonsense syllables. Students who slept after learning remembered considerably more than those who stayed awake for the same period. At the time, the researchers assumed that sleep merely protected memories from interference: with no new experiences entering the mind, old ones were less likely to be disturbed. This passive explanation dominated the field for most of the twentieth century.' },
        { label: 'C', text: 'The picture began to change when scientists were able to record brain activity during the night. Sleep, they discovered, consists of repeating cycles of roughly 90 minutes, each containing lighter stages, deep “slow-wave” sleep and rapid eye movement (REM) sleep, the stage most associated with vivid dreaming. Different stages appear to serve different purposes. Slow-wave sleep, which dominates the first half of the night, seems particularly important for remembering facts and events, whereas REM sleep, more common towards morning, has been linked to emotional memory and to learning physical skills.' },
        { label: 'D', text: 'One of the most striking findings concerns a small structure called the hippocampus. During the day, the hippocampus acts as a temporary store for new experiences. In deep sleep, it appears to “replay” these experiences, sending them to the outer layer of the brain, the cortex, for long-term storage. Experiments with rats have shown that patterns of neural activity recorded while the animals ran through a maze were repeated, at a faster speed, while they slept afterwards. Similar replay has since been observed in humans using brain-imaging techniques.' },
        { label: 'E', text: 'Sleep may also help us to see connections that we missed while awake. In a well-known experiment conducted in Germany, participants were given a tedious number puzzle that contained a hidden shortcut. Those who slept for eight hours before returning to the task were more than twice as likely to discover the shortcut as those who had remained awake. The researchers concluded that sleep had not only preserved the memory of the task but restructured it, making insight possible.' },
        { label: 'F', text: 'These findings have clear practical implications, particularly for students. Staying up all night before an examination may allow a final review of material, but it deprives the brain of the very process that fixes that material in memory. Some researchers also recommend short daytime naps: even 20 minutes of light sleep has been shown to improve recall in some studies. Nevertheless, scientists caution that much remains unknown. It is still unclear, for example, exactly how the brain decides which memories to keep and which to discard, and whether the same mechanisms operate in children and older adults.' },
      ],
    },
    groups: [
      {
        title: 'Questions 1–5',
        instructions: 'The passage has six paragraphs, A–F. Choose the correct heading for paragraphs B–F from the list of headings below.',
        list: [
          'i. A practical lesson for learners',
          'ii. An old explanation for an early observation',
          'iii. How the brain transfers information during sleep',
          'iv. Different kinds of sleep with different roles',
          'v. Why dreams are quickly forgotten',
          'vi. Sleep and the discovery of hidden solutions',
          'vii. The high cost of sleep research',
        ],
        questions: [
          { type: 'select', q: 'Paragraph B', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'], answer: 'ii' },
          { type: 'select', q: 'Paragraph C', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'], answer: 'iv' },
          { type: 'select', q: 'Paragraph D', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'], answer: 'iii' },
          { type: 'select', q: 'Paragraph E', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'], answer: 'vi' },
          { type: 'select', q: 'Paragraph F', options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'], answer: 'i' },
        ],
      },
      {
        title: 'Questions 6–9',
        instructions: 'Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.',
        questions: [
          { type: 'tfng', q: 'Jenkins and Dallenbach’s students learned lists of real words.', answer: 'FALSE', explain: 'Paragraph B: “lists of nonsense syllables”.' },
          { type: 'tfng', q: 'The passive explanation of sleep was widely accepted for many decades.', answer: 'TRUE', explain: 'Paragraph B: “dominated the field for most of the twentieth century”.' },
          { type: 'tfng', q: 'REM sleep occurs more often in the early part of the night.', answer: 'FALSE', explain: 'Paragraph C: REM is “more common towards morning”.' },
          { type: 'tfng', q: 'The rats in the maze experiment were rewarded with food.', answer: 'NOT GIVEN', explain: 'О награде в тексте ничего не сказано.' },
        ],
      },
      {
        title: 'Questions 10–13',
        instructions: 'Complete the sentences. Choose ONE WORD OR A NUMBER from the passage for each answer.',
        questions: [
          { type: 'gap', q: 'A complete sleep cycle lasts about ____ minutes.', answer: ['90', 'ninety'], explain: 'Paragraph C.' },
          { type: 'gap', q: 'During the day, the ____ stores new experiences temporarily.', answer: ['hippocampus'], explain: 'Paragraph D.' },
          { type: 'gap', q: 'People who slept were more than ____ as likely to find the shortcut.', answer: ['twice'], explain: 'Paragraph E.' },
          { type: 'gap', q: 'Even ____ minutes of light sleep can improve recall.', answer: ['20', 'twenty'], explain: 'Paragraph F.' },
        ],
      },
    ],
  },
  {
    slug: 'reading-vertical-farming',
    section: 'reading',
    kind: 'reading',
    title: 'Reading Practice 2: Farming Upwards',
    level: 'B1–B2',
    minutes: 15,
    description: 'Текст о вертикальных фермах. Multiple choice, True / False / Not Given и summary с выбором слов. 10 вопросов.',
    passage: {
      title: 'Farming Upwards',
      paragraphs: [
        { label: 'A', text: 'By 2050, the world’s population is expected to approach ten billion, and around two-thirds of those people will live in cities. Feeding them will require either more farmland or new ways of growing food. Vertical farming, the practice of growing crops in stacked layers inside buildings, has been promoted as one possible answer.' },
        { label: 'B', text: 'The idea is not entirely new. In 1999, Dickson Despommier, a professor at Columbia University, challenged his students to design a farm inside a skyscraper that could feed 50,000 people. Although the students’ designs were never built, the concept attracted wide attention, and the first commercial vertical farms appeared about a decade later.' },
        { label: 'C', text: 'Supporters point to several advantages. Because conditions inside are fully controlled, crops can be grown all year round regardless of the weather, and pests are rare, so pesticides are seldom needed. Most vertical farms use hydroponic systems, in which plant roots sit in nutrient-rich water rather than soil. This water is recycled, and operators claim to use up to 95 per cent less of it than conventional farms. Moreover, as farms can be located close to consumers, transport distances, and the emissions that accompany them, are greatly reduced.' },
        { label: 'D', text: 'Critics, however, argue that these benefits come at a high price. Sunlight must be replaced by LED lamps, and electricity is by far the largest operating cost. When energy prices rose sharply in 2022, several well-funded companies in Europe and the United States went out of business. In addition, the range of crops that can be grown profitably is narrow: leafy greens and herbs, which grow quickly and are light, are well suited, but staple crops such as wheat and rice would be far too expensive to produce indoors.' },
        { label: 'E', text: 'The future of the industry may therefore depend on cheaper renewable energy. Some new farms are being built next to solar or wind installations, while others are experimenting with mixing natural and artificial light. Few experts believe vertical farms will replace traditional agriculture, but many expect them to become a valuable supplement, particularly in cities with limited land or harsh climates.' },
      ],
    },
    groups: [
      {
        title: 'Questions 1–3',
        instructions: 'Choose the correct letter, A, B, C or D.',
        questions: [
          { type: 'mc', q: 'What did Despommier ask his students to do?', options: ['A. build a farm on the roof of the university', 'B. design a farm in a tall building', 'C. study the quality of urban soil', 'D. open a commercial vertical farm'], answer: 1 },
          { type: 'mc', q: 'According to paragraph C, pesticides are rarely needed because', options: ['A. they are banned in cities', 'B. pests are uncommon in a controlled environment', 'C. hydroponic water kills insects', 'D. they are too expensive'], answer: 1 },
          { type: 'mc', q: 'What happened in 2022?', options: ['A. The first commercial vertical farm opened.', 'B. Electricity became cheaper.', 'C. Several vertical farming companies closed.', 'D. Wheat was grown indoors for the first time.'], answer: 2 },
        ],
      },
      {
        title: 'Questions 4–7',
        instructions: 'Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.',
        questions: [
          { type: 'tfng', q: 'The students’ designs were later constructed in New York.', answer: 'FALSE', explain: '“the students’ designs were never built”.' },
          { type: 'tfng', q: 'Vertical farms may use far less water than traditional farms.', answer: 'TRUE', explain: '“up to 95 per cent less”.' },
          { type: 'tfng', q: 'Most vertical farms are owned by national governments.', answer: 'NOT GIVEN' },
          { type: 'tfng', q: 'Wheat can be produced cheaply in vertical farms.', answer: 'FALSE', explain: 'Wheat “would be far too expensive to produce indoors”.' },
        ],
      },
      {
        title: 'Questions 8–10',
        instructions: 'Complete the summary using the words from the box.',
        list: ['cost', 'lamps', 'quickly', 'slowly', 'water', 'profit', 'soil'],
        questions: [
          { type: 'select', q: 'Electricity is the largest ____ for vertical farms…', options: ['cost', 'lamps', 'quickly', 'slowly', 'water', 'profit', 'soil'], answer: 'cost' },
          { type: 'select', q: '…because ____ are used instead of sunlight.', options: ['cost', 'lamps', 'quickly', 'slowly', 'water', 'profit', 'soil'], answer: 'lamps' },
          { type: 'select', q: 'Leafy greens are suitable because they grow ____ and are light.', options: ['cost', 'lamps', 'quickly', 'slowly', 'water', 'profit', 'soil'], answer: 'quickly' },
        ],
      },
    ],
  },
];
