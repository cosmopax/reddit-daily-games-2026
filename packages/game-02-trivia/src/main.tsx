import { Devvit, SettingScope } from '@devvit/public-api';
import { Theme } from 'shared';
// Ingests trends from external API via shared proxy pattern

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
    scheduler: {
        daily_reset: async (event, context) => {
            console.log("Ingesting Daily Trends...");
            // const trends = await context.http.send(...)
        }
    }
});

// App settings for API keys
Devvit.addSettings([
    {
        name: 'SERPAPI_KEY',
        label: 'SerpApi Key (Google Trends)',
        type: 'string',
        isSecret: true,
        scope: SettingScope.App,
    },
    {
        name: 'GEMINI_API_KEY',
        label: 'Google Gemini API Key',
        type: 'string',
        isSecret: true,
        scope: SettingScope.App,
    },
]);

Devvit.addCustomPostType({
    name: 'Hive Mind Gauntlet',
    render: (context) => (
        <vstack height="100%" width="100%" backgroundColor={Theme.colors.background}>
            {/* Header */}
            <vstack alignment="center middle" padding="medium" backgroundColor={Theme.colors.surface}>
                <text style="heading" size="xlarge" color={Theme.colors.primary} weight="bold">HYPER HIVE MIND</text>
                <text size="small" color={Theme.colors.textDim}>Daily Trend Check</text>
            </vstack>

            {/* Split Screen Battle */}
            <hstack grow alignment="center middle">
                {/* Option A */}
                <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight}>
                    <text size="large" weight="bold" color={Theme.colors.text}>Topic A</text>
                    <text size="small" color={Theme.colors.textDim}>Trend A</text>
                    <spacer size="medium" />
                    <button appearance="primary">HIGHER</button>
                </vstack>

                {/* VS Separator */}
                <vstack width="1px" height="80%" backgroundColor={Theme.colors.textDim} />

                {/* Option B */}
                <vstack grow height="100%" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text size="large" weight="bold" color={Theme.colors.text}>Topic B</text>
                    <text size="small" color={Theme.colors.textDim}>Trend B</text>
                    <spacer size="medium" />
                    <button appearance="secondary">LOWER</button>
                </vstack>
            </hstack>

            {/* Footer */}
            <hstack alignment="center middle" padding="small" backgroundColor={Theme.colors.surface}>
                <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
            </hstack>
        </vstack>
    ),
});

export default Devvit;
