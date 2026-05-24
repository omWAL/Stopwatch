import { useState, useEffect, useRef, useCallback } from "react";

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Syne+Mono&display=swap');`;

const css = `
  ${fonts}
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f0f2f7;
    --surface: #ffffff;
    --surface2: #f5f6fa;
    --border: rgba(0,0,0,0.07);
    --border-hover: rgba(0,0,0,0.14);
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --accent: #4f6ef7;
    --accent-light: #eef1fe;
    --accent-glow: rgba(79,110,247,0.15);
    --accent-dim: rgba(79,110,247,0.07);
    --success: #10b981;
    --success-light: #d1fae5;
    --warning: #f59e0b;
    --danger: #ef4444;
    --danger-light: #fee2e2;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
    --mono: 'Syne Mono', monospace;
    --sans: 'Plus Jakarta Sans', sans-serif;
  }

  body { background: var(--bg); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: var(--sans);
  }

  .app-header {
    margin-bottom: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .app-logo {
    width: 36px;
    height: 36px;
    background: var(--accent);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    box-shadow: 0 2px 8px var(--accent-glow);
  }
  .app-title {
    font-family: var(--sans);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .app-sub {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 400;
  }

  .tab-bar {
    display: flex;
    gap: 4px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 1.75rem;
    box-shadow: var(--shadow-sm);
  }
  .tab {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    padding: 8px 28px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.18s;
    color: var(--text-secondary);
    background: transparent;
    letter-spacing: 0.01em;
  }
  .tab:hover { color: var(--text-primary); background: var(--surface2); }
  .tab.active {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 2px 8px var(--accent-glow);
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 2.5rem;
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    box-shadow: var(--shadow-md);
  }

  /* ── Ring display ── */
  .ring-wrap {
    position: relative;
    width: 220px;
    height: 220px;
    flex-shrink: 0;
  }
  .ring-bg {
    fill: var(--surface2);
  }
  .ring-svg { overflow: visible; }
  .ring-track {
    fill: none;
    stroke: #e5e7eb;
    stroke-width: 7;
  }
  .ring-progress {
    fill: none;
    stroke-width: 7;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.25s linear, stroke 0.4s;
    transform-origin: center;
    transform: rotate(-90deg);
  }
  .ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }
  .time-display {
    font-family: var(--mono);
    font-size: 38px;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    line-height: 1;
  }
  .time-display.running { color: var(--accent); }
  .time-display.danger { color: var(--danger); }
  .time-ms {
    font-family: var(--mono);
    font-size: 15px;
    font-weight: 400;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }
  .status-pill {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--surface2);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: all 0.3s;
  }
  .status-pill .dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--text-muted);
    transition: background 0.3s;
  }
  .status-pill.running { background: var(--accent-light); color: var(--accent); }
  .status-pill.running .dot { background: var(--accent); animation: pulse 1.2s infinite; }
  .status-pill.paused { background: #fef3c7; color: var(--warning); }
  .status-pill.paused .dot { background: var(--warning); }
  .status-pill.danger { background: var(--danger-light); color: var(--danger); }
  .status-pill.danger .dot { background: var(--danger); animation: pulse 0.7s infinite; }
  .status-pill.done { background: var(--success-light); color: var(--success); }
  .status-pill.done .dot { background: var(--success); }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── Timer input ── */
  .timer-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px 20px;
    width: 100%;
  }
  .time-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    flex: 1;
  }
  .time-field input {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 400;
    color: var(--text-primary);
    background: transparent;
    border: none;
    outline: none;
    width: 64px;
    text-align: center;
    padding: 4px 2px;
    border-radius: 8px;
    transition: background 0.15s;
  }
  .time-field input:focus {
    background: var(--accent-dim);
    color: var(--accent);
  }
  .time-field input::-webkit-inner-spin-button,
  .time-field input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .time-field label {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .time-sep {
    font-family: var(--mono);
    font-size: 22px;
    color: #d1d5db;
    margin-top: -10px;
    user-select: none;
  }

  /* ── Controls ── */
  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    justify-content: center;
  }
  .btn {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--surface);
    color: var(--text-secondary);
    padding: 10px 20px;
    height: 44px;
    letter-spacing: 0.01em;
    box-shadow: var(--shadow-sm);
  }
  .btn:hover { border-color: var(--border-hover); color: var(--text-primary); background: var(--surface2); }
  .btn:active { transform: scale(0.97); }
  .btn-primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    padding: 0;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    box-shadow: 0 4px 16px var(--accent-glow);
    font-size: 0;
  }
  .btn-primary:hover { background: #6279f8; border-color: #6279f8; box-shadow: 0 6px 20px var(--accent-glow); }
  .btn-icon {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }

  /* ── Laps ── */
  .laps-section {
    width: 100%;
    border-top: 1px solid var(--border);
    padding-top: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #e5e7eb transparent;
  }
  .lap-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 6px;
    border-bottom: 1px solid var(--border);
    animation: fadeSlide 0.22s ease;
  }
  .lap-row:last-child { border-bottom: none; }
  @keyframes fadeSlide { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .lap-num {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .lap-badge {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .lap-tag {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 20px;
    letter-spacing: 0.05em;
  }
  .lap-tag.best { background: var(--success-light); color: var(--success); }
  .lap-tag.worst { background: var(--danger-light); color: var(--danger); }
  .lap-time {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--text-secondary);
  }
  .lap-time.best { color: var(--success); }
  .lap-time.worst { color: var(--danger); }

  /* ── Completion flash ── */
  .done-flash {
    animation: doneFlash 0.5s ease;
  }
  @keyframes doneFlash {
    0%,100%{} 30%{box-shadow:0 0 0 4px rgba(16,185,129,0.15),var(--shadow-md);border-color:rgba(16,185,129,0.3);}
  }

  @media(max-width:500px) {
    .card { padding: 1.75rem 1.25rem; }
    .time-display { font-size: 32px; }
    .ring-wrap { width: 188px; height: 188px; }
  }
`;

const pad = (n) => String(Math.floor(n)).padStart(2, "0");

function formatTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  if (h > 0) return { main: `${pad(h)}:${pad(m)}:${pad(s)}`, ms: `.${pad(cs)}` };
  return { main: `${pad(m)}:${pad(s)}`, ms: `.${pad(cs)}` };
}

const CIRC = 2 * Math.PI * 88;

function Ring({ progress, running, danger }) {
  const stroke = danger ? "#ef4444" : running ? "#4f6ef7" : "#10b981";
  const dashoffset = CIRC * (1 - Math.min(1, Math.max(0, progress)));
  return (
    <svg className="ring-svg" viewBox="0 0 200 200" width="220" height="220">
      <circle cx="100" cy="100" r="84" fill="#f9fafb" />
      <circle className="ring-track" cx="100" cy="100" r="88" />
      <circle
        className="ring-progress"
        cx="100" cy="100" r="88"
        stroke={stroke}
        strokeDasharray={CIRC}
        strokeDashoffset={dashoffset}
        style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px" }}
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24">
      <polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <line x1="8" y1="5" x2="8" y2="19" /><line x1="16" y1="5" x2="16" y2="19" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24">
      <polyline points="1,4 1,10 7,10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    </svg>
  );
}
function FlagIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

/* ─────────────────────── STOPWATCH ─────────────────────── */
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(null);
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const id = setInterval(() => {
      setElapsed(baseRef.current + (performance.now() - startRef.current));
    }, 33);
    return () => clearInterval(id);
  }, [running]);

  const toggle = () => {
    if (running) { baseRef.current = elapsed; }
    setRunning((r) => !r);
  };
  const reset = () => {
    setRunning(false);
    setElapsed(0);
    baseRef.current = 0;
    setLaps([]);
  };
  const lap = () => {
    if (!running) return;
    setLaps((prev) => [{ t: elapsed, delta: elapsed - (prev[0]?.t ?? 0) }, ...prev]);
  };

  const { main, ms } = formatTime(elapsed);
  const lapTimes = laps.map((l) => l.delta);
  const best = laps.length > 1 ? Math.min(...lapTimes) : null;
  const worst = laps.length > 1 ? Math.max(...lapTimes) : null;

  const cycleProgress = elapsed > 0 ? ((elapsed / 1000) % 60) / 60 : 0;

  return (
    <div className="card">
      <div className="ring-wrap">
        <Ring progress={cycleProgress} running={running} danger={false} />
        <div className="ring-center">
          <span className={`time-display ${running ? "running" : ""}`}>{main}</span>
          <span className="time-ms">{ms}</span>
          <span className={`status-pill ${running ? "running" : elapsed > 0 ? "paused" : ""}`}>
            <span className="dot" /> {running ? "Running" : elapsed > 0 ? "Paused" : "Ready"}
          </span>
        </div>
      </div>

      <div className="controls">
        <button className="btn" onClick={reset} title="Reset">
          <ResetIcon /> Reset
        </button>
        <button className="btn btn-primary" onClick={toggle} title={running ? "Pause" : "Start"}>
          {running ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="btn" onClick={lap} disabled={!running} title="Lap"
          style={{ opacity: running ? 1 : 0.4 }}>
          <FlagIcon /> Lap
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-section">
          {laps.map((l, i) => {
            const isBest = laps.length > 1 && l.delta === best;
            const isWorst = laps.length > 1 && l.delta === worst;
            const { main: lm, ms: lms } = formatTime(l.delta);
            return (
              <div className="lap-row" key={i}>
                <span className="lap-num">Lap {laps.length - i}</span>
                <div className="lap-badge">
                  {isBest && <span className="lap-tag best">Best</span>}
                  {isWorst && <span className="lap-tag worst">Slow</span>}
                  <span className={`lap-time ${isBest ? "best" : isWorst ? "worst" : ""}`}>
                    {lm}{lms}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── TIMER ─────────────────────── */
function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const startRef = useRef(null);
  const baseRef = useRef(0);
  const beepRef = useRef(null);

  const totalMs = remaining !== null ? remaining : (hours * 3600 + minutes * 60 + seconds) * 1000;
  const initialMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
  const progress = initialMs > 0 ? totalMs / initialMs : 0;
  const isDanger = totalMs > 0 && totalMs <= 10000;
  const isEditing = remaining === null && !running;

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const r = baseRef.current - (now - startRef.current);
      if (r <= 0) {
        setRemaining(0);
        setRunning(false);
        setDone(true);
        clearInterval(id);
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          [0, 0.15, 0.3, 0.5].forEach((t) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = 880;
            o.type = "sine";
            g.gain.setValueAtTime(0.4, ctx.currentTime + t);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.12);
            o.start(ctx.currentTime + t);
            o.stop(ctx.currentTime + t + 0.12);
          });
        } catch (_) {}
        return;
      }
      setRemaining(r);
    }, 50);
    return () => clearInterval(id);
  }, [running]);

  const toggle = () => {
    if (done) return;
    const ms = remaining !== null ? remaining : initialMs;
    if (ms <= 0) return;
    if (running) {
      baseRef.current = remaining;
    } else {
      if (remaining === null) baseRef.current = initialMs;
      else baseRef.current = remaining;
      startRef.current = performance.now();
    }
    setRemaining(ms);
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(null);
    setDone(false);
    baseRef.current = 0;
  };

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const { main, ms } = formatTime(Math.max(0, totalMs));

  return (
    <div className={`card ${done ? "done-flash" : ""}`}>
      {isEditing ? (
        <div className="timer-input-row">
          <div className="time-field">
            <input type="number" value={hours} min={0} max={99}
              onChange={(e) => setHours(clamp(parseInt(e.target.value) || 0, 0, 99))} />
            <label>hours</label>
          </div>
          <span className="time-sep">:</span>
          <div className="time-field">
            <input type="number" value={pad(minutes)} min={0} max={59}
              onChange={(e) => setMinutes(clamp(parseInt(e.target.value) || 0, 0, 59))} />
            <label>min</label>
          </div>
          <span className="time-sep">:</span>
          <div className="time-field">
            <input type="number" value={pad(seconds)} min={0} max={59}
              onChange={(e) => setSeconds(clamp(parseInt(e.target.value) || 0, 0, 59))} />
            <label>sec</label>
          </div>
        </div>
      ) : (
        <div className="ring-wrap">
          <Ring progress={progress} running={running} danger={isDanger || done} />
          <div className="ring-center">
            <span className={`time-display ${running ? "running" : ""} ${isDanger || done ? "danger" : ""}`}>
              {done ? "00:00" : main}
            </span>
            <span className="time-ms">{done ? ".00" : ms}</span>
            <span className={`status-pill ${done ? "done" : running ? (isDanger ? "danger" : "running") : remaining !== null ? "paused" : ""}`}>
              <span className="dot" /> {done ? "Done!" : running ? (isDanger ? "Almost!" : "Running") : remaining !== null ? "Paused" : "Ready"}
            </span>
          </div>
        </div>
      )}

      <div className="controls">
        <button className="btn" onClick={reset} title="Reset">
          <ResetIcon /> Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={toggle}
          disabled={done || initialMs === 0}
          title={running ? "Pause" : "Start"}
          style={{ opacity: done || initialMs === 0 ? 0.4 : 1 }}>
          {running ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div style={{ width: 88 }} />
      </div>

      {done && (
        <p style={{
          fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--success)",
          animation: "pulse 1s infinite"
        }}>
          Time's up!
        </p>
      )}
    </div>
  );
}

/* ─────────────────────── APP ─────────────────────── */
export default function App() {
  const [tab, setTab] = useState("stopwatch");
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="app-header">
          <div className="app-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <p className="app-title">Chrono</p>
          <p className="app-sub">Stopwatch & Timer</p>
        </div>
        <div className="tab-bar">
          <button className={`tab ${tab === "stopwatch" ? "active" : ""}`} onClick={() => setTab("stopwatch")}>
            Stopwatch
          </button>
          <button className={`tab ${tab === "timer" ? "active" : ""}`} onClick={() => setTab("timer")}>
            Timer
          </button>
        </div>
        {tab === "stopwatch" ? <Stopwatch /> : <Timer />}
      </div>
    </>
  );
}