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
        scope: SettingScope.Installation,
    },
]);

Devvit.addMenuItem({
    label: 'Create Outsmarted Again Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
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
    },
});

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

        const { data: initialData, loading, error } = useAsync<any>(async () => {
            const state = await server.getGameState(userId);
            return { state } as any;
        });

        const state: DuelState | null = localState?.state || initialData?.state;

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const lb = new Leaderboard(context, 'game4_duel');
            const data = await lb.getTop(10);
            setLeaderboardData(data);
            setLbLoading(false);
        };

        const onSelectDifficulty = async (difficulty: Difficulty) => {
            if (!state || processing) return;
            setProcessing(true);
            const newState = await server.selectDifficulty(userId, difficulty);
            setLocalState({ state: newState });
            setProcessing(false);
        };

        const onAnswer = async (answerIndex: number) => {
            if (!state || processing) return;
            setProcessing(true);
            const newState = await server.submitAnswer(userId, answerIndex);
            setLocalState({ state: newState });
            setProcessing(false);
        };

        const onNext = async () => {
            if (!state) return;
            setProcessing(true);
            const newState = await server.nextRound(userId);
            setLocalState({ state: newState });
            setProcessing(false);
        };

        const onProceedToDifficulty = async () => {
            if (!state) return;
            setProcessing(true);
            const newState = await server.proceedToDifficultySelect(userId);
            setLocalState({ state: newState });
            setProcessing(false);
        };

        const onReset = async () => {
            setProcessing(true);
            const newState = await server.resetGame(userId);
            setLocalState({ state: newState });
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

        // Score bar component used across phases
        const ScoreBar = () => (
            <hstack padding="small" backgroundColor={Theme.colors.surface} cornerRadius="small" alignment="space-between middle" width="100%">
                <hstack gap="small" alignment="center middle">
                    <text size="small" color={Theme.colors.textDim}>You:</text>
                    <text size="medium" weight="bold" color={Theme.colors.success}>{state.player.score}</text>
                </hstack>
                <vstack alignment="center middle">
                    <text size="xsmall" color={accentColor}>Round {state.currentRound + 1}/{state.totalRounds}</text>
                </vstack>
                <hstack gap="small" alignment="center middle">
                    <text size="small" color={Theme.colors.textDim}>AI:</text>
                    <text size="medium" weight="bold" color={Theme.colors.danger}>{state.ai.score}</text>
                </hstack>
            </hstack>
        );

        // ─── GAME OVER ─────────────────
        if (state.phase === 'game_over') {
            const won = state.player.score > state.ai.score;
            const tied = state.player.score === state.ai.score;
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    <NarrativeHeader
                        title="OUTSMARTED AGAIN"
                        subtitle="Final Results"
                        accentColor={accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={won ? Theme.colors.success : tied ? Theme.colors.warning : Theme.colors.danger} alignment="center middle" gap="small" width="100%">
                        <text size="xlarge" weight="bold" color={won ? Theme.colors.success : tied ? Theme.colors.warning : Theme.colors.danger}>
                            {won ? 'YOU WIN!' : tied ? 'TIE GAME!' : 'AI WINS!'}
                        </text>
                        <spacer size="small" />
                        <hstack gap="large" alignment="center middle">
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>You</text>
                                <text size="xxlarge" weight="bold" color={Theme.colors.success}>{state.player.score}</text>
                                <text size="xsmall" color={Theme.colors.textDim}>pts</text>
                            </vstack>
                            <text size="large" color={Theme.colors.textDim}>vs</text>
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>AI</text>
                                <text size="xxlarge" weight="bold" color={Theme.colors.danger}>{state.ai.score}</text>
                                <text size="xsmall" color={Theme.colors.textDim}>pts</text>
                            </vstack>
                        </hstack>
                        <text size="small" color={Theme.colors.textDim}>{state.totalRounds} rounds played</text>
                    </vstack>

                    {/* Round breakdown */}
                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.colors.surface} width="100%" gap="small">
                        <text size="small" weight="bold" color={accentColor}>Round Breakdown</text>
                        {state.rounds.map((round, i) => (
                            <hstack key={`r-${i}`} gap="small" alignment="center middle">
                                <text size="xsmall" color={Theme.colors.textDim}>R{i + 1}</text>
                                <text size="xsmall" color={accentColor}>{round.category}</text>
                                <spacer grow />
                                <text size="xsmall" color={state.player.correct[i] ? Theme.colors.success : Theme.colors.danger}>
                                    {state.player.correct[i] ? '+' + DIFFICULTY_POINTS[state.player.difficultyChoices[i]] : '0'}
                                </text>
                                <text size="xsmall" color={Theme.colors.textDim}>vs</text>
                                <text size="xsmall" color={state.ai.correct[i] ? Theme.colors.danger : Theme.colors.success}>
                                    {state.ai.correct[i] ? '+' + DIFFICULTY_POINTS[state.ai.difficultyChoices[i]] : '0'}
                                </text>
                            </hstack>
                        ))}
                    </vstack>

                    <hstack gap="small">
                        <button appearance="primary" size="medium" onPress={onReset}>PLAY AGAIN</button>
                        <button appearance="secondary" size="small" onPress={async () => {
                            try {
                                if (!context.postId) return;
                                const result = won ? 'beat' : tied ? 'tied with' : 'lost to';
                                await context.reddit.submitComment({
                                    id: context.postId,
                                    text: `I ${result} the AI ${state.player.score}-${state.ai.score} pts in Outsmarted Again! Can you beat my score?`
                                });
                                context.ui.showToast('Shared!');
                            } catch (e) { context.ui.showToast('Could not share'); }
                        }}>Share</button>
                    </hstack>
                </vstack>
            );
        }

        // ─── CATEGORY REVEAL ──────────────
        if (state.phase === 'category_reveal') {
            const round = state.rounds[state.currentRound];
            const categoryEmojis: Record<string, string> = {
                'History': '📜', 'Science': '🔬', 'Pop Culture': '🎬',
                'Geography': '🌍', 'Sports': '⚽', 'Technology': '💻',
            };
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    <NarrativeHeader
                        title="OUTSMARTED AGAIN"
                        subtitle={`Round ${state.currentRound + 1} of ${state.totalRounds}`}
                        accentColor={accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <ScoreBar />

                    <spacer grow />

                    <vstack alignment="center middle" gap="medium" padding="large" cornerRadius="large" backgroundColor={Theme.colors.surface} border="thin" borderColor={accentColor}>
                        <text size="small" color={Theme.colors.textDim}>NEXT CATEGORY</text>
                        <text size="xxlarge" weight="bold" color={accentColor}>
                            {categoryEmojis[round.category] || '🎯'} {round.category}
                        </text>
                        <text size="small" color={Theme.colors.textDim}>Choose your difficulty wisely...</text>
                    </vstack>

                    <spacer grow />

                    <button appearance="primary" size="medium" onPress={onProceedToDifficulty}>
                        CHOOSE DIFFICULTY
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
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" gap="medium">
                    <NarrativeHeader
                        title="OUTSMARTED AGAIN"
                        subtitle={`${round.category} — Round ${state.currentRound + 1}`}
                        accentColor={accentColor}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <ScoreBar />

                    <spacer size="medium" />

                    <vstack alignment="center middle">
                        <text size="medium" weight="bold" color={Theme.colors.text}>Select Difficulty</text>
                        <text size="small" color={Theme.colors.textDim}>Higher risk = more points!</text>
                    </vstack>

                    <spacer size="small" />

                    {/* Easy */}
                    <hstack
                        padding="medium"
                        cornerRadius="medium"
                        backgroundColor={Theme.colors.surface}
                        border="thin"
                        borderColor={Theme.colors.success}
                        alignment="center middle"
                        gap="medium"
                        onPress={!processing ? () => onSelectDifficulty('easy') : undefined}
                    >
                        <vstack grow>
                            <text size="large" weight="bold" color={Theme.colors.success}>EASY</text>
                            <text size="small" color={Theme.colors.textDim}>Safe bet — most people know this</text>
                        </vstack>
                        <vstack alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#0A2A0A">
                            <text size="large" weight="bold" color={Theme.colors.success}>+1</text>
                            <text size="xsmall" color={Theme.colors.textDim}>pt</text>
                        </vstack>
                    </hstack>

                    {/* Normal */}
                    <hstack
                        padding="medium"
                        cornerRadius="medium"
                        backgroundColor={Theme.colors.surface}
                        border="thin"
                        borderColor={Theme.colors.warning}
                        alignment="center middle"
                        gap="medium"
                        onPress={!processing ? () => onSelectDifficulty('normal') : undefined}
                    >
                        <vstack grow>
                            <text size="large" weight="bold" color={Theme.colors.warning}>NORMAL</text>
                            <text size="small" color={Theme.colors.textDim}>Solid challenge — think it through</text>
                        </vstack>
                        <vstack alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#2A2A0A">
                            <text size="large" weight="bold" color={Theme.colors.warning}>+2</text>
                            <text size="xsmall" color={Theme.colors.textDim}>pts</text>
                        </vstack>
                    </hstack>

                    {/* Hard */}
                    <hstack
                        padding="medium"
                        cornerRadius="medium"
                        backgroundColor={Theme.colors.surface}
                        border="thin"
                        borderColor={Theme.colors.danger}
                        alignment="center middle"
                        gap="medium"
                        onPress={!processing ? () => onSelectDifficulty('hard') : undefined}
                    >
                        <vstack grow>
                            <text size="large" weight="bold" color={Theme.colors.danger}>HARD</text>
                            <text size="small" color={Theme.colors.textDim}>Big risk, big reward — expert level</text>
                        </vstack>
                        <vstack alignment="center middle" padding="small" cornerRadius="small" backgroundColor="#2A0A0A">
                            <text size="large" weight="bold" color={Theme.colors.danger}>+3</text>
                            <text size="xsmall" color={Theme.colors.textDim}>pts</text>
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
        const difficultyColors: Record<string, string> = {
            easy: Theme.colors.success,
            normal: Theme.colors.warning,
            hard: Theme.colors.danger,
        };
        const diffColor = difficultyColors[state.selectedDifficulty || 'normal'];
        const lastPlayerAnswer = state.player.answers[state.player.answers.length - 1];
        const lastAiAnswer = state.ai.answers[state.ai.answers.length - 1];
        const lastAiDifficulty = state.ai.difficultyChoices[state.ai.difficultyChoices.length - 1];

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                <NarrativeHeader
                    title="OUTSMARTED AGAIN"
                    subtitle={`${round.category} — Round ${state.currentRound + 1}`}
                    accentColor={accentColor}
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
                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={accentColor} alignment="center middle">
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
                                padding="small"
                                cornerRadius="small"
                                backgroundColor={bgColor}
                                border="thin"
                                borderColor={borderColor}
                                alignment="start middle"
                                gap="small"
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

                {/* Result + Next */}
                {state.phase === 'round_result' && (
                    <vstack padding="small" alignment="center middle" gap="small">
                        <text size="small" color={lastPlayerAnswer === q.correctIndex ? Theme.colors.success : Theme.colors.danger} weight="bold">
                            {lastPlayerAnswer === q.correctIndex
                                ? `Correct! +${DIFFICULTY_POINTS[state.selectedDifficulty || 'normal']} pts`
                                : `Wrong! Answer: ${q.options[q.correctIndex]}`}
                        </text>
                        <text size="xsmall" color={Theme.colors.textDim}>
                            AI chose {lastAiDifficulty} and {state.ai.correct[state.ai.correct.length - 1] ? 'got it right' : 'got it wrong'}
                        </text>
                        <button appearance="primary" size="small" onPress={onNext}>
                            {state.currentRound + 1 >= state.totalRounds ? 'SEE RESULTS' : 'NEXT ROUND'}
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
