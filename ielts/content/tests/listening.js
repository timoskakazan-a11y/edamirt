// Записи озвучиваются синтезатором речи браузера. Скрипты составлены командой BTL.
export default [
  {
    slug: 'listening-community-centre',
    section: 'listening',
    kind: 'listening',
    title: 'Listening Practice 1: Courses and a Nature Reserve',
    level: 'B1',
    minutes: 15,
    description: 'Part 1 (запись на кулинарный курс, заполнение формы) и Part 2 (экскурсия по заповеднику, multiple choice). 10 вопросов.',
    parts: [
      {
        title: 'Part 1',
        intro: 'You will hear a man phoning a community centre to ask about a cooking course.',
        script: [
          { s: 'A', text: 'Good morning, Riverside Community Centre. How can I help?' },
          { s: 'B', text: 'Hello. I saw your leaflet about cooking classes and I wanted to sign up for the Italian course for beginners.' },
          { s: 'A', text: 'Of course. We run that course twice a week, on Tuesdays and Thursdays. I\'m afraid the Tuesday group is already full, though.' },
          { s: 'B', text: 'Oh, that\'s a shame. Thursday is fine for me, then.' },
          { s: 'A', text: 'Great. The Thursday class starts at half past six in the evening and the course runs for eight weeks.' },
          { s: 'B', text: 'Eight weeks, OK. And how much does it cost?' },
          { s: 'A', text: 'The standard price is one hundred and fifty pounds, but if you live in the borough you get a discount, so it\'s one hundred and twenty.' },
          { s: 'B', text: 'I do live locally, so that\'s one hundred and twenty. Perfect.' },
          { s: 'A', text: 'Can I take your name, please?' },
          { s: 'B', text: 'Yes, it\'s Daniel Marsh. That\'s M, A, R, S, H.' },
          { s: 'A', text: 'Thank you. And your postcode?' },
          { s: 'B', text: 'It\'s C B 4, 7 R T.' },
          { s: 'A', text: 'C B 4, 7 R T. Lovely. All the ingredients are provided, and we have knives and boards, so the only thing you need to bring is an apron.' },
          { s: 'B', text: 'An apron. Great, thanks very much.' },
        ],
        groups: [
          {
            title: 'Questions 1–6',
            instructions: 'Complete the form. Write ONE WORD AND/OR A NUMBER for each answer.',
            questions: [
              { type: 'gap', q: 'Day of the class: ____', answer: ['Thursday', 'Thursdays'] },
              { type: 'gap', q: 'Length of course: ____ weeks', answer: ['8', 'eight'] },
              { type: 'gap', q: 'Price for local residents: £____', answer: ['120', '120.00'], explain: 'Стандартная цена 150, но для местных 120.' },
              { type: 'gap', q: 'Name: Daniel ____', answer: ['Marsh'] },
              { type: 'gap', q: 'Postcode: ____', answer: ['CB4 7RT', 'CB47RT'] },
              { type: 'gap', q: 'Students must bring an ____', answer: ['apron'] },
            ],
          },
        ],
      },
      {
        title: 'Part 2',
        intro: 'You will hear a guide talking to visitors at a nature reserve.',
        script: [
          { s: 'A', text: 'Good afternoon, everyone, and welcome to Hollow Marsh Nature Reserve. Before you set off, let me tell you a little about the reserve and give you some practical information.' },
          { s: 'A', text: 'The land was bought by a wildlife trust in 1985, but it took ten years to restore the wetlands, so the reserve only opened to the public in 1995.' },
          { s: 'A', text: 'Now, a few rules. Dogs are welcome as long as they\'re kept on a lead, and of course you\'re free to take as many photographs as you like. What we do ask is that you don\'t feed the birds. Bread in particular is very bad for them.' },
          { s: 'A', text: 'Many of you will be hoping to see our otters. A lot of visitors wait on the bridge, and occasionally they\'re lucky there, but in fact the wooden hide next to the reed beds is where you\'re most likely to spot them, especially early in the morning.' },
          { s: 'A', text: 'Finally, the café. During the summer it stays open until six, but now that we\'re in autumn it closes an hour earlier, at five o\'clock, so do make sure you get your tea before then.' },
        ],
        groups: [
          {
            title: 'Questions 7–10',
            instructions: 'Choose the correct letter, A, B or C.',
            questions: [
              { type: 'mc', q: 'The reserve opened to the public in', options: ['A. 1985', 'B. 1995', 'C. 2005'], answer: 1 },
              { type: 'mc', q: 'Visitors are asked not to', options: ['A. feed the birds', 'B. bring dogs', 'C. take photographs'], answer: 0 },
              { type: 'mc', q: 'The best place to see otters is', options: ['A. the bridge', 'B. the visitor centre', 'C. the wooden hide'], answer: 2 },
              { type: 'mc', q: 'At this time of year the café closes at', options: ['A. 4 pm', 'B. 5 pm', 'C. 6 pm'], answer: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'listening-heat-islands',
    section: 'listening',
    kind: 'listening',
    title: 'Listening Practice 2: Urban Heat Islands (lecture)',
    level: 'B2',
    minutes: 12,
    description: 'Part 4: академическая лекция о городских «островах тепла». Заполнение конспекта, 8 вопросов.',
    parts: [
      {
        title: 'Part 4',
        intro: 'You will hear part of a lecture about urban heat islands.',
        script: [
          { s: 'A', text: 'Today I\'d like to look at a phenomenon known as the urban heat island. Put simply, this is the tendency of cities to be noticeably warmer than the countryside around them. On a calm summer evening, the difference can be as much as seven degrees Celsius.' },
          { s: 'A', text: 'So what causes it? The main factor is the materials that cities are built from. Dark surfaces, such as asphalt on the roads and the roofs of buildings, absorb heat during the day and release it slowly at night.' },
          { s: 'A', text: 'A second factor is the lack of vegetation. In the countryside, plants release water through their leaves, and this evaporation has a cooling effect. In a city centre, there is simply far less of it.' },
          { s: 'A', text: 'Thirdly, human activity itself produces heat. Heat released by vehicles and by air conditioners adds to the problem, and ironically, the hotter it gets, the more air conditioning people use.' },
          { s: 'A', text: 'Moving on to the effects. The most obvious is higher energy use. Higher temperatures also make air quality worse. But what\'s crucial here is the risk to health, particularly for elderly people, who are more vulnerable during heatwaves.' },
          { s: 'A', text: 'Finally, what can be done? One relatively cheap solution is the so-called cool roof: roofs are painted white so that they reflect sunlight rather than absorb it. Planting street trees also helps, as their shade can lower surface temperatures by several degrees. And on a larger scale, urban planners can design streets to follow the prevailing wind direction, so that cooler air can flow through the city.' },
        ],
        groups: [
          {
            title: 'Questions 1–8',
            instructions: 'Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.',
            questions: [
              { type: 'gap', q: 'Cities can be up to ____ degrees warmer than the countryside.', answer: ['7', 'seven'] },
              { type: 'gap', q: 'Cause 1: dark surfaces such as asphalt and ____ absorb heat.', answer: ['roofs'] },
              { type: 'gap', q: 'Cause 2: lack of ____ means less cooling by evaporation.', answer: ['vegetation'] },
              { type: 'gap', q: 'Cause 3: heat from ____ and air conditioners.', answer: ['vehicles'] },
              { type: 'gap', q: 'Effects: higher energy use, worse air quality and risks to ____.', answer: ['health'] },
              { type: 'gap', q: 'Cool roofs are painted ____.', answer: ['white'] },
              { type: 'gap', q: 'Street trees can lower ____ temperatures.', answer: ['surface'] },
              { type: 'gap', q: 'Streets can follow the prevailing wind ____.', answer: ['direction'] },
            ],
          },
        ],
      },
    ],
  },
];
