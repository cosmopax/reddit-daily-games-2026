import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { Theme, Leaderboard, LeaderboardUI } from 'shared';
import { AssetType, ASSETS } from './types';
import { GameStrategyServer } from './server';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

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
    label: 'Create Get Rich Fast Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: '💰 Get Rich Fast — Build Your Passive Income Empire!',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.accent} size="xlarge" weight="bold">Loading Get Rich Fast...</text>
                </vstack>
            ),
        });
        context.ui.showToast('Game post created!');
    },
});

Devvit.addSchedulerJob({
    name: 'hourly_tick',
    onRun: async (event, context) => {
        const server = new GameStrategyServer(context);
        await server.onHourlyTick(event);
    },
});

Devvit.addCustomPostType({
    name: 'Get Rich Fast',
    height: 'tall',
    render: (context) => {
        const server = new GameStrategyServer(context);
        const [userId] = useState(() => context.userId || 'test-user');
        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        // Load initial state via useAsync, then track with local state for refreshes
        const { data: initialData, loading } = useAsync(async () => {
            const state = await server.getUserState(userId);
            return state as unknown as Record<string, any>;
        });

        const [localState, setLocalState] = useState<Record<string, any> | null>(null);
        const state = localState || initialData;

        const refreshState = async () => {
            const fresh = await server.getUserState(userId);
            setLocalState(fresh as unknown as Record<string, any>);
        };

        const syncLeaderboard = async () => {
            try {
                const lb = new Leaderboard(context, 'game1_strategy');
                let username = 'Unknown CEO';
                try {
                    const u = await context.reddit.getUserById(userId);
                    if (u) username = u.username;
                } catch (e) {}
                const fresh = await server.getUserState(userId);
                await lb.submitScore(userId, username, fresh.netWorth);
            } catch (e) { /* leaderboard sync is optional */ }
        };

        const onBuy = async (assetId: AssetType) => {
            const success = await server.buyAsset(userId, assetId);
            if (success) {
                context.ui.showToast(`Bought ${ASSETS[assetId].name}!`);
                await refreshState();
                await syncLeaderboard();
            } else {
                context.ui.showToast("Not enough cash!");
            }
        };

        const onInvestMax = async (assetId: AssetType) => {
            const amount = await server.investMax(userId, assetId);
            if (amount > 0) {
                context.ui.showToast(`Invested MAX in ${ASSETS[assetId].name}! (${Math.floor(amount)} units)`);
                await refreshState();
                await syncLeaderboard();
            } else {
                context.ui.showToast("No cash available!");
            }
        };

        if (loading && !state) return <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}><text color={Theme.colors.text}>Loading Empire...</text></vstack>;
        if (!state) return <vstack backgroundColor={Theme.colors.background}><text color={Theme.colors.danger}>Error loading state</text></vstack>;

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
                    scoreLabel="net worth"
                    currentUserId={userId}
                />
            );
        }

        // Calculate hourly income for display
        let hourlyIncome = 0;
        Object.entries(ASSETS).forEach(([key, config]) => {
            hourlyIncome += (state.assets?.[key] || 0) * config.incomePerHour;
        });

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                <vstack padding="medium" cornerRadius="medium">
                    <hstack alignment="space-between middle">
                        <vstack>
                            <text style="heading" color={Theme.colors.primary} size="xxlarge" weight="bold">GET RICH LAZY</text>
                            <text color={Theme.colors.success} size="small">+${hourlyIncome.toLocaleString()}/hr passive income</text>
                        </vstack>
                        <button
                            appearance="secondary"
                            size="small"
                            onPress={async () => {
                                setShowLeaderboard(true);
                                loadLeaderboard();
                            }}
                        >
                            Rankings
                        </button>
                    </hstack>
                    <spacer size="small" />
                    <hstack alignment="middle start" width="100%">
                        <text color={Theme.colors.text} size="large" weight="bold">Cash: </text>
                        <text color={Theme.colors.gold} size="large" weight="bold">${Math.floor(state.cash).toLocaleString()}</text>
                    </hstack>
                    <hstack alignment="middle start" width="100%">
                        <text color={Theme.colors.textDim} size="small">Net Worth: </text>
                        <text color={Theme.colors.textDim} size="small">${Math.floor(state.netWorth).toLocaleString()}</text>
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
                                    <hstack gap="small">
                                        <text size="small" color={Theme.colors.success}>+${config.incomePerHour}/hr</text>
                                        <text size="small" color={Theme.colors.textDim}>Owned: {state.assets?.[key] || 0}</text>
                                    </hstack>
                                </vstack>
                                <hstack gap="small">
                                    <button onPress={() => onBuy(key as AssetType)} disabled={state.cash < config.cost} appearance="primary" size="small">
                                        ${config.cost.toLocaleString()}
                                    </button>
                                    <button onPress={() => onInvestMax(key as AssetType)} disabled={state.cash < config.cost} appearance="secondary" size="small">
                                        MAX
                                    </button>
                                </hstack>
                            </hstack>
                        ))}
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
