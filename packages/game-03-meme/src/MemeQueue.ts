import { RedisWrapper, ServiceProxy } from 'shared';

const QUEUE_KEY = 'meme:generation_queue';
const MEME_DATA_KEY = 'meme:data'; // Hash of ID -> JSON string of MemePost
const LEADERBOARD_KEY = 'meme:leaderboard'; // ZSet of ID -> Score
const TIMELINE_KEY = 'meme:timeline'; // ZSet of ID -> Timestamp
const RETRY_KEY = 'meme:retry_count'; // Hash of jobId -> retry count
const DEAD_LETTER_KEY = 'meme:dead_letter'; // List of failed jobs
const STATUS_KEY = 'meme:job_status'; // Hash of jobId -> status string

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000]; // Exponential backoff

export interface MemeJob {
    id: string;
    userId: string;
    prompt: string;
    timestamp: number;
}

export interface MemePost {
    id: string;
    userId: string;
    prompt: string;
    url: string;
    votes: number;
    timestamp: number;
}

export class MemeQueue {
    redis: RedisWrapper;
    context: any;

    constructor(context: any) {
        this.redis = new RedisWrapper(context.redis);
        this.context = context;
    }

    async enqueueJob(userId: string, prompt: string): Promise<string> {
        const jobId = Math.random().toString(36).substring(7);
        const job: MemeJob = {
            id: jobId,
            userId,
            prompt,
            timestamp: Date.now(),
        };
        await (this.context.redis as any).rPush(QUEUE_KEY, JSON.stringify(job));
        await this.context.redis.hSet(STATUS_KEY, { [jobId]: 'queued' });
        return jobId;
    }

    /** Get job status for user feedback */
    async getJobStatus(jobId: string): Promise<string> {
        const status = await this.context.redis.hGet(STATUS_KEY, jobId);
        return status || 'unknown';
    }

    async processNextJob(): Promise<void> {
        const rawJob = await (this.context.redis as any).lPop(QUEUE_KEY);
        if (!rawJob) return;

        const job = JSON.parse(rawJob) as MemeJob;
        console.log(`Processing Meme Job ${job.id} for ${job.userId}`);
        await this.context.redis.hSet(STATUS_KEY, { [job.id]: 'generating' });

        try {
            const proxy = new ServiceProxy(this.context);
            const imageUrl = await proxy.generateImage(job.prompt, job.id);

            // Check if we got a placeholder (fallback) — treat as soft failure
            const isPlaceholder = imageUrl.includes('placehold.co');
            if (isPlaceholder) {
                console.warn(`Meme ${job.id} got placeholder — may retry`);
            }

            const post: MemePost = {
                id: job.id,
                userId: job.userId,
                prompt: job.prompt,
                url: imageUrl,
                votes: 0,
                timestamp: Date.now()
            };

            await this.context.redis.hSet(MEME_DATA_KEY, { [job.id]: JSON.stringify(post) });
            await this.context.redis.zAdd(LEADERBOARD_KEY, { member: job.id, score: 0 });
            await this.context.redis.zAdd(TIMELINE_KEY, { member: job.id, score: post.timestamp });
            await this.context.redis.hSet(STATUS_KEY, { [job.id]: 'complete' });

            console.log(`Meme ${job.id} created and posted.`);
        } catch (e) {
            console.error(`Generation Failed for ${job.id}:`, e);

            // Retry logic with exponential backoff
            const retryRaw = await this.context.redis.hGet(RETRY_KEY, job.id);
            const retryCount = retryRaw ? parseInt(retryRaw, 10) : 0;

            if (retryCount < MAX_RETRIES) {
                const nextRetry = retryCount + 1;
                await this.context.redis.hSet(RETRY_KEY, { [job.id]: String(nextRetry) });
                await this.context.redis.hSet(STATUS_KEY, { [job.id]: `retry ${nextRetry}/${MAX_RETRIES}` });

                // Re-enqueue the job
                await (this.context.redis as any).rPush(QUEUE_KEY, JSON.stringify(job));

                // Schedule retry with delay
                const delay = RETRY_DELAYS[retryCount] || 8000;
                try {
                    await this.context.scheduler.runJob({
                        name: 'process_queue',
                        runAt: new Date(Date.now() + delay),
                    });
                } catch (schedErr) {
                    console.error('Failed to schedule retry:', schedErr);
                }

                console.log(`Meme ${job.id} queued for retry ${nextRetry}/${MAX_RETRIES} in ${delay}ms`);
            } else {
                // Move to dead letter queue
                await (this.context.redis as any).rPush(DEAD_LETTER_KEY, JSON.stringify({
                    ...job,
                    error: String(e),
                    failedAt: Date.now(),
                    retries: retryCount,
                }));
                await this.context.redis.hSet(STATUS_KEY, { [job.id]: 'failed' });
                console.error(`Meme ${job.id} permanently failed after ${MAX_RETRIES} retries`);
            }
        }
    }
}
