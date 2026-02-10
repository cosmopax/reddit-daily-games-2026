import { Devvit, useState, useInterval } from '@devvit/public-api';
import { Theme } from '../Theme';

type GameKey = 'strategy' | 'trivia' | 'meme' | 'duel';

interface SplashScreenProps {
    gameKey?: GameKey;
    onDone: () => void;
    durationMs?: number;
}

/**
 * "cosmopax labs" branded splash screen.
 * Shows for ~2s then calls onDone to transition to the game.
 */
export const SplashScreen = (props: SplashScreenProps): JSX.Element => {
    const duration = props.durationMs || 2000;
    const accent = props.gameKey
        ? Theme.gameThemes[props.gameKey]?.accent || Theme.colors.primary
        : Theme.colors.primary;

    const [elapsed, setElapsed] = useState(0);

    const timer = useInterval(() => {
        setElapsed((prev) => {
            const next = prev + 100;
            if (next >= duration) {
                timer.stop();
                props.onDone();
            }
            return next;
        });
    }, 100);
    timer.start();

    // Fade phases: 0-800ms fade in, 800-1600ms hold, 1600-2000ms fade out
    const phase = elapsed < 800 ? 'fade-in' : elapsed < 1600 ? 'hold' : 'fade-out';
    const subtitleColor = phase === 'hold' ? Theme.colors.text : Theme.colors.textDim;

    return (
        <vstack
            height="100%"
            width="100%"
            backgroundColor="#0A0A0A"
            alignment="center middle"
            padding="large"
            gap="medium"
        >
            <spacer grow />

            {/* Brand Mark */}
            <vstack alignment="center middle" gap="small">
                {/* Lab flask / brand icon using text */}
                <text size="xxlarge" weight="bold" color={accent}>
                    {'{ c }'}
                </text>
            </vstack>

            {/* Brand Name */}
            <vstack alignment="center middle" gap="small">
                <text
                    size="xxlarge"
                    weight="bold"
                    color="#FFFFFF"
                >
                    cosmopax
                </text>
                <hstack gap="small" alignment="center middle">
                    <vstack width="24px" height="1px" backgroundColor={accent} />
                    <text size="small" color={subtitleColor} weight="bold">
                        LABS
                    </text>
                    <vstack width="24px" height="1px" backgroundColor={accent} />
                </hstack>
            </vstack>

            <spacer size="medium" />

            {/* Tagline */}
            <text size="small" color={Theme.colors.textDim}>
                {Theme.brand.motto}
            </text>

            <spacer grow />

            {/* Loading indicator */}
            <hstack gap="small" alignment="center middle">
                <vstack
                    width="6px"
                    height="6px"
                    cornerRadius="full"
                    backgroundColor={phase === 'fade-in' ? accent : Theme.colors.textDim}
                />
                <vstack
                    width="6px"
                    height="6px"
                    cornerRadius="full"
                    backgroundColor={phase === 'hold' ? accent : Theme.colors.textDim}
                />
                <vstack
                    width="6px"
                    height="6px"
                    cornerRadius="full"
                    backgroundColor={phase === 'fade-out' ? accent : Theme.colors.textDim}
                />
            </hstack>

            <spacer size="small" />
        </vstack>
    );
};
