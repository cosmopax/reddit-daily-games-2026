import { Context } from '@devvit/public-api';
import { RedisWrapper, DailyScheduler, ServiceProxy } from 'shared';

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
        const currentTrend = await this.context.redis.get(TRENDS_KEY);
        if (currentTrend) {
            await this.context.redis.zAdd(ARCHIVE_KEY, { member: currentTrend, score: Date.now() });
        }

        // 2. Fetch New Trend via Proxy
        const proxy = new ServiceProxy(this.context);
        const trends = await proxy.fetchDailyTrends(2);
        const newTrend = JSON.stringify(trends);

        // 3. Update State
        await this.context.redis.set(TRENDS_KEY, newTrend);
        console.log(`Updated Trend: ${newTrend}`);
    }
}
