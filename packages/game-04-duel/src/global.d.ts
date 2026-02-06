import type { Devvit } from '@devvit/public-api';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            vstack: Devvit.Blocks.VStackProps;
            hstack: Devvit.Blocks.HStackProps;
            zstack: Devvit.Blocks.ZStackProps;
            spacer: Devvit.Blocks.SpacerProps;
            text: Devvit.Blocks.TextProps;
            button: Devvit.Blocks.ButtonProps;
            image: Devvit.Blocks.ImageProps;
            icon: Devvit.Blocks.IconProps;
            textfield: Devvit.Blocks.TextFieldProps;
        }
    }
}

