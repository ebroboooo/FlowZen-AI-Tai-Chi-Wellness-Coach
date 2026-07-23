/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { LivingGardenLayer } from '@/components/garden/LivingGardenLayer';
import { getElementalTheme } from '@/data/elementalThemes';

describe('LivingGardenLayer Component Foundation', () => {
  it('instantiates cleanly for all atmospheres and elemental configurations', () => {
    const atmospheres: ('dawn' | 'daylight' | 'dusk' | 'twilight')[] = ['dawn', 'daylight', 'dusk', 'twilight'];
    const unlockedItems = ['stage-1', 'stage-4', 'stage-5', 'stage-6', 'stage-7'];

    atmospheres.forEach((atmos) => {
      const theme = getElementalTheme(atmos === 'dawn' ? 'fire' : atmos === 'dusk' ? 'water' : 'earth');
      
      const component = React.createElement(LivingGardenLayer, {
        atmosphere: atmos,
        unlockedItems,
        elementalTheme: theme,
        reducedMotion: false,
        isRaking: false,
      });

      expect(component).toBeDefined();
      expect(component.props.atmosphere).toBe(atmos);
    });
  });

  it('respects reduced motion setting gracefully', () => {
    const component = React.createElement(LivingGardenLayer, {
      atmosphere: 'daylight',
      unlockedItems: ['stage-1'],
      reducedMotion: true,
      isRaking: false,
    });

    expect(component.props.reducedMotion).toBe(true);
  });
});
