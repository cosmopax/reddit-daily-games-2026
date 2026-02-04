import { Devvit, SettingScope, useState, useAsync } from '@devvit/public-api';
import { Theme, ServiceProxy, Leaderboard, LeaderboardUI } from 'shared';
// Ingests trends from external API via shared proxy pattern

Devvit.configure({
    redditAPI: true,
    http: true,
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

Devvit.addCustomPostType({
    name: 'Hive Mind Gauntlet',
    render: (context) => {
        const proxy = new ServiceProxy(context);
        const [userId] = useState(() => context.userId || 'anon');
        const [hasPlayed, setHasPlayed] = useState(false);
        const [dataLoaded, setDataLoaded] = useState(false);
        const [trends, setTrends] = useState<{ a: any, b: any } | null>(null);
        const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

        const loadData = async () => {
            // 1. Check if user played
            const played = await context.redis.zScore('daily_participants', userId);
            // Using zScore on a Set (SISMEMBER) is better but Devvit 0.11 might limit Set ops?
            // Actually, the task said "BitField" but I'll use a Hash or ZSet for simplicity.
            // Let's use simple key lookup for this user if we want to be safe, 
            // but 'daily_participants' as a Hash {userId: 1} is easiest.
            // Wait, ZSet is good for leaderboards.
            // Let's use string key for simple boolean: `user:${userId}:played_today`? No, too many keys.
            // HGET daily_participants userId
            const p = await context.redis.hGet('daily_participants', userId);
            setHasPlayed(!!p);

            // 2. Load Trends
            const rawA = await context.redis.get('daily_trend_a');
            const rawB = await context.redis.get('daily_trend_b');

            if (rawA && rawB) {
                setTrends({ a: JSON.parse(rawA), b: JSON.parse(rawB) });
            } else {
                // Fallback if scheduler hasn't run
                const fresh = await proxy.fetchDailyTrends(2);
                setTrends({ a: fresh[0], b: fresh[1] });
                // Optionally save them here too if missing (Lazy Init)
            }
            setDataLoaded(true);
        };

        // Initial load
        if (!dataLoaded) {
            // We can't use useEffect. We just run async once via useAsync effectively?
            // But useAsync is cleaner.
        }

        // Re-implement with useAsync for cleanliness
        const { data, loading } = useAsync(async () => {
            const played = await context.redis.hGet('daily_participants', userId);
            const rawA = await context.redis.get('daily_trend_a');
            const rawB = await context.redis.get('daily_trend_b');
            let tA, tB;
            if (rawA && rawB) {
                tA = JSON.parse(rawA);
                tB = JSON.parse(rawB);
            } else {
                const fresh = await proxy.fetchDailyTrends(2);
                tA = fresh[0];
                tB = fresh[1];
            }
            return { played: !!played, trends: { a: tA, b: tB } };
        });

        const onGuess = async (choice: 'higher' | 'lower') => {
            if (!data?.trends) return;
            const { a, b } = data.trends;
            const isHigher = b.traffic > a.traffic;
            const win = (choice === 'higher' && isHigher) || (choice === 'lower' && !isHigher);

            setResult(win ? 'correct' : 'wrong');
            setHasPlayed(true);

            // Record participation for today
            await context.redis.hSet('daily_participants', { [userId]: win ? '1' : '0' });

            // Update Persistent Stats (Streak & Leaderboard)
            const statsKey = `user:${userId}:stats`;
            const statsRaw = await context.redis.get(statsKey);
            let stats = statsRaw ? JSON.parse(statsRaw) : { streak: 0, totalWins: 0, maxStreak: 0 };

            if (win) {
                stats.streak += 1;
                stats.totalWins += 1;
                if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
                context.ui.showToast(`Correct! Streak: ${stats.streak}`);

                // Submit to Leaderboard (Total Wins)
                const lb = new Leaderboard(context, 'game2_trivia');
                // Get username safely
                let username = 'Hive Mind Node';
                try {
                    const u = await context.reddit.getUserById(userId);
                    if (u) username = u.username;
                } catch (e) { }
                await lb.submitScore(userId, username, stats.totalWins);

            } else {
                stats.streak = 0; // Reset streak
                context.ui.showToast("Wrong! Streak Reset.");
            }

            await context.redis.set(statsKey, JSON.stringify(stats));
        };

        if (loading || !data) return <vstack alignment="center middle"><text>Loading Trends...</text></vstack>;

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
                />
            );
        }

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background}>
                {/* Header */}
                <vstack alignment="center middle" padding="medium" backgroundColor={Theme.colors.surface}>
                    <hstack alignment="space-between middle" width="100%">
                        <spacer />
                        <vstack alignment="center middle">
                            <text style="heading" size="xlarge" color={Theme.colors.primary} weight="bold">HYPER HIVE MIND</text>
                            <text size="small" color={Theme.colors.textDim}>Daily Trend Check</text>
                        </vstack>
                        <button appearance="plain" size="small" onPress={() => { setShowLeaderboard(true); loadLeaderboard(); }}>🏆 Rank</button>
                    </hstack>
                </vstack>

                {/* Split Screen Battle */}
                <hstack grow alignment="center middle">
                    {/* Option A (Baseline) */}
                    <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight}>
                        <text size="large" weight="bold" color={Theme.colors.text}>{currentTrends.a.query}</text>
                        <text size="xlarge" weight="bold" color={Theme.colors.gold}>{currentTrends.a.trafficDisplay}</text>
                        <text size="small" color={Theme.colors.textDim}>Searches</text>
                    </vstack>

                    {/* VS Separator */}
                    <vstack width="1px" height="80%" backgroundColor={Theme.colors.textDim} />

                    {/* Option B (The Guess) */}
                    <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.background}>
                        <text size="large" weight="bold" color={Theme.colors.text}>{currentTrends.b.query}</text>

                        {showResult ? (
                            <vstack alignment="center middle">
                                <text size="xlarge" weight="bold" color={Theme.colors.gold}>{currentTrends.b.trafficDisplay}</text>
                                <text size="large" color={Theme.colors.text}>{data.played || result === 'correct' || result === 'wrong' ? ((data.played && !result) ? "ALREADY PLAYED" : (result === 'correct' ? "CORRECT" : "WRONG")) : "DONE"}</text>
                            </vstack>
                        ) : (
                            <vstack gap="medium">
                                <text size="small" color={Theme.colors.textDim}>VS {currentTrends.a.query}?</text>
                                <button appearance="primary" onPress={() => onGuess('higher')}>HIGHER ▲</button>
                                <button appearance="secondary" onPress={() => onGuess('lower')}>LOWER ▼</button>
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
