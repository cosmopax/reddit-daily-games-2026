export class DailyScheduler {
    private scheduler: any;

    constructor(scheduler: any) {
        this.scheduler = scheduler;
    }

    /**
     * Schedule the next 'tick' of a long-running process.
     * This is used to break down heavy daily maintenance into chunks < 30s.
     * @param jobName The name of the job handler to trigger
     * @param data The payload, typically containing a cursor or shard ID
     * @param delaySeconds How long to wait before running (default 0 for immediate continuation)
     */
    async scheduleNextTick(jobName: string, data: Record<string, any>, delaySeconds: number = 0): Promise<string> {
        const runAt = new Date(Date.now() + delaySeconds * 1000);
        // Devvit runJob returns a job usage or Id.
        return await this.scheduler.runJob({
            name: jobName,
            data: data,
            runAt: runAt,
        });
    }

    /**
     * Cancel a pending job if needed
     */
    async cancelJob(jobId: string): Promise<void> {
        await this.scheduler.cancelJob(jobId);
    }
}
