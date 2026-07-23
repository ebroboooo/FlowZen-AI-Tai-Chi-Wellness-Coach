/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementalThemeConfig, ElementalType } from '@/types';

export const ELEMENTAL_THEMES: Record<ElementalType, ElementalThemeConfig> = {
  air: {
    id: 'air',
    name: 'Air Flow',
    tagline: 'Light, effortless, and expansive motion like floating breeze',
    description: 'Focuses on upper-body lightness, expansive ribcage breathing, and weightless arm transitions.',
    avatarStyle: 'flowing',
    visuals: {
      primaryColor: '#0ea5e9', // Sky blue
      secondaryColor: '#38bdf8', // Light sky blue
      accentColor: '#e0f2fe', // Mint mist
      glowColor: 'rgba(56, 189, 248, 0.35)',
      particleConfig: {
        particleType: 'wind-whisper',
        density: 24,
        speed: 1.2,
        lifetime: 3.5,
        intensity: 0.6,
      },
    },
    soundscape: {
      ambientType: 'mountain-wind',
      breathingStyle: 'calm',
      intensity: 0.5,
    },
    environmentMood: {
      name: 'High Mountain Sanctuary',
      description: 'Expansive open sky above mountain mist with gentle currents of wind.',
      ambientColor: '#f0f9ff',
      fogDensity: 0.15,
    },
    avatarGuidanceStyle: {
      movementCadence: 'Fluid and buoyant with soft floating ascents',
      breathingFocus: 'Inhale into upper lungs and shoulders, expanding effortlessly like wind',
      guidancePromptPrefix: 'As Air Flow, let your movements float softly like warm mountain breeze.',
    },
  },

  fire: {
    id: 'fire',
    name: 'Fire Flow',
    tagline: 'Dynamic, focused energy with martial clarity and warmth',
    description: 'Emphasizes vitality, intentful expansion, crisp weight shifts, and energetic expression.',
    avatarStyle: 'powerful',
    visuals: {
      primaryColor: '#f97316', // Vibrant orange
      secondaryColor: '#fb923c', // Warm amber
      accentColor: '#fef3c7', // Warm gold
      glowColor: 'rgba(249, 115, 22, 0.4)',
      particleConfig: {
        particleType: 'golden-embers',
        density: 35,
        speed: 2.0,
        lifetime: 2.0,
        intensity: 0.85,
      },
    },
    soundscape: {
      ambientType: 'hearth-embers',
      breathingStyle: 'dynamic',
      intensity: 0.8,
    },
    environmentMood: {
      name: 'Twilight Temple Court',
      description: 'Warm evening glow framed by courtyard braziers and radiating golden warmth.',
      ambientColor: '#fff7ed',
      fogDensity: 0.1,
    },
    avatarGuidanceStyle: {
      movementCadence: 'Decisive, spirited, with strong focal points and warm releases',
      breathingFocus: 'Rhythmic diaphragmatic pulse generating internal warmth and focus',
      guidancePromptPrefix: 'As Fire Flow, channel focused energy and vibrant warmth through every joint.',
    },
  },

  water: {
    id: 'water',
    name: 'Water Flow',
    tagline: 'Smooth, unbroken rhythm moving like tide and river currents',
    description: 'Prioritizes continuous momentum, circular arm routing, soft hips, and ripple-like pacing.',
    avatarStyle: 'flowing',
    visuals: {
      primaryColor: '#0284c7', // Azure river
      secondaryColor: '#06b6d4', // Teal current
      accentColor: '#cff4fc', // Water foam
      glowColor: 'rgba(6, 182, 212, 0.35)',
      particleConfig: {
        particleType: 'water-ripples',
        density: 28,
        speed: 1.0,
        lifetime: 4.0,
        intensity: 0.7,
      },
    },
    soundscape: {
      ambientType: 'ocean-stream',
      breathingStyle: 'wave-pacing',
      intensity: 0.6,
    },
    environmentMood: {
      name: 'Bamboo Stream Pavilion',
      description: 'Tranquil water mirror surrounded by soft bamboo groves and subtle ripples.',
      ambientColor: '#ecfeff',
      fogDensity: 0.2,
    },
    avatarGuidanceStyle: {
      movementCadence: 'Continuous, seamless loops without abrupt halts',
      breathingFocus: 'Ebb and flow like ocean tide matching arm arcs',
      guidancePromptPrefix: 'As Water Flow, yield smoothly and flow uninterrupted like a winding river.',
    },
  },

  earth: {
    id: 'earth',
    name: 'Earth Flow',
    tagline: 'Deeply rooted, grounded, and stable somatic presence',
    description: 'Anchors lower body stance, sink center of gravity, and cultivate quiet stillness in motion.',
    avatarStyle: 'grounded',
    visuals: {
      primaryColor: '#059669', // Emerald forest
      secondaryColor: '#10b981', // Sage
      accentColor: '#d1fae5', // Stone moss
      glowColor: 'rgba(16, 185, 129, 0.35)',
      particleConfig: {
        particleType: 'earth-dust-motes',
        density: 18,
        speed: 0.6,
        lifetime: 5.0,
        intensity: 0.45,
      },
    },
    soundscape: {
      ambientType: 'singing-bowl',
      breathingStyle: 'deep-dantian',
      intensity: 0.4,
    },
    environmentMood: {
      name: 'Ancient Cedar Grove',
      description: 'Rooted forest sanctuary bathed in soft sunbeams filtering through mossy cedar canopy.',
      ambientColor: '#f0fdf4',
      fogDensity: 0.25,
    },
    avatarGuidanceStyle: {
      movementCadence: 'Deliberate, rooted, heavy-soled balance with unshakeable core stability',
      breathingFocus: 'Deep Dantian abdominal breathing sinking breath into lower abdomen',
      guidancePromptPrefix: 'As Earth Flow, root your feet deeply into the ground like an ancient mountain.',
    },
  },
};

export function getElementalTheme(element?: ElementalType): ElementalThemeConfig {
  if (!element || !ELEMENTAL_THEMES[element]) {
    return ELEMENTAL_THEMES.air;
  }
  return ELEMENTAL_THEMES[element];
}
