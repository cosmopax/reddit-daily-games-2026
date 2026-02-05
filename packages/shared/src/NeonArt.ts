import type { Episode } from './Episode';

export type NeonPalette = {
  bg0: string;
  bg1: string;
  accent: string;
  accent2: string;
  text: string;
  dim: string;
};

const PALETTES: NeonPalette[] = [
  { bg0: '#07070a', bg1: '#111126', accent: '#ff4d00', accent2: '#00d1ff', text: '#e8e8ee', dim: '#9aa0a6' },
  { bg0: '#050811', bg1: '#0f1a2a', accent: '#00ff9a', accent2: '#ff2bd6', text: '#e8e8ee', dim: '#9aa0a6' },
  { bg0: '#080510', bg1: '#1a0f2a', accent: '#ffd000', accent2: '#6b7bff', text: '#f2f2f6', dim: '#a8a8b5' },
  { bg0: '#050a0a', bg1: '#0f1c1c', accent: '#00c3ff', accent2: '#ff5c7a', text: '#e8f1f1', dim: '#90a4ae' },
  { bg0: '#0b0507', bg1: '#1d0f14', accent: '#ff2d55', accent2: '#8aff00', text: '#f3edf0', dim: '#b0a0a7' },
  { bg0: '#050505', bg1: '#141414', accent: '#b700ff', accent2: '#00ffef', text: '#f4f4fb', dim: '#a0a0ad' },
];

export function getNeonPalette(paletteId: number): NeonPalette {
  const idx = Math.abs(paletteId || 0) % PALETTES.length;
  return PALETTES[idx];
}

function svgToDataUrl(svg: string): string {
  // SVG as utf8 keeps size smaller than base64 for our simple shapes.
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function esc(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function makeNeonPoster(opts: {
  title: string;
  subtitle: string;
  paletteId: number;
  badge?: string;
  kind: 'portrait' | 'scene';
}): string {
  const p = getNeonPalette(opts.paletteId);
  const title = esc(opts.title);
  const subtitle = esc(opts.subtitle);
  const badge = opts.badge ? esc(opts.badge) : '';
  const isPortrait = opts.kind === 'portrait';

  // 600x360 keeps it light but still looks crisp in post UIs.
  const w = 600;
  const h = 360;
  const centerX = 410;
  const centerY = 175;

  const portrait = isPortrait
    ? `
      <g opacity="0.98">
        <circle cx="${centerX}" cy="${centerY}" r="88" fill="url(#glow)" />
        <path d="M ${centerX - 38} ${centerY + 18} q 38 -58 76 0 v 62 h -76 z" fill="${p.bg1}" stroke="${p.accent2}" stroke-width="3" opacity="0.95"/>
        <circle cx="${centerX}" cy="${centerY - 20}" r="38" fill="${p.bg1}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M ${centerX - 18} ${centerY - 20} q 18 22 36 0" fill="none" stroke="${p.accent2}" stroke-width="3" opacity="0.9"/>
        <path d="M ${centerX - 56} ${centerY + 70} q 56 40 112 0" fill="none" stroke="${p.accent}" stroke-width="3" opacity="0.85"/>
      </g>`
    : `
      <g opacity="0.95">
        <rect x="312" y="78" width="250" height="190" rx="18" fill="url(#grid)" stroke="${p.accent2}" stroke-width="2"/>
        <path d="M 312 190 L 562 190" stroke="${p.accent}" stroke-width="2" opacity="0.75"/>
        <path d="M 312 138 L 562 138" stroke="${p.accent}" stroke-width="2" opacity="0.55"/>
        <path d="M 350 268 q 90 -120 180 0" fill="none" stroke="${p.accent2}" stroke-width="3" opacity="0.8"/>
      </g>`;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.bg0}"/>
        <stop offset="1" stop-color="${p.bg1}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="60%">
        <stop offset="0" stop-color="${p.accent2}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${p.accent}" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse">
        <path d="M 18 0 L 0 0 0 18" fill="none" stroke="${p.dim}" stroke-width="1" opacity="0.22"/>
      </pattern>
      <filter id="neon">
        <feGaussianBlur stdDeviation="2.2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="22" fill="rgba(0,0,0,0.24)" stroke="${p.dim}" stroke-width="1" opacity="0.9"/>

    <path d="M 26 84 L ${w - 26} 84" stroke="${p.accent}" stroke-width="2" opacity="0.45"/>
    <path d="M 26 ${h - 70} L ${w - 26} ${h - 70}" stroke="${p.accent2}" stroke-width="2" opacity="0.35"/>

    <g filter="url(#neon)">
      <path d="M 26 62 L 170 62" stroke="${p.accent2}" stroke-width="4" opacity="0.9"/>
      <path d="M 26 62 L 110 62" stroke="${p.accent}" stroke-width="4" opacity="0.9"/>
    </g>

    <text x="34" y="126" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      font-size="26" fill="${p.text}" font-weight="700" letter-spacing="1.5">${title}</text>
    <text x="34" y="156" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      font-size="14" fill="${p.dim}" font-weight="600" letter-spacing="1.2">${subtitle}</text>

    ${badge ? `<g>
      <rect x="34" y="176" width="160" height="28" rx="14" fill="${p.accent2}" opacity="0.16" stroke="${p.accent2}" stroke-width="1"/>
      <text x="46" y="195" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        font-size="12" fill="${p.text}" font-weight="700" letter-spacing="1.6">${badge}</text>
    </g>` : ''}

    ${portrait}

    <g opacity="0.55">
      <circle cx="92" cy="${h - 76}" r="3" fill="${p.accent}"/>
      <circle cx="108" cy="${h - 76}" r="3" fill="${p.accent2}"/>
      <circle cx="124" cy="${h - 76}" r="3" fill="${p.text}"/>
      <text x="140" y="${h - 72}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        font-size="10" fill="${p.dim}" font-weight="700">NEON DAILY ARCADE</text>
    </g>
  </svg>`;

  return svgToDataUrl(svg);
}

export function episodePortraitUrl(episode: Episode, title: string = 'ORACLE'): string {
  return makeNeonPoster({
    title,
    subtitle: episode.id,
    paletteId: episode.paletteId,
    badge: 'PORTRAIT OF THE DAY',
    kind: 'portrait',
  });
}

export function episodeSceneUrl(episode: Episode, title: string = 'SCENE'): string {
  return makeNeonPoster({
    title,
    subtitle: episode.title,
    paletteId: episode.paletteId,
    badge: 'TODAY',
    kind: 'scene',
  });
}

