import { Devvit, SettingScope, useState, useAsync } from '@devvit/public-api';
import { Theme, ServiceProxy, Leaderboard, LeaderboardUI, NarrativeHeader, HIVE_BRAIN, CharacterPanel } from 'shared';
// Ingests trends from external API via shared proxy pattern

const DAILY_ACTIVE_DATE_KEY = 'trivia:active_date';
const TREND_A_PREFIX = 'daily_trend_a:';
const TREND_B_PREFIX = 'daily_trend_b:';
const PARTICIPANTS_PREFIX = 'daily_participants:';

const getUtcDateKey = (date: Date = new Date()): string => {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const keyed = (prefix: string, dateKey: string): string => `${prefix}${dateKey}`;

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

Devvit.addSchedulerJob({
    name: 'daily_reset',
    onRun: async (_event, context) => {
        const dateKey = getUtcDateKey();
        const trendAKey = keyed(TREND_A_PREFIX, dateKey);
        const trendBKey = keyed(TREND_B_PREFIX, dateKey);
        const participantsKey = keyed(PARTICIPANTS_PREFIX, dateKey);
        console.log(`[daily_reset] Ingesting trends for ${dateKey}...`);
        try {
            const active = await context.redis.get(DAILY_ACTIVE_DATE_KEY);
            if (active === dateKey) {
                const existingA = await context.redis.get(trendAKey);
                const existingB = await context.redis.get(trendBKey);
                if (existingA && existingB) {
                    console.log(`[daily_reset] Already initialized for ${dateKey}, skipping.`);
                    return;
                }
            }

            const proxy = new ServiceProxy(context);
            const trends = await proxy.fetchDailyTrends(2);
            await context.redis.set(trendAKey, JSON.stringify(trends[0]));
            await context.redis.set(trendBKey, JSON.stringify(trends[1]));
            await context.redis.del(participantsKey);
            await context.redis.set(DAILY_ACTIVE_DATE_KEY, dateKey);

            // Compatibility keys consumed by earlier builds/tools.
            await context.redis.set('daily_trend_a', JSON.stringify(trends[0]));
            await context.redis.set('daily_trend_b', JSON.stringify(trends[1]));

            console.log(`[daily_reset] Stored ${dateKey}: "${trends[0].query}" vs "${trends[1].query}"`);
        } catch (e) {
            console.error('[daily_reset] Failed to ingest trends:', e);
        }
    },
});

// App settings for API keys
Devvit.addSettings([
    {
        name: 'SERPAPI_KEY',
        label: 'SerpApi Key (Google Trends)',
        type: 'string',
        isSecret: false,
        scope: SettingScope.Installation,
    },
    {
        name: 'GEMINI_API_KEY',
        label: 'Google Gemini API Key',
        type: 'string',
        isSecret: false,
        scope: SettingScope.Installation,
    },
]);

Devvit.addMenuItem({
    label: 'Create Hive Mind Gauntlet Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: '🧠 Hive Mind Gauntlet — Sync With the Collective!',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.primary} size="xlarge" weight="bold">NEURAL SYNC INITIALIZING...</text>
                    <text color={Theme.colors.textDim} size="small">Connecting to the Hive...</text>
                </vstack>
            ),
        });
        context.ui.showToast('Game post created!');
    },
});

Devvit.addCustomPostType({
    name: 'Hive Mind Gauntlet',
    height: 'tall',
    render: (context) => {
        const proxy = new ServiceProxy(context);
        const [userId] = useState(() => context.userId || 'anon');
        const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

        const { data, loading } = useAsync(async () => {
            const activeDate = (await context.redis.get(DAILY_ACTIVE_DATE_KEY)) || getUtcDateKey();
            const trendAKey = keyed(TREND_A_PREFIX, activeDate);
            const trendBKey = keyed(TREND_B_PREFIX, activeDate);
            const participantsKey = keyed(PARTICIPANTS_PREFIX, activeDate);

            const played = await context.redis.hGet(participantsKey, userId);
            const rawA = await context.redis.get(trendAKey);
            const rawB = await context.redis.get(trendBKey);
            let tA, tB;
            if (rawA && rawB) {
                tA = JSON.parse(rawA);
                tB = JSON.parse(rawB);
            } else {
                const fresh = await proxy.fetchDailyTrends(2);
                tA = fresh[0];
                tB = fresh[1];
                await context.redis.set(trendAKey, JSON.stringify(tA));
                await context.redis.set(trendBKey, JSON.stringify(tB));
                await context.redis.set(DAILY_ACTIVE_DATE_KEY, activeDate);
            }
            // Also fetch user stats for display
            const statsRaw = await context.redis.get(`user:${userId}:stats`);
            const stats = statsRaw ? JSON.parse(statsRaw) : { streak: 0, totalWins: 0, maxStreak: 0 };
            return { played: !!played, trends: { a: tA, b: tB }, stats, activeDate, participantsKey };
        });

        const onGuess = async (choice: 'higher' | 'lower') => {
            if (!data?.trends) return;
            if (data.played) {
                context.ui.showToast('You already synced for today.');
                return;
            }
            const { a, b } = data.trends;
            const isHigher = b.traffic > a.traffic;
            const win = (choice === 'higher' && isHigher) || (choice === 'lower' && !isHigher);

            setResult(win ? 'correct' : 'wrong');

            // Record participation for today
            await context.redis.hSet(data.participantsKey, { [userId]: win ? '1' : '0' });

            // Update Persistent Stats (Streak & Leaderboard)
            const statsKey = `user:${userId}:stats`;
            const statsRaw = await context.redis.get(statsKey);
            let stats = statsRaw ? JSON.parse(statsRaw) : { streak: 0, totalWins: 0, maxStreak: 0 };

            if (win) {
                stats.streak += 1;
                stats.totalWins += 1;
                if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
                context.ui.showToast(`Neural Sync successful! Streak: ${stats.streak}`);

                // Share to comment on streak milestones
                if (stats.streak >= 3 && context.postId) {
                    try {
                        await context.reddit.submitComment({
                            id: context.postId,
                            text: `🧠 My neural sync streak is at ${stats.streak}! (${stats.totalWins} total syncs) Can you beat it?`
                        });
                    } catch (e) { /* Comment sharing is optional */ }
                }

                // Submit to Leaderboard (Total Wins)
                const lb = new Leaderboard(context, 'game2_trivia');
                let username = 'Hive Mind Node';
                try {
                    const u = await context.reddit.getUserById(userId);
                    if (u) username = u.username;
                } catch (e) { }
                await lb.submitScore(userId, username, stats.totalWins);

            } else {
                stats.streak = 0; // Reset streak
                context.ui.showToast("Neural Desync! Streak Reset.");
            }

            await context.redis.set(statsKey, JSON.stringify(stats));
        };

        if (loading || !data) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.primary} size="large" weight="bold">HYPER HIVE MIND</text>
                    <spacer size="small" />
                    <text color={Theme.colors.textDim} size="small">Intercepting signals...</text>
                </vstack>
            );
        }

        const { trends: currentTrends, played } = data;
        const showResult = played || result; // If previously played or just played

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
                    scoreLabel="syncs"
                    currentUserId={userId}
                />
            );
        }

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background}>
                {/* Header */}
                <NarrativeHeader
                    title="HYPER HIVE MIND"
                    subtitle="Daily Neural Sync"
                    accentColor={HIVE_BRAIN.accentColor}
                    onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                />
                <hstack alignment="center middle" padding="xsmall">
                    <text size="xsmall" color={Theme.colors.textDim}>How to play: compare two trends, lock one guess per UTC day, build streaks.</text>
                </hstack>

                {/* Hive Brain Intro */}
                <CharacterPanel
                    character={HIVE_BRAIN}
                    dialogue={showResult ? 'Signal processed. Results decoded.' : 'SIGNAL INTERCEPTED. Two trends detected. Which burns brighter in the collective consciousness?'}
                    compact={true}
                />

                {/* Split Screen Battle */}
                <hstack grow alignment="center middle">
                    {/* Option A (Baseline) */}
                    <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} padding="small">
                        <text size="small" color={Theme.colors.textDim}>SIGNAL A</text>
                        <text size="large" weight="bold" color={Theme.colors.text} wrap alignment="center">{currentTrends.a.query}</text>
                        <text size="xlarge" weight="bold" color={Theme.colors.gold}>{currentTrends.a.trafficDisplay}</text>
                        <text size="small" color={Theme.colors.textDim}>searches</text>
                    </vstack>

                    {/* VS Separator */}
                    <vstack width="2px" height="80%" backgroundColor={HIVE_BRAIN.accentColor} />

                    {/* Option B (The Guess) */}
                    <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.background} padding="small">
                        <text size="small" color={Theme.colors.textDim}>SIGNAL B</text>
                        <text size="large" weight="bold" color={Theme.colors.text} wrap alignment="center">{currentTrends.b.query}</text>

                        {showResult ? (
                            <vstack alignment="center middle" gap="small">
                                <text size="xlarge" weight="bold" color={Theme.colors.gold}>{currentTrends.b.trafficDisplay}</text>
                                <text size="large" weight="bold" color={
                                    result === 'correct' ? Theme.colors.success
                                    : result === 'wrong' ? Theme.colors.danger
                                    : Theme.colors.textDim
                                }>{
                                    data.played && !result ? '🔄 SYNCED TODAY'
                                    : result === 'correct' ? '✅ NEURAL SYNC!'
                                    : result === 'wrong'   ? '❌ DESYNC!'
                                    : 'DONE'
                                }</text>
                                <spacer size="small" />
                                <text size="small" color={HIVE_BRAIN.accentColor}>🔥 Streak: {data.stats?.streak || 0}</text>
                                <text size="small" color={Theme.colors.textDim}>Syncs: {data.stats?.totalWins || 0} | Best: {data.stats?.maxStreak || 0}</text>
                                <text size="small" color={Theme.colors.textDim}>Signal date: {data.activeDate} (UTC)</text>
                            </vstack>
                        ) : (
                            <vstack gap="medium" alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>vs {currentTrends.a.query}?</text>
                                <button appearance="primary" onPress={() => onGuess('higher')}>📈 HIGHER</button>
                                <button appearance="secondary" onPress={() => onGuess('lower')}>📉 LOWER</button>
                            </vstack>
                        )}
                    </vstack>
                </hstack>

                {/* Footer */}
                <hstack alignment="center middle" padding="small" backgroundColor={Theme.colors.surface}>
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
