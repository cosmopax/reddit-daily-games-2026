import { Theme } from '../Theme';
import type { Episode } from '../Episode';
import { episodePortraitUrl, getNeonPalette } from '../NeonArt';

export const NeonCard = (props: {
  children: JSX.Element | JSX.Element[];
  title?: string;
  subtitle?: string;
  accent?: 'a' | 'b';
}): JSX.Element => {
  const { children, title, subtitle, accent } = props;
  const borderColor =
    accent === 'a' ? Theme.colors.secondary : accent === 'b' ? Theme.colors.primary : Theme.colors.surfaceHighlight;

  return (
    <vstack
      padding="medium"
      cornerRadius="medium"
      backgroundColor={Theme.colors.surface}
      border="thin"
      borderColor={borderColor}
      gap="small"
    >
      {title ? (
        <vstack>
          <text weight="bold" size="medium" color={Theme.colors.text}>
            {title}
          </text>
          {subtitle ? (
            <text size="small" color={Theme.colors.textDim}>
              {subtitle}
            </text>
          ) : null}
        </vstack>
      ) : null}
      {children}
    </vstack>
  );
};

export const SignalPills = (props: { episode: Episode }): JSX.Element => {
  const a = props.episode.signals?.[0];
  const b = props.episode.signals?.[1];
  if (!a || !b) return <text size="small" color={Theme.colors.textDim}>No signals.</text>;

  return (
    <hstack gap="small">
      <vstack backgroundColor="#0f1118" cornerRadius="full" padding="small" border="thin" borderColor={Theme.colors.secondary}>
        <text size="small" weight="bold" color={Theme.colors.secondary}>
          {a.query}
        </text>
      </vstack>
      <vstack backgroundColor="#0f1118" cornerRadius="full" padding="small" border="thin" borderColor={Theme.colors.primary}>
        <text size="small" weight="bold" color={Theme.colors.primary}>
          {b.query}
        </text>
      </vstack>
    </hstack>
  );
};

export const DialogueBox = (props: { speaker: string; line: string; tone: 'oracle' | 'rival' }): JSX.Element => {
  const toneColor = props.tone === 'oracle' ? Theme.colors.success : Theme.colors.warning;
  const borderColor = props.tone === 'oracle' ? Theme.colors.secondary : Theme.colors.primary;
  return (
    <vstack backgroundColor="#0f1118" cornerRadius="small" padding="small" border="thin" borderColor={borderColor}>
      <text color={Theme.colors.text} weight="bold">
        {props.speaker}
      </text>
      <text color={toneColor} size="small" wrap>
        {props.line}
      </text>
    </vstack>
  );
};

export const EpisodeHeader = (props: {
  episode: Episode;
  title: string;
  subtitle: string;
  rightActionLabel?: string;
  onRightAction?: () => void;
}): JSX.Element => {
  const { episode } = props;
  const palette = getNeonPalette(episode.paletteId);
  const portraitUrl = episode.portraitUrl || episodePortraitUrl(episode, 'ORACLE NYX');

  return (
    <vstack
      padding="medium"
      cornerRadius="medium"
      backgroundColor={Theme.colors.surface}
      border="thin"
      borderColor={Theme.colors.surfaceHighlight}
      gap="small"
    >
      <hstack alignment="space-between middle">
        <vstack grow>
          <text size="xxlarge" weight="bold" color={Theme.colors.primary}>
            {props.title}
          </text>
          <text size="small" color={Theme.colors.textDim}>
            {props.subtitle}
          </text>
          <text size="small" color={palette.accent2} weight="bold">
            {episode.title}
          </text>
        </vstack>
        <vstack alignment="center middle">
          <image url={portraitUrl} imageHeight={72} imageWidth={120} resizeMode="cover" />
          {props.rightActionLabel && props.onRightAction ? (
            <button appearance="secondary" size="small" onPress={props.onRightAction}>
              {props.rightActionLabel}
            </button>
          ) : null}
        </vstack>
      </hstack>

      <SignalPills episode={episode} />

      <vstack gap="small">
        <DialogueBox speaker="Oracle Nyx" line={episode.oracleLine} tone="oracle" />
        <DialogueBox speaker="CEO Vex" line={episode.rivalLine} tone="rival" />
      </vstack>
    </vstack>
  );
};
