import { RedisClient } from '@devvit/public-api';

export class RedisWrapper {
    private redis: RedisClient;

    constructor(redis: RedisClient) {
        this.redis = redis;
    }

    /**
     * Packs two 32-bit integers into a single 64-bit number (simulated as string for Redis)
     * or a byte array if supported. 
     * For simplicity here, we assume storing efficient strings or using HSETs effectively.
     * Real bit-packing in JS/TS often uses DataView/ArrayBuffer.
     */
    async savePackedState(key: string, field: string, data: Record<string, number>): Promise<void> {
        // Example: Pack inventory {gold: 100, wood: 50} -> "100:50" or similar compact format
        // or use Buffer.from(...) if Devvit supports binary strings.
        // For this hackathon, we'll strict to minimized JSON or delimited strings.
        const packed = Object.values(data).join(':');
        await this.redis.hSet(key, { [field]: packed });
    }

    async getPackedState(key: string, field: string, keys: string[]): Promise<Record<string, number>> {
        const val = await this.redis.hGet(key, field);
        if (!val) return {};
        const values = val.split(':').map(Number);
        const result: Record<string, number> = {};
        keys.forEach((k, i) => {
            result[k] = values[i] || 0;
        });
        return result;
    }

    /**
     * Optimized Increment using HINCRBY
     */
    async increment(key: string, field: string, amount: number): Promise<number> {
        return await this.redis.hIncrBy(key, field, amount);
    }

    /**
     * ZSET wrapper for Leaderboards (Space Efficient)
     */
    async updateLeaderboard(boardKey: string, member: string, score: number): Promise<number> {
        return await this.redis.zAdd(boardKey, { member, score });
    }
}

