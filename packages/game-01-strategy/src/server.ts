import { Context, JobContext } from '@devvit/public-api';
import { RedisWrapper, DailyScheduler } from 'shared';
import { ASSETS, AssetType, UserState } from './types';

const USER_KEY_PREFIX = 'user:v1:';

export class GameStrategyServer {
    redis: RedisWrapper;
    scheduler: DailyScheduler;

    constructor(context: Context | JobContext) {
        this.redis = new RedisWrapper(context.redis);
        this.scheduler = new DailyScheduler(context.scheduler);
    }

    private getUserKey(userId: string): string {
        return `${USER_KEY_PREFIX}${userId}`;
    }

    async getUserState(userId: string): Promise<UserState> {
        // Rehydrate from Redis using our optimized wrapper
        // We expect keys like: cash, lastTick, asset_lemonade_stand, ...
        const keys = ['cash', 'lastTick', ...Object.keys(ASSETS).map(id => `asset_${id}`)];
        const data = await this.redis.getPackedState(this.getUserKey(userId), 'state', keys);

        const assets: Record<string, number> = {};
        Object.keys(ASSETS).forEach(id => {
            assets[id] = data[`asset_${id}`] || 0;
        });

        return {
            cash: data['cash'] || 0,
            lastTick: data['lastTick'] || Date.now(),
            netWorth: 0, // Calculated dynamically
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

    async buyAsset(userId: string, assetType: AssetType): Promise<boolean> {
        const config = ASSETS[assetType];
        const state = await this.getUserState(userId);

        if (state.cash >= config.cost) {
            state.cash -= config.cost;
            state.assets[assetType] = (state.assets[assetType] || 0) + 1;
            await this.saveUserState(userId, state);
            return true;
        }
        return false;
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
}
