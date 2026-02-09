import { Devvit, useState, useAsync, useForm, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { DuelServer, DuelState } from './DuelServer';
import { Theme, Leaderboard, LeaderboardUI, NarrativeHeader, getValkyrieProfile } from 'shared';

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
            title: '⚔️ Outsmarted — Battle the Cyber-Valkyries!',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.danger} size="xlarge" weight="bold">DUEL PROTOCOL INITIATING...</text>
                    <text color={Theme.colors.textDim} size="small">Scanning for opponents...</text>
                </vstack>
            ),
        });
        context.ui.showToast('Game post created!');
    },
});

type DuelScreen = 'intro' | 'battle' | 'leaderboard';

Devvit.addCustomPostType({
    name: 'AI Duel',
    height: 'tall',
    render: (context) => {
        const server = new DuelServer(context as any);
        const [userId] = useState(() => context.userId || 'test-user');
        const [processing, setProcessing] = useState(false);
        const [screen, setScreen] = useState<DuelScreen>('intro');

        const { data: initialData, loading } = useAsync<any>(async () => {
            const state = await server.getDuelState(userId);
            return { state } as any;
        });
        const [localState, setLocalState] = useState<any>(null);
        const state: DuelState | null = localState?.state || initialData?.state;

        const attackForm = useForm(
            {
                fields: [{ type: 'string' as const, name: 'move', label: 'Your Attack', placeholder: 'Quantum disruption blast...' }],
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
            setScreen('intro'); // Show intro for new opponent
        };

        // Leaderboard
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const lb = new Leaderboard(context, 'game4_duel');
            const data = await lb.getTop(10);
            setLeaderboardData(data);
            setLbLoading(false);
        };

        // ─── LOADING ───────────────────
        if (loading && !state) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.danger} size="large" weight="bold">OUTSMARTED</text>
                    <spacer size="small" />
                    <text color={Theme.colors.textDim} size="small">Scanning for opponents...</text>
                </vstack>
            );
        }
        if (!state) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.danger}>Error loading arena</text>
                </vstack>
            );
        }

        // Get Valkyrie profile for theming
        const valkyrie = getValkyrieProfile(state.opponentRole || '');
        const opponentPortrait = state.opponentPortrait || valkyrie.portraitUrl;

        // ─── LEADERBOARD ───────────────
        if (screen === 'leaderboard') {
            return (
                <LeaderboardUI
                    title="VALKYRIE SLAYERS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setScreen('battle')}
                    scoreLabel="wins"
                    currentUserId={userId}
                />
            );
        }

        // ─── INTRO SCREEN ──────────────
        if (screen === 'intro') {
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    {/* Title */}
                    <vstack alignment="center middle">
                        <text size="xxlarge" weight="bold" color={Theme.colors.danger}>OUTSMARTED</text>
                        <text size="small" color={Theme.colors.textDim}>Duel of Minds — You vs AI</text>
                        <text size="xsmall" color={Theme.colors.textDim}>How to play: execute one move per turn, spend credits for stronger attacks, survive to win.</text>
                    </vstack>

                    <spacer size="small" />

                    {/* Duel Protocol Banner */}
                    <vstack padding="small" cornerRadius="small" backgroundColor={Theme.narrative.noir} border="thin" borderColor={Theme.colors.danger} alignment="center middle">
                        <text size="medium" weight="bold" color={Theme.colors.danger}>⚡ DUEL PROTOCOL INITIATED ⚡</text>
                        <text size="small" color={Theme.colors.textDim}>Opponent locked. Combat imminent.</text>
                        <text size="small" color={Theme.colors.warning}>Starting Credits: {Math.floor(state.credits)}</text>
                    </vstack>

                    <spacer size="small" />

                    {/* Opponent Reveal */}
                    <vstack
                        padding="medium"
                        cornerRadius="medium"
                        backgroundColor={valkyrie.bgTint}
                        border="thin"
                        borderColor={valkyrie.accentColor}
                        alignment="center middle"
                        gap="small"
                        width="100%"
                    >
                        <image
                            url={opponentPortrait}
                            imageWidth={80}
                            imageHeight={80}
                            resizeMode="cover"
                        />
                        <text size="large" weight="bold" color={valkyrie.accentColor}>
                            {state.opponentName || valkyrie.name}
                        </text>
                        <text size="small" color={Theme.colors.textDim}>{valkyrie.role}</text>
                        <text size="small" color={Theme.colors.text} wrap alignment="center">
                            "{valkyrie.tagline}"
                        </text>
                    </vstack>

                    <spacer size="medium" />

                    <button appearance="destructive" size="medium" onPress={() => setScreen('battle')}>
                        ENGAGE COMBAT
                    </button>

                    <button appearance="plain" size="small" onPress={() => { setScreen('leaderboard'); loadLeaderboard(); }}>
                        🏆 View Rankings
                    </button>
                </vstack>
            );
        }

        // ─── BATTLE SCREEN ─────────────
        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                <NarrativeHeader
                    title="OUTSMARTED"
                    subtitle={`vs ${state.opponentName || 'GEMINI CORE'}`}
                    accentColor={valkyrie.accentColor}
                    onLeaderboard={() => { setScreen('leaderboard'); loadLeaderboard(); }}
                />

                {/* Battle Arena */}
                <vstack grow backgroundColor={Theme.colors.surface} cornerRadius="medium" padding="small" border="thin" borderColor={valkyrie.accentColor}>

                    {/* HUD */}
                    <hstack alignment="space-between middle" width="100%" padding="small">
                        {/* Player HUD */}
                        <vstack alignment="start">
                            <text weight="bold" color={Theme.colors.secondary} size="small">COMMANDER</text>
                            <text color={Theme.colors.success} size="xlarge" weight="bold">{state.userHealth} HP</text>
                            <vstack width="100px" height="4px" backgroundColor="#333333" cornerRadius="small">
                                <vstack width={`${state.userHealth}%`} height="100%" backgroundColor={Theme.colors.success} cornerRadius="small" />
                            </vstack>
                        </vstack>

                        <text color={Theme.colors.warning} size="large" weight="bold">VS</text>

                        {/* AI HUD with portrait */}
                        <vstack alignment="end">
                            <hstack gap="small" alignment="center middle">
                                <vstack alignment="end">
                                    <text weight="bold" color={valkyrie.accentColor} size="small">{state.opponentName || valkyrie.name}</text>
                                    <text color={Theme.colors.textDim} size="xsmall">{valkyrie.role}</text>
                                </vstack>
                                <image
                                    url={opponentPortrait}
                                    imageWidth={32}
                                    imageHeight={32}
                                    resizeMode="cover"
                                />
                            </hstack>
                            <text color={Theme.colors.danger} size="xlarge" weight="bold">{state.aiHealth} HP</text>
                            <vstack width="100px" height="4px" backgroundColor="#333333" cornerRadius="small">
                                <vstack width={`${state.aiHealth}%`} height="100%" backgroundColor={Theme.colors.danger} cornerRadius="small" />
                            </vstack>
                        </vstack>
                    </hstack>
                    <hstack alignment="space-between middle" padding="small">
                        <text size="small" color={Theme.colors.warning}>Credits: {Math.floor(state.credits)}</text>
                        <text size="small" color={Theme.colors.textDim}>Overclock costs 10 credits (+2 damage)</text>
                    </hstack>

                    <spacer size="small" />

                    {/* Battle Log (Terminal Style) */}
                    <vstack grow backgroundColor="#000000" cornerRadius="small" padding="small" gap="small">
                        {state.history.slice(-8).map((log: string, i: number) => {
                            // Color-code battle log entries
                            const isUser = log.startsWith('You ') || log.includes('COMMANDER');
                            const isAI = log.startsWith('AI ') || log.includes(state.opponentName || '');
                            const isSystem = log.includes('Protocol') || log.includes('VICTORY') || log.includes('DEFEAT');
                            const logColor = isSystem ? Theme.colors.warning
                                : isUser ? Theme.colors.secondary
                                : isAI ? valkyrie.accentColor
                                : Theme.colors.text;

                            return (
                                <hstack key={`${i}`}>
                                    <text color={isSystem ? Theme.colors.warning : Theme.narrative.terminalGreen} size="small">{'>'}</text>
                                    <spacer size="small" />
                                    <text color={logColor} size="small" wrap>{log}</text>
                                </hstack>
                            );
                        })}
                    </vstack>

                    <spacer size="small" />

                    {/* Controls */}
                    {!state.gameOver ? (
                        <button appearance="primary" onPress={() => context.ui.showForm(attackForm)} disabled={state.gameOver || state.turn === 'ai' || processing}>
                            {processing ? 'PROCESSING...' : state.turn === 'ai' ? 'AI THINKING...' : '⚔️ EXECUTE MOVE'}
                        </button>
                    ) : (
                        <vstack padding="small" alignment="center middle" gap="small">
                            <text color={state.userHealth > 0 ? Theme.colors.success : Theme.colors.danger} weight="bold" size="large">
                                {state.userHealth > 0 ? '🏆 VICTORY!' : '💀 DEFEAT...'}
                            </text>
                            <text size="small" color={Theme.colors.textDim}>Career Wins: {state.wins || 0} | Credits: {Math.floor(state.credits)}</text>
                            <hstack gap="small">
                                <button appearance="primary" onPress={onReset}>NEW OPPONENT</button>
                                <button appearance="secondary" size="small" onPress={async () => {
                                    try {
                                        const postId = context.postId;
                                        if (!postId) return;
                                        const outcome = state.userHealth > 0 ? 'defeated' : 'was bested by';
                                        await context.reddit.submitComment({
                                            id: postId,
                                            text: `I ${outcome} ${state.opponentName || 'the Cyber-Valkyrie'} (${valkyrie.role}) in Outsmarted! Can you beat my score?`
                                        });
                                        context.ui.showToast('Shared to comments!');
                                    } catch (e) {
                                        context.ui.showToast('Could not share');
                                    }
                                }}>Share</button>
                            </hstack>
                        </vstack>
                    )}
                </vstack>

                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
