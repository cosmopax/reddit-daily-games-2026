import { Devvit, SettingScope, useState, useAsync } from '@devvit/public-api';
import { Theme, ServiceProxy, Leaderboard, LeaderboardUI, NarrativeHeader, HIVE_BRAIN, CharacterPanel, SplashScreen } from 'shared';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
interface Trend {
    query: string;
    traffic: number;
    trafficDisplay: string;
}

type RoundType = 'higher_lower' | 'closest_guess' | 'odd_one_out';

interface GauntletRound {
    type: RoundType;
    // higher_lower: compare trend A vs B
    trendA?: Trend;
    trendB?: Trend;
    // odd_one_out: 4 trends, one is the outlier (lowest traffic)
    options?: Trend[];
    outlierIndex?: number;
    // closest_guess: guess the traffic of a hidden trend
    hiddenTrend?: Trend;
    guessOptions?: string[];  // formatted traffic strings to pick from
    correctGuessIndex?: number;
}

interface GauntletState {
    rounds: GauntletRound[];
    currentRound: number;
    totalRounds: number;
    score: number;
    maxScore: number;
    answers: (boolean | null)[];
    phase: 'playing' | 'round_result' | 'game_over';
    lastCorrect: boolean | null;
    streakBonus: number;
}

const TOTAL_ROUNDS = 5;
const ROUND_SEQUENCE: RoundType[] = ['higher_lower', 'closest_guess', 'odd_one_out', 'higher_lower', 'closest_guess'];

// Text juice: Hive Brain reacts between rounds
function getHiveBrainReaction(correct: boolean, consecutiveCorrect: number, roundType: RoundType, roundNum: number): string {
    if (roundNum === 5) {
        if (correct) return 'FINAL SYNC ACHIEVED. The hive resonates with your frequency.';
        return 'Signal lost on the final transmission. So close...';
    }
    if (consecutiveCorrect >= 4) return 'UNPRECEDENTED RESONANCE. You ARE the collective.';
    if (consecutiveCorrect >= 3) return 'Triple sync! The neural pathways are BLAZING.';
    if (consecutiveCorrect >= 2) return 'Double sync. The hive acknowledges your signal strength.';

    if (correct) {
        const reactions: Record<RoundType, string[]> = {
            higher_lower: ['The collective knew. And so did you.', 'Frequency matched. Signal clear.'],
            closest_guess: ['Precise calibration. The hive is impressed.', 'Your estimation circuits are running hot.'],
            odd_one_out: ['Pattern recognition: SUPERIOR.', 'You spotted the anomaly instantly.'],
        };
        return reactions[roundType][Math.floor(Math.random() * reactions[roundType].length)];
    } else {
        const misses: Record<RoundType, string[]> = {
            higher_lower: ['The signal was inverted. Recalibrate.', 'Interference detected. The hive expected more.'],
            closest_guess: ['Off-frequency. The true signal was elsewhere.', 'Estimation error. Adjusting parameters...'],
            odd_one_out: ['The anomaly hid in plain sight.', 'Pattern disruption. The hive is reconfiguring.'],
        };
        return misses[roundType][Math.floor(Math.random() * misses[roundType].length)];
    }
}

function buildHiveEmojiGrid(answers: (boolean | null)[], score: number, grade: string): string {
    let grid = 'HIVE MIND GAUNTLET\n';
    const types = ['H/L', 'Guess', 'Odd', 'H/L', 'Guess'];
    answers.forEach((a, i) => {
        const emoji = a === true ? '🟢' : a === false ? '🔴' : '⚫';
        grid += `R${i + 1} ${types[i]} ${emoji}\n`;
    });
    grid += `Score: ${score} | Grade: ${grade}`;
    return grid;
}

// ═══════════════════════════════════════════════════════
// BUILD GAUNTLET ROUNDS FROM TRENDS
// ═══════════════════════════════════════════════════════
// Difficulty tiers based on player stats
function getDifficultyLevel(stats: { bestScore: number; maxStreak: number; gamesPlayed: number }): number {
    // 0 = easy (new players), 1 = medium, 2 = hard (veterans)
    if (stats.gamesPlayed >= 10 && stats.maxStreak >= 3) return 2;
    if (stats.gamesPlayed >= 3 || stats.bestScore >= 300) return 1;
    return 0;
}

const DIFFICULTY_OFFSETS: number[][] = [
    [0.3, 0.6, 1.6, 2.5],  // Easy: wide spread, easy to distinguish
    [0.4, 0.7, 1.5, 2.2],  // Medium: default
    [0.6, 0.8, 1.3, 1.7],  // Hard: tight spread, tough to pick
];

function buildGauntlet(trends: Trend[], difficulty: number = 1): GauntletRound[] {
    // Shuffle trends
    const shuffled = [...trends];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const rounds: GauntletRound[] = [];
    let idx = 0;
    const offsets = DIFFICULTY_OFFSETS[difficulty] || DIFFICULTY_OFFSETS[1];

    for (const type of ROUND_SEQUENCE) {
        if (type === 'higher_lower') {
            const a = shuffled[idx++ % shuffled.length];
            const b = shuffled[idx++ % shuffled.length];
            // On hard difficulty, pick trends with closer traffic values
            if (difficulty >= 2) {
                const sorted = [...shuffled].sort((x, y) => Math.abs(x.traffic - y.traffic));
                if (sorted.length >= 2) {
                    rounds.push({ type, trendA: sorted[0], trendB: sorted[1] });
                    continue;
                }
            }
            rounds.push({ type, trendA: a, trendB: b });
        } else if (type === 'closest_guess') {
            const hidden = shuffled[idx++ % shuffled.length];
            // Generate 4 plausible traffic options — tighter on harder difficulties
            const real = hidden.traffic;
            const candidates = offsets.map(m => Math.round(real * m));
            candidates[0] = real; // ensure real is in there
            // Shuffle candidates
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }
            const correctIdx = candidates.indexOf(real);
            const guessOptions = candidates.map(v =>
                v >= 1000000 ? `${(v / 1000000).toFixed(1)}M+`
                    : v >= 1000 ? `${Math.round(v / 1000)}K+`
                        : `${v}+`
            );
            rounds.push({ type, hiddenTrend: hidden, guessOptions, correctGuessIndex: correctIdx });
        } else if (type === 'odd_one_out') {
            // Pick 4 trends, the one with lowest traffic is the "odd one out" (least trending)
            const opts: Trend[] = [];
            for (let k = 0; k < 4; k++) {
                opts.push(shuffled[idx++ % shuffled.length]);
            }
            let minIdx = 0;
            for (let k = 1; k < opts.length; k++) {
                if (opts[k].traffic < opts[minIdx].traffic) minIdx = k;
            }
            rounds.push({ type, options: opts, outlierIndex: minIdx });
        }
    }

    return rounds;
}

// ═══════════════════════════════════════════════════════
// SCHEDULER
// ═══════════════════════════════════════════════════════
Devvit.addSchedulerJob({
    name: 'daily_reset',
    onRun: async (_event, context) => {
        console.log('[daily_reset] Ingesting Daily Trends...');
        try {
            const proxy = new ServiceProxy(context);
            const trends = await proxy.fetchDailyTrends(12);
            await context.redis.set('daily_trends', JSON.stringify(trends));
            await context.redis.del('daily_participants');
            console.log(`[daily_reset] Stored ${trends.length} trends`);
        } catch (e) {
            console.error('[daily_reset] Failed to ingest trends:', e);
        }
    },
});

Devvit.addSettings([
    {
        name: 'SERPAPI_KEY',
        label: 'SerpApi Key (Google Trends)',
        type: 'string',
        isSecret: true,
        scope: SettingScope.Installation,
    },
    {
        name: 'GEMINI_API_KEY',
        label: 'Google Gemini API Key',
        type: 'string',
        isSecret: true,
        scope: SettingScope.Installation,
    },
]);

Devvit.addMenuItem({
    label: 'Create Hive Mind Gauntlet Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: '🧠 Hive Mind Gauntlet — 5 Rounds. Sync or Desync.',
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

// ═══════════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════════
Devvit.addCustomPostType({
    name: 'Hive Mind Gauntlet',
    height: 'tall',
    render: (context) => {
        const proxy = new ServiceProxy(context);
        const [userId] = useState(() => context.userId || 'anon');
        const [showSplash, setShowSplash] = useState(true);
        const [gameState, setGameState] = useState<GauntletState | null>(null);
        const [processing, setProcessing] = useState(false);

        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const { data, loading, error } = useAsync(async () => {
            const played = await context.redis.hGet('daily_participants', userId);
            const rawTrends = await context.redis.get('daily_trends');
            let trends: Trend[];
            if (rawTrends) {
                trends = JSON.parse(rawTrends);
            } else {
                trends = await proxy.fetchDailyTrends(12);
                await context.redis.set('daily_trends', JSON.stringify(trends));
            }
            const statsRaw = await context.redis.get(`user:${userId}:hive_stats`);
            const stats = statsRaw ? JSON.parse(statsRaw) : { streak: 0, totalScore: 0, gamesPlayed: 0, bestScore: 0, maxStreak: 0 };
            return { played: !!played, trends, stats };
        });

        const startGauntlet = () => {
            if (!data?.trends) return;
            const difficulty = getDifficultyLevel(data.stats || { bestScore: 0, maxStreak: 0, gamesPlayed: 0 });
            const rounds = buildGauntlet(data.trends, difficulty);
            setGameState({
                rounds,
                currentRound: 0,
                totalRounds: TOTAL_ROUNDS,
                score: 0,
                maxScore: 0,
                answers: [],
                phase: 'playing',
                lastCorrect: null,
                streakBonus: 0,
            });
        };

        const submitAnswer = async (correct: boolean) => {
            if (!gameState || processing) return;
            setProcessing(true);

            const roundIdx = gameState.currentRound;
            const consecutiveCorrect = correct
                ? gameState.answers.filter(a => a === true).length + 1
                : 0;
            const streakMultiplier = consecutiveCorrect >= 4 ? 3 : consecutiveCorrect >= 2 ? 2 : 1;
            // R5 (index 4) is the FINAL SYNC — worth 2x base points
            const isFinalRound = roundIdx === TOTAL_ROUNDS - 1;
            const basePoints = correct ? (isFinalRound ? 200 : 100) : 0;
            const roundPoints = basePoints * streakMultiplier;

            const newState: GauntletState = {
                ...gameState,
                score: gameState.score + roundPoints,
                maxScore: gameState.maxScore + 300, // max possible per round
                answers: [...gameState.answers, correct],
                phase: 'round_result',
                lastCorrect: correct,
                streakBonus: correct ? streakMultiplier : 0,
            };
            setGameState(newState);
            setProcessing(false);
        };

        const nextRound = async () => {
            if (!gameState) return;
            const nextIdx = gameState.currentRound + 1;

            if (nextIdx >= gameState.totalRounds) {
                // Game over — save stats
                const finalScore = gameState.score;
                const correctCount = gameState.answers.filter(a => a === true).length;

                try {
                    const statsKey = `user:${userId}:hive_stats`;
                    const statsRaw = await context.redis.get(statsKey);
                    let stats = statsRaw ? JSON.parse(statsRaw) : { streak: 0, totalScore: 0, gamesPlayed: 0, bestScore: 0, maxStreak: 0 };

                    stats.gamesPlayed += 1;
                    stats.totalScore += finalScore;
                    if (finalScore > stats.bestScore) stats.bestScore = finalScore;

                    if (correctCount >= 3) {
                        stats.streak += 1;
                        if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
                    } else {
                        stats.streak = 0;
                    }

                    await context.redis.set(statsKey, JSON.stringify(stats));
                    await context.redis.hSet('daily_participants', { [userId]: String(finalScore) });

                    // Leaderboard
                    const lb = new Leaderboard(context, 'game2_trivia');
                    let username = 'Hive Mind Node';
                    try {
                        const u = await context.reddit.getUserById(userId);
                        if (u) username = u.username;
                    } catch (e) { }
                    await lb.submitScore(userId, username, stats.totalScore);

                    // Auto-share on perfect score
                    if (correctCount === 5 && context.postId) {
                        try {
                            await context.reddit.submitComment({
                                id: context.postId,
                                text: `🧠 PERFECT SYNC! I scored ${finalScore} points (5/5) in the Hive Mind Gauntlet! Streak: ${stats.streak}`
                            });
                        } catch (e) { }
                    }
                } catch (e) {
                    console.error('Failed to save game stats:', e);
                    context.ui.showToast('Score saved locally but sync failed');
                }

                setGameState({ ...gameState, currentRound: nextIdx, phase: 'game_over' });
            } else {
                setGameState({
                    ...gameState,
                    currentRound: nextIdx,
                    phase: 'playing',
                    lastCorrect: null,
                    streakBonus: 0,
                });
            }
        };

        const loadLeaderboard = async () => {
            setLbLoading(true);
            try {
                const lb = new Leaderboard(context, 'game2_trivia');
                const d = await lb.getTop(10);
                setLeaderboardData(d);
            } catch (e) {
                console.error('Leaderboard load failed:', e);
                context.ui.showToast('Could not load leaderboard');
            }
            setLbLoading(false);
        };

        // ─── SPLASH ─────────────────────────
        if (showSplash) {
            return <SplashScreen gameKey="trivia" onDone={() => setShowSplash(false)} />;
        }

        if (loading) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={HIVE_BRAIN.accentColor} size="large" weight="bold">HIVE MIND GAUNTLET</text>
                    <spacer size="small" />
                    <text color={Theme.colors.textDim} size="small">Intercepting signals...</text>
                </vstack>
            );
        }
        if (!data) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.danger} size="large" weight="bold">SIGNAL LOST</text>
                    <text color={Theme.colors.textDim} size="small">{error?.message || 'Failed to load. Try refreshing.'}</text>
                </vstack>
            );
        }

        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="HIVE MIND ORACLES"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                    scoreLabel="total pts"
                    currentUserId={userId}
                />
            );
        }

        // ─── LOBBY (not started or already played) ─────
        if (!gameState) {
            const alreadyPlayed = data.played;
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    <NarrativeHeader
                        title="HIVE MIND GAUNTLET"
                        subtitle="Daily Neural Sync"
                        accentColor={HIVE_BRAIN.accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <CharacterPanel
                        character={HIVE_BRAIN}
                        dialogue={alreadyPlayed
                            ? 'You have already synced today. Return tomorrow for a fresh signal.'
                            : '5 rounds. 3 challenge types. Can you stay in sync with the collective consciousness?'
                        }
                        compact={true}
                    />

                    <spacer size="small" />

                    {/* Challenge types preview */}
                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} width="100%" gap="small">
                        <text size="small" weight="bold" color={HIVE_BRAIN.accentColor}>THE GAUNTLET</text>
                        <hstack gap="small" alignment="start middle">
                            <text size="small" color={Theme.colors.warning}>R1</text>
                            <text size="small" color={Theme.colors.text}>Higher or Lower?</text>
                        </hstack>
                        <hstack gap="small" alignment="start middle">
                            <text size="small" color={Theme.colors.warning}>R2</text>
                            <text size="small" color={Theme.colors.text}>Guess the Searches</text>
                        </hstack>
                        <hstack gap="small" alignment="start middle">
                            <text size="small" color={Theme.colors.warning}>R3</text>
                            <text size="small" color={Theme.colors.text}>Odd One Out</text>
                        </hstack>
                        <hstack gap="small" alignment="start middle">
                            <text size="small" color={Theme.colors.warning}>R4</text>
                            <text size="small" color={Theme.colors.text}>Higher or Lower?</text>
                        </hstack>
                        <hstack gap="small" alignment="start middle">
                            <text size="small" color={Theme.colors.gold}>R5</text>
                            <text size="small" weight="bold" color={Theme.colors.gold}>FINAL SYNC (2x Points!)</text>
                        </hstack>
                    </vstack>

                    {/* Stats */}
                    <hstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} width="100%" alignment="space-between middle">
                        <vstack alignment="center middle">
                            <text size="xsmall" color={Theme.colors.textDim}>Streak</text>
                            <text size="medium" weight="bold" color={HIVE_BRAIN.accentColor}>{data.stats?.streak || 0}</text>
                        </vstack>
                        <vstack alignment="center middle">
                            <text size="xsmall" color={Theme.colors.textDim}>Best Score</text>
                            <text size="medium" weight="bold" color={Theme.colors.gold}>{data.stats?.bestScore || 0}</text>
                        </vstack>
                        <vstack alignment="center middle">
                            <text size="xsmall" color={Theme.colors.textDim}>Games</text>
                            <text size="medium" weight="bold" color={Theme.colors.text}>{data.stats?.gamesPlayed || 0}</text>
                        </vstack>
                        <vstack alignment="center middle">
                            <text size="xsmall" color={Theme.colors.textDim}>Max Streak</text>
                            <text size="medium" weight="bold" color={Theme.colors.danger}>{data.stats?.maxStreak || 0}</text>
                        </vstack>
                    </hstack>

                    <spacer grow />

                    {alreadyPlayed ? (
                        <vstack alignment="center middle" gap="small">
                            <text size="medium" color={Theme.colors.textDim}>Synced for today. Come back tomorrow.</text>
                            <button appearance="secondary" size="small" onPress={() => { setShowLeaderboard(true); loadLeaderboard(); }}>VIEW RANKINGS</button>
                        </vstack>
                    ) : (
                        <vstack alignment="center middle" gap="small">
                            <text size="xsmall" color={Theme.colors.textDim}>
                                Difficulty: {['INITIATE', 'ADEPT', 'MASTER'][getDifficultyLevel(data?.stats || { bestScore: 0, maxStreak: 0, gamesPlayed: 0 })]}
                            </text>
                            <button appearance="primary" size="medium" onPress={startGauntlet}>
                                BEGIN GAUNTLET
                            </button>
                        </vstack>
                    )}

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── GAME OVER ─────────────────────
        if (gameState.phase === 'game_over') {
            const correctCount = gameState.answers.filter(a => a === true).length;
            const perfect = correctCount === 5;
            const grade = correctCount >= 4 ? 'S' : correctCount >= 3 ? 'A' : correctCount >= 2 ? 'B' : correctCount >= 1 ? 'C' : 'F';
            const gradeColor = grade === 'S' ? Theme.colors.gold : grade === 'A' ? Theme.colors.success : grade === 'B' ? Theme.colors.warning : Theme.colors.danger;

            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    <NarrativeHeader
                        title="HIVE MIND GAUNTLET"
                        subtitle="Results"
                        accentColor={HIVE_BRAIN.accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={gradeColor} alignment="center middle" gap="small" width="100%">
                        <text size="xxlarge" weight="bold" color={gradeColor}>
                            {perfect ? 'PERFECT SYNC!' : correctCount >= 3 ? 'SYNCED!' : 'DESYNC!'}
                        </text>
                        <hstack gap="large" alignment="center middle">
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>Score</text>
                                <text size="xxlarge" weight="bold" color={Theme.colors.gold}>{gameState.score}</text>
                            </vstack>
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>Grade</text>
                                <text size="xxlarge" weight="bold" color={gradeColor}>{grade}</text>
                            </vstack>
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>Correct</text>
                                <text size="xxlarge" weight="bold" color={Theme.colors.text}>{correctCount}/5</text>
                            </vstack>
                        </hstack>
                    </vstack>

                    {/* Round-by-round results */}
                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} width="100%" gap="small">
                        {gameState.rounds.map((round, i) => {
                            const wasCorrect = gameState.answers[i];
                            const typeLabel = round.type === 'higher_lower' ? 'Higher/Lower'
                                : round.type === 'closest_guess' ? 'Guess Searches'
                                : 'Odd One Out';
                            return (
                                <hstack key={`r-${i}`} gap="small" alignment="center middle">
                                    <text size="xsmall" color={Theme.colors.textDim}>R{i + 1}</text>
                                    <text size="xsmall" color={HIVE_BRAIN.accentColor}>{typeLabel}</text>
                                    <spacer grow />
                                    <text size="small" weight="bold" color={wasCorrect ? Theme.colors.success : Theme.colors.danger}>
                                        {wasCorrect ? 'SYNC' : 'DESYNC'}
                                    </text>
                                </hstack>
                            );
                        })}
                    </vstack>

                    <CharacterPanel
                        character={HIVE_BRAIN}
                        dialogue={perfect ? 'Flawless neural resonance. You ARE the hive.'
                            : correctCount >= 3 ? 'Acceptable synchronization. The collective acknowledges you.'
                            : 'Signal degradation detected. Recalibrate and return tomorrow.'}
                        compact={true}
                    />

                    <hstack gap="small">
                        <button appearance="secondary" size="small" onPress={async () => {
                            try {
                                if (!context.postId) return;
                                const emojiGrid = buildHiveEmojiGrid(gameState.answers, gameState.score, grade);
                                await context.reddit.submitComment({
                                    id: context.postId,
                                    text: emojiGrid
                                });
                                context.ui.showToast('Sync grid shared!');
                            } catch (e) { context.ui.showToast('Could not share'); }
                        }}>Share Grid</button>
                        <button appearance="secondary" size="small" onPress={() => { setShowLeaderboard(true); loadLeaderboard(); }}>Rankings</button>
                    </hstack>

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── ACTIVE ROUND ───────────────────
        const round = gameState.rounds[gameState.currentRound];
        const roundNum = gameState.currentRound + 1;
        const consecutiveCorrect = gameState.answers.reduce((acc, a, i) => {
            if (i < gameState.answers.length) return a ? acc + 1 : 0;
            return acc;
        }, 0);

        // Score bar
        const ScoreBar = () => (
            <hstack padding="small" backgroundColor={Theme.colors.surface} cornerRadius="small" alignment="space-between middle" width="100%">
                <hstack gap="small" alignment="center middle">
                    <text size="small" color={Theme.colors.textDim}>Score:</text>
                    <text size="medium" weight="bold" color={Theme.colors.gold}>{gameState.score}</text>
                </hstack>
                <text size="xsmall" color={HIVE_BRAIN.accentColor}>Round {roundNum}/{TOTAL_ROUNDS}</text>
                <hstack gap="small" alignment="center middle">
                    {consecutiveCorrect >= 2 && (
                        <text size="xsmall" weight="bold" color={Theme.colors.warning}>x{consecutiveCorrect >= 4 ? 3 : 2}</text>
                    )}
                    <text size="small" color={Theme.colors.textDim}>
                        {gameState.answers.filter(a => a).length}/{gameState.answers.length} correct
                    </text>
                </hstack>
            </hstack>
        );

        // ─── ROUND RESULT ───────────────────
        if (gameState.phase === 'round_result') {
            const totalCorrectSoFar = gameState.answers.filter(a => a === true).length;
            const isFinalRound = gameState.currentRound === TOTAL_ROUNDS - 1;
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    <NarrativeHeader
                        title="HIVE MIND GAUNTLET"
                        subtitle={isFinalRound ? 'FINAL SYNC Result' : `Round ${roundNum} Result`}
                        accentColor={HIVE_BRAIN.accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <ScoreBar />

                    <vstack padding="large" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin"
                        borderColor={gameState.lastCorrect ? Theme.colors.success : Theme.colors.danger}
                        alignment="center middle" gap="small" width="100%">
                        <text size="xlarge" weight="bold" color={gameState.lastCorrect ? Theme.colors.success : Theme.colors.danger}>
                            {gameState.lastCorrect ? (isFinalRound ? 'FINAL SYNC LOCKED!' : 'NEURAL SYNC!') : (isFinalRound ? 'FINAL SYNC FAILED!' : 'DESYNC!')}
                        </text>
                        {gameState.streakBonus > 1 && (
                            <text size="small" color={Theme.colors.warning} weight="bold">
                                Streak x{gameState.streakBonus} multiplier!
                            </text>
                        )}
                        {isFinalRound && gameState.lastCorrect && (
                            <text size="small" color={Theme.colors.gold} weight="bold">2x FINAL ROUND BONUS!</text>
                        )}

                        {/* Show the answer for the round */}
                        {round.type === 'higher_lower' && round.trendB && (
                            <vstack alignment="center middle" gap="small">
                                <text size="small" color={Theme.colors.textDim}>
                                    {round.trendB.query}: {round.trendB.trafficDisplay} searches
                                </text>
                                <text size="small" color={Theme.colors.textDim}>
                                    vs {round.trendA!.query}: {round.trendA!.trafficDisplay}
                                </text>
                            </vstack>
                        )}
                        {round.type === 'closest_guess' && round.hiddenTrend && (
                            <text size="small" color={Theme.colors.textDim}>
                                {round.hiddenTrend.query} has {round.hiddenTrend.trafficDisplay} searches
                            </text>
                        )}
                        {round.type === 'odd_one_out' && round.options && (
                            <text size="small" color={Theme.colors.textDim}>
                                Least trending: {round.options[round.outlierIndex!].query} ({round.options[round.outlierIndex!].trafficDisplay})
                            </text>
                        )}
                    </vstack>

                    {/* Hive Brain narrative reaction */}
                    <CharacterPanel
                        character={HIVE_BRAIN}
                        dialogue={getHiveBrainReaction(!!gameState.lastCorrect, totalCorrectSoFar, round.type, roundNum)}
                        compact={true}
                    />

                    <spacer grow />

                    <button appearance="primary" size="medium" onPress={nextRound}>
                        {roundNum >= TOTAL_ROUNDS ? 'SEE FINAL RESULTS' : (roundNum === TOTAL_ROUNDS - 1 ? 'FINAL SYNC →' : `ROUND ${roundNum + 1} →`)}
                    </button>

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── HIGHER / LOWER ─────────────────
        if (round.type === 'higher_lower') {
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                    <NarrativeHeader
                        title="HIVE MIND GAUNTLET"
                        subtitle={`Round ${roundNum}: Higher or Lower?`}
                        accentColor={HIVE_BRAIN.accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />
                    <ScoreBar />

                    <hstack grow alignment="center middle">
                        {/* Trend A — known */}
                        <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} padding="small">
                            <text size="small" color={Theme.colors.textDim}>SIGNAL A</text>
                            <spacer size="small" />
                            <text size="large" weight="bold" color={Theme.colors.text} wrap alignment="center">{round.trendA!.query}</text>
                            <spacer size="small" />
                            <text size="xlarge" weight="bold" color={Theme.colors.gold}>{round.trendA!.trafficDisplay}</text>
                            <text size="small" color={Theme.colors.textDim}>searches</text>
                        </vstack>

                        <vstack width="2px" height="80%" backgroundColor={HIVE_BRAIN.accentColor} />

                        {/* Trend B — hidden */}
                        <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.background} padding="small" gap="medium">
                            <text size="small" color={Theme.colors.textDim}>SIGNAL B</text>
                            <text size="large" weight="bold" color={Theme.colors.text} wrap alignment="center">{round.trendB!.query}</text>
                            <text size="small" color={Theme.colors.textDim}>vs {round.trendA!.query}?</text>
                            <spacer size="small" />
                            <button appearance="primary" size="small" disabled={processing}
                                onPress={() => submitAnswer(round.trendB!.traffic > round.trendA!.traffic)}>
                                📈 HIGHER
                            </button>
                            <button appearance="secondary" size="small" disabled={processing}
                                onPress={() => submitAnswer(round.trendB!.traffic <= round.trendA!.traffic)}>
                                📉 LOWER
                            </button>
                        </vstack>
                    </hstack>

                    <hstack alignment="center middle" padding="small" backgroundColor={Theme.colors.surface}>
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── CLOSEST GUESS ──────────────────
        if (round.type === 'closest_guess') {
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" gap="medium">
                    <NarrativeHeader
                        title="HIVE MIND GAUNTLET"
                        subtitle={`Round ${roundNum}: Guess the Searches`}
                        accentColor={HIVE_BRAIN.accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />
                    <ScoreBar />

                    <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={HIVE_BRAIN.accentColor} alignment="center middle" gap="small">
                        <text size="small" color={Theme.colors.textDim}>HOW MANY SEARCHES?</text>
                        <text size="xlarge" weight="bold" color={Theme.colors.text} wrap alignment="center">{round.hiddenTrend!.query}</text>
                    </vstack>

                    <spacer size="small" />

                    <vstack gap="small">
                        {round.guessOptions!.map((opt, i) => (
                            <hstack
                                key={`guess-${i}`}
                                padding="medium"
                                cornerRadius="small"
                                backgroundColor={Theme.colors.surface}
                                border="thin"
                                borderColor={Theme.colors.surfaceHighlight}
                                alignment="center middle"
                                onPress={!processing ? () => submitAnswer(i === round.correctGuessIndex) : undefined}
                            >
                                <vstack width="28px" height="28px" cornerRadius="full" backgroundColor={HIVE_BRAIN.accentColor} alignment="center middle">
                                    <text size="small" weight="bold" color="#FFFFFF">{String.fromCharCode(65 + i)}</text>
                                </vstack>
                                <spacer size="small" />
                                <text size="large" weight="bold" color={Theme.colors.gold}>{opt}</text>
                                <spacer grow />
                                <text size="small" color={Theme.colors.textDim}>searches</text>
                            </hstack>
                        ))}
                    </vstack>

                    <spacer grow />

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── ODD ONE OUT ────────────────────
        if (round.type === 'odd_one_out') {
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" gap="medium">
                    <NarrativeHeader
                        title="HIVE MIND GAUNTLET"
                        subtitle={`Round ${roundNum}: Odd One Out`}
                        accentColor={HIVE_BRAIN.accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />
                    <ScoreBar />

                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} border="thin" borderColor={HIVE_BRAIN.accentColor} alignment="center middle">
                        <text size="medium" weight="bold" color={Theme.colors.text}>Which is LEAST trending?</text>
                        <text size="small" color={Theme.colors.textDim}>Tap the one with the fewest searches</text>
                    </vstack>

                    <spacer size="small" />

                    <vstack gap="small" grow>
                        {round.options!.map((trend, i) => (
                            <hstack
                                key={`odd-${i}`}
                                padding="medium"
                                cornerRadius="small"
                                backgroundColor={Theme.colors.surface}
                                border="thin"
                                borderColor={Theme.colors.surfaceHighlight}
                                alignment="center middle"
                                gap="small"
                                onPress={!processing ? () => submitAnswer(i === round.outlierIndex) : undefined}
                            >
                                <vstack width="28px" height="28px" cornerRadius="full" backgroundColor={Theme.colors.warning} alignment="center middle">
                                    <text size="small" weight="bold" color="#FFFFFF">{String.fromCharCode(65 + i)}</text>
                                </vstack>
                                <text size="medium" weight="bold" color={Theme.colors.text} wrap>{trend.query}</text>
                                <spacer grow />
                                <text size="small" color={Theme.colors.textDim}>???</text>
                            </hstack>
                        ))}
                    </vstack>

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // Fallback
        return (
            <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                <text color={Theme.colors.textDim}>Loading round...</text>
            </vstack>
        );
    },
});

export default Devvit;
