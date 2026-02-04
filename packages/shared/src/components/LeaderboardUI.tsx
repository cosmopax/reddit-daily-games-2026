import { Devvit } from '@devvit/public-api';
import { Theme } from '../Theme';
import { LeaderboardEntry } from '../Leaderboard';

interface LeaderboardUIProps {
    title: string;
    entries: LeaderboardEntry[];
    isLoading: boolean;
    onRefresh: () => void;
    onClose?: () => void; // Optional if we want a back button
    userRank?: number; // Optional user's specific rank
}

export const LeaderboardUI = (props: LeaderboardUIProps): JSX.Element => {
    const { title, entries, isLoading, onRefresh, onClose } = props;

    // Helper for Rank Badges
    const getRankColor = (index: number) => {
        if (index === 0) return Theme.colors.legendary; // Gold
        if (index === 1) return '#C0C0C0'; // Silver (Custom)
        if (index === 2) return '#CD7F32'; // Bronze
        return Theme.colors.textDim;
    };

    return (
        <vstack width="100%" height="100%" backgroundColor={Theme.colors.background}>
            {/* Header */}
            <vstack padding="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight}>
                <hstack alignment="space-between middle">
                    <vstack>
                        <text size="large" weight="bold" color={Theme.colors.primary}>{title}</text>
                        <text size="small" color={Theme.colors.textDim}>Global Hall of Fame</text>
                    </vstack>
                    <hstack gap="small">
                        <button size="small" appearance="plain" onPress={onRefresh} disabled={isLoading}>
                            {isLoading ? "Loading..." : "🔄 Refresh"}
                        </button>
                        {onClose && <button size="small" appearance="secondary" onPress={onClose}>✖ Close</button>}
                    </hstack>
                </hstack>
            </vstack>

            <spacer size="small" />

            {/* List */}
            <vstack grow padding="medium" gap="small" scrollable>
                {entries.length === 0 && !isLoading ? (
                    <vstack alignment="center middle" grow>
                        <text color={Theme.colors.textDim}>No legends yet. Be the first.</text>
                    </vstack>
                ) : (
                    entries.map((entry, index) => (
                        <hstack
                            key={entry.userId}
                            backgroundColor={index < 3 ? Theme.colors.surface : 'transparent'}
                            cornerRadius="small"
                            padding="small"
                            alignment="center middle"
                            border={index < 3 ? "thin" : "none"}
                            borderColor={Theme.colors.surfaceHighlight}
                        >
                            {/* Rank */}
                            <vstack width="30px" alignment="center middle">
                                <text weight="bold" size="large" color={getRankColor(index)}>
                                    #{index + 1}
                                </text>
                            </vstack>

                            <spacer size="small" />

                            {/* Avatar/Name */}
                            {entry.avatarUrl ? (
                                <image url={entry.avatarUrl} imageHeight={32} imageWidth={32} resizeMode="cover" radius="full" />
                            ) : null}

                            <spacer size="small" />

                            <vstack grow>
                                <text weight="bold" color={Theme.colors.text}>{entry.username || 'Anonymous'}</text>
                                <text size="small" color={Theme.colors.textDim}>{entry.userId}</text>
                            </vstack>

                            {/* Score */}
                            <text weight="bold" color={Theme.colors.gold} size="large">
                                {entry.score.toLocaleString()}
                            </text>
                        </hstack>
                    ))
                )}
            </vstack>

            {/* Footer / User Stats? */}
            <vstack padding="small" alignment="center middle" backgroundColor={Theme.colors.surface}>
                <text size="small" color={Theme.colors.textDim}>Top 10 Agents Globally</text>
            </vstack>
        </vstack>
    );
};
