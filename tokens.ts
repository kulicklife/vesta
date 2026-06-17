// Vesta — Design Tokens (Inner Tide) — TS mirror of tokens.css
// Use semantic aliases in screens; map to Candlelight now, add Daylight later.

export const color = {
  night: '#0A0B1F', indigo: '#1A1840', ink: '#26233A',
  gold1: '#F5D98B', gold2: '#CAA24A',
  aqua: '#7FB7C4', parchment: '#EFE4C8', dawnRose: '#F0A9A0',
  moon: '#ECE9F5', dim: '#A9A6C4',
} as const;

export const goldGradient = 'linear-gradient(135deg,#F5D98B,#CAA24A)';

export const font = {
  display: "'Spectral',Georgia,serif", // Vesta's voice / headlines
  ui: "'Inter',system-ui,sans-serif",  // UI / body
  meta: "'JetBrains Mono',monospace",  // eyebrows / labels (caps, tracked .2em)
} as const;

export const type = {
  displayXl: 32, displayL: 26, vesta: 18, title: 20, body: 16, meta: 11,
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { card: 24, input: 14, pill: 999 } as const;

export const motion = {
  easeStandard: 'cubic-bezier(.4,0,.2,1)',
  durMicro: 120, durBase: 350, durTransition: 430, breatheCycle: 5000,
} as const;

// Haptic vocabulary (map to CHHapticEngine patterns on device)
export const haptic = {
  swell: 'ramp .2→.8→.2 ~500ms (drag along tide)',
  anchorDone: 'success — two soft + tail',
  insightPeak: 'single soft + sharpness up',
  highTideAlert: 'double soft tap',
  tick: 'light',
} as const;

// Hard guardrail — these terms must never appear in UI copy (any language)
export const bannedCopy = [
  'weight','kg','lbs','lose','diet','calorie','BMI','diagnos','doctor',
  'willpower','fix yourself','result in', // + RU equivalents: вес, похуд, диета, калории
];
