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
        <vstack backgroundColor={Theme.colors.background} padding="medium" height="100%">
            <text style="heading" color={Theme.colors.primary}>HYPER HIVE MIND</text>
            <text color={Theme.colors.text}>Guess the Trend!</text>
            <spacer grow />
            <hstack alignment="center middle" padding="small">
                <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
            </hstack>
        </vstack>
    ),
});

export default Devvit;
