'use client';

import { useEffect, useRef, useState } from 'react';

// Озвучка скрипта через Web Speech API браузера.
// Длинные реплики режем на предложения: некоторые браузеры обрывают длинные фразы.
function pickVoices() {
  const all = window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('en'));
  const gb = all.filter((v) => v.lang.toLowerCase().includes('gb'));
  const pool = gb.length >= 2 ? gb : all;
  return { A: pool[0] || null, B: pool[1] || pool[0] || null };
}

// Только один плеер может говорить одновременно.
let activeToken = 0;

export default function ListeningPlayer({ script, onFinished, allowReplay }) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState('idle'); // idle | playing | paused | done
  const [line, setLine] = useState(-1);
  const [rate, setRate] = useState(0.95);
  const cancelled = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) setSupported(false);
    else window.speechSynthesis.getVoices();
    return () => {
      cancelled.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  function play() {
    const synth = window.speechSynthesis;
    synth.cancel();
    cancelled.current = false;
    const token = ++activeToken;
    const voices = pickVoices();
    const queue = [];
    script.forEach((l, idx) => {
      const sentences = l.text.match(/[^.!?]+[.!?]*/g) || [l.text];
      sentences.forEach((s) => queue.push({ idx, speaker: l.s, text: s.trim() }));
    });
    setState('playing');
    let i = 0;
    const next = () => {
      if (cancelled.current) return;
      if (token !== activeToken) {
        setState('done');
        setLine(-1);
        return;
      }
      if (i >= queue.length) {
        setState('done');
        setLine(-1);
        onFinished?.();
        return;
      }
      const item = queue[i++];
      const u = new SpeechSynthesisUtterance(item.text);
      u.lang = 'en-GB';
      u.rate = rate;
      const v = voices[item.speaker] || voices.A;
      if (v) u.voice = v;
      if (item.speaker === 'B' && voices.A === voices.B) u.pitch = 0.75;
      u.onstart = () => setLine(item.idx);
      u.onend = () => setTimeout(next, 250);
      u.onerror = () => setTimeout(next, 50);
      synth.speak(u);
    };
    next();
  }

  function stop() {
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setState('done');
    setLine(-1);
    onFinished?.();
  }

  function pause() {
    window.speechSynthesis.pause();
    setState('paused');
  }
  function resume() {
    window.speechSynthesis.resume();
    setState('playing');
  }

  if (!supported) {
    return (
      <div className="callout warn">
        <b>Озвучка недоступна</b>
        Ваш браузер не поддерживает синтез речи. Прочитайте скрипт ниже как транскрипт или откройте сайт в Chrome, Safari или Edge.
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="btn-row" style={{ alignItems: 'center' }}>
        {state === 'idle' && (
          <button className="btn" onClick={play}>▶ Слушать запись</button>
        )}
        {state === 'playing' && (
          <>
            <button className="btn secondary" onClick={pause}>⏸ Пауза</button>
            <button className="btn ghost" onClick={stop}>Остановить</button>
          </>
        )}
        {state === 'paused' && (
          <button className="btn" onClick={resume}>▶ Продолжить</button>
        )}
        {state === 'done' && (
          allowReplay ? (
            <button className="btn secondary" onClick={play}>↻ Прослушать ещё раз</button>
          ) : (
            <span className="muted small">Запись прослушана. На экзамене она звучит только один раз.</span>
          )
        )}
        <label className="small muted" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          Скорость
          <select className="input" style={{ width: 'auto' }} value={rate} onChange={(e) => setRate(Number(e.target.value))} disabled={state === 'playing'}>
            <option value={0.8}>0.8×</option>
            <option value={0.95}>1×</option>
            <option value={1.1}>1.1×</option>
          </select>
        </label>
      </div>
      {state === 'playing' && line >= 0 && (
        <div className="small muted" style={{ marginTop: 10 }}>
          Говорит: {script[line].s === 'A' ? 'спикер 1' : 'спикер 2'} · реплика {line + 1} из {script.length}
        </div>
      )}
    </div>
  );
}
