import RichText from './RichText';

export default function LessonBlocks({ blocks }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h':
            return <h2 key={i} id={`s-${i}`}>{b.text}</h2>;
          case 'p':
            return <p key={i}><RichText text={b.text} /></p>;
          case 'list':
            return (
              <ul key={i}>
                {b.items.map((it, j) => <li key={j}><RichText text={it} /></li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i}>
                {b.items.map((it, j) => <li key={j}><RichText text={it} /></li>)}
              </ol>
            );
          case 'tip':
          case 'warn':
          case 'note':
            return (
              <div key={i} className={`callout ${b.t}`}>
                {b.title && <b>{b.t === 'warn' ? '⚠️ ' : '💡 '}{b.title}</b>}
                <RichText text={b.text} />
              </div>
            );
          case 'example':
            return (
              <div key={i} className="example">
                <div className="en pre"><RichText text={b.en} /></div>
                {b.ru && <div className="muted small" style={{ marginTop: 6 }}><RichText text={b.ru} /></div>}
              </div>
            );
          case 'table':
            return (
              <div key={i} className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>{r.map((c, k) => <td key={k}><RichText text={c} /></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
