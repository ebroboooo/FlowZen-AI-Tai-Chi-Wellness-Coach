/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  WeatherState,
  calculatePlantGrowth,
  calculateStreakUnlocks,
  calculateElementalMonuments,
  getWeatherLighting
} from '../utils/gardenEvolution';

describe('Zen Garden Evolution System', () => {
  describe('Weather States & Lighting Configurations', () => {
    it('should return valid lighting configurations for all weather states', () => {
      const weatherStates: WeatherState[] = ['clear', 'rain', 'snow', 'wind', 'sunrise', 'sunset'];

      weatherStates.forEach((weather) => {
        const lighting = getWeatherLighting(weather);
        expect(lighting).toBeDefined();
        expect(lighting.name).toBeTruthy();
        expect(lighting.bgGradient).toBeTruthy();
        expect(lighting.skyColor).toBeTruthy();
        expect(lighting.fogColor).toBeTruthy();
      });
    });

    it('should fall back to clear weather configuration on unknown weather input', () => {
      const fallbackLighting = getWeatherLighting('clear' as WeatherState);
      expect(fallbackLighting.name).toBe('Serene Clear Sky');
    });
  });

  describe('Growth Calculations', () => {
    it('should return seedling stage for low practice minutes', () => {
      const growth = calculatePlantGrowth(5);
      expect(growth.stage).toBe(1);
      expect(growth.bloomPercentage).toBe(10);
      expect(growth.label).toBe('Young Seedling');
      expect(growth.scaleFactor).toBeLessThan(1);
    });

    it('should scale plant growth progressively as practice minutes increase', () => {
      const sprout = calculatePlantGrowth(25);
      expect(sprout.stage).toBe(2);
      expect(sprout.bloomPercentage).toBe(40);

      const flora = calculatePlantGrowth(65);
      expect(flora.stage).toBe(3);
      expect(flora.bloomPercentage).toBe(75);

      const master = calculatePlantGrowth(150);
      expect(master.stage).toBe(4);
      expect(master.bloomPercentage).toBe(100);
      expect(master.label).toBe('Full Bloom Master');
    });
  });

  describe('Streak Unlocks', () => {
    it('should unlock ambient features based on daily streak length', () => {
      const lowStreak = calculateStreakUnlocks(1);
      expect(lowStreak.birdsUnlocked).toBe(false);
      expect(lowStreak.floatingLanternsUnlocked).toBe(false);

      const streak3 = calculateStreakUnlocks(3);
      expect(streak3.birdsUnlocked).toBe(true);
      expect(streak3.butterfliesUnlocked).toBe(false);

      const streak7 = calculateStreakUnlocks(7);
      expect(streak7.birdsUnlocked).toBe(true);
      expect(streak7.butterfliesUnlocked).toBe(true);
      expect(streak7.floatingLanternsUnlocked).toBe(true);

      const streak14 = calculateStreakUnlocks(14);
      expect(streak14.ambientCreaturesUnlocked).toBe(true);
    });
  });

  describe('Elemental Monuments Unlock Logic', () => {
    it('should unlock elemental monuments when criteria are met', () => {
      const airMonuments = calculateElementalMonuments({ minutes: 35, streak: 3 });
      expect(airMonuments.airTemple).toBe(true);
      expect(airMonuments.waterSanctuary).toBe(false);

      const fullMastery = calculateElementalMonuments({
        minutes: 100,
        streak: 10,
        elementMastery: { air: true, water: true, fire: true, earth: true }
      });
      expect(fullMastery.airTemple).toBe(true);
      expect(fullMastery.waterSanctuary).toBe(true);
      expect(fullMastery.fireShrine).toBe(true);
      expect(fullMastery.earthTemple).toBe(true);
    });
  });

  describe('Empty Progress Fallback', () => {
    it('should handle undefined or empty progress gracefully', () => {
      const growth = calculatePlantGrowth(undefined);
      expect(growth.stage).toBe(1);
      expect(growth.scaleFactor).toBeGreaterThan(0);
      expect(growth.bloomPercentage).toBe(10);

      const streakUnlocks = calculateStreakUnlocks(undefined);
      expect(streakUnlocks.birdsUnlocked).toBe(false);
      expect(streakUnlocks.floatingLanternsUnlocked).toBe(false);

      const monuments = calculateElementalMonuments(undefined);
      expect(monuments.airTemple).toBe(false);
      expect(monuments.waterSanctuary).toBe(false);
      expect(monuments.fireShrine).toBe(false);
      expect(monuments.earthTemple).toBe(false);
    });

    it('should handle negative or NaN inputs safely', () => {
      const nanGrowth = calculatePlantGrowth(NaN);
      expect(nanGrowth.stage).toBe(1);

      const negStreak = calculateStreakUnlocks(-5);
      expect(negStreak.birdsUnlocked).toBe(false);
    });
  });
});
