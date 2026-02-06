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
    // Game sub-themes (accent colors per game)
    gameThemes: {
        strategy: { accent: '#46D160', accentDim: '#2A7A3A' },  // Green/gold for money
        trivia: { accent: '#0079D3', accentDim: '#005A9E' },    // Blue for knowledge
        meme: { accent: '#FF8717', accentDim: '#CC6B12' },      // Orange for creativity
        duel: { accent: '#EA0027', accentDim: '#B8001F' },      // Red for combat
    },

    // Narrative layer — manga/graphic novel aesthetic
    narrative: {
        newspaper: { bg: '#FFFFF0', text: '#0A0A0A', border: '#333333' },
        speechBubble: { bg: '#272729', border: '#818384' },
        vicAccent: '#EA0027',
        salAccent: '#46D160',
        goldHighlight: '#D4AF37',
        terminalGreen: '#00FF41',
        dangerRed: '#FF3333',
        noir: '#0A0A0A',
    },

    // Character accent palette
    characters: {
        vic: { color: '#EA0027', bg: '#1A0000' },
        sal: { color: '#46D160', bg: '#001A00' },
        bladeDancer: { color: '#9400D3', bg: '#0D001A' },
        neuralWitch: { color: '#6A0DAD', bg: '#0A001A' },
        chromeAssassin: { color: '#EA0027', bg: '#1A0000' },
        voidSiren: { color: '#0079D3', bg: '#00001A' },
    },
};
