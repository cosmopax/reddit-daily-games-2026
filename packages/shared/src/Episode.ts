import { Context } from '@devvit/public-api';
import { ServiceProxy, TrendResult } from './ServiceProxy';
import { CURATED_SIGNALS, EP_TITLES, ORACLE_LINES, RIVAL_LINES } from './content';

export type Episode = {
  id: string; // YYYY-MM-DD (UTC)
  title: string;
  signals: TrendResult[]; // length 2
  oracleLine: string;
  rivalLine: string;
  paletteId: number;
  portraitKey?: string; // for local "impressive visuals" without external hosting
  sceneKey?: string;
  portraitUrl?: string; // optional enhanced mode
  sceneUrl?: string; // optional enhanced mode
  createdAt: number;
};

const EP_TODAY_KEY = 'episode:today';
const EP_ARCHIVE_LIST = 'episode:archive'; // list of episode ids (newest first)

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function getEpisodeIdUTC(d: Date = new Date()): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function hashSeed(input: string): number {
  // Simple non-crypto hash (stable across runtimes)
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

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// content moved to packages/shared/src/content/*

function episodeKey(id: string): string {
  return `episode:${id}`;
}

async function readSetting(context: Context, key: string): Promise<string | undefined> {
  try {
    // @ts-ignore runtime exists in Devvit
    const val = await context.settings?.get(key);
    if (typeof val === 'string' && val.trim()) return val.trim();
  } catch {
    // ignore
  }
  return undefined;
}

function looksLikeDefaultFallback(signals: TrendResult[]): boolean {
  const defaults = ['Minecraft', 'Fortnite', 'Retro Gaming', 'AI Coding'];
  return signals.length === 2 && signals.every((s) => defaults.includes(s.query));
}

function curatedSignalsForEpisode(id: string): TrendResult[] {
  const rand = mulberry32(hashSeed(id));
  const shuffled = shuffle(CURATED_SIGNALS, rand);
  // Ensure traffic differs so higher/lower isn't ambiguous.
  const a = shuffled[0];
  let b = shuffled.find((s) => s.query !== a.query && s.traffic !== a.traffic) || shuffled[1];
  if (!b) b = CURATED_SIGNALS[1];
  const two = [a, b];
  // order not guaranteed; keep as-is for "A vs B"
  return two;
}

export async function seedEpisode(context: Context): Promise<Episode> {
  const id = getEpisodeIdUTC();
  const existing = await context.redis.get(episodeKey(id));
  if (existing) return JSON.parse(existing) as Episode;

  const paletteId = hashSeed(id) % 6;
  const rand = mulberry32(hashSeed(`${id}:episode`));
  const title = `${pick(EP_TITLES, rand)} // ${id}`;

  const hasSerpKey = !!(await readSetting(context, 'SERPAPI_KEY'));
  let signals: TrendResult[];
  if (hasSerpKey) {
    const proxy = new ServiceProxy(context);
    const fetched = await proxy.fetchDailyTrends(2);
    signals = fetched && fetched.length >= 2 ? fetched.slice(0, 2) : curatedSignalsForEpisode(id);
    if (looksLikeDefaultFallback(signals)) {
      // avoid always-the-same fallback experience even when SerpApi has transient failures.
      signals = curatedSignalsForEpisode(id);
    }
  } else {
    signals = curatedSignalsForEpisode(id);
  }

  const episode: Episode = {
    id,
    title,
    signals,
    oracleLine: pick(ORACLE_LINES, rand),
    rivalLine: pick(RIVAL_LINES, rand),
    paletteId,
    portraitKey: `oracle_${paletteId}`,
    sceneKey: `scene_${paletteId}`,
    createdAt: Date.now(),
  };

  await context.redis.set(episodeKey(id), JSON.stringify(episode));
  await context.redis.set(EP_TODAY_KEY, id);
  // Archive list: newest first, keep last 14.
  await context.redis.lPush(EP_ARCHIVE_LIST, id);
  await context.redis.lTrim(EP_ARCHIVE_LIST, 0, 13);
  return episode;
}

export async function getTodayEpisode(context: Context): Promise<Episode> {
  const todayId = await context.redis.get(EP_TODAY_KEY);
  if (todayId) {
    const raw = await context.redis.get(episodeKey(todayId));
    if (raw) return JSON.parse(raw) as Episode;
  }
  return seedEpisode(context);
}

export async function getEpisodeArchive(context: Context, keepDays: number = 7): Promise<Episode[]> {
  const ids = await context.redis.lRange(EP_ARCHIVE_LIST, 0, Math.max(0, keepDays - 1));
  const episodes: Episode[] = [];
  for (const id of ids || []) {
    const raw = await context.redis.get(episodeKey(id));
    if (raw) episodes.push(JSON.parse(raw) as Episode);
  }
  return episodes;
}
