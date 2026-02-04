import { Context } from '@devvit/public-api';
import { RedisWrapper, DailyScheduler, ServiceProxy } from 'shared';

const TREND_A_KEY = 'daily_trend_a';
const TREND_B_KEY = 'daily_trend_b';
const TRENDS_KEY = 'daily:trends';
const ARCHIVE_KEY = 'archive:trends';

export class TrendIngestor {
    redis: RedisWrapper;
    scheduler: DailyScheduler;
    context: Context;

    constructor(context: Context) {
        this.redis = new RedisWrapper(context.redis);
        this.scheduler = new DailyScheduler(context.scheduler);
        this.context = context;
    }

    /**
     * Triggered by Scheduler at 00:00 UTC.
     * Fetches trends from external API (Google Trends via Proxy or Wikipedia).
     */
    async cleanAndIngest() {
        console.log("Starting Daily Ingestion...");

        // 1. Archive Yesterday
        const currentA = await this.context.redis.get(TREND_A_KEY);
        const currentB = await this.context.redis.get(TREND_B_KEY);
        if (currentA && currentB) {
            await this.context.redis.zAdd(ARCHIVE_KEY, {
                member: JSON.stringify({ a: JSON.parse(currentA), b: JSON.parse(currentB) }),
                score: Date.now()
            });
        }

        // 2. Fetch New Trends via Proxy
        const proxy = new ServiceProxy(this.context);
        const trends = await proxy.fetchDailyTrends(2);
        const trendA = trends[0];
        const trendB = trends[1];
        if (!trendA || !trendB) {
            throw new Error('Not enough trend data returned by ServiceProxy');
        }

        // 3. Update State
        await this.context.redis.set(TREND_A_KEY, JSON.stringify(trendA));
        await this.context.redis.set(TREND_B_KEY, JSON.stringify(trendB));
        await this.context.redis.set(TRENDS_KEY, JSON.stringify(trends));
        console.log(`Updated Trends: ${trendA.query} vs ${trendB.query}`);
    }
}
