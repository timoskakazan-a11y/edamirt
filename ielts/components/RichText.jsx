// Мини-разметка: **жирный** текст. Переносы строк сохраняются через CSS.
export default function RichText({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}
