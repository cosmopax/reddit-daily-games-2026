import { Devvit, useState, useAsync } from '@devvit/public-api';
import { DuelServer, DuelState } from './DuelServer';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

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

        import { Theme } from 'shared';

        // ... (render start)

        if (loading) return <vstack><text>Loading Arena...</text></vstack>;
        if (!state) return <vstack><text>Error loading arena.</text></vstack>;

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                <hstack alignment="center middle">
                    <text size="xlarge" weight="bold" color={Theme.colors.primary}>NEON ARENA</text>
                </hstack>

                <hstack alignment="space-between middle" width="100%" padding="small">
                    <vstack>
                        <text weight="bold" color={Theme.colors.secondary}>YOU</text>
                        <text color={Theme.colors.text} size="large">{state.userHealth} HP</text>
                    </vstack>
                    <text color={Theme.colors.textDim}>VS</text>
                    <vstack alignment="end">
                        <text weight="bold" color={Theme.colors.danger}>AI</text>
                        <text color={Theme.colors.text} size="large">{state.aiHealth} HP</text>
                    </vstack>
                </hstack>

                <vstack grow backgroundColor={Theme.colors.surface} cornerRadius="medium" padding="small" gap="small">
                    {state.history.slice(-5).map((log, i) => (
                        <text key={i} color={Theme.colors.text}>{log}</text>
                    ))}
                </vstack>

                <hstack padding="small" gap="medium">
                    <textfield placeholder="Cast Spell..." onChange={(v) => setMove(v)} />
                    <button appearance="primary" onPress={onAttack} disabled={state.gameOver || state.turn === 'ai'}>ATTACK</button>
                </hstack>

                {state.gameOver && (
                    <button appearance="bordered" onPress={onReset}>PLAY AGAIN</button>
                )}

                {/* Brand Footer */}
                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
