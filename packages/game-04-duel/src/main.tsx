import { Devvit, useState, useAsync } from '@devvit/public-api';
import { DuelServer, DuelState } from './DuelServer';
import { EpisodeHeader, Theme, Leaderboard, LeaderboardUI, getTodayEpisode } from 'shared';

Devvit.configure({
    redditAPI: true,
    http: {
        domains: ['generativelanguage.googleapis.com', 'api.replicate.com', 'router.huggingface.co']
    },
    redis: true,
});

// App settings for API keys
Devvit.addSettings([
    {
        name: 'HUGGINGFACE_TOKEN',
        label: 'Hugging Face API Token',
        type: 'string',
        isSecret: false,
    },
    {
        name: 'GEMINI_API_KEY',
        label: 'Google Gemini API Key',
        type: 'string',
        isSecret: false,
    },
    {
        name: 'NEON_IMAGE_MODE',
        label: 'Neon images (data-URI) mode',
        type: 'string',
        isSecret: false,
        helpText: 'Set to "none" if images fail to render on some clients (e.g. iOS).',
        defaultValue: 'data',
    },
]);

Devvit.addMenuItem({
    label: "Open/Create Today's Valkyrie Arena Post",
    location: 'subreddit',
    onPress: async (_event, context) => {
        const episode = await getTodayEpisode(context);
        const subreddit = await context.reddit.getCurrentSubreddit();
        const postKey = `posts:v1:${subreddit.name}:outsmarted-again:${episode.id}`;
        const existingPostId = await context.redis.get(postKey);
        if (existingPostId) {
            try {
                const post = await context.reddit.getPostById(existingPostId);
                context.ui.navigateTo(post);
                context.ui.showToast("Opened today's post");
                return;
            } catch (e) {
                await context.redis.del(postKey);
            }
        }

        const post = await context.reddit.submitPost({
            title: `${episode.id} // Valkyrie Arena Duel`,
            subredditName: subreddit.name,
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text>Loading VALKYRIE ARENA...</text>
                </vstack>
            ),
        });
        await context.redis.set(postKey, post.id);
        context.ui.navigateTo(post);
        context.ui.showToast("Created today's post");
    },
});

Devvit.addCustomPostType({
    name: 'AI Duel',
    render: (context) => {
        const server = new DuelServer(context);
        const [userId] = useState(() => context.userId || 'test-user');
        const [move, setMove] = useState('');

        const { data, loading, refresh } = useAsync<{ episode: any; state: DuelState; showImage: boolean }>(async () => {
            const episode = await getTodayEpisode(context);
            // @ts-ignore runtime setting
            const imgMode = (await context.settings?.get('NEON_IMAGE_MODE')) as string | undefined;
            const showImage = (imgMode || 'data') !== 'none';
            const state = await server.getDuelState(userId);
            return { episode, state, showImage };
        });

        const episode = data?.episode;
        const state = data?.state;
        const showImage = data?.showImage;

        const onAttack = async () => {
            if (!move || !state) return;
            await server.submitMove(userId, move);
            setMove('');
            await refresh();
        };

        const onReset = async () => {
            await server.resetGame(userId);
            setMove('');
            await refresh();
        };

        // Render the arena UI

        if (loading) return <vstack><text>Loading Arena...</text></vstack>;
        if (!state || !episode) return <vstack><text>Error loading arena.</text></vstack>;

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

        const suggestedMoves = [
            'Neon Slash',
            'Firewall Probe',
        ];

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                <EpisodeHeader
                    episode={episode}
                    title="VALKYRIE ARENA"
                    subtitle="Keys enhance dialogue. Keyless duels still hit."
                    showImage={showImage}
                    rightActionLabel="🏆 Rank"
                    onRightAction={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                />

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
                        <vstack gap="small">
                            {suggestedMoves.map((m) => (
                                <button
                                    key={m}
                                    appearance="secondary"
                                    onPress={async () => { await server.submitMove(userId, m); setMove(''); await refresh(); }}
                                    disabled={state.gameOver || state.turn === 'ai'}
                                >
                                    {m}
                                </button>
                            ))}
                        </vstack>
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
                    <vstack>
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                        <text size="small" style="mono" color={Theme.colors.primary} wrap>
                            {`ARENA ${episode.id} | hp:${state.userHealth}-${state.aiHealth} | #ValkyrieArena`}
                        </text>
                    </vstack>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
