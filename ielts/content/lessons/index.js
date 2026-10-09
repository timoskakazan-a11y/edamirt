import start from './start';
import listening from './listening';
import reading from './reading';
import writing from './writing';
import speaking from './speaking';
import grammar from './grammar';

export const lessons = [...start, ...listening, ...reading, ...writing, ...speaking, ...grammar];

export const courseModules = [
  { id: 'start', title: 'Старт', description: 'Формат экзамена и план подготовки' },
  { id: 'listening', title: 'Listening', description: 'Формы, дистракторы, карты и лекции' },
  { id: 'reading', title: 'Reading', description: 'Скорость чтения и все типы вопросов' },
  { id: 'writing', title: 'Writing', description: 'Критерии, эссе, графики и письма' },
  { id: 'speaking', title: 'Speaking', description: 'Все три части и произношение' },
  { id: 'grammar', title: 'Грамматика и лексика', description: 'Конструкции и слова для 7.0', match: ['grammar', 'vocabulary'] },
];

export function lessonsForModule(mod) {
  const ids = mod.match || [mod.id];
  return lessons.filter((l) => ids.includes(l.section));
}

export function getLesson(slug) {
  return lessons.find((l) => l.slug === slug);
}

export function neighbours(slug) {
  const i = lessons.findIndex((l) => l.slug === slug);
  return { prev: lessons[i - 1] || null, next: lessons[i + 1] || null };
}
