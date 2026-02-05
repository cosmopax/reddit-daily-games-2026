import { Devvit, useState, useAsync } from '@devvit/public-api';
import { EpisodeHeader, Theme, Leaderboard, LeaderboardUI, getEpisodeArchive, getEpisodeIdUTC, getTodayEpisode } from 'shared';

type PlayRecord = {
    episodeId: string;
    choice: 'higher' | 'lower';
    correct: boolean;
    reason?: string;
    createdAt: number;
};

type UserStats = {
    streak: number;
    maxStreak: number;
    totalWins: number;
    lastPlayedEpisodeId?: string;
    lastWinEpisodeId?: string;
};

const REASONS = [
    'Mainstream media spike',
    'Meme amplification',
    'Breaking scandal / leak',
];

Devvit.configure({
    redditAPI: true,
    http: {
        domains: ['serpapi.com', 'generativelanguage.googleapis.com']
    },
    redis: true,
    scheduler: {
        daily_reset: async (event, context) => {
            console.log("Ingesting Daily Trends...");
            // const trends = await context.http.send(...)
        }
    }
});

// App settings for API keys
Devvit.addSettings([
    {
        name: 'SERPAPI_KEY',
        label: 'SerpApi Key (Google Trends)',
        type: 'string',
        isSecret: false,
    },
    {
        name: 'GEMINI_API_KEY',
        label: 'Google Gemini API Key',
        type: 'string',
        isSecret: false,
    },
]);

Devvit.addMenuItem({
    label: "Open/Create Today's Trend Heist Post",
    location: 'subreddit',
    onPress: async (_event, context) => {
        const episode = await getTodayEpisode(context);
        const subreddit = await context.reddit.getCurrentSubreddit();
        const postKey = `posts:v1:${subreddit.name}:hyper-hive-minds:${episode.id}`;
        const existingPostId = await context.redis.get(postKey);
        if (existingPostId) {
            try {
                const post = await context.reddit.getPostById(existingPostId);
                context.ui.navigateTo(post);
                context.ui.showToast("Opened today's post");
                return;
            } catch (e) {
                await context.redis.del(postKey);
            }
        }

        const post = await context.reddit.submitPost({
            title: `${episode.id} // Hive Mind: Trend Heist`,
            subredditName: subreddit.name,
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text>Loading TREND HEIST...</text>
                </vstack>
            ),
        });
        await context.redis.set(postKey, post.id);
        context.ui.navigateTo(post);
        context.ui.showToast("Created today's post");
    },
});

Devvit.addCustomPostType({
    name: 'Hive Mind Gauntlet',
    render: (context) => {
        const [userId] = useState(() => context.userId || 'anon');
        const playKey = (episodeId: string) => `trivia:play:v1:${episodeId}:${userId}`;
        const countsKey = (episodeId: string) => `trivia:counts:v1:${episodeId}`;
        const statsKey = `trivia:user:v1:${userId}`;

        const { data, loading, refresh } = useAsync(async () => {
            const episode = await getTodayEpisode(context);
            const playRaw = await context.redis.get(playKey(episode.id));
            const play: PlayRecord | null = playRaw ? JSON.parse(playRaw) : null;

            const countsRaw = await context.redis.hGetAll(countsKey(episode.id));
            const counts = {
                higher: Number.parseInt(countsRaw?.higher || '0', 10) || 0,
                lower: Number.parseInt(countsRaw?.lower || '0', 10) || 0,
            };

            const statsRaw = await context.redis.get(statsKey);
            const stats: UserStats = statsRaw ? JSON.parse(statsRaw) : { streak: 0, maxStreak: 0, totalWins: 0 };

            const archive = await getEpisodeArchive(context, 7);
            const archiveCounts: Record<string, { higher: number; lower: number }> = {};
            for (const ep of archive) {
                const c = await context.redis.hGetAll(countsKey(ep.id));
                archiveCounts[ep.id] = {
                    higher: Number.parseInt(c?.higher || '0', 10) || 0,
                    lower: Number.parseInt(c?.lower || '0', 10) || 0,
                };
            }

            return { episode, play, counts, stats, archive, archiveCounts };
        });

        const onGuess = async (choice: 'higher' | 'lower') => {
            if (!data?.episode) return;
            const { episode } = data;
            const a = episode.signals?.[0];
            const b = episode.signals?.[1];
            if (!a || !b) return;

            const isHigher = b.traffic > a.traffic;
            const win = (choice === 'higher' && isHigher) || (choice === 'lower' && !isHigher);

            const record: PlayRecord = {
                episodeId: episode.id,
                choice,
                correct: win,
                createdAt: Date.now(),
            };

            await context.redis.set(playKey(episode.id), JSON.stringify(record));
            await context.redis.hIncrBy(countsKey(episode.id), choice, 1);

            // Streak handling (UTC episodes)
            const stats: UserStats = data.stats || { streak: 0, maxStreak: 0, totalWins: 0 };
            stats.lastPlayedEpisodeId = episode.id;
            if (win) {
                const yesterday = getEpisodeIdUTC(new Date(Date.now() - 24 * 60 * 60 * 1000));
                stats.streak = stats.lastWinEpisodeId === yesterday ? (stats.streak + 1) : 1;
                stats.lastWinEpisodeId = episode.id;
                stats.totalWins += 1;
                stats.maxStreak = Math.max(stats.maxStreak || 0, stats.streak);
                context.ui.showToast(`Correct. Intel streak: ${stats.streak}`);

                const lb = new Leaderboard(context, 'game2_trivia');
                let username = 'Hive Mind Node';
                try {
                    const u = await context.reddit.getUserById(userId);
                    if (u) username = u.username;
                } catch { }
                await lb.submitScore(userId, username, stats.totalWins);
            } else {
                stats.streak = 0;
                context.ui.showToast('Wrong. Streak reset.');
            }
            await context.redis.set(statsKey, JSON.stringify(stats));
            await refresh();
        };

        const onReason = async (reason: string) => {
            if (!data?.episode || !data.play) return;
            const updated = { ...data.play, reason };
            await context.redis.set(playKey(data.episode.id), JSON.stringify(updated));
            await refresh();
        };

        if (loading || !data) return <vstack alignment="center middle"><text>Loading Heist...</text></vstack>;

        const { episode, play, stats, archive, archiveCounts } = data;
        const a = episode.signals?.[0];
        const b = episode.signals?.[1];
        const played = !!play;

        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const lb = new Leaderboard(context, 'game2_trivia');
            const data = await lb.getTop(10);
            setLeaderboardData(data);
            setLbLoading(false);
        };

        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="HIVE MIND ORACLES"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                />
            );
        }

        if (!a || !b) {
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle">
                    <text color={Theme.colors.textDim}>No signals available. Try again.</text>
                </vstack>
            );
        }

        const showReason = played && !play?.reason;
        const share = played
            ? `HEIST ${episode.id} | ${play?.choice === 'higher' ? 'B>A' : 'B<A'} | streak:${stats?.streak || 0} | #HiveMind`
            : '';

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" gap="medium">
                <EpisodeHeader
                    episode={episode}
                    title="HIVE MIND: TREND HEIST"
                    subtitle={`One pick. One reason. Streak: ${stats?.streak || 0}`}
                    rightActionLabel="🏆 Rank"
                    onRightAction={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                />

                <vstack grow gap="medium">
                    <hstack gap="small">
                        <vstack grow backgroundColor={Theme.colors.surface} padding="medium" cornerRadius="medium" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                            <text size="small" color={Theme.colors.textDim}>Signal A</text>
                            <text size="large" weight="bold" color={Theme.colors.text}>{a.query}</text>
                            <text size="xlarge" weight="bold" color={Theme.colors.gold}>{a.trafficDisplay}</text>
                        </vstack>
                        <vstack grow backgroundColor={Theme.colors.surface} padding="medium" cornerRadius="medium" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                            <text size="small" color={Theme.colors.textDim}>Signal B</text>
                            <text size="large" weight="bold" color={Theme.colors.text}>{b.query}</text>
                            <text size="xlarge" weight="bold" color={Theme.colors.gold}>{b.trafficDisplay}</text>
                        </vstack>
                    </hstack>

                    {!played ? (
                        <vstack gap="small" alignment="center middle">
                            <text color={Theme.colors.textDim} size="small">Is B higher than A?</text>
                            <button appearance="primary" onPress={() => onGuess('higher')}>B is HIGHER ▲</button>
                            <button appearance="secondary" onPress={() => onGuess('lower')}>B is LOWER ▼</button>
                        </vstack>
                    ) : (
                        <vstack gap="small">
                            <text weight="bold" color={play?.correct ? Theme.colors.success : Theme.colors.danger}>
                                {play?.correct ? 'CORRECT. Intel secured.' : 'WRONG. The feed cooked you.'}
                            </text>
                            {showReason ? (
                                <vstack gap="small">
                                    <text size="small" color={Theme.colors.textDim}>Why?</text>
                                    <hstack gap="small">
                                        {REASONS.map((r) => (
                                            <button key={r} appearance="secondary" size="small" onPress={() => onReason(r)}>
                                                {r}
                                            </button>
                                        ))}
                                        <button appearance="plain" size="small" onPress={() => onReason('Skipped')}>
                                            Skip
                                        </button>
                                    </hstack>
                                </vstack>
                            ) : null}
                            <vstack backgroundColor={Theme.colors.surface} padding="small" cornerRadius="small" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                                <text size="small" color={Theme.colors.textDim}>Share string</text>
                                <text size="small" style="mono" color={Theme.colors.primary} wrap>{share}</text>
                            </vstack>
                        </vstack>
                    )}

                    <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                        <hstack alignment="space-between middle">
                            <text weight="bold" color={Theme.colors.text}>Archive (last 7)</text>
                            <button appearance="plain" size="small" onPress={() => refresh()}>🔄</button>
                        </hstack>
                        <vstack gap="small">
                            {archive.map((ep) => {
                                const c = archiveCounts[ep.id] || { higher: 0, lower: 0 };
                                const total = c.higher + c.lower;
                                const higherPct = total > 0 ? Math.round((c.higher / total) * 100) : 0;
                                return (
                                    <vstack key={ep.id} padding="small" cornerRadius="small" backgroundColor={Theme.colors.background} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                                        <text size="small" weight="bold" color={Theme.colors.text}>{ep.id}</text>
                                        <text size="small" color={Theme.colors.textDim} wrap>
                                            {ep.signals?.[0]?.query} vs {ep.signals?.[1]?.query}
                                        </text>
                                        <text size="small" color={Theme.colors.textDim}>
                                            Hive believed "HIGHER": {higherPct}% ({c.higher}/{total})
                                        </text>
                                    </vstack>
                                );
                            })}
                        </vstack>
                    </vstack>
                </vstack>

                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
