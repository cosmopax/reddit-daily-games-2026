import { Context } from '@devvit/public-api';
import { RedisWrapper } from './RedisWrapper';

export interface LeaderboardEntry {
    userId: string;
    username: string; // Stored if available
    score: number;    // NetWorth or Wins
    avatarUrl?: string; // For the visual flair
}

export class Leaderboard {
    context: Context;
    redis: RedisWrapper;
    gameId: string;

    constructor(context: Context, gameId: string) {
        this.context = context;
        this.redis = new RedisWrapper(context.redis);
        this.gameId = gameId; // 'game1', 'game2', etc.
    }

    private getKey(): string {
        return `global:leaderboard:${this.gameId}`;
    }

    /** Public accessor for the leaderboard ZSET key */
    getLeaderboardKey(): string {
        return this.getKey();
    }

    /**
     * Submit a score. Uses ZADD.
     * Also stores metadata in a separate Hash if needed, but for Hackathon we might just pack it
     * into the member value string (e.g. "username|avatarUrl|userId") if we want atomic zset retrieval?
     * Or better: ZSET stores score + userId. A separate Hash stores user profiles.
     */
    async submitScore(userId: string, username: string, score: number, avatarUrl?: string): Promise<void> {
        // 1. Update Score in ZSET
        await this.context.redis.zAdd(this.getKey(), { member: userId, score: score });

        // 2. Update Profile Metadata (Hash)
        const profileKey = `global:profile:${userId}`;
        const profile = {
            username,
            avatarUrl: avatarUrl || '',
            lastSeen: Date.now().toString()
        };
        await this.context.redis.hSet(profileKey, profile);
    }

    /**
     * Get top N players with their metadata.
     */
    async getTop(limit: number = 10): Promise<LeaderboardEntry[]> {
        // 1. Get Top IDs from ZSET (Reverse for High Score)
        const range = await this.context.redis.zRange(this.getKey(), 0, limit - 1, { by: 'rank', reverse: true });

        const results: LeaderboardEntry[] = [];

        // 2. Hydrate with Profile Data
        for (const item of range) {
            const userId = item.member;
            const score = item.score;

            const profileKey = `global:profile:${userId}`;
            const profile = await this.context.redis.hGetAll(profileKey);

            results.push({
                userId,
                username: profile?.username || 'Anon',
                score,
                avatarUrl: profile?.avatarUrl
            });
        }

        return results;
    }
}
