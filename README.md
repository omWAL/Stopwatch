# Chrono ⏱

A clean, modern stopwatch and timer application built with React. Features a circular progress ring, lap tracking, and a countdown timer with audio alert — all in a light, minimal UI.

## Features

### Stopwatch
- Start, pause, and resume with millisecond precision using `performance.now()`
- Lap recording with automatic best (green) and slowest (red) lap highlighting
- Animated arc ring that completes one revolution every 60 seconds
- Live centisecond display updating at ~30fps

### Timer
- Custom time input for hours, minutes, and seconds
- Countdown with a draining arc ring
- Visual danger mode in the final 10 seconds (ring and time turn red)
- Audio beep on completion via the Web Audio API (four short tones)
- "Time's up" indicator with pulsing animation

### General
- Live status pill showing Ready / Running / Paused / Done
- Responsive layout that works on mobile and desktop
- Light theme with soft shadows and a clean indigo accent

## Tech Stack

- **React** (hooks: `useState`, `useEffect`, `useRef`)
- **CSS** via a scoped `<style>` tag — no build step or CSS modules needed
- **Google Fonts** — Plus Jakarta Sans + Syne Mono
- **Web Audio API** — for the timer completion beep

## Getting Started

This project ships as a single `.jsx` file with no external dependencies beyond React itself.

### In Claude.ai

Open the artifact directly — it runs in the built-in React sandbox with no setup.

### In a local Vite project

```bash
npm create vite@latest chrono -- --template react
cd chrono
npm install
```

Replace `src/App.jsx` with `stopwatch-timer.jsx`, then:

```bash
npm run dev
```

### In any React app

Copy `stopwatch-timer.jsx` into your `src/` folder and import it:

```jsx
import App from './stopwatch-timer';
```

No additional packages are required.

## File Structure

```
stopwatch-timer.jsx
├── CSS styles (scoped via <style> tag)
├── Utility helpers
│   ├── formatTime(ms) → { main, ms }
│   └── pad(n)
├── Ring          — SVG arc progress component
├── PlayIcon / PauseIcon / ResetIcon / FlagIcon — inline SVG icons
├── Stopwatch     — stopwatch tab with lap tracking
├── Timer         — countdown timer tab
└── App           — tab switcher and root layout
```

## Key Implementation Notes

**Timing accuracy** — both the stopwatch and timer use `performance.now()` rather than `Date.now()` or a simple `setInterval` counter. This avoids drift from tab throttling and keeps the display accurate even after the page is backgrounded.

**Timer input** — the time fields are only shown while the timer is idle. Once started, the view switches to the ring display. Resetting returns to the input view.

**Lap logic** — each lap records both the cumulative elapsed time and the delta from the previous lap. Best and slowest laps are computed on every render from the full lap array, so they update correctly if laps are cleared.

**Audio** — the completion beep creates a short-lived `AudioContext` on demand (to satisfy browser autoplay policies) and schedules four oscillator tones with exponential gain decay.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). The Web Audio API beep requires a user gesture to have occurred on the page before the timer finishes — this is satisfied naturally since the user must click Start.