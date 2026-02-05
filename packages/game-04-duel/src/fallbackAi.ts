function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function rand(): number {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MOVE_TEMPLATES = [
  'Glitch Feint',
  'Neon Riposte',
  'Firewall Shatter',
  'Signal Juke',
  'Chrome Uppercut',
  'Spectral Lunge',
  'Protocol Slam',
  'Memory Spike',
  'Holo Mirage',
  'Circuit Breaker',
  'Echo Parry',
  'Heat Sink Counter',
];

const TAUNTS = [
  'The Valkyrie laughs in static.',
  'Your move echoes across the feed.',
  'A cold algorithm smiles.',
  'The arena lights flicker: advantage shifts.',
  'A blade of light draws a new line in the air.',
  'The crowd hears only synth and consequence.',
];

export function fallbackAiMove(history: string[], episodeId: string): { move: string; damage: number } {
  const seed = hashSeed(`${episodeId}:${history.length}:${history.slice(-2).join('|')}`);
  const rand = mulberry32(seed);
  const move = MOVE_TEMPLATES[Math.floor(rand() * MOVE_TEMPLATES.length)];
  const taunt = TAUNTS[Math.floor(rand() * TAUNTS.length)];
  const damage = 4 + Math.floor(rand() * 13); // 4..16
  return { move: `${move} (${taunt})`, damage };
}

