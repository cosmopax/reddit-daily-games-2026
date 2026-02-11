import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { DuelServer, DuelState } from './DuelServer';
import { Theme, Leaderboard, LeaderboardUI, NarrativeHeader, SplashScreen } from 'shared';
import { DIFFICULTY_POINTS, type Difficulty } from './data/questions';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

Devvit.addSettings([
    {
        name: 'GEMINI_API_KEY',
        label: 'Google Gemini API Key',
        type: 'string',
        isSecret: true,
        scope: SettingScope.App,
    },
]);

Devvit.addMenuItem({
    label: 'Create Outsmarted Again Post',
    location: ['subreddit', 'post'],
    forUserType: 'moderator',
    onPress: async (_event, context) => {
        try {
            const sub = await context.reddit.getCurrentSubreddit();
            await context.reddit.submitPost({
                title: '🧠 Outsmarted Again — Category Trivia vs AI!',
                subredditName: sub.name,
                preview: (
                    <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                        <text color="#00D4FF" size="xlarge" weight="bold">OUTSMARTED AGAIN</text>
                        <text color={Theme.colors.textDim} size="small">Loading trivia...</text>
                    </vstack>
                ),
            });
            context.ui.showToast('Game post created!');
        } catch (e) {
            console.error('Failed to create Outsmarted Again post:', e);
            context.ui.showToast('Failed to create post. Check app logs.');
        }
    },
});

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
const categoryEmojis: Record<string, string> = {
    'History': '📜', 'Science': '🔬', 'Pop Culture': '🎬',
    'Geography': '🌍', 'Sports': '⚽', 'Technology': '💻',
};
const difficultyEmojis: Record<string, string> = { easy: '🟢', normal: '🟡', hard: '🔴' };
const difficultyColors: Record<string, string> = {
    easy: Theme.colors.success,
    normal: Theme.colors.warning,
    hard: Theme.colors.danger,
};

function buildEmojiGrid(state: DuelState): string {
    let grid = 'OUTSMARTED AGAIN\n';
    state.rounds.forEach((round, i) => {
        if (i >= state.player.correct.length) return;
        const catEmoji = categoryEmojis[round.category] || '🎯';
        const playerOk = state.player.correct[i];
        const aiOk = state.ai.correct[i];
        const pDiff = difficultyEmojis[state.player.difficultyChoices[i]] || '🟡';
        const aDiff = difficultyEmojis[state.ai.difficultyChoices[i]] || '🟡';
        grid += `R${i + 1} ${catEmoji} You:${pDiff}${playerOk ? '✅' : '❌'} AI:${aDiff}${aiOk ? '✅' : '❌'}\n`;
    });
    const won = state.player.score > state.ai.score;
    const tied = state.player.score === state.ai.score;
    grid += `${won ? '🏆 VICTORY' : tied ? '🤝 TIE' : '💀 DEFEAT'} ${state.player.score}-${state.ai.score}`;
    return grid;
}

function getRankTitle(wins: number): { title: string; color: string } {
    if (wins >= 50) return { title: 'Grandmaster', color: Theme.colors.gold };
    if (wins >= 25) return { title: 'Champion', color: '#9400D3' };
    if (wins >= 10) return { title: 'Scholar', color: Theme.colors.secondary };
    if (wins >= 5) return { title: 'Duelist', color: Theme.colors.success };
    if (wins >= 1) return { title: 'Apprentice', color: Theme.colors.textDim };
    return { title: 'Newcomer', color: Theme.colors.textDim };
}

// AI personality quips based on game state
function getAiQuip(aiDiff: Difficulty, aiCorrect: boolean, playerCorrect: boolean, gap: number): string {
    if (aiDiff === 'hard' && aiCorrect) return '"Calculated. Precisely calculated."';
    if (aiDiff === 'hard' && !aiCorrect) return '"Even I overreach sometimes..."';
    if (!playerCorrect && aiCorrect) return '"Better luck next round, human."';
    if (playerCorrect && !aiCorrect) return '"...impressive. I underestimated you."';
    if (gap >= 4) return '"I\'m adapting. Don\'t get comfortable."';
    if (gap <= -4) return '"This is almost too easy."';
    return '"The game continues."';
}

Devvit.addCustomPostType({
    name: 'AI Duel',
    height: 'tall',
    render: (context) => {
        const server = new DuelServer(context as any);
        const [userId] = useState(() => context.userId || 'test-user');
        const [showSplash, setShowSplash] = useState(true);
        const [localState, setLocalState] = useState<any>(null);
        const [processing, setProcessing] = useState(false);

        // Leaderboard hooks
        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);
        const [challengeBoard, setChallengeBoard] = useState<any[]>([]);

        const { data: initialData, loading, error } = useAsync<any>(async () => {
            const state = await server.getGameState(userId);
            const stats = await server.getPlayerStats(userId);
            return { state, stats } as any;
        });

        const state: DuelState | null = localState?.state || initialData?.state;
        const stats = localState?.stats || initialData?.stats || { wins: 0, streak: 0, bestStreak: 0, games: 0 };

        const refreshStats = async () => {
            try {
                const s = await server.getPlayerStats(userId);
                setLocalState((prev: any) => ({ ...prev, stats: s }));
            } catch (e) { console.error('Stats refresh failed:', e); }
        };

        const loadLeaderboard = async () => {
            setLbLoading(true);
            try {
                const lb = new Leaderboard(context, 'game4_duel');
                const data = await lb.getTop(10);
                setLeaderboardData(data);
            } catch (e) {
                console.error('Leaderboard load failed:', e);
                context.ui.showToast('Could not load leaderboard');
            }
            setLbLoading(false);
        };

        const onSelectDifficulty = async (difficulty: Difficulty) => {
            if (!state || processing) return;
            setProcessing(true);
            try {
                const newState = await server.selectDifficulty(userId, difficulty);
                setLocalState((prev: any) => ({ ...prev, state: newState }));
            } catch (e) {
                console.error('Difficulty select failed:', e);
                context.ui.showToast('Failed to select difficulty — try again');
            }
            setProcessing(false);
        };

        const onAnswer = async (answerIndex: number) => {
            if (!state || processing) return;
            setProcessing(true);
            try {
                const newState = await server.submitAnswer(userId, answerIndex);
                setLocalState((prev: any) => ({ ...prev, state: newState }));
            } catch (e) {
                console.error('Answer submit failed:', e);
                context.ui.showToast('Failed to submit answer — try again');
            }
            setProcessing(false);
        };

        const onNext = async () => {
            if (!state) return;
            setProcessing(true);
            try {
                const newState = await server.nextRound(userId);
                setLocalState((prev: any) => ({ ...prev, state: newState }));
                if (newState.phase === 'game_over') {
                    await refreshStats();
                    // Save to post challenge board and load it
                    if (context.postId) {
                        await server.savePostChallenge(
                            context.postId, userId,
                            newState.player.score,
                            newState.player.score > newState.ai.score
                        );
                        const board = await server.getPostChallengeBoard(context.postId);
                        setChallengeBoard(board);
                    }
                }
            } catch (e) {
                console.error('Next round failed:', e);
                context.ui.showToast('Failed to advance — try again');
            }
            setProcessing(false);
        };

        const onProceedToDifficulty = async () => {
            if (!state) return;
            setProcessing(true);
            try {
                const newState = await server.proceedToDifficultySelect(userId);
                setLocalState((prev: any) => ({ ...prev, state: newState }));
            } catch (e) {
                console.error('Proceed failed:', e);
                context.ui.showToast('Failed to proceed — try again');
            }
            setProcessing(false);
        };

        const onReset = async () => {
            setProcessing(true);
            try {
                const newState = await server.resetGame(userId);
                setLocalState((prev: any) => ({ ...prev, state: newState }));
            } catch (e) {
                console.error('Reset failed:', e);
                context.ui.showToast('Failed to reset — try again');
            }
            setProcessing(false);
        };

        const accentColor = '#00D4FF';

        // ─── SPLASH SCREEN ───────────────────────
        if (showSplash) {
            return <SplashScreen gameKey="duel" onDone={() => setShowSplash(false)} />;
        }

        // ─── LOADING ───────────────────
        if (loading && !state) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={accentColor} size="large" weight="bold">OUTSMARTED AGAIN</text>
                    <spacer size="small" />
                    <text color={Theme.colors.textDim} size="small">Loading trivia...</text>
                </vstack>
            );
        }
        if (!state) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.danger} size="large" weight="bold">Error</text>
                    <text color={Theme.colors.textDim} size="small">{error?.message || 'Failed to load. Try refreshing.'}</text>
                </vstack>
            );
        }

        // ─── LEADERBOARD ───────────────
        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="TRIVIA CHAMPIONS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                    scoreLabel="wins"
                    currentUserId={userId}
                />
            );
        }

        // Score bar with juice
        const ScoreBar = () => {
            const gap = state.player.score - state.ai.score;
            const momentumColor = gap > 0 ? Theme.colors.success : gap < 0 ? Theme.colors.danger : Theme.colors.textDim;
            return (
                <hstack padding="small" backgroundColor={Theme.colors.surface} cornerRadius="small" alignment="space-between middle" width="100%">
                    <hstack gap="small" alignment="center middle">
                        <text size="small" color={Theme.colors.textDim}>You:</text>
                        <text size="medium" weight="bold" color={Theme.colors.success}>{state.player.score}</text>
                    </hstack>
                    <vstack alignment="center middle">
                        <text size="xsmall" color={accentColor}>
                            {(state as any).isTiebreaker ? 'SUDDEN DEATH' : `Round ${state.currentRound + 1}/${state.totalRounds}`}
                        </text>
                        {gap !== 0 && (
                            <text size="xsmall" color={momentumColor}>
                                {gap > 0 ? `You lead by ${gap}` : `AI leads by ${Math.abs(gap)}`}
                            </text>
                        )}
                    </vstack>
                    <hstack gap="small" alignment="center middle">
                        <text size="small" color={Theme.colors.textDim}>AI:</text>
                        <text size="medium" weight="bold" color={Theme.colors.danger}>{state.ai.score}</text>
                    </hstack>
                </hstack>
            );
        };

        // ─── GAME OVER ─────────────────
        if (state.phase === 'game_over') {
            const won = state.player.score > state.ai.score;
            const tied = state.player.score === state.ai.score;
            const rank = getRankTitle(stats.wins);
            const emojiGrid = buildEmojiGrid(state);

            // Achievements
            const achievements: string[] = [];
            const playerCorrectCount = state.player.correct.filter(c => c).length;
            if (playerCorrectCount === state.totalRounds) achievements.push('PERFECT GAME');
            if (state.player.difficultyChoices.every(d => d === 'hard') && won) achievements.push('HARD MODE HERO');
            if (won && state.player.score - state.ai.score >= 6) achievements.push('DOMINATION');
            if (won && state.ai.score > state.player.score - 2) achievements.push('CLUTCH VICTORY');
            if ((state as any).isTiebreaker && won) achievements.push('SUDDEN DEATH SURVIVOR');
            if (stats.streak >= 3) achievements.push(`${stats.streak}-WIN STREAK`);

            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" gap="small">
                    <NarrativeHeader
                        title="OUTSMARTED AGAIN"
                        subtitle="Final Results"
                        accentColor={accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    {/* Result banner */}
                    <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={won ? Theme.colors.success : tied ? Theme.colors.warning : Theme.colors.danger} alignment="center middle" gap="small" width="100%">
                        <text size="xxlarge" weight="bold" color={won ? Theme.colors.success : tied ? Theme.colors.warning : Theme.colors.danger}>
                            {won ? 'YOU WIN!' : tied ? 'TIE GAME!' : 'AI WINS!'}
                        </text>
                        <hstack gap="large" alignment="center middle">
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>You</text>
                                <text size="xxlarge" weight="bold" color={Theme.colors.success}>{state.player.score}</text>
                            </vstack>
                            <text size="large" color={Theme.colors.textDim}>vs</text>
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>AI</text>
                                <text size="xxlarge" weight="bold" color={Theme.colors.danger}>{state.ai.score}</text>
                            </vstack>
                        </hstack>

                        {/* Rank & Streak */}
                        <hstack gap="medium" alignment="center middle">
                            <vstack alignment="center middle">
                                <text size="xsmall" color={Theme.colors.textDim}>Rank</text>
                                <text size="small" weight="bold" color={rank.color}>{rank.title}</text>
                            </vstack>
                            <vstack alignment="center middle">
                                <text size="xsmall" color={Theme.colors.textDim}>Streak</text>
                                <text size="small" weight="bold" color={stats.streak >= 3 ? Theme.colors.warning : Theme.colors.text}>
                                    {stats.streak >= 3 ? `🔥 ${stats.streak}` : String(stats.streak)}
                                </text>
                            </vstack>
                            <vstack alignment="center middle">
                                <text size="xsmall" color={Theme.colors.textDim}>Wins</text>
                                <text size="small" weight="bold" color={Theme.colors.text}>{stats.wins}</text>
                            </vstack>
                        </hstack>
                    </vstack>

                    {/* Achievements */}
                    {achievements.length > 0 && (
                        <hstack padding="small" cornerRadius="small" backgroundColor="#1A1A0A" border="thin" borderColor={Theme.colors.gold} gap="small" alignment="center middle">
                            <text size="small" color={Theme.colors.gold}>🏅</text>
                            <text size="small" weight="bold" color={Theme.colors.gold}>{achievements.join(' · ')}</text>
                        </hstack>
                    )}

                    {/* Round breakdown with emoji grid */}
                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} width="100%" gap="small">
                        <text size="small" weight="bold" color={accentColor}>Battle Grid</text>
                        {state.rounds.map((round, i) => {
                            if (i >= state.player.correct.length) return null;
                            const pOk = state.player.correct[i];
                            const aOk = state.ai.correct[i];
                            const pDiff = state.player.difficultyChoices[i];
                            const aDiff = state.ai.difficultyChoices[i];
                            return (
                                <hstack key={`r-${i}`} gap="small" alignment="center middle">
                                    <text size="xsmall" color={Theme.colors.textDim}>R{i + 1}</text>
                                    <text size="xsmall" color={accentColor}>{categoryEmojis[round.category] || '🎯'}</text>
                                    <spacer grow />
                                    <text size="xsmall" color={difficultyColors[pDiff]}>{pDiff[0].toUpperCase()}</text>
                                    <text size="xsmall" color={pOk ? Theme.colors.success : Theme.colors.danger} weight="bold">
                                        {pOk ? `+${DIFFICULTY_POINTS[pDiff]}` : '0'}
                                    </text>
                                    <text size="xsmall" color={Theme.colors.textDim}>vs</text>
                                    <text size="xsmall" color={difficultyColors[aDiff]}>{aDiff[0].toUpperCase()}</text>
                                    <text size="xsmall" color={aOk ? Theme.colors.danger : Theme.colors.success} weight="bold">
                                        {aOk ? `+${DIFFICULTY_POINTS[aDiff]}` : '0'}
                                    </text>
                                </hstack>
                            );
                        })}
                    </vstack>

                    {/* Challenge Board — other players on this post */}
                    {challengeBoard.length > 0 && (
                        <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} border="thin" borderColor={accentColor} width="100%" gap="small">
                            <text size="small" weight="bold" color={accentColor}>Challenge Board ({challengeBoard.length} players)</text>
                            {challengeBoard.slice(0, 5).map((entry: any, i: number) => (
                                <hstack key={`cb-${i}`} gap="small" alignment="center middle">
                                    <text size="xsmall" color={i === 0 ? Theme.colors.gold : Theme.colors.textDim}>{i === 0 ? '👑' : `#${i + 1}`}</text>
                                    <text size="xsmall" color={Theme.colors.text}>{entry.username}</text>
                                    <spacer grow />
                                    <text size="xsmall" weight="bold" color={entry.won ? Theme.colors.success : Theme.colors.danger}>{entry.score}pts {entry.won ? 'W' : 'L'}</text>
                                </hstack>
                            ))}
                        </vstack>
                    )}

                    <hstack gap="small" alignment="center middle">
                        <button appearance="primary" size="medium" onPress={onReset}>PLAY AGAIN</button>
                        <button appearance="secondary" size="small" onPress={async () => {
                            try {
                                if (!context.postId) return;
                                await context.reddit.submitComment({
                                    id: context.postId,
                                    text: emojiGrid
                                });
                                context.ui.showToast('Battle grid shared!');
                            } catch (e) { context.ui.showToast('Could not share'); }
                        }}>Share Grid</button>
                        <button appearance="secondary" size="small" onPress={() => { setShowLeaderboard(true); loadLeaderboard(); }}>Rankings</button>
                    </hstack>
                </vstack>
            );
        }

        // ─── CATEGORY REVEAL ──────────────
        if (state.phase === 'category_reveal') {
            const round = state.rounds[state.currentRound];
            const isTiebreaker = (state as any).isTiebreaker && state.currentRound === state.totalRounds - 1;
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    <NarrativeHeader
                        title="OUTSMARTED AGAIN"
                        subtitle={isTiebreaker ? 'SUDDEN DEATH!' : `Round ${state.currentRound + 1} of ${state.totalRounds}`}
                        accentColor={isTiebreaker ? Theme.colors.danger : accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <ScoreBar />

                    <spacer grow />

                    {isTiebreaker && (
                        <vstack alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#2A0A0A" border="thin" borderColor={Theme.colors.danger}>
                            <text size="medium" weight="bold" color={Theme.colors.danger}>TIED! SUDDEN DEATH ROUND!</text>
                            <text size="small" color={Theme.colors.textDim}>One question decides everything.</text>
                        </vstack>
                    )}

                    <vstack alignment="center middle" gap="medium" padding="large" cornerRadius="large" backgroundColor={Theme.colors.surface} border="thin" borderColor={isTiebreaker ? Theme.colors.danger : accentColor}>
                        <text size="small" color={Theme.colors.textDim}>{isTiebreaker ? 'FINAL CATEGORY' : 'NEXT CATEGORY'}</text>
                        <text size="xxlarge" weight="bold" color={isTiebreaker ? Theme.colors.danger : accentColor}>
                            {categoryEmojis[round.category] || '🎯'} {round.category}
                        </text>
                        <text size="small" color={Theme.colors.textDim}>
                            {isTiebreaker ? 'Everything rides on this.' : 'Choose your difficulty wisely...'}
                        </text>
                    </vstack>

                    <spacer grow />

                    <button appearance="primary" size="medium" onPress={onProceedToDifficulty}>
                        {isTiebreaker ? 'FACE YOUR DESTINY' : 'CHOOSE DIFFICULTY'}
                    </button>

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── DIFFICULTY SELECT ────────────
        if (state.phase === 'difficulty_select') {
            const round = state.rounds[state.currentRound];
            const gap = state.player.score - state.ai.score;
            const isTiebreaker = (state as any).isTiebreaker && state.currentRound === state.totalRounds - 1;

            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" gap="medium">
                    <NarrativeHeader
                        title="OUTSMARTED AGAIN"
                        subtitle={`${round.category} — ${isTiebreaker ? 'SUDDEN DEATH' : `Round ${state.currentRound + 1}`}`}
                        accentColor={isTiebreaker ? Theme.colors.danger : accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <ScoreBar />

                    <vstack alignment="center middle">
                        <text size="medium" weight="bold" color={Theme.colors.text}>
                            {isTiebreaker ? 'CHOOSE WISELY — NO SECOND CHANCES' : 'Select Difficulty'}
                        </text>
                        <text size="small" color={Theme.colors.textDim}>
                            {gap >= 3 ? 'You\'re ahead — play it safe or go for the kill?'
                                : gap <= -3 ? 'You\'re behind — time to take risks!'
                                : 'Higher risk = more points!'}
                        </text>
                    </vstack>

                    {/* Easy */}
                    <hstack
                        padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface}
                        border="thin" borderColor={Theme.colors.success} alignment="center middle" gap="medium"
                        onPress={!processing ? () => onSelectDifficulty('easy') : undefined}
                    >
                        <vstack grow>
                            <text size="large" weight="bold" color={Theme.colors.success}>🟢 EASY</text>
                            <text size="small" color={Theme.colors.textDim}>Safe bet — most people know this</text>
                        </vstack>
                        <vstack alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#0A2A0A">
                            <text size="large" weight="bold" color={Theme.colors.success}>+1</text>
                        </vstack>
                    </hstack>

                    {/* Normal */}
                    <hstack
                        padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface}
                        border="thin" borderColor={Theme.colors.warning} alignment="center middle" gap="medium"
                        onPress={!processing ? () => onSelectDifficulty('normal') : undefined}
                    >
                        <vstack grow>
                            <text size="large" weight="bold" color={Theme.colors.warning}>🟡 NORMAL</text>
                            <text size="small" color={Theme.colors.textDim}>Solid challenge — think it through</text>
                        </vstack>
                        <vstack alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#2A2A0A">
                            <text size="large" weight="bold" color={Theme.colors.warning}>+2</text>
                        </vstack>
                    </hstack>

                    {/* Hard */}
                    <hstack
                        padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface}
                        border="thin" borderColor={Theme.colors.danger} alignment="center middle" gap="medium"
                        onPress={!processing ? () => onSelectDifficulty('hard') : undefined}
                    >
                        <vstack grow>
                            <text size="large" weight="bold" color={Theme.colors.danger}>🔴 HARD</text>
                            <text size="small" color={Theme.colors.textDim}>Big risk, big reward — expert level</text>
                        </vstack>
                        <vstack alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#2A0A0A">
                            <text size="large" weight="bold" color={Theme.colors.danger}>+3</text>
                        </vstack>
                    </hstack>

                    <spacer grow />

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── ANSWERING / ROUND RESULT ────────────
        const q = state.currentQuestion;
        if (!q) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.textDim}>Loading question...</text>
                </vstack>
            );
        }

        const round = state.rounds[state.currentRound];
        const diffColor = difficultyColors[state.selectedDifficulty || 'normal'];
        const lastPlayerAnswer = state.player.answers[state.player.answers.length - 1];
        const lastAiDifficulty = state.ai.difficultyChoices[state.ai.difficultyChoices.length - 1];
        const lastAiCorrect = state.ai.correct[state.ai.correct.length - 1];
        const lastPlayerCorrect = state.player.correct[state.player.correct.length - 1];
        const isTiebreaker = (state as any).isTiebreaker && state.currentRound === state.totalRounds - 1;

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                <NarrativeHeader
                    title="OUTSMARTED AGAIN"
                    subtitle={`${round.category} — ${isTiebreaker ? 'SUDDEN DEATH' : `Round ${state.currentRound + 1}`}`}
                    accentColor={isTiebreaker ? Theme.colors.danger : accentColor}
                    onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                />

                {/* Score Bar with difficulty badge */}
                <hstack padding="small" backgroundColor={Theme.colors.surface} cornerRadius="small" alignment="space-between middle" width="100%">
                    <hstack gap="small" alignment="center middle">
                        <text size="small" color={Theme.colors.textDim}>You:</text>
                        <text size="medium" weight="bold" color={Theme.colors.success}>{state.player.score}</text>
                    </hstack>
                    <vstack alignment="center middle">
                        <text size="xsmall" color={diffColor} weight="bold">
                            {(state.selectedDifficulty || '').toUpperCase()} (+{DIFFICULTY_POINTS[state.selectedDifficulty || 'normal']})
                        </text>
                    </vstack>
                    <hstack gap="small" alignment="center middle">
                        <text size="small" color={Theme.colors.textDim}>AI:</text>
                        <text size="medium" weight="bold" color={Theme.colors.danger}>{state.ai.score}</text>
                    </hstack>
                </hstack>

                <spacer size="small" />

                {/* Question */}
                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={isTiebreaker ? Theme.colors.danger : accentColor} alignment="center middle">
                    <text size="large" weight="bold" color={Theme.colors.text} wrap alignment="center">{q.question}</text>
                </vstack>

                <spacer size="small" />

                {/* Answer Options */}
                <vstack gap="small" grow>
                    {q.options.map((option, i) => {
                        let bgColor = Theme.colors.surface;
                        let borderColor = Theme.colors.surfaceHighlight;
                        let textColor = Theme.colors.text;

                        if (state.phase === 'round_result') {
                            if (i === q.correctIndex) {
                                bgColor = '#0A2A0A';
                                borderColor = Theme.colors.success;
                                textColor = Theme.colors.success;
                            } else if (i === lastPlayerAnswer && i !== q.correctIndex) {
                                bgColor = '#2A0A0A';
                                borderColor = Theme.colors.danger;
                                textColor = Theme.colors.danger;
                            }
                        }

                        return (
                            <hstack
                                key={`opt-${i}`}
                                padding="small" cornerRadius="small" backgroundColor={bgColor}
                                border="thin" borderColor={borderColor} alignment="start middle" gap="small"
                                onPress={state.phase === 'answering' && !processing ? () => onAnswer(i) : undefined}
                            >
                                <vstack width="24px" height="24px" cornerRadius="full" backgroundColor={borderColor} alignment="center middle">
                                    <text size="small" weight="bold" color="#FFFFFF">{String.fromCharCode(65 + i)}</text>
                                </vstack>
                                <text size="medium" color={textColor} wrap>{option}</text>
                            </hstack>
                        );
                    })}
                </vstack>

                {/* ROUND RESULT — Dramatic AI reveal + next */}
                {state.phase === 'round_result' && (
                    <vstack padding="small" alignment="center middle" gap="small" backgroundColor={Theme.colors.surface} cornerRadius="small">
                        {/* Player result */}
                        <text size="medium" weight="bold" color={lastPlayerCorrect ? Theme.colors.success : Theme.colors.danger}>
                            {lastPlayerCorrect ? `CORRECT! +${DIFFICULTY_POINTS[state.selectedDifficulty || 'normal']} pts` : 'WRONG!'}
                        </text>

                        {/* AI REVEAL — dramatic */}
                        <hstack gap="small" alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#0A0A1A" border="thin" borderColor={Theme.colors.danger}>
                            <text size="small" color={Theme.colors.textDim}>AI chose</text>
                            <text size="small" weight="bold" color={difficultyColors[lastAiDifficulty]}>
                                {difficultyEmojis[lastAiDifficulty]} {lastAiDifficulty.toUpperCase()}
                            </text>
                            <text size="small" color={Theme.colors.textDim}>and</text>
                            <text size="small" weight="bold" color={lastAiCorrect ? Theme.colors.danger : Theme.colors.success}>
                                {lastAiCorrect ? `NAILED IT (+${DIFFICULTY_POINTS[lastAiDifficulty]})` : 'MISSED!'}
                            </text>
                        </hstack>

                        {/* AI quip */}
                        <text size="xsmall" color={Theme.colors.textDim}>
                            {getAiQuip(lastAiDifficulty, lastAiCorrect, lastPlayerCorrect, state.player.score - state.ai.score)}
                        </text>

                        <button appearance="primary" size="small" onPress={onNext}>
                            {state.currentRound + 1 >= state.totalRounds ? 'SEE RESULTS' : 'NEXT ROUND →'}
                        </button>
                    </vstack>
                )}

                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
