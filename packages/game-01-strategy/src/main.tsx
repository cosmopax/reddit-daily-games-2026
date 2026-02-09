import { Devvit, useState, useAsync, SettingScope } from '@devvit/public-api';
import './global.d.ts';
import { Theme, Leaderboard, LeaderboardUI, VIC, SAL, CharacterPanel, NarrativeHeader } from 'shared';
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
    label: 'Create Get Rich Lazy Post',
    location: 'subreddit',
    onPress: async (_event, context) => {
        const sub = await context.reddit.getCurrentSubreddit();
        await context.reddit.submitPost({
            title: '💰 Get Rich Lazy — Two Advisors. One Wants You Rich. The Other Wants You Alive.',
            subredditName: sub.name,
            preview: (
                <vstack padding="large" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text color={Theme.narrative.vicAccent} size="xlarge" weight="bold">Loading Get Rich Lazy...</text>
                    <text color={Theme.colors.textDim} size="small">Preparing today's market scenario...</text>
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

// ═══════════════════════════════════════════════════════
// SCREEN TYPE — Multi-screen narrative flow
// ═══════════════════════════════════════════════════════
type Screen = 'intro' | 'scenario' | 'portfolio' | 'leaderboard';

Devvit.addCustomPostType({
    name: 'Get Rich Fast',
    height: 'tall',
    render: (context) => {
        const server = new GameStrategyServer(context);
        const [userId] = useState(() => context.userId || 'test-user');

        // Screen navigation
        const [screen, setScreen] = useState<Screen>('intro');

        // Core state
        const [localState, setLocalState] = useState<any>(null);
        const [choiceResult, setChoiceResult] = useState<any>(null);
        const [processing, setProcessing] = useState(false);

        // Leaderboard
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        // Load initial game state + scenario + today's choice status
        const { data: initialData, loading } = useAsync<any>(async () => {
            const state = await server.getUserState(userId);
            const scenario = await server.getDailyScenario();
            const todayChoice = await server.hasChosenToday(userId);
            return {
                state: state as unknown as Record<string, any>,
                scenario,
                todayChoice,
            };
        });

        const state = localState || initialData?.state;
        const scenario = initialData?.scenario;
        const alreadyChosen = initialData?.todayChoice;

        const refreshState = async () => {
            const fresh = await server.getUserState(userId);
            setLocalState(fresh as unknown as Record<string, any>);
        };

        const onBuy = async (assetId: AssetType) => {
            const success = await server.buyAsset(userId, assetId);
            if (success) {
                context.ui.showToast(`Bought ${ASSETS[assetId].name}!`);
                await refreshState();
            } else {
                context.ui.showToast("Not enough cash!");
            }
        };

        const onInvestMax = async (assetId: AssetType) => {
            const amount = await server.investMax(userId, assetId);
            if (amount > 0) {
                context.ui.showToast(`MAX invested in ${ASSETS[assetId].name}!`);
                await refreshState();
            } else {
                context.ui.showToast("No cash available!");
            }
        };

        const onChoice = async (choice: 'vic' | 'sal') => {
            setProcessing(true);
            try {
                const result = await server.processDailyChoice(userId, choice);
                setChoiceResult(result);
                await refreshState();
                context.ui.showToast(result.narrative);
            } catch (e) {
                context.ui.showToast('Error processing choice');
            }
            setProcessing(false);
        };

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const data = await server.getLeaderboard();
            setLeaderboardData(data);
            setLbLoading(false);
        };

        // ─── LOADING ─────────────────────────────
        if (loading && !state) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.narrative.vicAccent} size="large" weight="bold">GET RICH LAZY</text>
                    <spacer size="small" />
                    <text color={Theme.colors.textDim} size="small">Loading today's market...</text>
                </vstack>
            );
        }
        if (!state) {
            return (
                <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                    <text color={Theme.colors.danger}>Error loading state</text>
                </vstack>
            );
        }

        // ─── LEADERBOARD SCREEN ──────────────────
        if (screen === 'leaderboard') {
            return (
                <LeaderboardUI
                    title="TYCOON RANKINGS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setScreen('portfolio')}
                    scoreLabel="net worth"
                    currentUserId={userId}
                />
            );
        }

        // ─── INTRO SCREEN ────────────────────────
        if (screen === 'intro') {
            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" alignment="center middle" gap="medium">
                    {/* Title */}
                    <vstack alignment="center middle">
                        <text size="xxlarge" weight="bold" color={Theme.narrative.goldHighlight}>GET RICH LAZY</text>
                        <text size="small" color={Theme.colors.textDim}>A Financial Education Experience</text>
                        <text size="xsmall" color={Theme.colors.textDim}>Daily loop: choose one advisor, then scale passive income hourly.</text>
                    </vstack>

                    <spacer size="small" />

                    {/* Tagline */}
                    <vstack alignment="center middle" padding="small" backgroundColor={Theme.narrative.noir} cornerRadius="medium" border="thin" borderColor={Theme.colors.surfaceHighlight}>
                        <text size="medium" color={Theme.colors.text} weight="bold" alignment="center">Two advisors.</text>
                        <text size="medium" color={Theme.colors.text} alignment="center">One wants you rich.</text>
                        <text size="medium" color={Theme.colors.text} alignment="center">The other wants you alive.</text>
                    </vstack>

                    <spacer size="small" />

                    {/* Character Previews */}
                    <CharacterPanel
                        character={VIC}
                        dialogue={VIC.tagline}
                        compact={true}
                    />
                    <CharacterPanel
                        character={SAL}
                        dialogue={SAL.tagline}
                        compact={true}
                    />

                    <spacer size="medium" />

                    {/* Enter Button */}
                    <button
                        appearance="primary"
                        size="medium"
                        onPress={() => {
                            if (alreadyChosen || choiceResult) {
                                setScreen('portfolio');
                            } else {
                                setScreen('scenario');
                            }
                        }}
                    >
                        ▶ PLAY NOW
                    </button>

                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── SCENARIO SCREEN ─────────────────────
        if (screen === 'scenario') {
            // If already chose today, skip to portfolio
            if (alreadyChosen && !choiceResult) {
                setScreen('portfolio');
                return <vstack><text color={Theme.colors.textDim}>Redirecting...</text></vstack>;
            }

            // Show choice result if just made a choice
            if (choiceResult) {
                return (
                    <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium" gap="small">
                        <NarrativeHeader
                            title="GET RICH LAZY"
                            subtitle="Today's Result"
                            accentColor={Theme.narrative.goldHighlight}
                            onLeaderboard={() => { setScreen('leaderboard'); loadLeaderboard(); }}
                        />

                        <spacer size="small" />

                        {/* Result Panel */}
                        <vstack
                            padding="medium"
                            cornerRadius="medium"
                            backgroundColor={Theme.colors.surface}
                            border="thin"
                            borderColor={choiceResult.multiplier >= 1.0 ? Theme.colors.success : Theme.colors.danger}
                            alignment="center middle"
                            gap="small"
                        >
                            <text size="large" weight="bold" color={choiceResult.multiplier >= 1.0 ? Theme.colors.success : Theme.colors.danger}>
                                {choiceResult.multiplier >= 1.0 ? '📈 GAINS' : '📉 LOSSES'}
                            </text>
                            <text size="small" color={Theme.colors.text} wrap alignment="center">{choiceResult.narrative}</text>
                            <spacer size="small" />
                            <hstack gap="medium" alignment="center middle">
                                <vstack alignment="center middle">
                                    <text size="small" color={Theme.colors.textDim}>Before</text>
                                    <text size="medium" color={Theme.colors.textDim}>${Math.floor(choiceResult.cashBefore).toLocaleString()}</text>
                                </vstack>
                                <text size="large" color={Theme.narrative.goldHighlight}>→</text>
                                <vstack alignment="center middle">
                                    <text size="small" color={Theme.colors.textDim}>After</text>
                                    <text size="medium" weight="bold" color={Theme.narrative.goldHighlight}>${Math.floor(choiceResult.cashAfter).toLocaleString()}</text>
                                </vstack>
                            </hstack>
                        </vstack>

                        {/* Who you followed */}
                        <CharacterPanel
                            character={choiceResult.choice === 'vic' ? VIC : SAL}
                            dialogue={choiceResult.choice === 'vic' ? 'You followed my lead. No regrets.' : 'You chose wisely. The long game always wins.'}
                            compact={true}
                        />

                        <spacer size="small" />

                        <button appearance="primary" size="medium" onPress={() => setScreen('portfolio')}>
                            VIEW PORTFOLIO →
                        </button>

                        <hstack alignment="center middle" padding="small">
                            <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                        </hstack>
                    </vstack>
                );
            }

            // Show scenario + Vic/Sal choice
            if (!scenario) {
                return (
                    <vstack alignment="center middle" height="100%" backgroundColor={Theme.colors.background}>
                        <text color={Theme.colors.textDim}>Loading scenario...</text>
                    </vstack>
                );
            }

            return (
                <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small" gap="small">
                    <NarrativeHeader
                        title="GET RICH LAZY"
                        subtitle="Daily Market Event"
                        accentColor={Theme.narrative.goldHighlight}
                        onLeaderboard={() => { setScreen('leaderboard'); loadLeaderboard(); }}
                    />

                    {/* Newspaper Headline */}
                    <vstack
                        padding="small"
                        cornerRadius="small"
                        backgroundColor={Theme.narrative.newspaper.bg}
                        border="thin"
                        borderColor={Theme.narrative.newspaper.border}
                        alignment="center middle"
                    >
                        <text size="large" weight="bold" color={Theme.narrative.newspaper.text} alignment="center" wrap>{scenario.headline}</text>
                        <text size="small" color="#555555" wrap alignment="center">{scenario.narrative}</text>
                    </vstack>

                    {/* Street Knowledge */}
                    <vstack
                        padding="small"
                        cornerRadius="small"
                        backgroundColor={Theme.colors.surface}
                        border="thin"
                        borderColor={Theme.narrative.goldHighlight}
                    >
                        <hstack gap="small" alignment="start middle">
                            <text size="small" weight="bold" color={Theme.narrative.goldHighlight}>💡 STREET KNOWLEDGE:</text>
                            <text size="small" weight="bold" color={Theme.colors.text}>{scenario.financialConcept}</text>
                        </hstack>
                        <text size="small" color={Theme.colors.textDim} wrap>{scenario.illegalAnalogy}</text>
                    </vstack>

                    {/* Vic's Advice */}
                    <CharacterPanel
                        character={VIC}
                        dialogue={scenario.vic.dialogue}
                        action={{
                            label: processing ? '...' : '🔥 YOLO',
                            onPress: () => onChoice('vic'),
                            appearance: 'destructive',
                        }}
                        compact={true}
                    />

                    {/* Sal's Advice */}
                    <CharacterPanel
                        character={SAL}
                        dialogue={scenario.sal.dialogue}
                        action={{
                            label: processing ? '...' : '🛡️ FOLD',
                            onPress: () => onChoice('sal'),
                            appearance: 'bordered',
                        }}
                        compact={true}
                    />

                    {/* Cash Display */}
                    <hstack alignment="center middle" padding="small">
                        <text size="small" color={Theme.colors.textDim}>Your Cash: </text>
                        <text size="small" weight="bold" color={Theme.narrative.goldHighlight}>${Math.floor(state.cash).toLocaleString()}</text>
                    </hstack>
                </vstack>
            );
        }

        // ─── PORTFOLIO SCREEN ────────────────────
        // Calculate hourly income
        let hourlyIncome = 0;
        Object.entries(ASSETS).forEach(([key, config]) => {
            hourlyIncome += (state.assets?.[key] || 0) * config.incomePerHour;
        });

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="small">
                <NarrativeHeader
                    title="GET RICH LAZY"
                    subtitle={`+$${hourlyIncome.toLocaleString()}/hr passive income`}
                    accentColor={Theme.narrative.goldHighlight}
                    onLeaderboard={() => { setScreen('leaderboard'); loadLeaderboard(); }}
                    leaderboardLabel="🏆 Rankings"
                />

                {/* Cash & Net Worth Bar */}
                <vstack padding="small" backgroundColor={Theme.colors.surface} cornerRadius="small">
                    <hstack alignment="space-between middle" width="100%">
                        <vstack>
                            <text size="small" color={Theme.colors.textDim}>Cash</text>
                            <text size="large" weight="bold" color={Theme.narrative.goldHighlight}>${Math.floor(state.cash).toLocaleString()}</text>
                        </vstack>
                        <vstack alignment="end">
                            <text size="small" color={Theme.colors.textDim}>Net Worth</text>
                            <text size="medium" weight="bold" color={Theme.colors.text}>${Math.floor(state.netWorth).toLocaleString()}</text>
                        </vstack>
                    </hstack>
                </vstack>

                <spacer size="small" />

                {/* Today's Choice Status */}
                {(alreadyChosen || choiceResult) ? (
                    <hstack
                        padding="small"
                        cornerRadius="small"
                        backgroundColor={Theme.colors.surface}
                        border="thin"
                        borderColor={alreadyChosen === 'vic' || choiceResult?.choice === 'vic' ? Theme.characters.vic.color : Theme.characters.sal.color}
                        alignment="center middle"
                        gap="small"
                    >
                        <text size="small" color={Theme.colors.textDim}>Today you followed:</text>
                        <text size="small" weight="bold" color={alreadyChosen === 'vic' || choiceResult?.choice === 'vic' ? Theme.characters.vic.color : Theme.characters.sal.color}>
                            {alreadyChosen === 'vic' || choiceResult?.choice === 'vic' ? 'VIC 🔥' : 'SAL 🛡️'}
                        </text>
                        <text size="small" color={Theme.colors.textDim}>| Come back tomorrow</text>
                    </hstack>
                ) : (
                    <button appearance="primary" size="small" onPress={() => setScreen('scenario')}>
                        📰 Today's Market Event — Make Your Choice
                    </button>
                )}

                <spacer size="small" />

                {/* Portfolio Assets */}
                <vstack gap="small" grow>
                    <text size="medium" weight="bold" color={Theme.colors.secondary}>Portfolio</text>
                    {Object.entries(ASSETS).map(([key, config]) => (
                        <hstack
                            key={key}
                            backgroundColor={Theme.colors.surface}
                            padding="small"
                            cornerRadius="small"
                            alignment="center middle"
                            border="thin"
                            borderColor={Theme.colors.surfaceHighlight}
                        >
                            <vstack grow>
                                <text weight="bold" color={Theme.colors.text} size="medium">{config.name}</text>
                                <hstack gap="small">
                                    <text size="small" color={Theme.colors.success}>+${config.incomePerHour}/hr</text>
                                    <text size="small" color={Theme.colors.textDim}>×{state.assets?.[key] || 0}</text>
                                </hstack>
                            </vstack>
                            <hstack gap="small">
                                <button onPress={() => onBuy(key as AssetType)} disabled={state.cash < config.cost} appearance="primary" size="small">
                                    ${config.cost >= 1000 ? `${(config.cost / 1000).toFixed(0)}K` : config.cost}
                                </button>
                                <button onPress={() => onInvestMax(key as AssetType)} disabled={state.cash < config.cost} appearance="secondary" size="small">
                                    MAX
                                </button>
                            </hstack>
                        </hstack>
                    ))}
                </vstack>

                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
