import { Devvit, useState, useAsync, useForm, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { Theme, Leaderboard, LeaderboardUI, NarrativeHeader, MEME_LORD, CharacterPanel, SplashScreen } from 'shared';
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
        isSecret: true,
        scope: SettingScope.App,
    },
    {
        name: 'REPLICATE_API_TOKEN',
        label: 'Replicate API Token (Flux.1)',
        type: 'string',
        isSecret: true,
        scope: SettingScope.App,
    },
]);

// Daily themes rotate automatically
const DAILY_THEMES = [
    { name: 'Cyberpunk Chaos', prompt: 'cyberpunk neon dystopia style', emoji: '🌃' },
    { name: 'Nature Strikes Back', prompt: 'nature reclaiming technology style', emoji: '🌿' },
    { name: 'Retro Pixel', prompt: 'retro pixel art 8-bit style', emoji: '👾' },
    { name: 'Oil Painting Masters', prompt: 'classical oil painting renaissance style', emoji: '🎨' },
    { name: 'Cosmic Horror', prompt: 'cosmic horror lovecraftian style', emoji: '🌌' },
    { name: 'Wholesome Vibes', prompt: 'wholesome heartwarming kawaii style', emoji: '💖' },
    { name: 'Street Art', prompt: 'urban street art graffiti banksy style', emoji: '🎭' },
];

function getDailyTheme(): typeof DAILY_THEMES[0] {
    const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_THEMES.length;
    return DAILY_THEMES[dayIndex];
}

const STYLE_OPTIONS = [
    { label: 'Cyberpunk', suffix: ', cyberpunk neon aesthetic, dark futuristic' },
    { label: 'Oil Painting', suffix: ', classical oil painting style, rich colors' },
    { label: 'Neon Pop', suffix: ', neon pop art style, vibrant colors, bold' },
    { label: 'Photorealistic', suffix: ', photorealistic, 8k, cinematic lighting' },
    { label: 'Anime', suffix: ', anime style, detailed illustration, manga' },
    { label: 'Pixel Art', suffix: ', pixel art retro 8-bit style' },
];

Devvit.addMenuItem({
    label: 'Create Meme Wars Post',
    location: ['subreddit', 'post'],
    forUserType: 'moderator',
    onPress: async (_event, context) => {
        try {
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
        } catch (e) {
            console.error('Failed to create Meme Wars post:', e);
            context.ui.showToast('Failed to create post. Check app logs.');
        }
    },
});

Devvit.addCustomPostType({
    name: 'Meme Wars',
    height: 'tall',
    render: (context) => {
        const [showSplash, setShowSplash] = useState(true);
        const [status, setStatus] = useState<string>('Ready to create');
        const [selectedStyle, setSelectedStyle] = useState<number>(0);
        const queue = new MemeQueue(context);

        const [feed, setFeed] = useState<any[]>([]);
        const [refreshNonce, setRefreshNonce] = useState<number>(0);
        const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
        const [mySubmissions, setMySubmissions] = useState<string[]>([]);
        const [feedView, setFeedView] = useState<'hot' | 'new'>('hot');

        const SUBMIT_COOLDOWN_MS = 30_000;
        const dailyTheme = getDailyTheme();

        const promptForm = useForm(
            {
                fields: [
                    { type: 'string' as const, name: 'prompt', label: 'Meme Concept', placeholder: 'A cyberpunk cat ruling Wall Street...' },
                    {
                        type: 'select' as const, name: 'style', label: 'Art Style',
                        options: STYLE_OPTIONS.map((s, i) => ({ label: s.label, value: String(i) })),
                        defaultValue: ['0'],
                    },
                    {
                        type: 'boolean' as const, name: 'useTheme', label: `Use daily theme: ${dailyTheme.emoji} ${dailyTheme.name}`,
                        defaultValue: false,
                    },
                ],
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

                // Build full prompt with style and optional daily theme
                const styleIdx = Number(values.style?.[0] || '0');
                const style = STYLE_OPTIONS[styleIdx] || STYLE_OPTIONS[0];
                let fullPrompt = values.prompt + style.suffix;
                if (values.useTheme) {
                    fullPrompt += `, ${dailyTheme.prompt}`;
                }

                setStatus('⚡ Forging your meme...');
                const jobId = await queue.enqueueJob(context.userId || 'anon', fullPrompt);

                // Track if using daily theme for bonus
                if (values.useTheme) {
                    await context.redis.hSet('meme:theme_submissions', { [jobId]: dailyTheme.name });
                }

                try {
                    await context.scheduler.runJob({ name: 'process_queue', runAt: new Date(Date.now() + 2000) });
                } catch (e) {
                    console.error('Failed to schedule process_queue:', e);
                    setStatus('Queued but scheduler failed — tap 🔄 to check later');
                }
                setLastSubmitTime(Date.now());
                setMySubmissions(prev => [...prev, values.prompt!]);
                setStatus(`Forging with ${style.label} style... tap 🔄 in ~30s`);
            }
        );

        const loadFeed = async () => {
            try {
                return await Promise.race([
                    (async () => {
                        const ids = await context.redis.zRange('meme:leaderboard', 0, 9, { by: 'rank', reverse: true });
                        if (!ids || ids.length === 0) return { posts: [] };
                        const postsRaw = await context.redis.hMGet('meme:data', ids.map(id => id.member));
                        const posts = postsRaw.filter(p => !!p).map(p => { try { return JSON.parse(p!); } catch { return null; } }).filter(Boolean);
                        return { posts };
                    })(),
                    new Promise<{ posts: any[] }>((resolve) =>
                        setTimeout(() => resolve({ posts: [] }), 10000)
                    ),
                ]);
            } catch (e) {
                console.error('Failed to load meme feed:', e);
                return { posts: [] };
            }
        };

        const { loading } = useAsync(loadFeed, {
            depends: refreshNonce,
            finally: (data) => {
                setFeed((data as any)?.posts || []);
            },
        });

        const refreshFeed = async () => {
            // Also poll status of last submitted job
            if (mySubmissions.length > 0) {
                try {
                    const jobs = await context.redis.hGetAll('meme:job_status');
                    if (jobs) {
                        const anyComplete = Object.values(jobs).some(s => s === 'complete');
                        const anyFailed = Object.values(jobs).some(s => s === 'failed');
                        if (anyComplete) {
                            setStatus('Your meme is in the arena!');
                            setMySubmissions([]);
                        } else if (anyFailed) {
                            setStatus('Generation failed — try again with a different prompt');
                        }
                    }
                } catch (e) { /* polling is best-effort */ }
            }
            setRefreshNonce((prev) => prev + 1);
        };

        const onVote = async (memeId: string, delta: number) => {
            // Optimistic UI update
            const newFeed = feed.map(p => {
                if (p.id === memeId) return { ...p, votes: (p.votes || 0) + delta };
                return p;
            });
            setFeed(newFeed);

            try {
                await context.redis.zIncrBy('meme:leaderboard', memeId, delta);
                await context.redis.incrBy(`user:${context.userId}:vote_count`, 1);

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
            } catch (e) {
                console.error('Vote failed:', e);
                context.ui.showToast('Vote failed — try again');
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

        // ─── SPLASH SCREEN ───────────────────────
        if (showSplash) {
            return <SplashScreen gameKey="meme" onDone={() => setShowSplash(false)} />;
        }

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

                {/* Daily Theme Banner */}
                <hstack padding="small" cornerRadius="small" backgroundColor="#1A1A0A" border="thin" borderColor={Theme.colors.gold} alignment="center middle" gap="small">
                    <text size="small" color={Theme.colors.gold} weight="bold">{dailyTheme.emoji} DAILY THEME:</text>
                    <text size="small" color={Theme.colors.gold}>{dailyTheme.name}</text>
                    <spacer grow />
                    <text size="xsmall" color={Theme.colors.textDim}>+2x votes!</text>
                </hstack>

                {/* Create Section */}
                <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} border="thin" borderColor={MEME_LORD.accentColor}>
                    <hstack alignment="space-between middle">
                        <vstack>
                            <text color={Theme.colors.text} weight="bold" size="small">⚔️ Forge Your Creation</text>
                            <text color={Theme.colors.textDim} size="xsmall">{status}</text>
                        </vstack>
                        <button onPress={() => context.ui.showForm(promptForm)} appearance="primary" size="small">Create Meme</button>
                    </hstack>
                </vstack>

                {/* Your Pending Submissions */}
                {mySubmissions.length > 0 && (
                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.success}>
                        <text color={Theme.colors.success} weight="bold" size="small">Your Creations (generating...)</text>
                        {mySubmissions.map((prompt, i) => (
                            <text key={`sub-${i}`} size="xsmall" color={Theme.colors.textDim} wrap>⚡ {prompt}</text>
                        ))}
                        <text size="xsmall" color={Theme.colors.textDim}>Tap 🔄 below to check if ready</text>
                    </vstack>
                )}

                <spacer size="small" />

                {/* Gallery Feed */}
                <vstack cornerRadius="small" backgroundColor={Theme.colors.surface} grow padding="small">
                    <hstack alignment="space-between middle">
                        <hstack gap="small">
                            <button
                                appearance={feedView === 'hot' ? 'primary' : 'plain'}
                                size="small"
                                onPress={() => setFeedView('hot')}
                            >🔥 Hot</button>
                            <button
                                appearance={feedView === 'new' ? 'primary' : 'plain'}
                                size="small"
                                onPress={() => setFeedView('new')}
                            >✨ New</button>
                        </hstack>
                        <button appearance="plain" size="small" onPress={() => refreshFeed()}>🔄</button>
                    </hstack>
                    <spacer size="small" />

                    {(feed && feed.length > 0) ? (
                        feed.slice(0, 4).map((meme, idx) => (
                            <hstack
                                key={meme.id}
                                backgroundColor={Theme.colors.background}
                                padding="small"
                                cornerRadius="small"
                                border="thin"
                                borderColor={idx === 0 ? Theme.colors.gold : Theme.colors.surfaceHighlight}
                                alignment="center middle"
                                gap="small"
                            >
                                {idx === 0 && <text size="small" color={Theme.colors.gold}>👑</text>}
                                <image url={meme.url || "https://placehold.co/64x64/1A1A1B/FF4500?text=MEME"} imageHeight={64} imageWidth={64} resizeMode="cover" />
                                <vstack grow>
                                    <text size="small" color={Theme.colors.text} wrap>{meme.prompt?.slice(0, 60)}</text>
                                    <text size="xsmall" color={Theme.colors.textDim}>#{idx + 1} in arena</text>
                                </vstack>
                                <vstack alignment="center middle" gap="small">
                                    <button appearance="plain" size="small" onPress={() => onVote(meme.id, 1)}>⬆️</button>
                                    <text color={Theme.narrative.goldHighlight} weight="bold" size="small">{meme.votes || 0}</text>
                                    <button appearance="plain" size="small" onPress={() => onVote(meme.id, -1)}>⬇️</button>
                                </vstack>
                            </hstack>
                        ))
                    ) : (
                        <vstack alignment="center middle" grow gap="small">
                            <text color={MEME_LORD.accentColor} size="large" weight="bold">The arena awaits.</text>
                            <text color={Theme.colors.textDim} size="small">Be the first gladiator to enter!</text>
                            <spacer size="small" />
                            <text color={Theme.colors.textDim} size="xsmall">Tap "Create Meme" above to forge your first creation.</text>
                            <text color={Theme.colors.textDim} size="xsmall">Use the daily theme for 2x vote power!</text>
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
