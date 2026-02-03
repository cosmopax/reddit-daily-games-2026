import { Devvit, useState, useAsync } from '@devvit/public-api';
import { GameStrategyServer } from './server';
import { ASSETS, AssetType, UserState } from './types';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
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
                <text style="heading" color="#00FF00">GET RICH FAST</text>
                <hstack alignment="middle start" width="100%">
                    <text color="#FFFFFF">Net Worth: ${state.cash}</text>
                    <text color="#AAAAAA">Last Tick: {new Date(state.lastTick).toLocaleTimeString()}</text>
                </hstack>

                <vstack gap="small" padding="small">
                    <text style="heading" size="small" color="#FFFF00">Assets</text>
                    {Object.values(ASSETS).map((asset) => (
                        <hstack key={asset.id} alignment="middle set" backgroundColor="#222222" padding="small" cornerRadius="small">
                            <vstack>
                                <text color="#FFFFFF" weight="bold">{asset.name}</text>
                                <text color="#888888">Owned: {state.assets[asset.id as AssetType] || 0}</text>
                                <text color="#44FF44">+${asset.incomePerHour}/hr</text>
                            </vstack>
                            <button onPress={() => onBuy(asset.id)} disabled={state.cash < asset.cost}>
                                Buy (${asset.cost})
                            </button>
                        </hstack>
                    ))}
                </vstack>
            </vstack>
        );
    },
});

export default Devvit;
