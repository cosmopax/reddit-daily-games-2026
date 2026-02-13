import { Devvit, useState, useAsync, useForm, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { Theme, Leaderboard, LeaderboardUI, NarrativeHeader, MEME_LORD, CharacterPanel, SplashScreen } from 'shared';
Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
    media: true,
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

/** Check if a URL is a valid renderable image URL (not data URI, not empty) */
function isValidImageUrl(url: string | undefined): boolean {
    if (!url) return false;
    if (url.startsWith('data:')) return false;
    if (!url.startsWith('http')) return false;
    return true;
}

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

        const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
        const [feed, setFeed] = useState<any[]>([]);

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
                    context.ui.showToast(`Cooldown: ${remaining}s remaining`);
                    return;
                }

                const styleIdx = Number(values.style?.[0] || '0');
                const style = STYLE_OPTIONS[styleIdx] || STYLE_OPTIONS[0];
                let fullPrompt = values.prompt + style.suffix;
                if (values.useTheme) {
                    fullPrompt += `, ${dailyTheme.prompt}`;
                }

                try {
                    // Generate meme inline (no scheduler — it's unreliable)
                    const memeId = Math.random().toString(36).substring(7);
                    const userId = context.userId || 'anon';

                    // Build Pollinations URL (generates image lazily on first access, cached after)
                    const encoded = encodeURIComponent(fullPrompt.slice(0, 200));
                    const finalUrl = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${memeId}`;

                    // Store meme
                    const post = {
                        id: memeId,
                        userId,
                        prompt: fullPrompt,
                        url: finalUrl,
                        votes: 0,
                        timestamp: Date.now(),
                    };
                    await context.redis.hSet('meme:data', { [memeId]: JSON.stringify(post) });
                    await context.redis.zAdd('meme:leaderboard', { member: memeId, score: 0 });
                    await context.redis.zAdd('meme:timeline', { member: memeId, score: post.timestamp });

                    if (values.useTheme) {
                        await context.redis.hSet('meme:theme_submissions', { [memeId]: dailyTheme.name });
                    }

                    setLastSubmitTime(Date.now());
                    setStatus('Your meme is in the arena!');
                    context.ui.showToast('Meme created! Tap 🔄 to see it.');
                } catch (e) {
                    console.error('Meme creation error:', e);
                    context.ui.showToast(`Failed: ${String(e).slice(0, 80)}`);
                }
            }
        );

        // Load feed data — merge leaderboard scores as vote counts
        const { data: feedData, loading } = useAsync<any[]>(async () => {
            try {
                const ids = await context.redis.zRange('meme:leaderboard', 0, 19, { by: 'rank', reverse: true });
                if (!ids || ids.length === 0) return [];
                const postsRaw = await context.redis.hMGet('meme:data', ids.map(id => id.member));
                const posts = postsRaw
                    .map((p, i) => {
                        if (!p) return null;
                        try {
                            const parsed = JSON.parse(p);
                            parsed.votes = ids[i].score; // Use leaderboard score as source of truth
                            return parsed;
                        } catch { return null; }
                    })
                    .filter(Boolean);
                return posts;
            } catch (e) {
                console.error('Failed to load meme feed:', e);
                return [];
            }
        });

        // Sync feed data to state (for updates after voting)
        const displayFeed = feed.length > 0 ? feed : (feedData || []);

        const refreshFeed = async () => {
            try {
                const ids = await context.redis.zRange('meme:leaderboard', 0, 19, { by: 'rank', reverse: true });
                if (ids && ids.length > 0) {
                    const postsRaw = await context.redis.hMGet('meme:data', ids.map(id => id.member));
                    const posts = postsRaw
                        .map((p, i) => {
                            if (!p) return null;
                            try {
                                const parsed = JSON.parse(p);
                                parsed.votes = ids[i].score;
                                return parsed;
                            } catch { return null; }
                        })
                        .filter(Boolean);
                    setFeed(posts);
                    setStatus(`${posts.length} memes in the arena`);
                } else {
                    setStatus('No memes yet — be the first!');
                }
            } catch (e) {
                console.error('Refresh failed:', e);
            }
        };

        const onVote = async (memeId: string, delta: number) => {
            try {
                const newScore = await context.redis.zIncrBy('meme:leaderboard', memeId, delta);

                // Update local feed state immediately with real score from Redis
                const updatedFeed = displayFeed.map(p => {
                    if (p.id === memeId) return { ...p, votes: newScore };
                    return p;
                });
                setFeed(updatedFeed);
                context.ui.showToast(delta > 0 ? 'Upvoted!' : 'Downvoted!');

                // Update author's leaderboard score
                const targetMeme = displayFeed.find(p => p.id === memeId);
                if (targetMeme?.userId) {
                    const authorScoreKey = `user:${targetMeme.userId}:meme_score`;
                    const authorScore = await context.redis.incrBy(authorScoreKey, delta);
                    const lb = new Leaderboard(context, 'game3_meme');
                    let username = 'Meme Artist';
                    try {
                        const u = await context.reddit.getUserById(targetMeme.userId);
                        if (u) username = u.username;
                    } catch (_) { }
                    await lb.submitScore(targetMeme.userId, username, authorScore);
                }
            } catch (e) {
                console.error('Vote error:', e);
                context.ui.showToast('Vote failed');
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

        const PLACEHOLDER_IMG = "https://placehold.co/48x48/1A1A1B/FF4500?text=MEME";

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                {/* Compact Header */}
                <hstack alignment="space-between middle">
                    <vstack>
                        <text color={MEME_LORD.accentColor} weight="bold" size="medium">MEME WARS</text>
                        <text color={Theme.colors.textDim} size="xsmall">{dailyTheme.emoji} Theme: {dailyTheme.name} (+2x)</text>
                    </vstack>
                    <hstack gap="small">
                        <button appearance="primary" size="small" onPress={() => context.ui.showForm(promptForm)}>Create Meme</button>
                        <button appearance="plain" size="small" onPress={() => { setShowLeaderboard(true); loadLeaderboard(); }}>👑</button>
                    </hstack>
                </hstack>

                {/* Status bar */}
                <hstack alignment="space-between middle" padding="small">
                    <text color={Theme.colors.textDim} size="xsmall">{status}</text>
                    <button appearance="plain" size="small" onPress={() => refreshFeed()}>🔄 Refresh</button>
                </hstack>

                {/* Feed */}
                <vstack cornerRadius="small" backgroundColor={Theme.colors.surface} grow padding="small" gap="small">
                    {(displayFeed && displayFeed.length > 0) ? (
                        displayFeed.slice(0, 5).map((meme: any, idx: number) => (
                            <hstack
                                key={`meme-${idx}`}
                                backgroundColor={Theme.colors.background}
                                padding="small"
                                cornerRadius="small"
                                border="thin"
                                borderColor={idx === 0 ? Theme.colors.gold : Theme.colors.surfaceHighlight}
                                alignment="center middle"
                                gap="small"
                            >
                                <text size="xsmall" color={idx === 0 ? Theme.colors.gold : Theme.colors.textDim}>
                                    {idx === 0 ? '👑' : `#${idx + 1}`}
                                </text>
                                {isValidImageUrl(meme.url) ? (
                                    <image url={meme.url} imageHeight={48} imageWidth={48} resizeMode="cover" />
                                ) : (
                                    <image url={PLACEHOLDER_IMG} imageHeight={48} imageWidth={48} resizeMode="cover" />
                                )}
                                <vstack grow>
                                    <text size="xsmall" color={Theme.colors.text} wrap>
                                        {(meme.prompt || '').replace(/,\s*(cyberpunk|classical|neon|photorealistic|anime|pixel|nature|retro|cosmic|wholesome|urban).*$/i, '').slice(0, 50)}
                                    </text>
                                </vstack>
                                <hstack alignment="center middle" gap="small">
                                    <button appearance="primary" size="small" onPress={() => onVote(meme.id, 1)}>⬆</button>
                                    <text color={Theme.narrative.goldHighlight} weight="bold" size="small">{meme.votes || 0}</text>
                                    <button appearance="destructive" size="small" onPress={() => onVote(meme.id, -1)}>⬇</button>
                                </hstack>
                            </hstack>
                        ))
                    ) : (
                        <vstack alignment="center middle" grow gap="small">
                            <text color={MEME_LORD.accentColor} size="large" weight="bold">The arena awaits.</text>
                            <text color={Theme.colors.textDim} size="small">Tap "Create Meme" to enter!</text>
                        </vstack>
                    )}
                </vstack>

                <hstack alignment="center middle">
                    <text size="xsmall" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
