import { Context } from '@devvit/public-api';
import { RedisWrapper, DailyScheduler, ServiceProxy } from 'shared';

const ACTIVE_DATE_KEY = 'trivia:active_date';
const TRENDS_PREFIX = 'daily:trends:';
const ARCHIVE_KEY = 'archive:trends';
const getUtcDateKey = (date: Date = new Date()): string => {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

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
        const dateKey = getUtcDateKey();
        const trendsKey = `${TRENDS_PREFIX}${dateKey}`;
        console.log(`[trivia.ingestor] Starting daily ingestion for ${dateKey}...`);

        const existing = await this.context.redis.get(trendsKey);
        if (existing) {
            console.log(`[trivia.ingestor] ${dateKey} already ingested, skipping.`);
            await this.context.redis.set(ACTIVE_DATE_KEY, dateKey);
            return;
        }

        // 1. Archive Yesterday
        const currentDate = await this.context.redis.get(ACTIVE_DATE_KEY);
        const currentTrend = currentDate ? await this.context.redis.get(`${TRENDS_PREFIX}${currentDate}`) : null;
        if (currentTrend) {
            await this.context.redis.zAdd(ARCHIVE_KEY, { member: currentTrend, score: Date.now() });
        }

        // 2. Fetch New Trend via Proxy
        const proxy = new ServiceProxy(this.context);
        const trends = await proxy.fetchDailyTrends(2);
        const newTrend = JSON.stringify(trends);

        // 3. Update State
        await this.context.redis.set(trendsKey, newTrend);
        await this.context.redis.set(ACTIVE_DATE_KEY, dateKey);
        console.log(`[trivia.ingestor] Updated trend for ${dateKey}: ${newTrend}`);
    }
}
