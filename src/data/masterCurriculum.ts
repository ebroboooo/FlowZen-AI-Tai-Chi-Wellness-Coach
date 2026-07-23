/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementalType } from '@/types';

export interface MasterMovement {
  id: string;
  name: string;
  element: ElementalType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in seconds
  phases: Array<'preparation' | 'gathering' | 'extension' | 'recovery'>;
  breathingPattern: {
    inhaleSeconds: number;
    holdSeconds: number;
    exhaleSeconds: number;
  };
  avatarStyle: {
    robeColor: string;
    energyEffect: string;
  };
  commonMistakes: string[];
  masterTips: string[];
}

export interface MasterProgram {
  id: string;
  name: string;
  element: ElementalType;
  description: string;
  levels: Array<'beginner' | 'intermediate' | 'advanced'>;
  movements: MasterMovement[];
}

export const MASTER_CURRICULUM: Record<ElementalType, MasterProgram> = {
  air: {
    id: 'program-air',
    name: 'Air Flow Path — Feather Weight & Breath',
    element: 'air',
    description: 'Master effortless breath coordination, floating transitions, and cloud hand fluidity.',
    levels: ['beginner', 'intermediate', 'advanced'],
    movements: [
      {
        id: 'air-breath-flow',
        name: 'Breath Flow',
        element: 'air',
        difficulty: 'beginner',
        duration: 300,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 4, holdSeconds: 2, exhaleSeconds: 6 },
        avatarStyle: { robeColor: '#e0f2fe', energyEffect: 'soft wind ribbons' },
        commonMistakes: ['Tensing upper shoulders during inhalation', 'Shallow chest breathing'],
        masterTips: ['Inhale soft mountain air through the nose, expand the diaphragm gently.']
      },
      {
        id: 'air-cloud-hands',
        name: 'Cloud Hands',
        element: 'air',
        difficulty: 'intermediate',
        duration: 450,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 4, holdSeconds: 1, exhaleSeconds: 5 },
        avatarStyle: { robeColor: '#bae6fd', energyEffect: 'circling breeze trails' },
        commonMistakes: ['Locking wrists at hand turns', 'Moving arms without waist rotation'],
        masterTips: ['Your waist is the axle; your wrists turn softly like drifting clouds.']
      },
      {
        id: 'air-light-movement',
        name: 'Light Movement',
        element: 'air',
        difficulty: 'advanced',
        duration: 600,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 5, holdSeconds: 2, exhaleSeconds: 7 },
        avatarStyle: { robeColor: '#7dd3fc', energyEffect: 'floating aerial mist' },
        commonMistakes: ['Heavy heel steps', 'Rushing weight shifts'],
        masterTips: ['Step like a cat on thin ice; touch with the toe before settling weight.']
      }
    ]
  },
  water: {
    id: 'program-water',
    name: 'Water Flow Path — Liquid Continuous Grace',
    element: 'water',
    description: 'Embrace seamless yielding, wave movements, and uninterrupted momentum.',
    levels: ['beginner', 'intermediate', 'advanced'],
    movements: [
      {
        id: 'water-flow-movement',
        name: 'Flow Movement',
        element: 'water',
        difficulty: 'beginner',
        duration: 300,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 4, holdSeconds: 0, exhaleSeconds: 6 },
        avatarStyle: { robeColor: '#e0f2fe', energyEffect: 'ocean ripples' },
        commonMistakes: ['Abrupt stops between arcs', 'Stiff elbow angles'],
        masterTips: ['Eliminate all sharp corners; move continuously like river currents.']
      },
      {
        id: 'water-wave-hands',
        name: 'Wave Hands',
        element: 'water',
        difficulty: 'intermediate',
        duration: 450,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 5, holdSeconds: 1, exhaleSeconds: 6 },
        avatarStyle: { robeColor: '#38bdf8', energyEffect: 'tidal waves' },
        commonMistakes: ['Over-extending wrists past shoulder plane', 'Dropping eyes away from palm'],
        masterTips: ['Yield gently to opposition; let force dissolve into ocean depth.']
      },
      {
        id: 'water-continuous-transitions',
        name: 'Continuous Transitions',
        element: 'water',
        difficulty: 'advanced',
        duration: 600,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 5, holdSeconds: 2, exhaleSeconds: 7 },
        avatarStyle: { robeColor: '#0284c7', energyEffect: 'swirling vortex' },
        commonMistakes: ['Holding breath during directional turns', 'Tensing core during transition'],
        masterTips: ['Maintain liquid continuity even as direction reverses.']
      }
    ]
  },
  fire: {
    id: 'program-fire',
    name: 'Fire Flow Path — Dynamic Rooted Energy',
    element: 'fire',
    description: 'Cultivate martial focus, explosive energy release (Fa Jin), and warm vitality.',
    levels: ['beginner', 'intermediate', 'advanced'],
    movements: [
      {
        id: 'fire-rooted-power',
        name: 'Rooted Power',
        element: 'fire',
        difficulty: 'beginner',
        duration: 300,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 3, holdSeconds: 1, exhaleSeconds: 4 },
        avatarStyle: { robeColor: '#fef08a', energyEffect: 'warm inner hearth glow' },
        commonMistakes: ['Excess muscular tension', 'Collapsing back alignment'],
        masterTips: ['Store power in your legs like a coiled spring before expanding.']
      },
      {
        id: 'fire-energy-release',
        name: 'Energy Release',
        element: 'fire',
        difficulty: 'intermediate',
        duration: 450,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 3, holdSeconds: 1, exhaleSeconds: 3 },
        avatarStyle: { robeColor: '#f97316', energyEffect: 'bursting ember arc' },
        commonMistakes: ['Releasing without solid root', 'Hyperextending joints'],
        masterTips: ['Express internal warmth through your palms with grounded intention.']
      },
      {
        id: 'fire-martial-flow',
        name: 'Martial Flow',
        element: 'fire',
        difficulty: 'advanced',
        duration: 600,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 4, holdSeconds: 1, exhaleSeconds: 4 },
        avatarStyle: { robeColor: '#dc2626', energyEffect: 'radiant solar ring' },
        commonMistakes: ['Rushing stance setup', 'Losing peripheral focus'],
        masterTips: ['Maintain absolute mental stillness inside dynamic physical release.']
      }
    ]
  },
  earth: {
    id: 'program-earth',
    name: 'Earth Flow Path — Unshakable Stability & Rooting',
    element: 'earth',
    description: 'Establish deep lower-body stability, Dantian centering, and cedar-like balance.',
    levels: ['beginner', 'intermediate', 'advanced'],
    movements: [
      {
        id: 'earth-stability',
        name: 'Stability',
        element: 'earth',
        difficulty: 'beginner',
        duration: 300,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 5, holdSeconds: 2, exhaleSeconds: 5 },
        avatarStyle: { robeColor: '#ecfccb', energyEffect: 'grounding roots' },
        commonMistakes: ['Standing too high without knee bend', 'Leaning torso forward'],
        masterTips: ['Sink your center of gravity down through your knees into your heels.']
      },
      {
        id: 'earth-rooting',
        name: 'Rooting',
        element: 'earth',
        difficulty: 'intermediate',
        duration: 450,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 5, holdSeconds: 2, exhaleSeconds: 6 },
        avatarStyle: { robeColor: '#84cc16', energyEffect: 'rock solid aura' },
        commonMistakes: ['Lifting toes off the ground', 'Tightening lower lumbar spine'],
        masterTips: ['Grip the floor gently with all ten toes like roots in fertile soil.']
      },
      {
        id: 'earth-balance-forms',
        name: 'Balance Forms',
        element: 'earth',
        difficulty: 'advanced',
        duration: 600,
        phases: ['preparation', 'gathering', 'extension', 'recovery'],
        breathingPattern: { inhaleSeconds: 6, holdSeconds: 2, exhaleSeconds: 6 },
        avatarStyle: { robeColor: '#4d7c0f', energyEffect: 'mountain aura' },
        commonMistakes: ['Wobbling hips on single-leg support', 'Holding breath to balance'],
        masterTips: ['Focus your gaze on a stable horizon and settle your spirit in the Dantian.']
      }
    ]
  }
};

/**
 * Returns program for given element or falls back to Air path safely
 */
export function getMasterProgram(element?: ElementalType): MasterProgram {
  if (element && MASTER_CURRICULUM[element]) {
    return MASTER_CURRICULUM[element];
  }
  return MASTER_CURRICULUM.air;
}
