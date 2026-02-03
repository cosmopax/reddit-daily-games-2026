import { Devvit } from '@devvit/public-api';
import { GameStrategyServer } from './server';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
    scheduler: {
        hourly_tick: async (event, context) => {
            const server = new GameStrategyServer(context);
            await server.onHourlyTick(event);
        }
    }
});

// Advanced CSS styles (Halftones/Jagged) will be applied inline or via blocks
Devvit.addCustomPostType({
    name: 'Get Rich Fast',
    height: 'tall',
    render: (context) => {
        return (
            <vstack height="100%" width="100%" backgroundColor="#000000">
                <text style="heading" color="#00FF00">GET RICH FAST</text>
                <text color="#FFFFFF">Net Worth: $0</text>
                {/* Placeholder for complex UI */}
            </vstack>
        );
    },
});

export default Devvit;
