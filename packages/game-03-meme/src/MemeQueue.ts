import { RedisWrapper, ServiceProxy } from 'shared';

const QUEUE_KEY = 'meme:generation_queue';   // ZSet: member=jobId, score=timestamp (FIFO)
const QUEUE_DATA_KEY = 'meme:queue_data';    // Hash: jobId -> JSON MemeJob
const MEME_DATA_KEY = 'meme:data';           // Hash: jobId -> JSON MemePost
const LEADERBOARD_KEY = 'meme:leaderboard';  // ZSet: jobId -> vote score
const TIMELINE_KEY = 'meme:timeline';        // ZSet: jobId -> timestamp
const RETRY_KEY = 'meme:retry_count';        // Hash: jobId -> retry count
const DEAD_LETTER_KEY = 'meme:dead_letter';  // Hash: jobId -> JSON failed job
const STATUS_KEY = 'meme:job_status';        // Hash: jobId -> status string

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000];

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
        await this.context.redis.hSet(QUEUE_DATA_KEY, { [jobId]: JSON.stringify(job) });
        await this.context.redis.zAdd(QUEUE_KEY, { member: jobId, score: job.timestamp });
        await this.context.redis.hSet(STATUS_KEY, { [jobId]: 'queued' });
        return jobId;
    }

    async getJobStatus(jobId: string): Promise<string> {
        const status = await this.context.redis.hGet(STATUS_KEY, jobId);
        return status || 'unknown';
    }

    async processNextJob(): Promise<void> {
        const items = await this.context.redis.zRange(QUEUE_KEY, 0, 0, { by: 'rank' });
        if (!items || items.length === 0) return;

        const jobId = items[0].member;
        await this.context.redis.zRem(QUEUE_KEY, [jobId]);

        const rawJob = await this.context.redis.hGet(QUEUE_DATA_KEY, jobId);
        if (!rawJob) return;

        const job = JSON.parse(rawJob) as MemeJob;
        console.log(`Processing Meme Job ${job.id} for ${job.userId}`);
        await this.context.redis.hSet(STATUS_KEY, { [job.id]: 'generating' });

        try {
            const proxy = new ServiceProxy(this.context);
            let imageUrl = await proxy.generateImage(job.prompt, job.id);
            console.log(`Image generated for ${job.id}: ${imageUrl.substring(0, 80)}...`);

            // Upload external image to Reddit CDN so Devvit can render it
            if (imageUrl && !imageUrl.startsWith('data:') && imageUrl.startsWith('http')) {
                try {
                    const uploaded = await this.context.media.upload({ url: imageUrl, type: 'image' });
                    if (uploaded?.mediaUrl) {
                        console.log(`Uploaded to Reddit CDN: ${uploaded.mediaUrl}`);
                        imageUrl = uploaded.mediaUrl;
                    }
                } catch (uploadErr) {
                    console.error(`Reddit CDN upload failed for ${job.id}:`, uploadErr);
                    // Keep the original URL as fallback
                }
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
            await this.context.redis.hDel(QUEUE_DATA_KEY, [jobId]);

            console.log(`Meme ${job.id} created and posted with URL: ${imageUrl.substring(0, 80)}`);
        } catch (e) {
            console.error(`Generation Failed for ${job.id}:`, e);

            const retryRaw = await this.context.redis.hGet(RETRY_KEY, job.id);
            const retryCount = retryRaw ? parseInt(retryRaw, 10) : 0;

            if (retryCount < MAX_RETRIES) {
                const nextRetry = retryCount + 1;
                await this.context.redis.hSet(RETRY_KEY, { [job.id]: String(nextRetry) });
                await this.context.redis.hSet(STATUS_KEY, { [job.id]: `retry ${nextRetry}/${MAX_RETRIES}` });
                await this.context.redis.zAdd(QUEUE_KEY, { member: job.id, score: Date.now() });

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
                await this.context.redis.hSet(DEAD_LETTER_KEY, {
                    [job.id]: JSON.stringify({
                        ...job,
                        error: String(e),
                        failedAt: Date.now(),
                        retries: retryCount,
                    })
                });
                await this.context.redis.hSet(STATUS_KEY, { [job.id]: 'failed' });
                await this.context.redis.hDel(QUEUE_DATA_KEY, [job.id]);
                console.error(`Meme ${job.id} permanently failed after ${MAX_RETRIES} retries`);
            }
        }
    }
}
