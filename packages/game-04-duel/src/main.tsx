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

        if (loading) return <vstack><text>Loading Arena...</text></vstack>;
        if (!state) return <vstack><text>Error loading arena.</text></vstack>;

        return (
            <vstack height="100%" width="100%" backgroundColor="#2a0a3b" padding="medium">
                <text style="heading" color="#FF00FF">NEON ARENA</text>

                <hstack alignment="spaceBetween" width="100%" padding="small">
                    <vstack>
                        <text color="#00FFFF">YOU</text>
                        <text color="#FFFFFF" size="large">{state.userHealth} HP</text>
                    </vstack>
                    <text color="#FFFFFF">VS</text>
                    <vstack>
                        <text color="#FF0000">AI</text>
                        <text color="#FFFFFF" size="large">{state.aiHealth} HP</text>
                    </vstack>
                </hstack>

                <vstack height="200px" backgroundColor="#111111" cornerRadius="small" padding="small">
                    {state.history.slice(-5).map((log, i) => (
                        <text key={i} color="#BBBBBB">{log}</text>
                    ))}
                </vstack>

                <hstack padding="small">
                    <textfield placeholder="Cast Spell..." onChange={(v) => setMove(v)} />
                    <button onPress={onAttack} disabled={state.gameOver || state.turn === 'ai'}>ATTACK</button>
                </hstack>

                {state.gameOver && (
                    <button onPress={onReset}>PLAY AGAIN</button>
                )}
            </vstack>
        );
    },
});

export default Devvit;
