// Простая сгруппированная столбчатая диаграмма на SVG.
export default function BarChart({ chart }) {
  const W = 640;
  const H = 320;
  const pad = { l: 44, r: 12, t: 16, b: 48 };
  const max = Math.ceil(Math.max(...chart.categories.flatMap((c) => c.values)) / 5) * 5;
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const groupW = innerW / chart.categories.length;
  const barW = Math.min(36, (groupW * 0.7) / chart.series.length);
  const colors = ['var(--brand)', 'var(--accent)', 'var(--writing)'];
  const ticks = [];
  for (let v = 0; v <= max; v += 5) ticks.push(v);
  const y = (v) => pad.t + innerH - (v / max) * innerH;

  return (
    <figure style={{ margin: '0 0 16px' }}>
      <figcaption className="center" style={{ fontWeight: 600, marginBottom: 8 }}>{chart.title}</figcaption>
      <div className="chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={chart.title}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--border)" />
              <text x={pad.l - 8} y={y(t) + 4} fontSize="12" textAnchor="end" fill="var(--muted)">{t}</text>
            </g>
          ))}
          {chart.categories.map((c, ci) => {
            const gx = pad.l + ci * groupW + (groupW - barW * chart.series.length) / 2;
            return (
              <g key={c.label}>
                {c.values.map((v, si) => (
                  <g key={si}>
                    <rect x={gx + si * barW} y={y(v)} width={barW - 4} height={pad.t + innerH - y(v)} rx="3" fill={colors[si]} />
                    <text x={gx + si * barW + (barW - 4) / 2} y={y(v) - 5} fontSize="11" textAnchor="middle" fill="var(--fg)">{v}</text>
                  </g>
                ))}
                <text x={pad.l + ci * groupW + groupW / 2} y={H - pad.b + 20} fontSize="13" textAnchor="middle" fill="var(--fg)">{c.label}</text>
              </g>
            );
          })}
          <text x={14} y={pad.t + innerH / 2} fontSize="12" fill="var(--muted)" transform={`rotate(-90 14 ${pad.t + innerH / 2})`} textAnchor="middle">{chart.unit}</text>
        </svg>
      </div>
      <div className="chart-legend">
        {chart.series.map((s, i) => (
          <span key={s}><i style={{ background: colors[i] }} />{s}</span>
        ))}
      </div>
    </figure>
  );
}
