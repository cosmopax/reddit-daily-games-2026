import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
import { AssetType, AssetConfig, ASSETS, UserState } from './server';
import { Theme, LeaderboardUI } from 'shared';
import { ASSETS, AssetType, UserState } from './types';

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
        const { data, loading, error } = useAsync(async () => {
            const state = await server.getUserState(userId);
            // useAsync expects JSONValue. UserState is complex.
            // We assume it serializes fine.
            return { state: state as unknown as Record<string, any> };
        });

        const state = data?.state;

        const onBuy = async (assetId: AssetType) => {
            const success = await server.buyAsset(userId, assetId);
            if (success) {
                context.ui.showToast(`Bought ${ASSETS[assetId].name}!`);
                // We can't easily refresh useAsync in 0.11 without a hack, 
                // implies we should just set local optimistic state or use a state manager.
                // For MVP, we presume the next render or interval picks it up.
            } else {
                context.ui.showToast("Not enough cash!");
            }
        };

        if (loading) return <vstack alignment="center middle"><text>Loading Empire...</text></vstack>;
        if (!state) return <vstack><text>Error loading state</text></vstack>;

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
                {/* Header with App-Scope Gradient */}
                <vstack padding="medium" cornerRadius="medium">
                    <hstack alignment="space-between middle">
                        <vstack>
                            <text style="heading" color={Theme.colors.primary} size="xxlarge" weight="bold">GET RICH LAZY</text>
                            <text color={Theme.colors.textDim} size="small">Last Tick: {new Date(state.lastTick).toLocaleTimeString()}</text>
                        </vstack>
                        <button
                            appearance="secondary"
                            size="small"
                            onPress={async () => {
                                setShowLeaderboard(true);
                                loadLeaderboard();
                            }}
                        >
                            🏆 Authors
                        </button>
                    </hstack>
                    <spacer size="small" />
                    <hstack alignment="middle start" width="100%">
                        <text color={Theme.colors.text} size="large" weight="bold">Net Worth: </text>
                        <text color={Theme.colors.gold} size="large" weight="bold">${state.cash.toLocaleString()}</text>
                    </hstack>
                </vstack>

                <spacer size="medium" />

                <vstack gap="small" padding="small" grow>
                    <text style="heading" size="medium" color={Theme.colors.secondary}>Portfolio</text>

                    <vstack gap="small">
                        {Object.entries(ASSETS).map(([key, config]) => (
                            <hstack key={key} backgroundColor={Theme.colors.surface} padding="medium" cornerRadius="medium" alignment="center middle" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                                <vstack grow>
                                    <text weight="bold" color={Theme.colors.text} size="large">{config.name}</text>
                                    <text size="small" color={Theme.colors.success}>+${config.incomePerHour}/hr</text>
                                </vstack>
                                <button
                                    onPress={() => onBuy(key as AssetType)}
                                    disabled={state.cash < config.cost}
                                    appearance="primary"
                                >
                                    Buy (${config.cost.toLocaleString()})
                                </button>
                            </hstack>
                        ))}
                    </vstack>
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
