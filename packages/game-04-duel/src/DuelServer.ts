import { Context } from '@devvit/public-api';
import { RedisWrapper, ServiceProxy } from 'shared';

const USER_HEALTH = 100;
const AI_HEALTH = 100;

export interface DuelState {
    userHealth: number;
    aiHealth: number;
    history: string[]; // Log of moves
    turn: 'user' | 'ai';
    gameOver: boolean;
    opponentName?: string;
    opponentRole?: string;
    opponentPortrait?: string;
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
            // Initialize new game with Cyber-Valkyrie
            const proxy = new ServiceProxy(this.context);
            const roles = ['Blade Dancer', 'Neural Witch', 'Chrome Assassin', 'Void Siren'];
            const role = roles[Math.floor(Math.random() * roles.length)];
            const name = `Valkyrie ${Math.floor(Math.random() * 99)}`;

            // Generate "Hot" portrait
            let portrait = '';
            try {
                portrait = await proxy.generateCharacterPortrait(role, 'Cyber-District-9', 'Valkyrie');
            } catch (e) {
                console.error("Portrait gen failed", e);
                portrait = "https://placeholder.com/valkyrie_fallback.png";
            }

            const newState: DuelState = {
                userHealth: USER_HEALTH,
                aiHealth: AI_HEALTH,
                history: [`Duel Protocol Initiated. Opponent: ${name} (${role})`],
                turn: 'user',
                gameOver: false,
                opponentName: name,
                opponentRole: role,
                opponentPortrait: portrait
            };

            await this.context.redis.set(this.getKey(userId), JSON.stringify(newState));
            return newState;
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
        // Fetch AI Move via Proxy (Gemini 2.0)
        const proxy = new ServiceProxy(this.context);
        const { move, damage } = await proxy.generateAiMove(state.history);

        state.history.push(`AI used: ${move}`);
        state.userHealth = Math.max(0, state.userHealth - damage);
        state.history.push(`You took ${damage} damage!`);

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
