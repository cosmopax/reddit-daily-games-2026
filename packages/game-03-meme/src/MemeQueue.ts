import { RedisWrapper } from 'shared';
import { Context } from '@devvit/public-api';

const QUEUE_KEY = 'meme:generation_queue';
const RESULTS_KEY = 'meme:results';

export interface MemeJob {
    id: string;
    userId: string;
    prompt: string;
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

            // Store Result
            await this.context.redis.hSet(RESULTS_KEY, { [job.id]: imageUrl });
        } catch (e) {
            console.error("Generation Failed", e);
            // Retry logic could go here (rPush back to head)
        }
    }
}
