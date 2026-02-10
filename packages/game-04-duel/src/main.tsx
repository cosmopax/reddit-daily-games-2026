import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { DuelServer, DuelState } from './DuelServer';
import { Theme, Leaderboard, LeaderboardUI, NarrativeHeader } from 'shared';

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
        isSecret: false,
        scope: SettingScope.Installation,
    },
]);

Devvit.addMenuItem({
    label: 'Create Duel of Minds Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: '🧠 Duel of Minds — 1v1 Trivia vs AI!',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color="#00D4FF" size="xlarge" weight="bold">DUEL OF MINDS</text>
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
        const [localState, setLocalState] = useState<any>(null);
        const [processing, setProcessing] = useState(false);

        // Leaderboard hooks (before any early return)
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

        const onReset = async () => {
            setProcessing(true);
            const newState = await server.resetGame(userId);
            setLocalState({ state: newState });
            setProcessing(false);
        };

        // ─── LOADING ───────────────────
        if (loading && !state) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color="#00D4FF" size="large" weight="bold">DUEL OF MINDS</text>
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

        const accentColor = '#00D4FF';
        const q = state.questions[state.currentRound];

        // ─── GAME OVER ─────────────────
        if (state.gameOver) {
            const won = state.userScore > state.aiScore;
            const tied = state.userScore === state.aiScore;
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    <NarrativeHeader
                        title="DUEL OF MINDS"
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
                                <text size="xxlarge" weight="bold" color={Theme.colors.success}>{state.userScore}</text>
                            </vstack>
                            <text size="large" color={Theme.colors.textDim}>vs</text>
                            <vstack alignment="center middle">
                                <text size="small" color={Theme.colors.textDim}>AI</text>
                                <text size="xxlarge" weight="bold" color={Theme.colors.danger}>{state.aiScore}</text>
                            </vstack>
                        </hstack>
                        <text size="small" color={Theme.colors.textDim}>out of {state.totalRounds} questions</text>
                    </vstack>

                    <hstack gap="small">
                        <button appearance="primary" size="medium" onPress={onReset}>PLAY AGAIN</button>
                        <button appearance="secondary" size="small" onPress={async () => {
                            try {
                                if (!context.postId) return;
                                const result = won ? 'beat' : tied ? 'tied with' : 'lost to';
                                await context.reddit.submitComment({
                                    id: context.postId,
                                    text: `I ${result} the AI ${state.userScore}-${state.aiScore} in Duel of Minds! Can you beat my score?`
                                });
                                context.ui.showToast('Shared!');
                            } catch (e) { context.ui.showToast('Could not share'); }
                        }}>Share</button>
                    </hstack>
                </vstack>
            );
        }

        // ─── QUESTION SCREEN ────────────
        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                <NarrativeHeader
                    title="DUEL OF MINDS"
                    subtitle={`Round ${state.currentRound + 1} of ${state.totalRounds}`}
                    accentColor={accentColor}
                    onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                />

                {/* Score Bar */}
                <hstack padding="small" backgroundColor={Theme.colors.surface} cornerRadius="small" alignment="space-between middle" width="100%">
                    <hstack gap="small" alignment="center middle">
                        <text size="small" color={Theme.colors.textDim}>You:</text>
                        <text size="medium" weight="bold" color={Theme.colors.success}>{state.userScore}</text>
                    </hstack>
                    <vstack alignment="center middle">
                        <text size="xsmall" color={accentColor}>{q.category}</text>
                    </vstack>
                    <hstack gap="small" alignment="center middle">
                        <text size="small" color={Theme.colors.textDim}>AI:</text>
                        <text size="medium" weight="bold" color={Theme.colors.danger}>{state.aiScore}</text>
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

                        if (state.showResult) {
                            if (i === q.correctIndex) {
                                bgColor = '#0A2A0A';
                                borderColor = Theme.colors.success;
                                textColor = Theme.colors.success;
                            } else if (i === state.userAnswer && i !== q.correctIndex) {
                                bgColor = '#2A0A0A';
                                borderColor = Theme.colors.danger;
                                textColor = Theme.colors.danger;
                            }
                        } else if (i === state.userAnswer) {
                            borderColor = accentColor;
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
                                onPress={!state.showResult && !processing ? () => onAnswer(i) : undefined}
                            >
                                <vstack width="24px" height="24px" cornerRadius="full" backgroundColor={borderColor} alignment="center middle">
                                    <text size="small" weight="bold" color="#FFFFFF">{String.fromCharCode(65 + i)}</text>
                                </vstack>
                                <text size="medium" color={textColor} wrap>{option}</text>
                                {state.showResult && i === state.aiAnswer && (
                                    <text size="xsmall" color={Theme.colors.textDim}> (AI picked)</text>
                                )}
                            </hstack>
                        );
                    })}
                </vstack>

                {/* Result + Next */}
                {state.showResult && (
                    <vstack padding="small" alignment="center middle" gap="small">
                        <text size="small" color={state.userAnswer === q.correctIndex ? Theme.colors.success : Theme.colors.danger} weight="bold">
                            {state.userAnswer === q.correctIndex ? 'Correct!' : `Wrong! Answer: ${q.options[q.correctIndex]}`}
                        </text>
                        <text size="xsmall" color={Theme.colors.textDim}>
                            AI {state.aiAnswer === q.correctIndex ? 'got it right' : 'got it wrong'}
                        </text>
                        <button appearance="primary" size="small" onPress={onNext}>
                            {state.currentRound + 1 >= state.totalRounds ? 'SEE RESULTS' : 'NEXT QUESTION'}
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
