/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WeatherState = 'clear' | 'rain' | 'snow' | 'wind' | 'sunrise' | 'sunset';

export interface GardenProgress {
  minutes?: number;
  streak?: number;
  completedLessonsCount?: number;
  elementMastery?: {
    air?: boolean | number;
    water?: boolean | number;
    fire?: boolean | number;
    earth?: boolean | number;
  };
}

export interface PlantGrowth {
  stage: number;
  scaleFactor: number;
  bloomPercentage: number;
  label: string;
}

export interface AmbientUnlocks {
  birdsUnlocked: boolean;
  butterfliesUnlocked: boolean;
  floatingLanternsUnlocked: boolean;
  ambientCreaturesUnlocked: boolean;
}

export interface MonumentUnlocks {
  airTemple: boolean;
  waterSanctuary: boolean;
  fireShrine: boolean;
  earthTemple: boolean;
}

/**
 * Calculates plant growth metrics based on total practice minutes.
 * Includes empty/undefined progress fallback.
 */
export function calculatePlantGrowth(minutes: number = 0): PlantGrowth {
  const safeMinutes = Math.max(0, isNaN(minutes) ? 0 : minutes);

  if (safeMinutes >= 120) {
    return { stage: 4, scaleFactor: 1.3, bloomPercentage: 100, label: 'Full Bloom Master' };
  } else if (safeMinutes >= 60) {
    return { stage: 3, scaleFactor: 1.1, bloomPercentage: 75, label: 'Flourishing Flora' };
  } else if (safeMinutes >= 20) {
    return { stage: 2, scaleFactor: 0.85, bloomPercentage: 40, label: 'Budding Sprout' };
  } else {
    return { stage: 1, scaleFactor: 0.6, bloomPercentage: 10, label: 'Young Seedling' };
  }
}

/**
 * Calculates ambient creature and item unlocks based on daily practice streak.
 * Includes empty/undefined progress fallback.
 */
export function calculateStreakUnlocks(streak: number = 0): AmbientUnlocks {
  const safeStreak = Math.max(0, isNaN(streak) ? 0 : streak);

  return {
    birdsUnlocked: safeStreak >= 2,
    butterfliesUnlocked: safeStreak >= 4,
    floatingLanternsUnlocked: safeStreak >= 7,
    ambientCreaturesUnlocked: safeStreak >= 12,
  };
}

/**
 * Calculates elemental monument unlocks based on element mastery or progress stats.
 * Includes empty/undefined progress fallback.
 */
export function calculateElementalMonuments(progress?: GardenProgress): MonumentUnlocks {
  if (!progress) {
    return {
      airTemple: false,
      waterSanctuary: false,
      fireShrine: false,
      earthTemple: false,
    };
  }

  const mins = progress.minutes || 0;
  const streak = progress.streak || 0;
  const mastery = progress.elementMastery || {};

  const isAir = Boolean(mastery.air) || mins >= 30 || streak >= 3;
  const isWater = Boolean(mastery.water) || mins >= 45 || streak >= 5;
  const isFire = Boolean(mastery.fire) || mins >= 60 || streak >= 7;
  const isEarth = Boolean(mastery.earth) || mins >= 90 || streak >= 10;

  return {
    airTemple: isAir,
    waterSanctuary: isWater,
    fireShrine: isFire,
    earthTemple: isEarth,
  };
}

/**
 * Gets background gradient and lighting properties for weather states.
 */
export function getWeatherLighting(weather: WeatherState) {
  switch (weather) {
    case 'sunrise':
      return {
        name: 'Golden Sunrise',
        bgGradient: 'from-amber-200 via-rose-200 to-sky-300',
        skyColor: '#fde68a',
        fogColor: 'rgba(251, 146, 60, 0.25)',
      };
    case 'sunset':
      return {
        name: 'Crimson Sunset',
        bgGradient: 'from-purple-900 via-rose-800 to-amber-700',
        skyColor: '#f43f5e',
        fogColor: 'rgba(159, 18, 57, 0.35)',
      };
    case 'rain':
      return {
        name: 'Mist Rain',
        bgGradient: 'from-slate-700 via-slate-800 to-stone-900',
        skyColor: '#64748b',
        fogColor: 'rgba(148, 163, 184, 0.4)',
      };
    case 'snow':
      return {
        name: 'Winter Snow',
        bgGradient: 'from-slate-300 via-indigo-200 to-slate-400',
        skyColor: '#e2e8f0',
        fogColor: 'rgba(255, 255, 255, 0.5)',
      };
    case 'wind':
      return {
        name: 'Brisk Wind',
        bgGradient: 'from-teal-100 via-sky-100 to-stone-200',
        skyColor: '#7dd3fc',
        fogColor: 'rgba(224, 242, 254, 0.3)',
      };
    case 'clear':
    default:
      return {
        name: 'Serene Clear Sky',
        bgGradient: 'from-sky-100 via-stone-100 to-emerald-50',
        skyColor: '#bae6fd',
        fogColor: 'rgba(255, 255, 255, 0.15)',
      };
  }
}
