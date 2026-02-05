import { Devvit, useState, useAsync } from '@devvit/public-api';
import './global.d.ts';
import { EpisodeHeader, Theme, LeaderboardUI, getTodayEpisode } from 'shared';
import { GameStrategyServer } from './server';
import { AssetType, AssetConfig, ASSETS } from './types';


Devvit.configure({
    redditAPI: true,
    http: {
        domains: ['generativelanguage.googleapis.com']
    },
    redis: true,
});

// App settings for API keys
Devvit.addSettings([
    {
        name: 'GEMINI_API_KEY',
        label: 'Google Gemini API Key',
        type: 'string',
        isSecret: false,
    },
]);

Devvit.addMenuItem({
    label: "Open/Create Today's Neon Syndicate Post",
    location: 'subreddit',
    onPress: async (_event, context) => {
        const episode = await getTodayEpisode(context);
        const subreddit = await context.reddit.getCurrentSubreddit();
        const postKey = `posts:v1:${subreddit.name}:get-rich-lazy:${episode.id}`;
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
            title: `${episode.id} // Neon Syndicate Tycoon`,
            subredditName: subreddit.name,
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text>Booting Neon Syndicate...</text>
                </vstack>
            ),
        });
        await context.redis.set(postKey, post.id);
        context.ui.navigateTo(post);
        context.ui.showToast("Created today's post");
    },
});

Devvit.addSchedulerJob({
    name: 'hourly_tick',
    onRun: async (event, context) => {
        const server = new GameStrategyServer(context);
        await server.onHourlyTick(event);
    },
});

// Advanced CSS styles (Halftones/Jagged) will be applied inline or via blocks
Devvit.addCustomPostType({
    name: 'Get Rich Fast',
    height: 'tall',
    render: (context) => {
        const server = new GameStrategyServer(context);
        const [userId] = useState(() => context.userId || 'test-user');

        // Load initial state
        const { data, loading, refresh } = useAsync(async () => {
            const episode = await getTodayEpisode(context);
            const view = await server.getUserView(userId);
            return { episode, view };
        });

        const episode = data?.episode;
        const view = data?.view;

        const onBuy = async (assetId: AssetType) => {
            const success = await server.buyAsset(userId, assetId);
            if (success) {
                context.ui.showToast(`Acquired ${ASSETS[assetId].name}`);
                await refresh();
            } else {
                context.ui.showToast("Not enough cash!");
            }
        };

        const onContract = async (choiceId: 'a' | 'b') => {
            const ok = await server.acceptContract(userId, choiceId);
            context.ui.showToast(ok ? 'Contract executed.' : 'Already executed today.');
            await refresh();
        };

        if (loading) return <vstack alignment="center middle"><text>Loading Empire...</text></vstack>;
        if (!view || !episode) return <vstack><text>Error loading state</text></vstack>;

        const assetEntries = Object.entries(ASSETS) as [AssetType, AssetConfig][];
        const nextTarget = assetEntries.find(([_, config]) => (view.cash || 0) < config.cost);

        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const data = await server.getLeaderboard();
            setLeaderboardData(data);
            setLbLoading(false);
        };

        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="TYCOON RANKINGS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                />
            );
        }

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                <EpisodeHeader
                    episode={episode}
                    title="NEON SYNDICATE TYCOON"
                    subtitle={`Tier: ${view.tier} · Mult: x${view.incomeMultiplier.toFixed(2)} · Tick: ${new Date(view.lastTick).toLocaleTimeString()}`}
                    rightActionLabel="🏆 Authors"
                    onRightAction={async () => {
                        setShowLeaderboard(true);
                        loadLeaderboard();
                    }}
                />

                <spacer size="medium" />

                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                    <hstack alignment="space-between middle">
                        <vstack>
                            <text color={Theme.colors.text} size="large" weight="bold">Net Worth: ${view.netWorth.toLocaleString()}</text>
                            <text color={Theme.colors.success} size="small">Income: +${view.hourlyIncome.toLocaleString()}/hr</text>
                        </vstack>
                        <vstack alignment="end">
                            <text color={Theme.colors.gold} size="large" weight="bold">Liquid: ${Math.round(view.cash || 0).toLocaleString()}</text>
                            <text color={Theme.colors.textDim} size="small">Assets Owned: {view.totalAssetsOwned}</text>
                        </vstack>
                    </hstack>
                    <text color={Theme.colors.textDim} size="small">
                        Mission: {nextTarget ? `Reach $${nextTarget[1].cost.toLocaleString()} and buy ${nextTarget[1].name}` : 'All assets unlocked. Push leaderboard dominance.'}
                    </text>
                </vstack>

                <spacer size="medium" />

                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                    <text weight="bold" color={Theme.colors.secondary}>TODAY'S CONTRACT</text>
                    {!view.hasAcceptedContractToday ? (
                        <vstack gap="small">
                            {view.todaysContracts.map((c) => (
                                <hstack key={c.id} backgroundColor="#0f1118" cornerRadius="small" padding="small" border="thin" borderColor={Theme.colors.surfaceHighlight} alignment="space-between middle">
                                    <vstack grow>
                                        <text weight="bold" color={Theme.colors.text}>{c.title}</text>
                                        <text size="small" color={Theme.colors.textDim} wrap>{c.flavor}</text>
                                        <text size="small" color={Theme.colors.success}>
                                            Reward: +${c.reward} · Income boost: x{c.multiplier.toFixed(2)} (24h)
                                        </text>
                                    </vstack>
                                    <button appearance="primary" onPress={() => onContract(c.id)}>
                                        Execute
                                    </button>
                                </hstack>
                            ))}
                            <text size="small" color={Theme.colors.textDim}>Contracts are keyless. Keys only enhance flavor elsewhere.</text>
                        </vstack>
                    ) : (
                        <vstack gap="small">
                            <text color={Theme.colors.success} weight="bold">Contract executed: {view.boost?.label}</text>
                            <text size="small" color={Theme.colors.textDim}>Boost active until: {view.boost ? new Date(view.boost.expiresAt).toLocaleString() : 'n/a'}</text>
                        </vstack>
                    )}
                </vstack>

                <spacer size="medium" />

                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                    <text weight="bold" color={Theme.colors.secondary}>ADVISORS (UNLOCKED)</text>
                    {view.advisors.length === 0 ? (
                        <text size="small" color={Theme.colors.textDim}>Reach $500 net worth to unlock your first advisor.</text>
                    ) : (
                        <vstack gap="small">
                            {view.advisors.map((a) => (
                                <vstack key={a.id} backgroundColor="#0f1118" cornerRadius="small" padding="small" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                                    <text weight="bold" color={Theme.colors.text}>{a.name} · {a.role}</text>
                                    <text size="small" color={Theme.colors.textDim} wrap>{a.perk}</text>
                                </vstack>
                            ))}
                        </vstack>
                    )}
                </vstack>

                <spacer size="medium" />

                <vstack gap="small" padding="small" grow>
                    <text style="heading" size="medium" color={Theme.colors.secondary}>Portfolio Arsenal</text>

                    <vstack gap="small">
                        {assetEntries.map(([key, config]) => {
                            const owned = view.assets?.[key] || 0;
                            const affordable = (view.cash || 0) >= config.cost;
                            return (
                            <hstack key={key} backgroundColor={affordable ? '#202834' : Theme.colors.surface} padding="medium" cornerRadius="medium" alignment="center middle" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                                <vstack grow>
                                    <text weight="bold" color={Theme.colors.text} size="large">{config.name}</text>
                                    <text size="small" color={Theme.colors.success}>+${config.incomePerHour}/hr · Owned: {owned}</text>
                                </vstack>
                                <button
                                    onPress={() => onBuy(key as AssetType)}
                                    disabled={!affordable}
                                    appearance={affordable ? 'primary' : 'secondary'}
                                >
                                    {affordable ? `Buy (${config.cost.toLocaleString()})` : `Need ${config.cost.toLocaleString()}`}
                                </button>
                            </hstack>
                        )})}
                    </vstack>
                </vstack>

                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
