import { Devvit } from '@devvit/public-api';
import { Theme } from '../Theme';
import { LeaderboardEntry } from '../Leaderboard';

interface LeaderboardUIProps {
    title: string;
    entries: LeaderboardEntry[];
    isLoading: boolean;
    onRefresh: () => void;
    onClose?: () => void;
    scoreLabel?: string;
    currentUserId?: string;
}

const getRankDisplay = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
};

const getRankColor = (index: number): string => {
    if (index === 0) return '#FFD700';
    if (index === 1) return '#C0C0C0';
    if (index === 2) return '#CD7F32';
    return Theme.colors.textDim;
};

export const LeaderboardUI = (props: LeaderboardUIProps): JSX.Element => {
    const { title, entries, isLoading, onRefresh, onClose, scoreLabel, currentUserId } = props;

    return (
        <vstack width="100%" height="100%" backgroundColor={Theme.colors.background}>
            <vstack padding="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight}>
                <hstack alignment="middle">
                    <vstack>
                        <text size="large" weight="bold" color={Theme.colors.primary}>{title}</text>
                        <text size="small" color={Theme.colors.textDim}>Community Rankings</text>
                    </vstack>
                    <hstack gap="small">
                        <button size="small" appearance="plain" onPress={onRefresh} disabled={isLoading}>
                            {isLoading ? "..." : "Refresh"}
                        </button>
                        {onClose ? <button size="small" appearance="secondary" onPress={onClose}>Back</button> : null}
                    </hstack>
                </hstack>
            </vstack>

            <spacer size="small" />

            <vstack grow padding="medium" gap="small">
                {entries.length === 0 && !isLoading ? (
                    <vstack alignment="center middle" grow>
                        <text color={Theme.colors.textDim} size="large">No legends yet.</text>
                        <text color={Theme.colors.textDim} size="small">Be the first to claim the throne!</text>
                    </vstack>
                ) : (
                    entries.map((entry, index) => {
                        const isCurrentUser = currentUserId && entry.userId === currentUserId;
                        return (
                            <hstack
                                key={entry.userId}
                                backgroundColor={isCurrentUser ? Theme.colors.surfaceHighlight : (index < 3 ? Theme.colors.surface : 'transparent')}
                                cornerRadius="small"
                                padding="small"
                                alignment="center middle"
                                border={index < 3 || isCurrentUser ? "thin" : "none"}
                                borderColor={isCurrentUser ? Theme.colors.primary : Theme.colors.surfaceHighlight}
                            >
                                <vstack width="40px" alignment="center middle">
                                    <text weight="bold" size="large" color={getRankColor(index)}>
                                        {getRankDisplay(index)}
                                    </text>
                                </vstack>

                                <spacer size="small" />

                                <vstack grow>
                                    <hstack gap="small" alignment="middle">
                                        <text weight="bold" color={isCurrentUser ? Theme.colors.primary : Theme.colors.text}>
                                            {entry.username || 'Anonymous'}
                                        </text>
                                        {isCurrentUser ? <text size="small" color={Theme.colors.primary}>(You)</text> : null}
                                    </hstack>
                                </vstack>

                                <text weight="bold" color={Theme.colors.gold} size="large">
                                    {scoreLabel ? `${entry.score.toLocaleString()} ${scoreLabel}` : entry.score.toLocaleString()}
                                </text>
                            </hstack>
                        );
                    })
                )}
            </vstack>

            <vstack padding="small" alignment="center middle" backgroundColor={Theme.colors.surface}>
                <text size="small" color={Theme.colors.textDim}>Top 10 in this community</text>
            </vstack>
        </vstack>
    );
};
