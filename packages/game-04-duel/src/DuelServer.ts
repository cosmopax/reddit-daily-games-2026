import { Context } from '@devvit/public-api';
import { RedisWrapper } from 'shared';

const USER_HEALTH = 100;
const AI_HEALTH = 100;

export interface DuelState {
    userHealth: number;
    aiHealth: number;
    history: string[]; // Log of moves
    turn: 'user' | 'ai';
    gameOver: boolean;
}

export class DuelServer {
    redis: RedisWrapper;
    context: Context;

    constructor(context: Context) {
        this.redis = new RedisWrapper(context.redis);
        this.context = context;
    }

    private getKey(userId: string) {
        return `duel:v1:${userId}`;
    }

    async getDuelState(userId: string): Promise<DuelState> {
        const raw = await this.context.redis.get(this.getKey(userId));
        if (!raw) {
            return {
                userHealth: USER_HEALTH,
                aiHealth: AI_HEALTH,
                history: ["Battle Started!"],
                turn: 'user',
                gameOver: false,
            };
        }
        return JSON.parse(raw);
    }

    async submitMove(userId: string, move: string): Promise<DuelState> {
        const state = await this.getDuelState(userId);
        if (state.gameOver || state.turn !== 'user') return state;

        // 1. Process User Move
        state.history.push(`You used: ${move}`);

        // Simulate Damage (Mock) - In real version, LLM judge determines effectiveness
        const dmg = Math.floor(Math.random() * 20);
        state.aiHealth = Math.max(0, state.aiHealth - dmg);
        state.history.push(`AI took ${dmg} damage!`);

        if (state.aiHealth === 0) {
            state.gameOver = true;
            state.history.push("VICTORY!");
            await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
            return state;
        }

        state.turn = 'ai';
        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));

        // 2. Schedule AI Turn (or process immediately if light)
        // For Hackathon MVP, we process immediately to avoid complicated callbacks for now
        return await this.processAITurn(userId, state);
    }

    async processAITurn(userId: string, state: DuelState): Promise<DuelState> {
        // MOCK GEMINI CALL
        // const response = await this.context.http.fetch('https://gemini-proxy/generate', ...);
        const aiMoves = ["Plasma Blast", "Binary Slash", "Recursive Trap"];
        const move = aiMoves[Math.floor(Math.random() * aiMoves.length)];

        state.history.push(`AI used: ${move}`);
        const dmg = Math.floor(Math.random() * 15);
        state.userHealth = Math.max(0, state.userHealth - dmg);
        state.history.push(`You took ${dmg} damage!`);

        if (state.userHealth === 0) {
            state.gameOver = true;
            state.history.push("DEFEAT...");
        } else {
            state.turn = 'user';
        }

        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    async resetGame(userId: string): Promise<DuelState> {
        await this.context.redis.del(this.getKey(userId));
        return await this.getDuelState(userId);
    }
}
