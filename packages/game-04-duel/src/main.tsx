import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
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
        name: 'HUGGINGFACE_TOKEN',
        label: 'Hugging Face API Token',
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
    name: 'AI Duel',
    render: (context) => {
        const server = new DuelServer(context);
        const [userId] = useState(() => context.userId || 'test-user');
        const [move, setMove] = useState('');

        const { data, loading, error, refresh } = useAsync<{ state: DuelState }>(async () => {
            const state = await server.getDuelState(userId);
            return { state };
        });

        const state = data?.state;

        const onAttack = async () => {
            if (!move || !state) return;
            // Optimistic update could happen here
            await server.submitMove(userId, move);
            setMove('');
            // Trigger refresh
            // In 0.11, simpler to just force re-render via state update or await the result
            const newState = await server.getDuelState(userId);
            // We lack a clean way to mutate 'data' from useAsync without re-triggering it.
            // For now, we rely on standard re-render flow if we passed state down, 
            // but useAsync holds it. We might need a local state copy.
        };

        const onReset = async () => {
            await server.resetGame(userId);
            // refresh();
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
                />
            );
        }

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                {/* Header */}
                <vstack alignment="center middle" padding="small">
                    <hstack alignment="space-between middle" width="100%">
                        <spacer />
                        <vstack alignment="center middle">
                            <text size="xlarge" weight="bold" color={Theme.colors.primary}>OUTSMARTED</text>
                            <text size="small" color={Theme.colors.textDim}>vs Gemini 2.0 Flash</text>
                        </vstack>
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
                            <text weight="bold" color={Theme.colors.danger}>GEMINI CORE</text>
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
                                <text color={Theme.colors.primary} size="small" style="mono">{`>`}</text>
                                <spacer size="small" />
                                <text color={Theme.colors.text} size="small" style="mono">{log}</text>
                            </hstack>
                        ))}
                    </vstack>

                    <spacer size="medium" />

                    {/* Controls */}
                    <vstack gap="small">
                        <textfield placeholder="Cast Spell or Hack System..." onChange={(v) => setMove(v)} />
                        <button appearance="primary" onPress={onAttack} disabled={state.gameOver || state.turn === 'ai'}>
                            {state.turn === 'ai' ? 'AI THINKING...' : 'EXECUTE MOVE'}
                        </button>
                    </vstack>

                    {state.gameOver && (
                        <vstack padding="small" alignment="center middle">
                            <text color={Theme.colors.gold} weight="bold" size="large">GAME OVER</text>
                            <button appearance="bordered" onPress={onReset}>REBOOT SYSTEM</button>
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
