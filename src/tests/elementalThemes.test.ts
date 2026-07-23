/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { ELEMENTAL_THEMES, getElementalTheme } from '@/data/elementalThemes';
import { ElementalType } from '@/types';

describe('Elemental Themes Architecture Foundation', () => {
  it('defines four core elemental themes', () => {
    const elements: ElementalType[] = ['air', 'fire', 'water', 'earth'];
    
    elements.forEach(element => {
      const theme = ELEMENTAL_THEMES[element];
      expect(theme).toBeDefined();
      expect(theme.id).toBe(element);
      expect(theme.name).toBeDefined();
      expect(theme.visuals.particleConfig).toBeDefined();
      expect(theme.soundscape).toBeDefined();
      expect(theme.environmentMood).toBeDefined();
      expect(theme.avatarGuidanceStyle).toBeDefined();
    });
  });

  it('getElementalTheme fallback returns air flow by default', () => {
    const fallbackTheme = getElementalTheme(undefined);
    expect(fallbackTheme.id).toBe('air');

    const waterTheme = getElementalTheme('water');
    expect(waterTheme.id).toBe('water');
    expect(waterTheme.name).toBe('Water Flow');
  });
});
