import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { Theme, Leaderboard, LeaderboardUI } from 'shared';
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
        isSecret: false,
        scope: SettingScope.Installation,
    },
    {
        name: 'REPLICATE_API_TOKEN',
        label: 'Replicate API Token (Flux.1)',
        type: 'string',
        isSecret: false,
        scope: SettingScope.Installation,
    },
]);

Devvit.addMenuItem({
    label: 'Create Meme Wars Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: '🎨 Meme Wars — AI-Powered Meme Battle Arena!',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.accent} size="xlarge" weight="bold">Loading Meme Wars...</text>
                </vstack>
            ),
        });
        context.ui.showToast('Game post created!');
    },
});

Devvit.addCustomPostType({
    name: 'Meme Wars',
    render: (context) => {
        const [prompt, setPrompt] = useState('');
        const [status, setStatus] = useState<string>('Idle');
        const queue = new MemeQueue(context);


        const [feed, setFeed] = useState<any[]>([]);
        const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

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

        // Effect-like update: always sync feed when data is available
        if (data && data.posts) {
            setFeed(data.posts);
        }

        const onVote = async (memeId: string, delta: number) => {
            // Optimistic Update
            const newFeed = feed.map(p => {
                if (p.id === memeId) return { ...p, votes: (p.votes || 0) + delta };
                return p;
            });
            setFeed(newFeed);

            // 1. Update Meme Score (Local Content Leaderboard)
            await context.redis.zIncrBy('meme:leaderboard', memeId, delta);

            // 2. Credit Author (Global User Leaderboard)
            const targetMeme = feed.find(p => p.id === memeId);
            if (targetMeme?.userId) {
                const authorId = targetMeme.userId;

                // Increment Author's Cumulative Score
                // We use a separate key for tracking total meme karma
                const authorScoreKey = `user:${authorId}:meme_score`;
                const newScore = await context.redis.incrBy(authorScoreKey, delta);

                // Submit to Global Leaderboard
                const lb = new Leaderboard(context, 'game3_meme');
                let username = 'Meme Artist';
                try {
                    // Try to get username if possible, or maybe we should have stored it in MemePost?
                    // Fetching here is fine for now.
                    const u = await context.reddit.getUserById(authorId);
                    if (u) username = u.username;
                } catch (e) { }

                await lb.submitScore(authorId, username, newScore);
            }
        };

        const SUBMIT_COOLDOWN_MS = 30_000; // 30-second cooldown

        const onSubmit = async () => {
            if (!prompt) return;

            const now = Date.now();
            if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
                const remaining = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
                setStatus(`Cooldown: wait ${remaining}s before submitting again.`);
                return;
            }

            setStatus('Queueing...');
            const jobId = await queue.enqueueJob(context.userId || 'anon', prompt);
            setLastSubmitTime(Date.now());
            setStatus(`Queued! ID: ${jobId}`);
            setPrompt('');
            // Trigger background processing immediately if local dev or quick test
            // (In prod, scheduler picks it up)
        };

        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const lb = new Leaderboard(context, 'game3_meme');
            const data = await lb.getTop(10);
            setLeaderboardData(data);
            setLbLoading(false);
        };

        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="MEME LORDS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                    scoreLabel="karma"
                    currentUserId={context.userId}
                />
            );
        }

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                {/* Header */}
                <vstack alignment="center middle" padding="medium">
                    <hstack alignment="space-between middle" width="100%">
                        <spacer />
                        <vstack alignment="center middle">
                            <text style="heading" color={Theme.colors.primary} size="xxlarge" weight="bold">MEME WARS</text>
                            <text color={Theme.colors.textDim}>Flux.1 AI Meme Generator</text>
                        </vstack>
                        <button appearance="plain" size="small" onPress={() => { setShowLeaderboard(true); loadLeaderboard(); }}>🏆 Top Artists</button>
                    </hstack>
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
