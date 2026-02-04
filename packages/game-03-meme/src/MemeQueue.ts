import { RedisWrapper, ServiceProxy } from 'shared';
import { Context } from '@devvit/public-api';

const QUEUE_KEY = 'meme:generation_queue';
const MEME_DATA_KEY = 'meme:data'; // Hash of ID -> JSON string of MemePost
const LEADERBOARD_KEY = 'meme:leaderboard'; // ZSet of ID -> Score
const TIMELINE_KEY = 'meme:timeline'; // ZSet of ID -> Timestamp

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
    context: Context;

    constructor(context: Context) {
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
        await this.context.redis.rPush(QUEUE_KEY, JSON.stringify(job));
        return jobId;
    }

    async processNextJob(): Promise<void> {
        const rawJob = await this.context.redis.lPop(QUEUE_KEY);
        if (!rawJob) return;

        const job = JSON.parse(rawJob) as MemeJob;
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

            console.log(`Meme ${job.id} created and posted.`);
        } catch (e) {
            console.error("Generation Failed", e);
            // Retry logic could go here (rPush back to head)
        }
    }
}
