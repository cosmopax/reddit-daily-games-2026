import { Devvit, useState, SettingScope } from '@devvit/public-api';
import { Theme } from 'shared';
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

// App settings for API keys
Devvit.addSettings([
    {
        name: 'HUGGINGFACE_TOKEN',
        label: 'Hugging Face API Token',
        type: 'string',
        isSecret: true,
        scope: SettingScope.App,
    },
]);

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
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                {/* Header */}
                <vstack alignment="center middle" padding="medium">
                    <text style="heading" color={Theme.colors.primary} size="xxlarge" weight="bold">MEME WARS</text>
                    <text color={Theme.colors.textDim}>Flux.1 AI Meme Generator</text>
                </vstack>

                <spacer size="medium" />

                {/* Input Area */}
                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight}>
                    <text color={Theme.colors.text} weight="bold">Create New Meme</text>
                    <spacer size="small" />
                    <hstack>
                        <textfield placeholder="A cyberpunk cat..." onChange={(v) => setPrompt(v)} />
                        <button onPress={onSubmit} appearance="primary">Generate</button>
                    </hstack>
                    <text color={Theme.colors.secondary} size="small">{status}</text>
                </vstack>

                <spacer size="medium" />

                {/* Gallery Feed using Grid-like layout */}
                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} grow>
                    <hstack alignment="space-between middle">
                        <text color={Theme.colors.gold} weight="bold">🔥 Live Feed</text>
                        <text color={Theme.colors.textDim} size="small">Updates every 60s</text>
                    </hstack>
                    <spacer size="small" />

                    {/* Placeholder Grid Item */}
                    <vstack backgroundColor={Theme.colors.background} padding="small" cornerRadius="small" border="thin" borderColor={Theme.colors.surfaceHighlight} alignment="center middle">
                        <image url="https://placeholder.com/meme.png" imageHeight={200} imageWidth={200} resizeMode="cover" />
                        <spacer size="small" />
                        <hstack alignment="center middle" gap="medium">
                            <button appearance="plain" size="small">⬆️ 42</button>
                            <button appearance="plain" size="small">⬇️ 12</button>
                        </hstack>
                    </vstack>
                </vstack>

                {/* Brand Footer */}
                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
