import { Context } from '@devvit/public-api';
import { RedisWrapper, ServiceProxy, Leaderboard, episodePortraitUrl, getTodayEpisode } from 'shared';
import { fallbackAiMove } from './fallbackAi';

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
            // Initialize new game with Cyber-Valkyrie (keyless by default; keys only enhance)
            const episode = await getTodayEpisode(this.context);
            const roles = ['Blade Dancer', 'Neural Witch', 'Chrome Assassin', 'Void Siren'];
            const role = roles[Math.abs(episode.paletteId) % roles.length];
            const name = `Valkyrie ${Math.floor(Math.random() * 99)}`;

            const portrait = episodePortraitUrl(episode, `${name.toUpperCase()}`);

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
        console.log(`[duel] user_move user=${userId} move=${move}`);

        // Simulate Damage (Mock) - In real version, LLM judge determines effectiveness
        const dmg = Math.floor(Math.random() * 20);
        state.aiHealth = Math.max(0, state.aiHealth - dmg);
        state.history.push(`AI took ${dmg} damage!`);

        if (state.aiHealth === 0) {
            state.gameOver = true;
            state.history.push("VICTORY!");
            await this.context.redis.set(this.getKey(userId), JSON.stringify(state));

            // Leaderboard Sync
            const lb = new Leaderboard(this.context, 'game4_duel');
            let username = 'Cyber Duelist';
            try {
                const user = await this.context.reddit.getUserById(userId);
                if (user) username = user.username;
            } catch (e) { }

            await lb.incrementScore(userId, username, 1, state.opponentPortrait);

            return state;
        }

        state.turn = 'ai';
        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));

        // 2. Schedule AI Turn (or process immediately if light)
        // For Hackathon MVP, we process immediately to avoid complicated callbacks for now
        return await this.processAITurn(userId, state);
    }

    async processAITurn(userId: string, state: DuelState): Promise<DuelState> {
        const episode = await getTodayEpisode(this.context);
        // Fetch AI Move via Proxy (Gemini) with deterministic fallback (never show "Static Noise")
        const proxy = new ServiceProxy(this.context);
        let ai = await proxy.generateAiMove(state.history);
        let source: 'gemini' | 'fallback' = 'gemini';
        if (!ai.move || ai.move === 'Static Noise' || ai.move.startsWith('Systems Offline') || ai.damage <= 0) {
            ai = fallbackAiMove(state.history, episode.id);
            source = 'fallback';
        }
        console.log(`[duel] ai_move user=${userId} ep=${episode.id} source=${source} dmg=${ai.damage}`);

        state.history.push(`AI used: ${ai.move}`);
        state.userHealth = Math.max(0, state.userHealth - ai.damage);
        state.history.push(`You took ${ai.damage} damage!`);

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
