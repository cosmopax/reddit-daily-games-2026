import { Devvit } from '@devvit/public-api';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
    scheduler: {
        process_queue: async (event, context) => {
            console.log("Processing Generation Queue...");
            // Pop from Redis List
            // Call Flux.1 API via context.http
        }
    }
});

Devvit.addCustomPostType({
    name: 'Meme Wars',
    render: (context) => (
        <vstack>
            <text>Enter Prompt for Flux.1</text>
        </vstack>
    ),
});

export default Devvit;
