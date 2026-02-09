import { Context, JobContext } from '@devvit/public-api';
import { RedisWrapper, DailyScheduler, ServiceProxy, Leaderboard } from 'shared';
import { ASSETS, AssetType, UserState, ExecutiveAdvisor, DailyScenario, DailyChoiceResult } from './types';
import { getRandomScenario } from './fallbackScenarios';

const USER_KEY_PREFIX = 'user:v1:';
const ACTIVE_USERS_KEY = 'strategy:active_users';
const ACTIVE_CURSOR_KEY = 'strategy:hourly_cursor';
const HOURLY_BATCH_SIZE = 25;
const DAILY_SCENARIO_PREFIX = 'daily_scenario:';
const LEGACY_DAILY_SCENARIO_KEY = 'daily_scenario';

export class GameStrategyServer {
    redis: RedisWrapper;
    scheduler: DailyScheduler;

    context: Context | JobContext;

    constructor(context: Context | JobContext) {
        this.context = context;
        this.redis = new RedisWrapper(context.redis);
        this.scheduler = new DailyScheduler(context.scheduler);
    }

    private getUserKey(userId: string): string {
        return `${USER_KEY_PREFIX}${userId}`;
    }

    private getTodayChoiceKey(): string {
        return `daily_choices:${this.getTodayDateKey()}`;
    }

    private getTodayDateKey(): string {
        const now = new Date();
        const yyyy = now.getUTCFullYear();
        const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(now.getUTCDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    private getDailyScenarioKey(dateKey: string = this.getTodayDateKey()): string {
        return `${DAILY_SCENARIO_PREFIX}${dateKey}`;
    }

    private calculateAssetValue(assets: Record<AssetType, number>): number {
        let assetValue = 0;
        Object.keys(ASSETS).forEach(id => {
            const count = assets[id as AssetType] || 0;
            assetValue += count * ASSETS[id as AssetType].cost;
        });
        return assetValue;
    }

    private async touchActiveUser(userId: string): Promise<void> {
        try {
            await this.context.redis.zAdd(ACTIVE_USERS_KEY, { member: userId, score: Date.now() });
        } catch (e) {
            console.warn('[strategy] failed to touch active user', e);
        }
    }

    private async syncLeaderboardForUser(userId: string, state: UserState, avatarUrl?: string): Promise<void> {
        try {
            const lb = new Leaderboard(this.context, 'game1_strategy');
            let username = 'Unknown CEO';
            try {
                const user = await this.context.reddit.getUserById(userId);
                if (user) username = user.username;
            } catch (e) { }
            await lb.submitScore(userId, username, state.netWorth, avatarUrl);
        } catch (e) {
            console.warn('[strategy] leaderboard sync failed', e);
        }
    }

    async getUserState(userId: string): Promise<UserState> {
        // Rehydrate from Redis using our optimized wrapper
        const keys = ['cash', 'lastTick', 'advisors_json', ...Object.keys(ASSETS).map(id => `asset_${id}`)];
        const data = await this.redis.getPackedState(this.getUserKey(userId), 'state', keys);

        const assets: Record<string, number> = {};
        let hourlyIncome = 0;
        let assetValue = 0;

        Object.keys(ASSETS).forEach(id => {
            const count = Number(data[`asset_${id}`] || 0);
            assets[id] = count;
            // Calculate stats
            const config = ASSETS[id as AssetType];
            if (config) {
                hourlyIncome += count * config.incomePerHour;
                assetValue += count * config.cost;
            }
        });

        const lastTick = Number(data['lastTick'] || Date.now());
        const isNewUser = !data['cash'] && !data['lastTick'];
        let cash = Number(data['cash'] || (isNewUser ? 1000 : 0));
        let advisors: ExecutiveAdvisor[] = [];
        if (data['advisors_json']) {
            try {
                advisors = JSON.parse(data['advisors_json'] as unknown as string);
            } catch (e) { }
        }

        // Lazy Evaluation: Apply pending income and persist
        const now = Date.now();
        const elapsedHours = (now - (lastTick as number)) / 3600000;
        if (elapsedHours > 0 && hourlyIncome > 0) {
            const earned = hourlyIncome * elapsedHours;
            cash += earned;
        }

        const state: UserState = {
            cash,
            lastTick: now,
            netWorth: cash + assetValue,
            assets: assets as Record<AssetType, number>,
            advisors
        };

        // Persist accrued income so it's not lost on reload
        if (elapsedHours > 0.001 || isNewUser) {
            await this.saveUserState(userId, state);
        } else {
            await this.touchActiveUser(userId);
        }

        return state;
    }

    async saveUserState(userId: string, state: UserState): Promise<void> {
        const data: Record<string, number | string> = {
            cash: state.cash,
            lastTick: state.lastTick,
        };
        Object.entries(state.assets).forEach(([id, count]) => {
            data[`asset_${id}`] = count;
        });
        if (state.advisors && state.advisors.length > 0) {
            data.advisors_json = JSON.stringify(state.advisors);
        }
        await this.redis.savePackedState(this.getUserKey(userId), 'state', data);
        await this.touchActiveUser(userId);
    }

    async buyAsset(userId: string, assetType: AssetType, amount: number = 1): Promise<boolean> {
        const config = ASSETS[assetType];
        // Must get LATEST state including pending income
        // We need a version of getUserState that actually SAVES the catch-up income before transaction
        // Start by getting "view" state
        let state = await this.getUserState(userId);

        // Calculate cost
        // Fractional buying: simplified cost = base_cost * amount
        // (No exponential ramp logic in this MVP?)
        const totalCost = config.cost * amount;

        if (state.cash >= totalCost) {
            state.cash -= totalCost;
            state.assets[assetType] = (state.assets[assetType] || 0) + amount;
            state.netWorth = state.cash + this.calculateAssetValue(state.assets);

            // Critical: Update lastTick to NOW because we just consumed the accrued cash/time delta
            // getUserState returns 'now' as lastTick if we use the projected value.
            // So saving 'state' as returned by getUserState is correct.
            await this.saveUserState(userId, state);
            await this.syncLeaderboardForUser(userId, state);
            return true;
        }
        return false;
    }

    /**
     * Buys as much of an asset as possible with current cash
     * supports fractional shares if needed.
     */
    async investMax(userId: string, assetType: AssetType): Promise<number> {
        let state = await this.getUserState(userId);
        const config = ASSETS[assetType];
        if (state.cash <= 0) return 0;

        const maxAmount = state.cash / config.cost;
        if (maxAmount > 0) {
            state.cash = 0; // Utilized all cash
            state.assets[assetType] = (state.assets[assetType] || 0) + maxAmount;
            state.netWorth = state.cash + this.calculateAssetValue(state.assets);
            await this.saveUserState(userId, state);
            await this.syncLeaderboardForUser(userId, state);
            return maxAmount;
        }
        return 0;
    }

    /**
     * Run hourly to grant passive income.
     * To avoid valid timeout, we might process a shard.
     */
    async onHourlyTick(event: any) {
        const cursorRaw = await this.context.redis.get(ACTIVE_CURSOR_KEY);
        const startIndex = Number(cursorRaw || 0);
        let users = await this.context.redis.zRange(ACTIVE_USERS_KEY, startIndex, startIndex + HOURLY_BATCH_SIZE - 1, { by: 'rank' });

        if ((!users || users.length === 0) && startIndex > 0) {
            users = await this.context.redis.zRange(ACTIVE_USERS_KEY, 0, HOURLY_BATCH_SIZE - 1, { by: 'rank' });
        }

        if (!users || users.length === 0) {
            console.log('[strategy.hourly_tick] no active users');
            await this.context.redis.set(ACTIVE_CURSOR_KEY, '0');
            return;
        }

        let processed = 0;
        for (const item of users) {
            const userId = item.member;
            try {
                const state = await this.getUserState(userId);
                await this.syncLeaderboardForUser(userId, state);
                processed += 1;
            } catch (e) {
                console.error(`[strategy.hourly_tick] failed user=${userId}`, e);
            }
        }

        const nextCursor = users.length < HOURLY_BATCH_SIZE ? 0 : startIndex + users.length;
        await this.context.redis.set(ACTIVE_CURSOR_KEY, String(nextCursor));
        console.log(`[strategy.hourly_tick] processed=${processed} nextCursor=${nextCursor}`);
    }
    /**
     * Unlocks a new "Executive Advisor" if net worth milestones are met.
     */
    async unlockAdvisor(userId: string): Promise<ExecutiveAdvisor | null> {
        let state = await this.getUserState(userId);

        const currentAdvisors = state.advisors || [];
        if (currentAdvisors.length >= 4) return null; // Max 4

        const cost = 1000000 * Math.pow(10, currentAdvisors.length);
        if (state.cash < cost) return null; // Not liquid enough (changed from net worth to cash for challenge)

        // Deduct Cash
        state.cash -= cost;
        state.lastTick = Date.now();

        // Generate Advisor
        // @ts-ignore - Context mismatch fix later?
        const proxy = new ServiceProxy(this.context);
        const archetypes = ['CFO', 'Growth Hacker', 'Quantum Analyst', 'Corporate Spy'];
        const role = archetypes[currentAdvisors.length % archetypes.length];

        const portrait = await proxy.generateCharacterPortrait(role, 'Corporate Cyberpunk');

        const advisor: ExecutiveAdvisor = {
            id: Math.random().toString(36).substring(7),
            name: `Executive ${Math.floor(Math.random() * 999)}`,
            role: role,
            benefit: `+${(currentAdvisors.length + 1) * 10}% Income`,
            multiplier: 1 + ((currentAdvisors.length + 1) * 0.1),
            portraitUrl: portrait
        };

        const newAdvisors = [...currentAdvisors, advisor];

        // Save (Requires updating saveUserState to handle advisors)
        // We need to modify saveUserState logic too because it uses RedisWrapper packed state.
        // RedisWrapper packed state works for simple keys. Arrays are tricky.
        // We will store advisors as a JSON blob in a separate key or pack it as 'advisors_json' string?
        // Let's store as 'advisors_json' field.
        await this.saveWithAdvisors(userId, state, newAdvisors);

        state.advisors = newAdvisors;
        state.netWorth = state.cash + this.calculateAssetValue(state.assets);
        await this.syncLeaderboardForUser(userId, state, advisor.portraitUrl);

        return advisor;
    }

    async saveWithAdvisors(userId: string, state: UserState, advisors: ExecutiveAdvisor[]) {
        const data: Record<string, any> = {
            cash: state.cash,
            lastTick: state.lastTick,
            advisors_json: JSON.stringify(advisors) // Store as JSON string
        };
        Object.entries(state.assets).forEach(([id, count]) => {
            data[`asset_${id}`] = count;
        });
        await this.redis.savePackedState(this.getUserKey(userId), 'state', data);
    }
    // ═══════════════════════════════════════════
    // DAILY SCENARIO — The Vic/Sal Choice System
    // ═══════════════════════════════════════════

    /**
     * Get today's scenario. Tries Redis cache → Gemini generation → fallback.
     */
    async getDailyScenario(): Promise<DailyScenario> {
        const scenarioKey = this.getDailyScenarioKey();
        // Check Redis for cached scenario
        const cached = await this.context.redis.get(scenarioKey);
        if (cached) {
            try {
                return JSON.parse(cached) as DailyScenario;
            } catch (e) { /* corrupted, regenerate */ }
        }

        // Compatibility: hydrate new date-scoped key from legacy key if it exists.
        const legacy = await this.context.redis.get(LEGACY_DAILY_SCENARIO_KEY);
        if (legacy) {
            try {
                const parsed = JSON.parse(legacy) as DailyScenario;
                await this.context.redis.set(scenarioKey, JSON.stringify(parsed));
                return parsed;
            } catch (e) { /* ignore malformed legacy scenario */ }
        }

        // Try Gemini generation
        const generated = await this.generateDailyScenario();
        if (generated) {
            // Cache with ~25 hour TTL (in ms for redis expiry)
            await this.context.redis.set(scenarioKey, JSON.stringify(generated));
            await this.context.redis.set(LEGACY_DAILY_SCENARIO_KEY, JSON.stringify(generated));
            // Set expiration (25 hours)
            try {
                await (this.context.redis as any).expire(scenarioKey, 90000);
            } catch (e) { /* expire not available, scenario persists until overwritten */ }
            return generated;
        }

        // Fallback to pre-written scenarios
        const recentIds: string[] = [];
        try {
            const recentRaw = await this.context.redis.get('recent_scenario_ids');
            if (recentRaw) recentIds.push(...JSON.parse(recentRaw));
        } catch (e) { }

        const fallback = getRandomScenario(recentIds);

        // Track used scenario IDs (keep last 5)
        const updatedIds = [...recentIds, fallback.id].slice(-5);
        await this.context.redis.set('recent_scenario_ids', JSON.stringify(updatedIds));
        await this.context.redis.set(scenarioKey, JSON.stringify(fallback));
        await this.context.redis.set(LEGACY_DAILY_SCENARIO_KEY, JSON.stringify(fallback));

        return fallback;
    }

    /**
     * Generate a Vic/Sal scenario via Gemini.
     * Returns null on failure (caller falls back to pre-written scenarios).
     */
    private async generateDailyScenario(): Promise<DailyScenario | null> {
        const proxy = new ServiceProxy(this.context);
        const apiKey = await (async () => {
            try {
                const val = await (this.context.settings as any)?.get('GEMINI_API_KEY');
                return val as string | undefined;
            } catch (e) { return undefined; }
        })();

        if (!apiKey) return null;

        const concepts = [
            'Short Selling', 'Compound Interest', 'Diversification', 'Dollar-Cost Averaging',
            'Margin Trading', 'Options Trading', 'Real Estate Investment', 'Passive Income',
            'Inflation Hedging', 'Emergency Fund', 'Venture Capital', 'Market Cycles',
            'Bond Markets', 'ETFs vs Individual Stocks', 'Tax-Loss Harvesting',
        ];
        const concept = concepts[Math.floor(Math.random() * concepts.length)];

        const prompt = `You are a creative writer for a financial education game called "Get Rich Lazy".
The aesthetic is SEINEN NOIR — think noir manga meets Wall Street meets The Wire.
Two advisors give competing advice on a daily market event:

VIC: Young, reckless, WSB energy. Talks in internet slang, emoji, all-caps hype. High risk, high reward.
SAL: Old-school, street-wise, Wire-style dialogue. Calm, measured, conservative but sharp.

Today's financial concept: "${concept}"

Create a daily scenario. Reply with ONLY valid JSON (no markdown):
{
  "id": "gen_${Date.now()}",
  "headline": "DRAMATIC ALL-CAPS HEADLINE (max 8 words)",
  "narrative": "2-3 sentence noir-style scene setter (max 200 chars)",
  "financialConcept": "${concept}",
  "illegalAnalogy": "Explain ${concept} using a criminal/street metaphor (2-3 sentences, max 250 chars)",
  "vic": {
    "dialogue": "Vic's advice in character (2-3 sentences, max 200 chars)",
    "action": "What following Vic does (1 sentence, max 60 chars)",
    "multiplierRange": [low, high]
  },
  "sal": {
    "dialogue": "Sal's advice in character (2-3 sentences, max 200 chars)",
    "action": "What following Sal does (1 sentence, max 60 chars)",
    "multiplierRange": [low, high]
  }
}

RULES for multiplierRange:
- Vic: wide range like [0.2, 4.0] — high risk
- Sal: narrow range like [0.9, 1.3] — low risk
- Both can lose money, but Vic's floor is lower and ceiling higher`;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (response.ok) {
                const data: any = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(cleanJson) as DailyScenario;
                    // Validate structure
                    if (parsed.headline && parsed.vic?.dialogue && parsed.sal?.dialogue) {
                        return parsed;
                    }
                }
            }
        } catch (e) {
            console.error('[generateDailyScenario] Gemini error:', e);
        }

        return null;
    }

    /**
     * Process a user's daily Vic/Sal choice.
     * Applies the multiplier, records the choice, syncs leaderboard.
     */
    async processDailyChoice(userId: string, choice: 'vic' | 'sal'): Promise<DailyChoiceResult> {
        const existingChoice = await this.hasChosenToday(userId);
        if (existingChoice) {
            const state = await this.getUserState(userId);
            return {
                choice: existingChoice as 'vic' | 'sal',
                multiplier: 1,
                cashBefore: state.cash,
                cashAfter: state.cash,
                narrative: `You already chose ${existingChoice.toUpperCase()} today. Come back after UTC midnight.`,
            };
        }

        const state = await this.getUserState(userId);
        const scenario = await this.getDailyScenario();

        const advice = choice === 'vic' ? scenario.vic : scenario.sal;
        const [min, max] = advice.multiplierRange;
        const multiplier = min + Math.random() * (max - min);

        const cashBefore = state.cash;
        const cashAfter = Math.max(10, Math.floor(state.cash * multiplier)); // Never go below 10

        state.cash = cashAfter;
        state.lastTick = Date.now();

        // Recalculate net worth
        state.netWorth = state.cash + this.calculateAssetValue(state.assets);

        await this.saveUserState(userId, state);

        // Record choice for today (date-scoped to prevent permanent lockout)
        await this.context.redis.hSet(this.getTodayChoiceKey(), { [userId]: choice });

        // Generate outcome narrative
        const gainOrLoss = cashAfter - cashBefore;
        const pct = Math.round((multiplier - 1) * 100);
        let narrative: string;
        if (multiplier >= 2.0) {
            narrative = choice === 'vic'
                ? `VIC WAS RIGHT! Massive gains! Cash went ${pct > 0 ? '+' : ''}${pct}%. 🚀`
                : `SAL's patience PAID OFF BIG. Cash ${pct > 0 ? '+' : ''}${pct}%. Slow money IS smart money.`;
        } else if (multiplier >= 1.0) {
            narrative = choice === 'vic'
                ? `Vic's play worked. Cash up ${pct}%. Not bad for a degen move.`
                : `Sal's wisdom holds. Cash up ${pct}%. Steady hands, steady gains.`;
        } else if (multiplier >= 0.5) {
            narrative = choice === 'vic'
                ? `Vic's gamble didn't quite land. Cash down ${Math.abs(pct)}%. The market humbles everyone.`
                : `Even Sal's caution couldn't dodge this one. Cash down ${Math.abs(pct)}%.`;
        } else {
            narrative = choice === 'vic'
                ? `VIC LED YOU OFF A CLIFF. Cash obliterated — down ${Math.abs(pct)}%. Fortune did NOT favor the degen today.`
                : `A rare Sal miss. Cash dropped ${Math.abs(pct)}%. Even the wise take hits.`;
        }

        // Sync leaderboard
        await this.syncLeaderboardForUser(userId, state);

        return {
            choice,
            multiplier,
            cashBefore,
            cashAfter,
            narrative,
        };
    }

    /**
     * Check if user already made today's choice.
     */
    async hasChosenToday(userId: string): Promise<string | null> {
        const choice = await this.context.redis.hGet(this.getTodayChoiceKey(), userId);
        return choice || null;
    }

    async getLeaderboard() {
        const lb = new Leaderboard(this.context, 'game1_strategy');
        return lb.getTop(10);
    }
}
