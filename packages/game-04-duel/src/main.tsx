import { Devvit, useState, useAsync, useForm, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { DuelServer, DuelState } from './DuelServer';
import { Theme, Leaderboard, LeaderboardUI } from 'shared';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

// App settings for API keys
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
    label: 'Create AI Duel Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: '⚔️ AI Duel — Outsmart the Cyber-Valkyrie!',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.accent} size="xlarge" weight="bold">Loading AI Duel...</text>
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
        const [processing, setProcessing] = useState(false);

        const { data: initialData, loading } = useAsync<any>(async () => {
            const state = await server.getDuelState(userId);
            return { state } as any;
        });
        const [localState, setLocalState] = useState<any>(null);
        const state = localState?.state || initialData?.state;

        const attackForm = useForm(
            {
                fields: [{ type: 'string' as const, name: 'move', label: 'Your Attack', placeholder: 'Cast Spell or Hack System...' }],
                title: 'Execute Move',
                acceptLabel: 'ATTACK!'
            },
            async (values) => {
                if (!values.move || !state) return;
                setProcessing(true);
                const newState = await server.submitMove(userId, values.move);
                setLocalState({ state: newState });
                setProcessing(false);
            }
        );

        const onReset = async () => {
            const newState = await server.resetGame(userId);
            setLocalState({ state: newState });
        };

        // Render the arena UI

        if (loading) return <vstack><text>Loading Arena...</text></vstack>;
        if (!state) return <vstack><text>Error loading arena.</text></vstack>;

        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const lb = new Leaderboard(context, 'game4_duel');
            const data = await lb.getTop(10);
            setLeaderboardData(data);
            setLbLoading(false);
        };

        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="VALKYRIE SLAYERS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                    scoreLabel="wins"
                    currentUserId={userId}
                />
            );
        }

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                {/* Header */}
                <vstack alignment="center middle" padding="small">
                    <hstack alignment="middle" width="100%">
                        <spacer />
                        <text size="large" weight="bold" color={Theme.colors.primary}>CYBER DUEL v2.0</text>
                        <button appearance="plain" size="small" onPress={() => { setShowLeaderboard(true); loadLeaderboard(); }}>🏆 Rank</button>
                    </hstack>
                </vstack>

                <spacer size="medium" />

                {/* Battle Arena */}
                <vstack grow backgroundColor={Theme.colors.surface} cornerRadius="medium" padding="medium" border="thin" borderColor={Theme.colors.surfaceHighlight}>

                    {/* HUD */}
                    <hstack alignment="space-between middle" width="100%" padding="small">
                        {/* Player HUD */}
                        <vstack alignment="start">
                            <text weight="bold" color={Theme.colors.secondary}>COMMANDER</text>
                            <text color={Theme.colors.success} size="xlarge" weight="bold">{state.userHealth} HP</text>
                            <vstack width="100px" height="4px" backgroundColor="#333333" cornerRadius="small">
                                <vstack width={`${state.userHealth}%`} height="100%" backgroundColor={Theme.colors.success} cornerRadius="small" />
                            </vstack>
                        </vstack>

                        <text color={Theme.colors.warning} size="large" weight="bold">VS</text>

                        {/* AI HUD */}
                        <vstack alignment="end">
                            <text weight="bold" color={Theme.colors.danger}>{state.opponentName || 'GEMINI CORE'}</text>
                            <text color={Theme.colors.danger} size="xlarge" weight="bold">{state.aiHealth} HP</text>
                            <vstack width="100px" height="4px" backgroundColor="#333333" cornerRadius="small">
                                <vstack width={`${state.aiHealth}%`} height="100%" backgroundColor={Theme.colors.danger} cornerRadius="small" />
                            </vstack>
                        </vstack>
                    </hstack>

                    <spacer size="medium" />

                    {/* Battle Log (Terminal Style) */}
                    <vstack grow backgroundColor="#000000" cornerRadius="small" padding="small" gap="small">
                        {state.history.slice(-6).map((log, i) => (
                            <hstack key={i}>
                                <text color={Theme.colors.primary} size="small">{`>`}</text>
                                <spacer size="small" />
                                <text color={Theme.colors.text} size="small">{log}</text>
                            </hstack>
                        ))}
                    </vstack>

                    <spacer size="medium" />

                    {/* Controls */}
                    <vstack gap="small">
                        <button appearance="primary" onPress={() => context.ui.showForm(attackForm)} disabled={state.gameOver || state.turn === 'ai' || processing}>
                            {processing ? 'PROCESSING...' : state.turn === 'ai' ? 'AI THINKING...' : 'EXECUTE MOVE'}
                        </button>
                    </vstack>

                    {state.gameOver && (
                        <vstack padding="small" alignment="center middle" gap="small">
                            <text color={state.userHealth > 0 ? Theme.colors.success : Theme.colors.danger} weight="bold" size="large">
                                {state.userHealth > 0 ? 'VICTORY!' : 'DEFEAT...'}
                            </text>
                            <hstack gap="small">
                                <button appearance="bordered" onPress={onReset}>REBOOT SYSTEM</button>
                                <button appearance="secondary" size="small" onPress={async () => {
                                    try {
                                        const postId = context.postId;
                                        if (!postId) return;
                                        const outcome = state.userHealth > 0 ? 'defeated' : 'was bested by';
                                        await context.reddit.submitComment({
                                            id: postId,
                                            text: `I ${outcome} the Cyber-Valkyrie in AI Duel! Try to beat my score on the leaderboard.`
                                        });
                                        context.ui.showToast('Shared to comments!');
                                    } catch (e) {
                                        context.ui.showToast('Could not share - try again');
                                    }
                                }}>Share Result</button>
                            </hstack>
                        </vstack>
                    )}
                </vstack>

                {/* Brand Footer */}
                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
