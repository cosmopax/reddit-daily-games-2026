export class RedisWrapper {
    private redis: any;

    constructor(redis: any) {
        this.redis = redis;
    }

    /**
     * Packs two 32-bit integers into a single 64-bit number (simulated as string for Redis)
     * or a byte array if supported. 
     * For simplicity here, we assume storing efficient strings or using HSETs effectively.
     * Real bit-packing in JS/TS often uses DataView/ArrayBuffer.
     */
    async savePackedState(key: string, field: string, data: Record<string, number | string>): Promise<void> {
        const packed = JSON.stringify(data);
        await this.redis.hSet(key, { [field]: packed });
    }

    async getPackedState(key: string, field: string, keys: string[]): Promise<Record<string, number | string>> {
        const val = await this.redis.hGet(key, field);
        if (!val) return {};
        try {
            return JSON.parse(val);
        } catch {
            // Fallback: legacy colon-delimited format
            const values = val.split(':').map(Number);
            const result: Record<string, number> = {};
            keys.forEach((k, i) => {
                result[k] = values[i] || 0;
            });
            return result;
        }
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
