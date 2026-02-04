import { Devvit, useState, useAsync } from '@devvit/public-api';
import { AssetType, AssetConfig, ASSETS, UserState } from './server';
import { Theme } from 'shared';
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
        isSecret: true,
        scope: 'app',
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

        return (
            <vstack height="100%" width="100%" backgroundColor="#000000" padding="medium">
                <text style="heading" color="#00FF00">GET RICH LAZY</text>
                <hstack alignment="middle start" width="100%">
                    <text color="#FFFFFF">Net Worth: ${state.cash}</text>
                    <text color="#AAAAAA">Last Tick: {new Date(state.lastTick).toLocaleTimeString()}</text>
                </hstack>

                <vstack gap="small" padding="small">
                    <text style="heading" size="small" color="#FFFF00">Assets</text>
                    {Object.values(ASSETS).map((asset) => (
                        <hstack key={asset.id} alignment="middle set" backgroundColor="#222222" padding="small" cornerRadius="small">
                            <vstack backgroundColor={context.ui.theme.colors.background} height="100%" width="100%" padding="medium">

                                {/* Header */}
                                <hstack alignment="center middle" padding="medium">
                                    <text size="xlarge" weight="bold" color={context.ui.theme.colors.primary}>GET RICH LAZY</text>
                                    <spacer size="medium" />
                                    <text color={context.ui.theme.colors.textDim}>Tick: {state.lastTick}</text>
                                </hstack>

                                {/* Stats Card */}
                                <vstack cornerRadius="medium" backgroundColor={context.ui.theme.colors.surface} padding="medium" border="thin" borderColor={context.ui.theme.colors.textDim}>
                                    <text size="large" color={context.ui.theme.colors.gold}>${state.cash.toLocaleString()}</text>
                                    <text size="small" color={context.ui.theme.colors.text}>Income: ${state.income}/hr</text>
                                </vstack>

                                <spacer size="medium" />

                                {/* Assets Grid */}
                                <vstack gap="small">
                                    {Object.entries(ASSETS).map(([key, config]) => (
                                        <hstack key={key} backgroundColor={context.ui.theme.colors.surface} padding="small" cornerRadius="small" alignment="center middle">
                                            <vstack grow>
                                                <text weight="bold" color={context.ui.theme.colors.text}>{config.name}</text>
                                                <text size="small" color={context.ui.theme.colors.success}>+${config.incomePerHour}/hr</text>
                                            </vstack>
                                            <button
                                                onPress={() => onBuy(key as AssetType)}
                                                disabled={state.cash < config.cost}
                                                appearance="primary"
                                            >
                                                Buy (${config.cost})
                                            </button>
                                        </hstack>
                                    ))}
                                </vstack>

                            </vstack>
                        </hstack>
                    ))}
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
