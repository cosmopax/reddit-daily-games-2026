import { Context } from '@devvit/public-api';
import { Leaderboard, RedisWrapper } from 'shared';

export const GRID_SIZE = 5;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const LEVEL_COUNT = 3;
const TOTAL_MOVES = 9;

export type Sigil = 'burst' | 'orbit' | 'phase';
const SIGILS: Sigil[] = ['burst', 'orbit', 'phase'];

export interface LumenWeaveState {
    dayKey: string;
    board: number[];
    target: number[];
    movesLeft: number;
    totalMoves: number;
    resonance: number;
    currentMatch: number;
    bestMatch: number;
    turn: number;
    score: number;
    solved: boolean;
    gameOver: boolean;
    echoTriggered: boolean;
    resultSubmitted: boolean;
}

const idx = (row: number, col: number): number => row * GRID_SIZE + col;
const inBounds = (row: number, col: number): boolean => row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;

function normalizeLevel(value: number): number {
    return ((value % LEVEL_COUNT) + LEVEL_COUNT) % LEVEL_COUNT;
}

function applyDelta(board: number[], index: number, delta: number): void {
    board[index] = normalizeLevel(board[index] + delta);
}

function applyBurst(board: number[], index: number): number[] {
    const next = [...board];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const offsets = [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    for (const [dr, dc] of offsets) {
        const r = row + dr;
        const c = col + dc;
        if (inBounds(r, c)) {
            applyDelta(next, idx(r, c), 1);
        }
    }

    return next;
}

function applyOrbit(board: number[], index: number): number[] {
    const next = [...board];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    const ringCoords = [
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col + 1],
        [row + 1, col + 1],
        [row + 1, col],
        [row + 1, col - 1],
        [row, col - 1],
    ];

    const ringIndexes = ringCoords
        .filter(([r, c]) => inBounds(r, c))
        .map(([r, c]) => idx(r, c));

    if (ringIndexes.length > 1) {
        for (let i = 0; i < ringIndexes.length; i++) {
            const from = ringIndexes[i];
            const to = ringIndexes[(i + 1) % ringIndexes.length];
            next[to] = board[from];
        }
    }

    applyDelta(next, index, 1);
    return next;
}

function applyPhase(board: number[], index: number): number[] {
    const next = [...board];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    for (let c = 0; c < GRID_SIZE; c++) {
        applyDelta(next, idx(row, c), 2);
    }

    for (let r = 0; r < GRID_SIZE; r++) {
        if (r !== row) {
            applyDelta(next, idx(r, col), 2);
        }
    }

    for (let d = -GRID_SIZE; d <= GRID_SIZE; d++) {
        const diagA = [row + d, col + d] as const;
        const diagB = [row + d, col - d] as const;
        if (inBounds(diagA[0], diagA[1])) applyDelta(next, idx(diagA[0], diagA[1]), 1);
        if (inBounds(diagB[0], diagB[1])) applyDelta(next, idx(diagB[0], diagB[1]), 1);
    }

    applyDelta(next, index, 1);
    return next;
}

function applySigil(board: number[], sigil: Sigil, index: number): number[] {
    if (sigil === 'burst') return applyBurst(board, index);
    if (sigil === 'orbit') return applyOrbit(board, index);
    return applyPhase(board, index);
}

function getMirrorIndex(index: number): number {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    return idx(GRID_SIZE - 1 - row, GRID_SIZE - 1 - col);
}

function countMatches(board: number[], target: number[]): number {
    let matches = 0;
    for (let i = 0; i < CELL_COUNT; i++) {
        if (board[i] === target[i]) matches++;
    }
    return matches;
}

function hashString(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function mulberry32(seed: number): () => number {
    return () => {
        seed |= 0;
        seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function buildDailyPuzzle(dayKey: string): { board: number[]; target: number[] } {
    const rng = mulberry32(hashString(`lumen:${dayKey}`));

    const target: number[] = Array.from({ length: CELL_COUNT }, () => {
        const roll = rng();
        if (roll < 0.4) return 0;
        if (roll < 0.78) return 1;
        return 2;
    });

    let board: number[] = [...target];
    const scrambleSteps = 7 + Math.floor(rng() * 4);

    for (let i = 0; i < scrambleSteps; i++) {
        const sigil = SIGILS[Math.floor(rng() * SIGILS.length)];
        const index = Math.floor(rng() * CELL_COUNT);
        board = applySigil(board, sigil, index);
    }

    if (countMatches(board, target) > CELL_COUNT - 4) {
        for (let i = 0; i < 3; i++) {
            const sigil = SIGILS[Math.floor(rng() * SIGILS.length)];
            const index = Math.floor(rng() * CELL_COUNT);
            board = applySigil(board, sigil, index);
        }
    }

    return { board, target };
}

function computeScore(state: LumenWeaveState): number {
    if (state.solved) {
        return 1200 + (state.movesLeft * 160) + (state.bestMatch * 12);
    }

    const progressScore = state.currentMatch * 24;
    const explorationScore = Math.max(0, (state.totalMoves - state.movesLeft) * 8);
    const masteryScore = state.bestMatch * 9;

    return progressScore + explorationScore + masteryScore;
}

export class LumenWeaveServer {
    redis: RedisWrapper;
    context: any;

    constructor(context: Context) {
        this.redis = new RedisWrapper(context.redis);
        this.context = context;
    }

    private getKey(userId: string): string {
        return `lumen:v1:${userId}`;
    }

    private getTodayKey(): string {
        return new Date().toISOString().slice(0, 10);
    }

    private createFreshState(dayKey: string): LumenWeaveState {
        const { board, target } = buildDailyPuzzle(dayKey);
        const currentMatch = countMatches(board, target);

        return {
            dayKey,
            board,
            target,
            movesLeft: TOTAL_MOVES,
            totalMoves: TOTAL_MOVES,
            resonance: 0,
            currentMatch,
            bestMatch: currentMatch,
            turn: 0,
            score: 0,
            solved: false,
            gameOver: false,
            echoTriggered: false,
            resultSubmitted: false,
        };
    }

    async getGameState(userId: string): Promise<LumenWeaveState> {
        const today = this.getTodayKey();
        const raw = await this.context.redis.get(this.getKey(userId));

        if (raw) {
            try {
                const parsed = JSON.parse(raw) as LumenWeaveState;
                if (
                    parsed.dayKey === today
                    && Array.isArray(parsed.board)
                    && parsed.board.length === CELL_COUNT
                    && Array.isArray(parsed.target)
                    && parsed.target.length === CELL_COUNT
                ) {
                    return parsed;
                }
            } catch (_error) {
                // Fall through to state reset.
            }
        }

        const state = this.createFreshState(today);
        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    async applyMove(userId: string, sigil: Sigil, index: number): Promise<LumenWeaveState> {
        const state = await this.getGameState(userId);
        if (state.gameOver || state.movesLeft <= 0) {
            return state;
        }

        const safeIndex = Math.max(0, Math.min(CELL_COUNT - 1, index));
        let board = applySigil(state.board, sigil, safeIndex);
        let matches = countMatches(board, state.target);

        let resonance = state.resonance;
        if (matches > state.currentMatch) {
            resonance += 1;
        } else if (matches < state.currentMatch) {
            resonance = Math.max(0, resonance - 1);
        }

        let echoTriggered = false;
        if (resonance >= 3) {
            const mirrorIndex = getMirrorIndex(safeIndex);
            board = applySigil(board, sigil, mirrorIndex);
            matches = countMatches(board, state.target);
            resonance = 0;
            echoTriggered = true;
        }

        state.board = board;
        state.turn += 1;
        state.movesLeft = Math.max(0, state.movesLeft - 1);
        state.currentMatch = matches;
        state.bestMatch = Math.max(state.bestMatch, matches);
        state.resonance = resonance;
        state.echoTriggered = echoTriggered;

        state.solved = matches === CELL_COUNT;
        state.gameOver = state.solved || state.movesLeft === 0;
        state.score = computeScore(state);

        if (state.gameOver && !state.resultSubmitted) {
            const earned = state.solved ? state.score : Math.max(40, Math.floor(state.score / 4));
            await this.recordLeaderboard(userId, earned);
            state.resultSubmitted = true;
        }

        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    async resetGame(userId: string): Promise<LumenWeaveState> {
        await this.context.redis.del(this.getKey(userId));
        return this.getGameState(userId);
    }

    private async recordLeaderboard(userId: string, earnedScore: number): Promise<void> {
        try {
            const lb = new Leaderboard(this.context, 'game5_lumen');

            let username = 'Lumen Weaver';
            try {
                const user = await this.context.reddit.getUserById(userId);
                if (user?.username) {
                    username = user.username;
                }
            } catch (_error) {
                // Keep fallback username.
            }

            const totalKey = `user:${userId}:lumen_flux_total`;
            const totalScore = await this.context.redis.incrBy(totalKey, earnedScore);
            await lb.submitScore(userId, username, totalScore);
        } catch (_error) {
            // Game should remain playable even if leaderboard writes fail.
        }
    }
}
