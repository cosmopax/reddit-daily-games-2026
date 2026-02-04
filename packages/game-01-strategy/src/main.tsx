import { Devvit, useState, useAsync } from '@devvit/public-api';
import './global.d.ts';
import { Theme, LeaderboardUI } from 'shared';
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
    label: 'Create Get Rich Lazy Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const subreddit = await context.reddit.getCurrentSubreddit();
        const post = await context.reddit.submitPost({
            title: 'Get Rich Lazy - Play Now',
            subredditName: subreddit.name,
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text>Loading GET RICH LAZY...</text>
                </vstack>
            ),
        });
        context.ui.navigateTo(post);
        context.ui.showToast('Created Get Rich Lazy post');
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
        const [dialogueSeed, setDialogueSeed] = useState(0);

        // Load initial state
        const { data, loading, refresh } = useAsync(async () => {
            const state = await server.getUserState(userId);
            return { state: state as unknown as Record<string, any> };
        });

        const state = data?.state;

        const onBuy = async (assetId: AssetType) => {
            const success = await server.buyAsset(userId, assetId);
            if (success) {
                context.ui.showToast(`Acquired ${ASSETS[assetId].name}`);
                setDialogueSeed((seed) => seed + 1);
                await refresh();
            } else {
                context.ui.showToast("Not enough cash!");
            }
        };

        if (loading) return <vstack alignment="center middle"><text>Loading Empire...</text></vstack>;
        if (!state) return <vstack><text>Error loading state</text></vstack>;

        const assetEntries = Object.entries(ASSETS) as [AssetType, AssetConfig][];
        const totalAssetsOwned = Object.values(state.assets || {}).reduce((sum: number, count: number) => sum + (count || 0), 0);
        const hourlyIncome = assetEntries.reduce((sum, [id, config]) => sum + ((state.assets?.[id] || 0) * config.incomePerHour), 0);
        const assetValue = assetEntries.reduce((sum, [id, config]) => sum + ((state.assets?.[id] || 0) * config.cost), 0);
        const netWorth = Math.round((state.cash || 0) + assetValue);
        const nextTarget = assetEntries.find(([_, config]) => (state.cash || 0) < config.cost);
        const bossTier = netWorth >= 15000 ? 'Neon Titan' : netWorth >= 4000 ? 'Street Baron' : netWorth >= 800 ? 'Hustler' : 'Rookie';
        const oracleLines = [
            'Oracle Nyx: Stack small wins. Momentum beats hype.',
            'Oracle Nyx: Convert idle cash into hourly pressure.',
            'Oracle Nyx: Buy timing is your real weapon.',
            'Oracle Nyx: Tiny upgrades compound into empires.',
            'Oracle Nyx: If the button is green, take the trade.',
        ];
        const rivalLines = [
            'CEO Vex: You call that an empire?',
            'CEO Vex: I have yachts bigger than your portfolio.',
            'CEO Vex: Impress me with one clean power move.',
            'CEO Vex: Clock is running. Compound or vanish.',
            'CEO Vex: Every minute idle is money burned.',
        ];
        const oracleLine = oracleLines[(dialogueSeed + totalAssetsOwned) % oracleLines.length];
        const rivalLine = rivalLines[(dialogueSeed + Math.floor(netWorth / 250)) % rivalLines.length];

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
                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight}>
                    <hstack alignment="space-between middle">
                        <vstack>
                            <text style="heading" color={Theme.colors.primary} size="xxlarge" weight="bold">GET RICH LAZY // STORY MODE</text>
                            <text color={Theme.colors.textDim} size="small">Tier: {bossTier} · Last Tick: {new Date(state.lastTick).toLocaleTimeString()}</text>
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
                    <hstack alignment="space-between middle" width="100%">
                        <vstack>
                            <text color={Theme.colors.text} size="large" weight="bold">Net Worth: ${netWorth.toLocaleString()}</text>
                            <text color={Theme.colors.success} size="small">Income: +${hourlyIncome.toLocaleString()}/hr</text>
                        </vstack>
                        <vstack alignment="end">
                            <text color={Theme.colors.gold} size="large" weight="bold">Liquid: ${Math.round(state.cash || 0).toLocaleString()}</text>
                            <text color={Theme.colors.textDim} size="small">Assets Owned: {totalAssetsOwned}</text>
                        </vstack>
                    </hstack>
                </vstack>

                <spacer size="medium" />

                <vstack gap="small" padding="medium" cornerRadius="medium" backgroundColor="#171a23" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                    <hstack alignment="space-between middle">
                        <text color={Theme.colors.secondary} weight="bold">CHARACTERS</text>
                        <button appearance="secondary" size="small" onPress={() => setDialogueSeed((seed) => seed + 1)}>Talk</button>
                    </hstack>
                    <vstack backgroundColor="#0f1118" cornerRadius="small" padding="small" border="thin" borderColor="#2a3242">
                        <text color={Theme.colors.text} weight="bold">Oracle Nyx</text>
                        <text color={Theme.colors.success} size="small">{oracleLine}</text>
                    </vstack>
                    <vstack backgroundColor="#0f1118" cornerRadius="small" padding="small" border="thin" borderColor="#2a3242">
                        <text color={Theme.colors.text} weight="bold">Rival CEO Vex</text>
                        <text color={Theme.colors.warning} size="small">{rivalLine}</text>
                    </vstack>
                    <text color={Theme.colors.textDim} size="small">
                        Mission: {nextTarget ? `Reach $${nextTarget[1].cost.toLocaleString()} and buy ${nextTarget[1].name}` : 'All assets unlocked. Push leaderboard dominance.'}
                    </text>
                </vstack>

                <spacer size="medium" />

                <vstack gap="small" padding="small" grow>
                    <text style="heading" size="medium" color={Theme.colors.secondary}>Portfolio Arsenal</text>

                    <vstack gap="small">
                        {assetEntries.map(([key, config]) => {
                            const owned = state.assets?.[key] || 0;
                            const affordable = (state.cash || 0) >= config.cost;
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
