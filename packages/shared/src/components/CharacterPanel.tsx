import { Devvit } from '@devvit/public-api';
import { Theme } from '../Theme';
import type { CharacterProfile } from '../CharacterAssets';

interface CharacterPanelProps {
    character: CharacterProfile;
    dialogue: string;
    action?: {
        label: string;
        onPress: () => void;
        appearance?: 'primary' | 'secondary' | 'destructive' | 'bordered';
    };
    compact?: boolean;
}

/**
 * Manga-style character panel with portrait + speech bubble.
 * Used by Game 01 (Vic/Sal advice) and Game 04 (Valkyrie intro).
 */
export const CharacterPanel = (props: CharacterPanelProps): JSX.Element => {
    const { character, dialogue, action, compact } = props;
    const imgSize = compact ? 40 : 56;

    return (
        <hstack
            backgroundColor={character.bgTint}
            padding={compact ? 'small' : 'medium'}
            cornerRadius="medium"
            border="thin"
            borderColor={character.accentColor}
            alignment="center middle"
            gap="small"
        >
            {/* Character Portrait */}
            <image
                url={character.portraitUrl}
                imageWidth={imgSize}
                imageHeight={imgSize}
                resizeMode="cover"
            />

            {/* Speech Bubble */}
            <vstack grow gap="small">
                <hstack alignment="start middle" gap="small">
                    <text color={character.accentColor} weight="bold" size={compact ? 'small' : 'medium'}>
                        {character.name}
                    </text>
                    {!compact && (
                        <text color={Theme.colors.textDim} size="small">
                            {character.role}
                        </text>
                    )}
                </hstack>
                <text color={Theme.colors.text} size="small" wrap>
                    "{dialogue}"
                </text>
            </vstack>

            {/* Optional Action Button */}
            {action && (
                <button
                    appearance={action.appearance || 'primary'}
                    size="small"
                    onPress={action.onPress}
                >
                    {action.label}
                </button>
            )}
        </hstack>
    );
};
