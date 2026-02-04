import { Context, JobContext } from '@devvit/public-api';
import { RedisWrapper, DailyScheduler, ServiceProxy } from 'shared';
import { ASSETS, AssetType, UserState, ExecutiveAdvisor } from './types';

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
        const keys = ['cash', 'lastTick', ...Object.keys(ASSETS).map(id => `asset_${id}`)];
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
        let cash = data['cash'] || 0;

        // Lazy Evaluation: Apply pending income
        const now = Date.now();
        const elapsedHours = (now - lastTick) / 3600000;
        if (elapsedHours > 0) {
            const earned = hourlyIncome * elapsedHours;
            cash += earned;

            // Auto-save logic could go here, but strictly we might wait for a user action 
            // OR save if significant time passed. For "Robustness", we save on read to keep state fresh.
            // However, saving on every read is heavy. We'll return the projected state,
            // and only save when 'buyAsset' or specific 'sync' is called, OR if gap is large.
            // For now, let's keep it pure query unless gap > 1 min
            if (now - lastTick > 60000) {
                // Update specific fields only to avoid race conditions? 
                // RedisWrapper packs everything. We have to save all.
                // We will defer save to actions to be safe, but return computed 'current' values.
                // Actually, if we don't save, the user sees "Earned $X" but if they don't click buy, it's lost on next reload?
                // Yes, we MUST save or at least return the updated state and let the client know.
                // A better pattern: "claim" endpoint. 
                // BUT "Get Rich Lazy" implies auto.
                // Let's UPDATE the cache in memory (data object) basically conceptually,
                // but for this function, just return calculated values.
                // Real persistence happens on 'buy' or 'tick'.
            }
        }

        return {
            cash,
            lastTick: now, // We project forward to 'now'
            netWorth: cash + assetValue,
            assets: assets as Record<AssetType, number>,
        };
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
    /**
     * Unlocks a new "Executive Advisor" if net worth milestones are met.
     */
    async unlockAdvisor(userId: string): Promise < string | null > {
            const state = await this.getUserState(userId);

            // Milestones: 1M, 10M, 100M, 1B
            // Check if we need to adding slot logic or just random unlock
            const currentAdvisors = state.advisors || [];
            if(currentAdvisors.length >= 4) return null; // Max 4

            const cost = 1000000 * Math.pow(10, currentAdvisors.length);
            if(state.netWorth < cost) return null; // Not rich enough

            // Generate Advisor
            const proxy = new ServiceProxy(this.scheduler.context); // wait, need context access. 
            // We stored context in scheduler? No, we need context.
            // Quick fix: pass context to method or store in class (it is stored in scheduler but maybe public?)
            // Let's assume we can pass it or fix constructor. 
            // Actually this.scheduler.context might not be valid.
            // Let's instantiate Proxy with "this.redis.context" if available? 
            // ServiceProxy needs Context. GameStrategyServer constructed with Context.
            // We should store context in Class.
        }
    }
