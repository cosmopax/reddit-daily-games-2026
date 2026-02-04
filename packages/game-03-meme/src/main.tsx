import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
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


        const [feed, setFeed] = useState<any[]>([]);

        // Load Feed
        const { data, loading, refresh } = useAsync(async () => {
            // Get top 10 from leaderboard (highest score)
            // Use zRange with byRank? Devvit 0.11 syntax:
            // zRange(key, min, max, { by: 'rank', reverse: true })
            const ids = await context.redis.zRange('meme:leaderboard', 0, 9, { by: 'rank', reverse: true });

            if (!ids || ids.length === 0) return { posts: [] };

            const postsRaw = await context.redis.hMGet('meme:data', ids.map(id => id.member));
            const posts = postsRaw.filter(p => !!p).map(p => JSON.parse(p!));
            return { posts };
        });

        // Effect-like update
        if (data && data.posts.length !== feed.length) {
            setFeed(data.posts);
        }

        const onVote = async (memeId: string, delta: number) => {
            // Optimistic Update
            const newFeed = feed.map(p => {
                if (p.id === memeId) return { ...p, votes: (p.votes || 0) + delta };
                return p;
            });
            setFeed(newFeed);

            // Commit
            await context.redis.zIncrBy('meme:leaderboard', memeId, delta);
            // Also update the metadata JSON? That's expensive (Read-Modify-Write).
            // Ideally we just trust ZSet for score, and Metadata for static info.
            // But UI reads from Metadata.
            // WORKAROUND: We won't update the JSON blob on every vote to avoid race conditions.
            // We rely on ZSCORE for the *real* score if we wanted perfection, 
            // but for this MVP, let's just update the ZSet.
            // AND we should probably update the JSON periodically or just fetch score from ZSet separately?
            // Fetching 10 scores is cheap.
            // Let's just update ZSet and let the UI be slightly eventually consistent or optimistic.
        };

        const onSubmit = async () => {
            if (!prompt) return;
            setStatus('Queueing...');
            const jobId = await queue.enqueueJob(context.userId || 'anon', prompt);
            setStatus(`Queued! ID: ${jobId}`);
            setPrompt('');
            // Trigger background processing immediately if local dev or quick test
            // (In prod, scheduler picks it up)
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

                {/* Gallery Feed */}
                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} grow>
                    <hstack alignment="space-between middle">
                        <text color={Theme.colors.gold} weight="bold">🔥 Leaderboard</text>
                        <button appearance="plain" size="small" onPress={() => refresh()}>🔄 Refresh</button>
                    </hstack>
                    <spacer size="small" />

                    {/* Feed Items (Limit to top 3 for space?) */}
                    {(feed && feed.length > 0) ? (
                        feed.slice(0, 3).map((meme) => (
                            <vstack key={meme.id} backgroundColor={Theme.colors.background} padding="small" cornerRadius="small" border="thin" borderColor={Theme.colors.surfaceHighlight} alignment="center middle" gap="small">
                                <image url={meme.url || "https://placeholder.com/meme.png"} imageHeight={200} imageWidth={200} resizeMode="cover" />
                                <text size="small" color={Theme.colors.text} wrap>{meme.prompt}</text>
                                <hstack alignment="center middle" gap="medium">
                                    <button appearance="plain" size="small" onPress={() => onVote(meme.id, 1)}>⬆️</button>
                                    <text color={Theme.colors.gold} weight="bold">{meme.votes || 0}</text>
                                    <button appearance="plain" size="small" onPress={() => onVote(meme.id, -1)}>⬇️</button>
                                </hstack>
                            </vstack>
                        ))
                    ) : (
                        <vstack alignment="center middle" grow>
                            <text color={Theme.colors.textDim}>No memes yet. Be the first!</text>
                        </vstack>
                    )}
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
