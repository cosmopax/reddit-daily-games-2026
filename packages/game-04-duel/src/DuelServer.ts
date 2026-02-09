import { Context } from '@devvit/public-api';
import { RedisWrapper, ServiceProxy, Leaderboard } from 'shared';

const USER_HEALTH = 100;
const AI_HEALTH = 100;
const MAX_HISTORY = 40;
const START_CREDITS = 100;
const MOVE_CREDIT_COST = 10;
const MOVE_BONUS_DAMAGE = 2;
const WIN_CREDIT_REWARD = 25;
const LOSS_CREDIT_REWARD = 5;
const FALLBACK_PORTRAIT = 'https://placehold.co/256x256/0B0C10/FF4500?text=VALKYRIE';

export interface DuelState {
    userHealth: number;
    aiHealth: number;
    history: string[]; // Log of moves
    turn: 'user' | 'ai';
    gameOver: boolean;
    opponentName?: string;
    opponentRole?: string;
    opponentPortrait?: string;
    credits: number;
    wins?: number;
}

export class DuelServer {
    redis: RedisWrapper;
    context: any;

    constructor(context: Context) {
        this.redis = new RedisWrapper(context.redis);
        this.context = context;
    }

    private getKey(userId: string) {
        return `duel:v1:${userId}`;
    }

    private appendHistory(state: DuelState, line: string): void {
        state.history.push(line);
        if (state.history.length > MAX_HISTORY) {
            state.history = state.history.slice(-MAX_HISTORY);
        }
    }

    private clampHealth(value: number): number {
        return Math.max(0, Math.min(USER_HEALTH, Number(value || 0)));
    }

    private normalizeState(parsed: any): DuelState {
        const history = Array.isArray(parsed?.history)
            ? parsed.history.filter((x: unknown) => typeof x === 'string')
            : [];
        const normalized: DuelState = {
            userHealth: this.clampHealth(parsed?.userHealth ?? USER_HEALTH),
            aiHealth: this.clampHealth(parsed?.aiHealth ?? AI_HEALTH),
            history: history.slice(-MAX_HISTORY),
            turn: parsed?.turn === 'ai' ? 'ai' : 'user',
            gameOver: Boolean(parsed?.gameOver),
            opponentName: typeof parsed?.opponentName === 'string' ? parsed.opponentName : undefined,
            opponentRole: typeof parsed?.opponentRole === 'string' ? parsed.opponentRole : undefined,
            opponentPortrait: typeof parsed?.opponentPortrait === 'string' ? parsed.opponentPortrait : undefined,
            credits: Math.max(0, Number(parsed?.credits ?? START_CREDITS)),
            wins: Math.max(0, Number(parsed?.wins ?? 0)),
        };
        if (normalized.gameOver) normalized.turn = 'user';
        return normalized;
    }

    private async saveState(userId: string, state: DuelState): Promise<void> {
        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
    }

    private createNewState(name: string, role: string, portrait: string): DuelState {
        return {
            userHealth: USER_HEALTH,
            aiHealth: AI_HEALTH,
            history: [`Duel Protocol Initiated. Opponent: ${name} (${role})`],
            turn: 'user',
            gameOver: false,
            opponentName: name,
            opponentRole: role,
            opponentPortrait: portrait,
            credits: START_CREDITS,
            wins: 0,
        };
    }

    async getDuelState(userId: string): Promise<DuelState> {
        const raw = await this.context.redis.get(this.getKey(userId));
        if (!raw) {
            const proxy = new ServiceProxy(this.context);
            const roles = ['Blade Dancer', 'Neural Witch', 'Chrome Assassin', 'Void Siren'];
            const role = roles[Math.floor(Math.random() * roles.length)];
            const name = `Valkyrie ${Math.floor(Math.random() * 99)}`;

            let portrait = FALLBACK_PORTRAIT;
            try {
                portrait = await proxy.generateCharacterPortrait(role, 'Cyber-District-9', 'Valkyrie');
            } catch (e) {
                console.error("Portrait gen failed", e);
            }

            const newState = this.createNewState(name, role, portrait);
            await this.saveState(userId, newState);
            return newState;
        }
        try {
            return this.normalizeState(JSON.parse(raw));
        } catch (e) {
            console.warn('[duel] corrupted state, resetting', e);
            await this.context.redis.del(this.getKey(userId));
            return this.getDuelState(userId);
        }
    }

    async submitMove(userId: string, move: string): Promise<DuelState> {
        const state = await this.getDuelState(userId);
        if (state.gameOver) return state;
        if (state.turn !== 'user') {
            return this.processAITurn(userId, state);
        }

        const sanitizedMove = (move || '').trim().slice(0, 180);
        if (!sanitizedMove) return state;

        let bonusDamage = 0;
        if (state.credits >= MOVE_CREDIT_COST) {
            state.credits -= MOVE_CREDIT_COST;
            bonusDamage = MOVE_BONUS_DAMAGE;
            this.appendHistory(state, `You spent ${MOVE_CREDIT_COST} credits to overclock your strike (+${MOVE_BONUS_DAMAGE} damage).`);
        }

        const proxy = new ServiceProxy(this.context);
        const { damage: baseDamage, narrative } = await proxy.evaluateUserMove(sanitizedMove, state.history);
        const totalDamage = Math.max(1, Math.min(30, Number(baseDamage || 0) + bonusDamage));

        this.appendHistory(state, `You used: ${sanitizedMove}`);
        state.aiHealth = Math.max(0, state.aiHealth - totalDamage);
        this.appendHistory(state, narrative !== sanitizedMove ? narrative : `AI took ${totalDamage} damage!`);

        if (state.aiHealth === 0) {
            state.gameOver = true;
            state.turn = 'user';
            state.wins = (state.wins || 0) + 1;
            state.credits += WIN_CREDIT_REWARD;
            this.appendHistory(state, `VICTORY! +${WIN_CREDIT_REWARD} credits awarded.`);
            await this.saveState(userId, state);

            const lb = new Leaderboard(this.context, 'game4_duel');
            let username = 'Cyber Duelist';
            try {
                const user = await this.context.reddit.getUserById(userId);
                if (user) username = user.username;
            } catch (e) { }

            const newScore = await this.context.redis.zIncrBy(lb.getLeaderboardKey(), userId, 1);
            await lb.submitScore(userId, username, newScore);

            return state;
        }

        state.turn = 'ai';
        await this.saveState(userId, state);

        return await this.processAITurn(userId, state);
    }

    async processAITurn(userId: string, state: DuelState): Promise<DuelState> {
        if (state.gameOver) return state;
        const proxy = new ServiceProxy(this.context);
        const { move, damage } = await proxy.generateAiMove(state.history.slice(-8));
        const safeDamage = Math.max(0, Math.min(20, Number(damage || 0)));

        state.turn = 'ai';
        this.appendHistory(state, `AI used: ${move}`);
        state.userHealth = Math.max(0, state.userHealth - safeDamage);
        this.appendHistory(state, `You took ${safeDamage} damage!`);

        if (state.userHealth === 0) {
            state.gameOver = true;
            state.turn = 'user';
            state.credits += LOSS_CREDIT_REWARD;
            this.appendHistory(state, `DEFEAT... +${LOSS_CREDIT_REWARD} recovery credits granted.`);
        } else {
            state.turn = 'user';
        }

        await this.saveState(userId, state);
        return state;
    }

    async resetGame(userId: string): Promise<DuelState> {
        await this.context.redis.del(this.getKey(userId));
        return await this.getDuelState(userId);
    }
}
