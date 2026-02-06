import { Context, JobContext } from '@devvit/public-api';
import { RedisWrapper, DailyScheduler, ServiceProxy, Leaderboard } from 'shared';
import { ASSETS, AssetType, UserState, ExecutiveAdvisor, DailyScenario, DailyChoiceResult } from './types';
import { getRandomScenario } from './fallbackScenarios';

const USER_KEY_PREFIX = 'user:v1:';

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

    async getUserState(userId: string): Promise<UserState> {
        // Rehydrate from Redis using our optimized wrapper
        const keys = ['cash', 'lastTick', 'advisors_json', ...Object.keys(ASSETS).map(id => `asset_${id}`)];
        const data = await this.redis.getPackedState(this.getUserKey(userId), 'state', keys);

        const assets: Record<string, number> = {};
        let hourlyIncome = 0;
        let assetValue = 0;

        Object.keys(ASSETS).forEach(id => {
            const count = data[`asset_${id}`] || 0;
            assets[id] = count;
            // Calculate stats
            const config = ASSETS[id as AssetType];
            if (config) {
                hourlyIncome += count * config.incomePerHour;
                assetValue += count * config.cost;
            }
        });

        const lastTick = data['lastTick'] || Date.now();
        const isNewUser = !data['cash'] && !data['lastTick'];
        let cash = data['cash'] || (isNewUser ? 1000 : 0);
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
        }

        return state;
    }

    async saveUserState(userId: string, state: UserState): Promise<void> {
        const data: Record<string, number> = {
            cash: state.cash,
            lastTick: state.lastTick,
        };
        Object.entries(state.assets).forEach(([id, count]) => {
            data[`asset_${id}`] = count;
        });
        await this.redis.savePackedState(this.getUserKey(userId), 'state', data);
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

            // Critical: Update lastTick to NOW because we just consumed the accrued cash/time delta
            // getUserState returns 'now' as lastTick if we use the projected value.
            // So saving 'state' as returned by getUserState is correct.
            await this.saveUserState(userId, state);
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
            await this.saveUserState(userId, state);
            return maxAmount;
        }
        return 0;
    }

    /**
     * Run hourly to grant passive income.
     * To avoid valid timeout, we might process a shard.
     */
    async onHourlyTick(event: any) {
        console.log("Processing hourly tick...");
        // Ideally, we'd iterate a specific ZSET shard of active users.
        // For MVP, we pass. Implementation details for sharding would go here.
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

        // Sync to Leaderboard (High Score = Net Worth)
        const lb = new Leaderboard(this.context, 'game1_strategy');
        // We need username. Context doesn't always have it in older triggers, but useful here.
        // We'll try to get it from context if possible, or fetch.
        // For now, pass 'Trader' if unknown, but usually we can get it or cache it.
        // Assuming we rely on client to pass username? No, server side.
        // We will just use userId for now, update metadata later?
        // Actually, let's fetch user if we can.
        let username = 'Unknown CEO';
        try {
            const user = await this.context.reddit.getUserById(userId);
            if (user) username = user.username;
        } catch (e) { }

        // NetWorth calculation might be projected. Let's use the current 'cash + assetVal'.
        // Recalculate net worth to be sure
        let currentNetWorth = state.cash;
        Object.keys(ASSETS).forEach(id => {
            const count = state.assets[id as AssetType] || 0;
            currentNetWorth += count * ASSETS[id as AssetType].cost;
        });

        await lb.submitScore(userId, username, currentNetWorth, advisor.portraitUrl);

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
        // Check Redis for cached scenario
        const cached = await this.context.redis.get('daily_scenario');
        if (cached) {
            try {
                return JSON.parse(cached) as DailyScenario;
            } catch (e) { /* corrupted, regenerate */ }
        }

        // Try Gemini generation
        const generated = await this.generateDailyScenario();
        if (generated) {
            // Cache with ~25 hour TTL (in ms for redis expiry)
            await this.context.redis.set('daily_scenario', JSON.stringify(generated));
            // Set expiration (25 hours)
            try {
                await (this.context.redis as any).expire('daily_scenario', 90000);
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
        await this.context.redis.set('daily_scenario', JSON.stringify(fallback));

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
        let assetValue = 0;
        Object.keys(ASSETS).forEach(id => {
            const count = state.assets[id as AssetType] || 0;
            assetValue += count * ASSETS[id as AssetType].cost;
        });
        state.netWorth = state.cash + assetValue;

        await this.saveUserState(userId, state);

        // Record choice for today
        await this.context.redis.hSet('daily_choices', { [userId]: choice });

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
        try {
            const lb = new Leaderboard(this.context, 'game1_strategy');
            let username = 'Unknown CEO';
            try {
                const user = await this.context.reddit.getUserById(userId);
                if (user) username = user.username;
            } catch (e) { }
            await lb.submitScore(userId, username, state.netWorth);
        } catch (e) { }

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
        const choice = await this.context.redis.hGet('daily_choices', userId);
        return choice || null;
    }

    async getLeaderboard() {
        const lb = new Leaderboard(this.context, 'game1_strategy');
        return lb.getTop(10);
    }
}
