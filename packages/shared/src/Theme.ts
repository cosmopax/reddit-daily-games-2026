export const Theme = {
    brand: {
        name: 'cosmopax',
        motto: 'Total Gamification',
        footer: 'cosmopax | Total Gamification',
    },
    colors: {
        // Base
        primary: '#FF4500', // Reddit Orange
        secondary: '#0079D3', // Reddit Blue
        background: '#1A1A1B', // Dark Mode BG (Scientific Dark)
        surface: '#272729', // Card BG
        surfaceHighlight: '#343536',

        // Text
        text: '#D7DADC', // Primary Text
        textDim: '#818384', // Secondary Text
        textDark: '#1A1A1B',

        // Semantic
        success: '#46D160',
        danger: '#EA0027',
        warning: '#FFB000',
        gold: '#D4AF37',

        // Rarity Tiers (Scientific/RPG)
        rarity: {
            common: '#818384',    // Grey
            uncommon: '#46D160',  // Green
            rare: '#0079D3',      // Blue
            epic: '#9400D3',      // Purple
            legendary: '#FF4500', // Orange/Gold
            mythic: '#D4AF37',    // Gold
        }
    },
    gradients: {
        primary: 'linear-gradient(45deg, #FF4500, #FF8717)',
        secondary: 'linear-gradient(45deg, #0079D3, #00C3FF)',
        dark: 'linear-gradient(180deg, #1A1A1B 0%, #000000 100%)',
        surface: 'linear-gradient(180deg, #272729 0%, #1A1A1B 100%)',
        // Rarity Gradients
        legendary: 'linear-gradient(135deg, #FF4500 0%, #D4AF37 100%)',
        mythic: 'linear-gradient(135deg, #D4AF37 0%, #F1C40F 50%, #FF4500 100%)',
    },
    effects: {
        glass: {
            backgroundColor: 'rgba(39, 39, 41, 0.8)',
            // backdropFilter: 'blur(10px)', // Devvit might not support this yet, fallback to opacity
        },
        neon: {
            boxShadow: '0 0 10px rgba(255, 69, 0, 0.5)',
        },
        shadow: {
            small: '0px 2px 4px rgba(0,0,0,0.2)',
            medium: '0px 4px 8px rgba(0,0,0,0.4)',
        }
    },
    spacing: {
        small: '8px',
        medium: '16px',
        large: '24px',
        xl: '32px',
    },
    radius: {
        small: '4px',
        medium: '8px',
        large: '16px',
        round: '999px',
    },
    typography: {
        heading: {
            size: '24px',
            weight: 'bold',
            color: '#D7DADC',
        },
        subheading: {
            size: '18px',
            weight: 'bold',
            color: '#818384',
        },
        body: {
            size: '14px',
            color: '#D7DADC',
        },
        caption: {
            size: '12px',
            color: '#818384',
        },
        code: {
            family: 'monospace',
            size: '12px',
            color: '#FF4500',
        }
    }
};

export const Styles = {
    // Standard Card
    card: {
        backgroundColor: Theme.colors.surface,
        padding: Theme.spacing.medium,
        cornerRadius: Theme.radius.medium,
        border: `1px solid ${Theme.colors.surfaceHighlight}`,
    },
    // Glassmorphic Card (Premium)
    glassCard: {
        backgroundColor: Theme.effects.glass.backgroundColor,
        padding: Theme.spacing.medium,
        cornerRadius: Theme.radius.medium,
        border: `1px solid ${Theme.colors.surfaceHighlight}`,
    },
    // Buttons
    button: {
        primary: {
            backgroundColor: Theme.colors.primary,
            color: 'white',
            cornerRadius: Theme.radius.round,
            padding: '8px 16px', // explicit because Devvit padding is string
        },
        secondary: {
            backgroundColor: Theme.colors.secondary,
            color: 'white',
            cornerRadius: Theme.radius.round,
            padding: '8px 16px',
        },
        outline: {
            borderColor: Theme.colors.textDim,
            borderWidth: '1px',
            color: Theme.colors.text,
            cornerRadius: Theme.radius.round,
            padding: '8px 16px',
        },
        // Action Button (e.g. "Buy", "Fight")
        action: {
            backgroundColor: Theme.colors.success,
            color: 'white',
            cornerRadius: Theme.radius.medium,
            padding: '12px 24px',
            weight: 'bold',
        }
    }
};
