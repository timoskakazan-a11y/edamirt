// Перевод сырых баллов в Band Score.
// Шкалы ориентировочные и основаны на опубликованных таблицах для 40 вопросов.
const LISTENING = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [1, 2],
];
const READING_ACADEMIC = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [1, 2],
];

export function rawToBand(correct, total, section) {
  if (!total) return 0;
  const scaled = Math.round((correct / total) * 40);
  const table = section === 'listening' ? LISTENING : READING_ACADEMIC;
  for (const [min, band] of table) if (scaled >= min) return band;
  return 0;
}

// Общий балл: среднее четырёх модулей, округлённое до ближайших 0.5
// (x.25 округляется вверх до x.5, x.75 вверх до следующего целого).
export function overallBand(scores) {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const whole = Math.floor(avg);
  const frac = avg - whole;
  if (frac < 0.25) return whole;
  if (frac < 0.75) return whole + 0.5;
  return whole + 1;
}

export function formatBand(b) {
  return Number.isInteger(b) ? `${b}.0` : String(b);
}

export function bandLabel(b) {
  if (b >= 8.5) return 'Expert user';
  if (b >= 7.5) return 'Very good user';
  if (b >= 6.5) return 'Competent user (сильный)';
  if (b >= 5.5) return 'Competent user';
  if (b >= 4.5) return 'Modest user';
  if (b >= 3.5) return 'Limited user';
  return 'Extremely limited user';
}

export function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrect(question, value) {
  if (question.type === 'gap') {
    const accepted = Array.isArray(question.answer) ? question.answer : [question.answer];
    return accepted.some((a) => normalize(a) === normalize(value));
  }
  return value === question.answer;
}
