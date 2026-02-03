export const Theme = {
    colors: {
        primary: '#FF4500', // Reddit Orange
        secondary: '#0079D3', // Reddit Blue
        background: '#1A1A1B', // Dark Mode BG
        surface: '#272729', // Card BG
        text: '#D7DADC', // Primary Text
        textDim: '#818384', // Secondary Text
        success: '#46D160',
        danger: '#EA0027',
        gold: '#D4AF37',
    },
    spacing: {
        small: '8px',
        medium: '16px',
        large: '24px',
    },
    radius: {
        small: '4px',
        medium: '8px',
        round: '999px',
    }
};

export const Styles = {
    card: {
        backgroundColor: Theme.colors.surface,
        padding: '16px',
        cornerRadius: '8px',
        border: '1px solid #343536',
    },
    button: {
        primary: {
            backgroundColor: Theme.colors.primary,
            color: 'white',
            cornerRadius: '999px',
            padding: '8px 16px',
        },
        outline: {
            borderColor: Theme.colors.textDim,
            borderWidth: '1px',
            color: Theme.colors.text,
            cornerRadius: '999px',
            padding: '8px 16px',
        }
    }
};
