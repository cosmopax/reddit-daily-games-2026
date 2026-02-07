import { Devvit } from '@devvit/public-api';
import { Theme } from '../Theme';

interface NarrativeHeaderProps {
    title: string;
    subtitle?: string;
    accentColor?: string;
    onLeaderboard?: () => void;
    leaderboardLabel?: string;
}

/**
 * Dramatic narrative-style header for game screens.
 * Replaces the ad-hoc headers across all 4 games with consistent branding.
 */
export const NarrativeHeader = (props: NarrativeHeaderProps): JSX.Element => {
    const accent = props.accentColor || Theme.colors.primary;

    return (
        <vstack alignment="center middle" padding="small" backgroundColor={Theme.colors.surface}>
            <hstack alignment="middle" width="100%">
                <spacer />
                <vstack alignment="center middle">
                    <text
                        size="xlarge"
                        weight="bold"
                        color={accent}
                    >
                        {props.title}
                    </text>
                    <text size="small" color={Theme.colors.textDim}>
                        {props.subtitle || ''}
                    </text>
                </vstack>
                {props.onLeaderboard ? (
                    <button
                        appearance="plain"
                        size="small"
                        onPress={props.onLeaderboard}
                    >
                        {props.leaderboardLabel || '🏆 Rank'}
                    </button>
                ) : (
                    <spacer />
                )}
            </hstack>
        </vstack>
    );
};
