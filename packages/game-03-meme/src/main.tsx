import { Devvit, useState } from '@devvit/public-api';
import { MemeQueue } from './MemeQueue';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
    scheduler: {
        process_queue: async (event, context) => {
            const queue = new MemeQueue(context);
            await queue.processNextJob();
        }
    }
});

Devvit.addCustomPostType({
    name: 'Meme Wars',
    render: (context) => {
        const [prompt, setPrompt] = useState('');
        const [status, setStatus] = useState<string>('Idle');
        const queue = new MemeQueue(context);

        const onSubmit = async () => {
            if (!prompt) return;
            setStatus('Queueing...');
            const jobId = await queue.enqueueJob(context.userId || 'anon', prompt);
            setStatus(`Queued! ID: ${jobId}`);
            setPrompt('');
        };

        return (
            <vstack height="100%" width="100%" backgroundColor="#FF4500" padding="medium">
                <text style="heading" color="#FFFFFF">MEME WARS 2026</text>
                <text color="#FFFFFF">Enter your prompt for Flux.1:</text>
                <hstack>
                    <textfield placeholder="A cyberpunk cat..." onChange={(v) => setPrompt(v)} />
                    <button onPress={onSubmit}>Generate</button>
                </hstack>
                <text color="#FFFF00">{status}</text>

                {/* Gallery Placeholder */}
                <vstack padding="small" backgroundColor="#000000" cornerRadius="small">
                    <text color="#FFFFFF">Live Feed (Updates every minute)</text>
                    <image url="https://placeholder.com/meme.png" imageHeight={200} imageWidth={200} />
                </vstack>
            </vstack>
        );
    },
});

export default Devvit;
