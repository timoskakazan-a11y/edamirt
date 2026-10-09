import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tests, getTest } from '../../../content/tests';
import ObjectiveTest from '../../../components/ObjectiveTest';
import WritingTest from '../../../components/WritingTest';
import SpeakingTest from '../../../components/SpeakingTest';

export function generateStaticParams() {
  return tests.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const t = getTest(params.slug);
  return t ? { title: t.title, description: t.description } : {};
}

export default function TestPage({ params }) {
  const test = getTest(params.slug);
  if (!test) notFound();

  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs"><Link href="/tests">Тесты</Link> / {test.title}</div>
        <h1>{test.title}</h1>
        <p className="muted" style={{ maxWidth: 720 }}>{test.description}</p>
      </div>
      {(test.kind === 'reading' || test.kind === 'listening') && <ObjectiveTest test={test} />}
      {test.kind === 'writing' && <WritingTest test={test} />}
      {test.kind === 'speaking' && <SpeakingTest test={test} />}
    </div>
  );
}
