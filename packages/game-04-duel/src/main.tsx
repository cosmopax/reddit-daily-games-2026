import { Devvit } from '@devvit/public-api';

Devvit.configure({
    redditAPI: true,
    http: true,
    redis: true,
});

Devvit.addCustomPostType({
    name: 'Duel of Minds',
    render: (context) => (
        <vstack>
            <text>Battling Gemini 2.0 Flash...</text>
        </vstack>
    ),
});

export default Devvit;
