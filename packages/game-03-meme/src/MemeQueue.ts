import { RedisWrapper, ServiceProxy } from 'shared';

const QUEUE_KEY = 'meme:generation_queue';
const DEAD_LETTER_KEY = 'meme:generation_dead_letter';
const JOB_STATUS_KEY = 'meme:job_status';
const MEME_DATA_KEY = 'meme:data'; // Hash of ID -> JSON string of MemePost
const LEADERBOARD_KEY = 'meme:leaderboard'; // ZSet of ID -> Score
const TIMELINE_KEY = 'meme:timeline'; // ZSet of ID -> Timestamp
const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 30_000;

export interface MemeJob {
    id: string;
    userId: string;
    prompt: string;
    timestamp: number;
    status: 'queued' | 'processing' | 'done' | 'failed';
    attempts: number;
    lastError?: string;
    completedAt?: number;
    nextAttemptAt?: number;
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
            status: 'queued',
            attempts: 0,
        };
        await this.context.redis.hSet(JOB_STATUS_KEY, { [job.id]: JSON.stringify(job) });
        await (this.context.redis as any).rPush(QUEUE_KEY, JSON.stringify(job));
        return jobId;
    }

    async getJobStatus(jobId: string): Promise<MemeJob | null> {
        const raw = await this.context.redis.hGet(JOB_STATUS_KEY, jobId);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as MemeJob;
        } catch (e) {
            return null;
        }
    }

    async processNextJob(): Promise<void> {
        const rawJob = await (this.context.redis as any).lPop(QUEUE_KEY);
        if (!rawJob) return;

        let job: MemeJob;
        try {
            job = JSON.parse(rawJob) as MemeJob;
        } catch (e) {
            console.error('[MemeQueue] Dropping malformed queue payload', e);
            return;
        }

        job.status = 'processing';
        job.attempts = (job.attempts || 0) + 1;
        job.lastError = undefined;

        if (job.nextAttemptAt && Date.now() < job.nextAttemptAt) {
            job.status = 'queued';
            await this.context.redis.hSet(JOB_STATUS_KEY, { [job.id]: JSON.stringify(job) });
            await (this.context.redis as any).rPush(QUEUE_KEY, JSON.stringify(job));
            return;
        }

        await this.context.redis.hSet(JOB_STATUS_KEY, { [job.id]: JSON.stringify(job) });
        console.log(`Processing Meme Job ${job.id} for ${job.userId}`);

        try {
            // 2. Fetch Generation via Proxy
            const proxy = new ServiceProxy(this.context);
            const imageUrl = await proxy.generateImage(job.prompt, job.id);

            // 3. Create Meme Post Object
            const post: MemePost = {
                id: job.id,
                userId: job.userId,
                prompt: job.prompt,
                url: imageUrl,
                votes: 0,
                timestamp: Date.now()
            };

            // 4. Store Data
            // Store rich data
            await this.context.redis.hSet(MEME_DATA_KEY, { [job.id]: JSON.stringify(post) });
            // Add to Leaderboard (Score 0)
            await this.context.redis.zAdd(LEADERBOARD_KEY, { member: job.id, score: 0 });
            // Add to Timeline (Score = Timestamp)
            await this.context.redis.zAdd(TIMELINE_KEY, { member: job.id, score: post.timestamp });

            job.status = 'done';
            job.completedAt = Date.now();
            await this.context.redis.hSet(JOB_STATUS_KEY, { [job.id]: JSON.stringify(job) });
            console.log(`Meme ${job.id} created and posted.`);
        } catch (e) {
            console.error("Generation Failed", e);
            job.lastError = e instanceof Error ? e.message : String(e);
            job.status = 'failed';

            if (job.attempts < MAX_ATTEMPTS) {
                job.status = 'queued';
                job.nextAttemptAt = Date.now() + (job.attempts * RETRY_BASE_MS);
                await this.context.redis.hSet(JOB_STATUS_KEY, { [job.id]: JSON.stringify(job) });
                await (this.context.redis as any).rPush(QUEUE_KEY, JSON.stringify(job));
                console.log(`[MemeQueue] Requeued job ${job.id} attempt=${job.attempts}`);
                return;
            }

            job.completedAt = Date.now();
            await this.context.redis.hSet(JOB_STATUS_KEY, { [job.id]: JSON.stringify(job) });
            await (this.context.redis as any).rPush(DEAD_LETTER_KEY, JSON.stringify(job));
            console.log(`[MemeQueue] Job ${job.id} moved to dead-letter.`);
        }
    }
}
