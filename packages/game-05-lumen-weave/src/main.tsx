import { Devvit, useAsync, useState } from '@devvit/public-api';
import './global.d.ts';
import { Leaderboard, LeaderboardUI, NarrativeHeader, Theme } from 'shared';
import { GRID_SIZE, LumenWeaveServer, LumenWeaveState, Sigil } from './LumenWeaveServer';

const CELL_GLYPHS = ['.', 'o', '*'];
const CELL_COLORS = [
    { bg: '#0A1023', fg: '#5B6EBE', border: '#1E2A52' },
    { bg: '#0A2435', fg: '#53EAFF', border: '#12617A' },
    { bg: '#341136', fg: '#FF76DD', border: '#8A2E8C' },
];

const SIGIL_INFO: Record<Sigil, { label: string; motif: string; hint: string }> = {
    burst: {
        label: 'Prism Burst',
        motif: '+',
        hint: 'Pulse center + cross',
    },
    orbit: {
        label: 'Orbit Fold',
        motif: 'O',
        hint: 'Rotate local ring',
    },
    phase: {
        label: 'Phase Lattice',
        motif: 'X',
        hint: 'Twist row/col + diagonals',
    },
};

const matchPercent = (state: LumenWeaveState): number => {
    const cells = GRID_SIZE * GRID_SIZE;
    return Math.round((state.currentMatch / cells) * 100);
};

Devvit.configure({
    redditAPI: true,
    redis: true,
});

Devvit.addMenuItem({
    label: 'Create Lumen Weave Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: 'Lumen Weave - reshape a neon grid in 9 moves',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor="#070B1D" gap="small">
                    <text color="#53EAFF" size="xlarge" weight="bold">LUMEN WEAVE</text>
                    <text color="#FF76DD" size="small">A chroma puzzle built for fast replay.</text>
                </vstack>
            ),
        });
        context.ui.showToast('Lumen Weave post created');
    },
});

Devvit.addCustomPostType({
    name: 'Lumen Weave',
    height: 'tall',
    render: (context) => {
        const server = new LumenWeaveServer(context as any);
        const [userId] = useState(() => context.userId || 'test-user');
        const [selectedSigil, setSelectedSigil] = useState<Sigil>('burst');
        const [localState, setLocalState] = useState<any>(null);
        const [processing, setProcessing] = useState(false);

        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const { data: initialData, loading, error } = useAsync<any>(async () => {
            const state = await server.getGameState(userId);
            return { state };
        });

        const state: LumenWeaveState | null = (localState?.state || initialData?.state || null) as LumenWeaveState | null;

        const loadLeaderboard = async (): Promise<void> => {
            setLbLoading(true);
            const lb = new Leaderboard(context as any, 'game5_lumen');
            const entries = await lb.getTop(10);
            setLeaderboardData(entries);
            setLbLoading(false);
        };

        const onTapCell = async (index: number): Promise<void> => {
            if (!state || processing || state.gameOver) return;
            setProcessing(true);
            const updated = await server.applyMove(userId, selectedSigil, index);
            setLocalState({ state: updated });
            setProcessing(false);
        };

        const onReset = async (): Promise<void> => {
            setProcessing(true);
            const reset = await server.resetGame(userId);
            setLocalState({ state: reset });
            setProcessing(false);
        };

        if (loading && !state) {
            return (
                <vstack height="100%" alignment="center middle" backgroundColor="#070B1D" gap="small">
                    <text size="xlarge" weight="bold" color="#53EAFF">LUMEN WEAVE</text>
                    <text size="small" color="#89A7C2">Spooling the daily pattern...</text>
                </vstack>
            );
        }

        if (!state) {
            return (
                <vstack height="100%" alignment="center middle" backgroundColor={Theme.colors.background} gap="small">
                    <text size="large" weight="bold" color={Theme.colors.danger}>Load Error</text>
                    <text size="small" color={Theme.colors.textDim}>{error?.message || 'Try reopening this post.'}</text>
                </vstack>
            );
        }

        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="LUMEN ARCHITECTS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                    scoreLabel="flux"
                    currentUserId={userId}
                />
            );
        }

        const renderGrid = (board: number[], clickable: boolean, compact = false): JSX.Element => {
            const cellSize = compact ? '26px' : '46px';
            const fontSize = compact ? 'xsmall' : 'large';

            return (
                <vstack gap="small" alignment="center middle">
                    {Array.from({ length: GRID_SIZE }).map((_, row) => (
                        <hstack key={`row-${row}`} gap="small" alignment="center middle">
                            {Array.from({ length: GRID_SIZE }).map((__, col) => {
                                const index = row * GRID_SIZE + col;
                                const tone = CELL_COLORS[board[index]];
                                return (
                                    <vstack
                                        key={`cell-${index}`}
                                        width={cellSize}
                                        height={cellSize}
                                        alignment="center middle"
                                        cornerRadius={compact ? 'small' : 'medium'}
                                        backgroundColor={tone.bg}
                                        border="thin"
                                        borderColor={tone.border}
                                        onPress={clickable ? () => onTapCell(index) : undefined}
                                    >
                                        <text size={fontSize} weight="bold" color={tone.fg}>{CELL_GLYPHS[board[index]]}</text>
                                    </vstack>
                                );
                            })}
                        </hstack>
                    ))}
                </vstack>
            );
        };

        if (state.gameOver) {
            const solved = state.solved;
            return (
                <vstack height="100%" width="100%" backgroundColor="#070B1D" padding="medium" gap="medium" alignment="center middle">
                    <NarrativeHeader
                        title="LUMEN WEAVE"
                        subtitle={solved ? 'Pattern Stabilized' : 'Field Destabilized'}
                        accentColor={solved ? '#53EAFF' : '#FF6A93'}
                        onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                    />

                    <vstack width="100%" gap="small" padding="medium" backgroundColor="#0E162E" border="thin" borderColor={solved ? '#53EAFF' : '#FF6A93'} cornerRadius="medium" alignment="center middle">
                        <text size="xlarge" weight="bold" color={solved ? '#53EAFF' : '#FF6A93'}>
                            {solved ? 'You solved the weave.' : 'Almost. The weave fought back.'}
                        </text>
                        <text size="small" color="#89A7C2">Score: {state.score.toLocaleString()} flux</text>
                        <text size="small" color="#89A7C2">Match: {state.currentMatch}/{GRID_SIZE * GRID_SIZE} ({matchPercent(state)}%)</text>
                        <text size="small" color="#89A7C2">Best resonance run: {state.bestMatch} matched cells</text>
                    </vstack>

                    <vstack width="100%" alignment="center middle" gap="small" padding="small" backgroundColor="#101D36" cornerRadius="small" border="thin" borderColor="#1E2A52">
                        <text size="small" color="#53EAFF">Target Pattern</text>
                        {renderGrid(state.target, false, true)}
                    </vstack>

                    <hstack gap="small">
                        <button appearance="primary" size="medium" onPress={onReset}>Play Again</button>
                        <button appearance="secondary" size="small" onPress={async () => {
                            try {
                                if (!context.postId) return;
                                const summary = state.solved
                                    ? `I solved today's Lumen Weave with ${state.movesLeft} moves left and scored ${state.score} flux.`
                                    : `I reached ${state.currentMatch}/${GRID_SIZE * GRID_SIZE} on today's Lumen Weave and scored ${state.score} flux.`;
                                await context.reddit.submitComment({
                                    id: context.postId,
                                    text: `${summary} Can you beat it?`
                                });
                                context.ui.showToast('Shared to comments');
                            } catch (_error) {
                                context.ui.showToast('Could not post share comment');
                            }
                        }}>Share</button>
                    </hstack>
                </vstack>
            );
        }

        return (
            <vstack height="100%" width="100%" backgroundColor="#070B1D" padding="small" gap="small">
                <NarrativeHeader
                    title="LUMEN WEAVE"
                    subtitle={`Day ${state.dayKey} | Turn ${state.turn + 1}/${state.totalMoves}`}
                    accentColor="#53EAFF"
                    onLeaderboard={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                />

                <hstack width="100%" backgroundColor="#0F1830" border="thin" borderColor="#1E2A52" cornerRadius="small" padding="small" alignment="space-between middle">
                    <vstack>
                        <text size="xsmall" color="#89A7C2">Moves Left</text>
                        <text size="large" weight="bold" color="#53EAFF">{state.movesLeft}</text>
                    </vstack>
                    <vstack alignment="center middle">
                        <text size="xsmall" color="#89A7C2">Match</text>
                        <text size="large" weight="bold" color="#FF76DD">{matchPercent(state)}%</text>
                    </vstack>
                    <vstack alignment="end middle">
                        <text size="xsmall" color="#89A7C2">Resonance</text>
                        <text size="large" weight="bold" color="#FFC658">{state.resonance}/3</text>
                    </vstack>
                </hstack>

                <hstack width="100%" gap="small" alignment="start middle">
                    <vstack grow padding="small" backgroundColor="#0E162E" cornerRadius="small" border="thin" borderColor="#1E2A52" gap="small" alignment="center middle">
                        <text size="small" color="#53EAFF">Target Pattern</text>
                        {renderGrid(state.target, false, true)}
                    </vstack>

                    <vstack grow padding="small" backgroundColor="#0E162E" cornerRadius="small" border="thin" borderColor="#1E2A52" gap="small" alignment="center middle">
                        <text size="small" color="#FF76DD">Your Field</text>
                        {renderGrid(state.board, true)}
                    </vstack>
                </hstack>

                <vstack width="100%" backgroundColor="#101D36" cornerRadius="small" border="thin" borderColor="#1E2A52" padding="small" gap="small">
                    <text size="small" color="#89A7C2">Sigil Controls</text>
                    <hstack gap="small">
                        {(Object.keys(SIGIL_INFO) as Sigil[]).map((sigil) => {
                            const info = SIGIL_INFO[sigil];
                            return (
                                <button
                                    key={sigil}
                                    appearance={selectedSigil === sigil ? 'primary' : 'secondary'}
                                    size="small"
                                    onPress={() => setSelectedSigil(sigil)}
                                >
                                    {info.motif} {info.label}
                                </button>
                            );
                        })}
                    </hstack>
                    <text size="xsmall" color="#89A7C2">{SIGIL_INFO[selectedSigil].hint}</text>
                    <text size="xsmall" color="#FFC658">Fill resonance to 3 and your next move mirrors across the grid.</text>
                    {state.echoTriggered ? <text size="xsmall" color="#53EAFF">Mirror echo just fired.</text> : null}
                </vstack>

                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
