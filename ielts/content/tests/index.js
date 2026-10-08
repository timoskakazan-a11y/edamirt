import reading from './reading';
import listening from './listening';
import writing from './writing';
import speaking from './speaking';

export const tests = [...listening, ...reading, ...writing, ...speaking];

export function getTest(slug) {
  return tests.find((t) => t.slug === slug);
}

export function questionCount(test) {
  if (test.kind === 'reading') return test.groups.reduce((n, g) => n + g.questions.length, 0);
  if (test.kind === 'listening')
    return test.parts.reduce((n, p) => n + p.groups.reduce((m, g) => m + g.questions.length, 0), 0);
  return null;
}
