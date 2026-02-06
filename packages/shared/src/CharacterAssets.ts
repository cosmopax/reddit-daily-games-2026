/**
 * Pre-generated character assets for the narrative layer.
 *
 * PLACEHOLDER URLS: Currently using placehold.co.
 * Replace with actual AI-generated art URLs (Flux.1/Replicate) before final submission.
 * Run: scripts/generateCharacterArt.sh to batch-generate with Replicate API.
 */

export interface CharacterProfile {
    id: string;
    name: string;
    role: string;
    tagline: string;
    portraitUrl: string;
    accentColor: string;
    bgTint: string;       // Darkened version for panel backgrounds
}

// ═══════════════════════════════════════════
// GAME 01: GET RICH LAZY — Vic & Sal
// ═══════════════════════════════════════════

export const VIC: CharacterProfile = {
    id: 'vic',
    name: 'VIC',
    role: 'High-Risk Speculator',
    tagline: 'Fortune favors the degenerate.',
    portraitUrl: 'https://placehold.co/128x128/EA0027/FFFFFF?text=VIC',
    accentColor: '#EA0027',
    bgTint: '#1A0000',
};

export const SAL: CharacterProfile = {
    id: 'sal',
    name: 'SAL',
    role: 'Old-School Strategist',
    tagline: 'Slow money is smart money.',
    portraitUrl: 'https://placehold.co/128x128/46D160/FFFFFF?text=SAL',
    accentColor: '#46D160',
    bgTint: '#001A00',
};

// ═══════════════════════════════════════════
// GAME 04: OUTSMARTED — Valkyrie Archetypes
// ═══════════════════════════════════════════

export const VALKYRIES: Record<string, CharacterProfile> = {
    'Blade Dancer': {
        id: 'blade_dancer',
        name: 'Blade Dancer',
        role: 'Elegant Combat Specialist',
        tagline: 'Every strike is choreography.',
        portraitUrl: 'https://placehold.co/128x128/9400D3/FFFFFF?text=BD',
        accentColor: '#9400D3',
        bgTint: '#0D001A',
    },
    'Neural Witch': {
        id: 'neural_witch',
        name: 'Neural Witch',
        role: 'Arcane Hacker',
        tagline: 'Your firewalls are my playthings.',
        portraitUrl: 'https://placehold.co/128x128/6A0DAD/FFFFFF?text=NW',
        accentColor: '#6A0DAD',
        bgTint: '#0A001A',
    },
    'Chrome Assassin': {
        id: 'chrome_assassin',
        name: 'Chrome Assassin',
        role: 'Stealth Eliminator',
        tagline: 'You never see the killing blow.',
        portraitUrl: 'https://placehold.co/128x128/EA0027/FFFFFF?text=CA',
        accentColor: '#EA0027',
        bgTint: '#1A0000',
    },
    'Void Siren': {
        id: 'void_siren',
        name: 'Void Siren',
        role: 'Cosmic Entity',
        tagline: 'Reality bends to my song.',
        portraitUrl: 'https://placehold.co/128x128/0079D3/FFFFFF?text=VS',
        accentColor: '#0079D3',
        bgTint: '#00001A',
    },
};

// ═══════════════════════════════════════════
// GAME 02 & 03: Thematic Assets
// ═══════════════════════════════════════════

export const HIVE_BRAIN: CharacterProfile = {
    id: 'hive_brain',
    name: 'THE HIVE',
    role: 'Collective Intelligence',
    tagline: 'One mind. Infinite connections.',
    portraitUrl: 'https://placehold.co/128x128/FF4500/FFFFFF?text=HIVE',
    accentColor: '#FF4500',
    bgTint: '#1A0500',
};

export const MEME_LORD: CharacterProfile = {
    id: 'meme_lord',
    name: 'MEME LORD',
    role: 'Arena Champion',
    tagline: 'The crowd decides your fate.',
    portraitUrl: 'https://placehold.co/128x128/D4AF37/000000?text=MEME',
    accentColor: '#D4AF37',
    bgTint: '#1A1500',
};

/**
 * Get a Valkyrie profile by role name.
 * Falls back to a default if role is unknown.
 */
export function getValkyrieProfile(role: string): CharacterProfile {
    return VALKYRIES[role] || {
        id: 'unknown',
        name: role || 'GEMINI CORE',
        role: 'Unknown Archetype',
        tagline: 'Prepare yourself.',
        portraitUrl: 'https://placehold.co/128x128/EA0027/FFFFFF?text=AI',
        accentColor: '#EA0027',
        bgTint: '#1A0000',
    };
}
