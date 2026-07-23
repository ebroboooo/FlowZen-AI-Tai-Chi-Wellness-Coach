/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface GardenStage {
  id: string;
  level: number;
  name: string;
  description: string;
  meaning: string;
  unlockCondition: string;
  position: { x: number; y: number };
  xpThreshold: number;
}

export const GARDEN_STAGES: GardenStage[] = [
  {
    id: 'bonsai_pine',
    level: 1,
    name: 'Ancient Bonsai Pine',
    description: 'A weathered pine rooted deep in mountain soil, symbolizing endurance.',
    meaning: 'Patience and steady rooting in physical practice.',
    unlockCondition: 'Unlocked at start of practice.',
    position: { x: 200, y: 150 },
    xpThreshold: 0
  },
  {
    id: 'bamboo_grove',
    level: 1,
    name: 'Bamboo Grove',
    description: 'Tall bamboo stalks bending with gentle mountain winds.',
    meaning: 'Yielding strength and resilience.',
    unlockCondition: 'Unlocked at Level 1.',
    position: { x: 350, y: 120 },
    xpThreshold: 50
  },
  {
    id: 'lotus_pond',
    level: 2,
    name: 'Serene Lotus Pond',
    description: 'Still water reflecting the sky, nurturing vibrant pink lotus blossoms.',
    meaning: 'Clarity of mind amidst movement.',
    unlockCondition: 'Complete 3 practice sessions.',
    position: { x: 500, y: 220 },
    xpThreshold: 150
  },
  {
    id: 'zen_lantern',
    level: 3,
    name: 'Stone Zen Lantern',
    description: 'A hand-carved granite lantern casting warm light across smooth river stones.',
    meaning: 'Illumination and inner warmth.',
    unlockCondition: 'Accumulate 60 minutes of total practice.',
    position: { x: 150, y: 280 },
    xpThreshold: 300
  },
  {
    id: 'raked_gravel',
    level: 4,
    name: 'Concentric Raked Gravel',
    description: 'Harmonious gravel ripples forming unbroken circular waves around mossy boulders.',
    meaning: 'Quiet focus and rhythmic flow.',
    unlockCondition: 'Maintain a 3-day practice streak.',
    position: { x: 380, y: 300 },
    xpThreshold: 500
  }
];

const GARDEN_STORAGE_KEY = 'fz_garden_v1';

interface GardenState {
  level: number;
  xp: number;
  unlockedItems: string[];
  unlockedAtMap: Record<string, string>;
  activeItem: string | null;
  weather: string;

  setWeather: (weather: string) => void;
  loadGarden: () => void;
  setActiveItem: (item: string | null) => void;
  addXp: (amount: number) => { newLevel: number; newlyUnlocked: string[]; totalXp: number };
}

function loadStoredGarden() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(GARDEN_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return null;
}

function saveGardenState(data: { xp: number; level: number; unlockedItems: string[]; unlockedAtMap: Record<string, string> }) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(GARDEN_STORAGE_KEY, JSON.stringify(data));
    }
  } catch {}
}

const defaultStored = loadStoredGarden();

export const useGardenStore = create<GardenState>((set, get) => ({
  level: defaultStored?.level || 1,
  xp: defaultStored?.xp !== undefined ? defaultStored.xp : 150,
  unlockedItems: defaultStored?.unlockedItems || ['bonsai_pine', 'bamboo_grove', 'lotus_pond'],
  unlockedAtMap: defaultStored?.unlockedAtMap || { bonsai_pine: 'Unlocked', bamboo_grove: 'Level 1', lotus_pond: 'Level 2' },
  activeItem: null,
  weather: 'sunny',

  setWeather: (weather) => set({ weather }),

  loadGarden: () => {
    const stored = loadStoredGarden();
    if (stored) {
      set({
        level: stored.level || 1,
        xp: stored.xp !== undefined ? stored.xp : 150,
        unlockedItems: stored.unlockedItems || ['bonsai_pine', 'bamboo_grove', 'lotus_pond'],
        unlockedAtMap: stored.unlockedAtMap || { bonsai_pine: 'Unlocked', bamboo_grove: 'Level 1', lotus_pond: 'Level 2' }
      });
    }
  },

  setActiveItem: (activeItem) => set({ activeItem }),

  addXp: (amount) => {
    const current = get();
    const newXp = current.xp + amount;
    let newLevel = 1;
    const currentUnlocked = [...current.unlockedItems];
    const newlyUnlocked: string[] = [];

    GARDEN_STAGES.forEach(stage => {
      if (newXp >= stage.xpThreshold) {
        if (stage.level > newLevel) {
          newLevel = stage.level;
        }
        if (!currentUnlocked.includes(stage.id)) {
          currentUnlocked.push(stage.id);
          newlyUnlocked.push(stage.name);
        }
      }
    });

    const updatedAtMap = { ...current.unlockedAtMap };
    newlyUnlocked.forEach(name => {
      updatedAtMap[name] = `Unlocked at ${newXp} Qi XP`;
    });

    set({
      xp: newXp,
      level: newLevel,
      unlockedItems: currentUnlocked,
      unlockedAtMap: updatedAtMap
    });

    saveGardenState({
      xp: newXp,
      level: newLevel,
      unlockedItems: currentUnlocked,
      unlockedAtMap: updatedAtMap
    });

    return { newLevel, newlyUnlocked, totalXp: newXp };
  }
}));

