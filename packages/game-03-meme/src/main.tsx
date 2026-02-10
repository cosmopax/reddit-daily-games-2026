import { Devvit, useState, useAsync, useForm, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { Theme, Leaderboard, LeaderboardUI, NarrativeHeader, MEME_LORD, CharacterPanel } from 'shared';
import { MemeQueue } from './MemeQueue';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

Devvit.addSchedulerJob({
    name: 'process_queue',
    onRun: async (_event, context) => {
        const queue = new MemeQueue(context);
        await queue.processNextJob();
    },
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
            title: '🎨 Meme Wars — Enter the AI Meme Arena!',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color={Theme.narrative.goldHighlight} size="xlarge" weight="bold">MEME ARENA LOADING...</text>
                    <text color={Theme.colors.textDim} size="small">Preparing the battleground...</text>
                </vstack>
            ),
        });
        context.ui.showToast('Game post created!');
    },
});

Devvit.addCustomPostType({
    name: 'Meme Wars',
    height: 'tall',
    render: (context) => {
        const [status, setStatus] = useState<string>('Ready to create');
        const queue = new MemeQueue(context);

        const [feed, setFeed] = useState<any[]>([]);
        const [refreshNonce, setRefreshNonce] = useState<number>(0);
        const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
        const [mySubmissions, setMySubmissions] = useState<string[]>([]);

        const SUBMIT_COOLDOWN_MS = 30_000;

        const promptForm = useForm(
            {
                fields: [{ type: 'string' as const, name: 'prompt', label: 'Meme Concept', placeholder: 'A cyberpunk cat ruling Wall Street...' }],
                title: '⚔️ Forge Your Meme',
                acceptLabel: 'ENTER THE ARENA!'
            },
            async (values) => {
                if (!values.prompt) return;
                const now = Date.now();
                if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
                    const remaining = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
                    setStatus(`Cooldown: ${remaining}s`);
                    return;
                }
                setStatus('⚡ Forging your meme...');
                const jobId = await queue.enqueueJob(context.userId || 'anon', values.prompt);
                // Trigger the scheduler to process the queue
                try {
                    await context.scheduler.runJob({ name: 'process_queue', runAt: new Date(Date.now() + 2000) });
                } catch (e) {
                    console.error('Failed to schedule process_queue:', e);
                }
                setLastSubmitTime(Date.now());
                setMySubmissions(prev => [...prev, values.prompt!]);
                setStatus(`Queued! Generating image... tap 🔄 in ~30s`);
            }
        );

        const loadFeed = async () => {
            const ids = await context.redis.zRange('meme:leaderboard', 0, 9, { by: 'rank', reverse: true });
            if (!ids || ids.length === 0) return { posts: [] };
            const postsRaw = await context.redis.hMGet('meme:data', ids.map(id => id.member));
            const posts = postsRaw.filter(p => !!p).map(p => JSON.parse(p!));
            return { posts };
        };

        // Load feed and sync to local state only when async call completes.
        const { loading } = useAsync(loadFeed, {
            depends: refreshNonce,
            finally: (data) => {
                setFeed((data as any)?.posts || []);
            },
        });

        const refreshFeed = async () => {
            setRefreshNonce((prev) => prev + 1);
        };

        const onVote = async (memeId: string, delta: number) => {
            const newFeed = feed.map(p => {
                if (p.id === memeId) return { ...p, votes: (p.votes || 0) + delta };
                return p;
            });
            setFeed(newFeed);

            await context.redis.zIncrBy('meme:leaderboard', memeId, delta);

            const targetMeme = feed.find(p => p.id === memeId);
            if (targetMeme?.userId) {
                const authorId = targetMeme.userId;
                const authorScoreKey = `user:${authorId}:meme_score`;
                const newScore = await context.redis.incrBy(authorScoreKey, delta);
                const lb = new Leaderboard(context, 'game3_meme');
                let username = 'Meme Artist';
                try {
                    const u = await context.reddit.getUserById(authorId);
                    if (u) username = u.username;
                } catch (e) { }
                await lb.submitScore(authorId, username, newScore);
            }
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
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                {/* Header */}
                <NarrativeHeader
                    title="MEME WARS"
                    subtitle="AI Meme Arena"
                    accentColor={MEME_LORD.accentColor}
                    onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    leaderboardLabel="👑 Lords"
                />

                {/* Arena Master */}
                <CharacterPanel
                    character={MEME_LORD}
                    dialogue="The crowd awaits. Forge your creation and let them judge."
                    compact={true}
                />

                {/* Create Section */}
                <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} border="thin" borderColor={MEME_LORD.accentColor}>
                    <hstack alignment="space-between middle">
                        <vstack>
                            <text color={Theme.colors.text} weight="bold" size="small">⚔️ Enter the Arena</text>
                            <text color={Theme.colors.textDim} size="xsmall">{status}</text>
                        </vstack>
                        <button onPress={() => context.ui.showForm(promptForm)} appearance="primary" size="small">Create Meme</button>
                    </hstack>
                </vstack>

                {/* Your Pending Submissions */}
                {mySubmissions.length > 0 && (
                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.success}>
                        <text color={Theme.colors.success} weight="bold" size="small">Your Submissions (generating...)</text>
                        {mySubmissions.map((prompt, i) => (
                            <text key={`sub-${i}`} size="xsmall" color={Theme.colors.textDim} wrap>• {prompt}</text>
                        ))}
                        <text size="xsmall" color={Theme.colors.textDim}>Tap 🔄 below to check if ready</text>
                    </vstack>
                )}

                <spacer size="small" />

                {/* Gallery Feed */}
                <vstack cornerRadius="small" backgroundColor={Theme.colors.surface} grow padding="small">
                    <hstack alignment="space-between middle">
                        <text color={Theme.narrative.goldHighlight} weight="bold" size="small">🏆 ARENA COMBATANTS</text>
                        <button appearance="plain" size="small" onPress={() => refreshFeed()}>🔄</button>
                    </hstack>
                    <spacer size="small" />

                    {(feed && feed.length > 0) ? (
                        feed.slice(0, 4).map((meme) => (
                            <hstack
                                key={meme.id}
                                backgroundColor={Theme.colors.background}
                                padding="small"
                                cornerRadius="small"
                                border="thin"
                                borderColor={Theme.colors.surfaceHighlight}
                                alignment="center middle"
                                gap="small"
                            >
                                <image url={meme.url || "https://placehold.co/64x64/1A1A1B/FF4500?text=MEME"} imageHeight={64} imageWidth={64} resizeMode="cover" />
                                <vstack grow>
                                    <text size="small" color={Theme.colors.text} wrap>{meme.prompt}</text>
                                </vstack>
                                <vstack alignment="center middle" gap="small">
                                    <button appearance="plain" size="small" onPress={() => onVote(meme.id, 1)}>⬆️</button>
                                    <text color={Theme.narrative.goldHighlight} weight="bold" size="small">{meme.votes || 0}</text>
                                    <button appearance="plain" size="small" onPress={() => onVote(meme.id, -1)}>⬇️</button>
                                </vstack>
                            </hstack>
                        ))
                    ) : (
                        <vstack alignment="center middle" grow>
                            <text color={Theme.colors.textDim} size="small">The arena is empty. Be the first to enter!</text>
                        </vstack>
                    )}
                </vstack>

                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
