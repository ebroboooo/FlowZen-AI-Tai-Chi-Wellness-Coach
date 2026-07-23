/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { MASTER_CURRICULUM, getMasterProgram } from '@/data/masterCurriculum';
import { ElementalType } from '@/types';

describe('Master Curriculum Engine', () => {
  it('contains programs for all 4 elemental paths (Air, Water, Fire, Earth)', () => {
    const elements: ElementalType[] = ['air', 'water', 'fire', 'earth'];
    elements.forEach((elem) => {
      expect(MASTER_CURRICULUM[elem]).toBeDefined();
      expect(MASTER_CURRICULUM[elem].element).toBe(elem);
      expect(MASTER_CURRICULUM[elem].movements.length).toBeGreaterThan(0);
    });
  });

  it('loads movements correctly for each elemental program', () => {
    const airProgram = getMasterProgram('air');
    expect(airProgram.name).toContain('Air');
    expect(airProgram.movements.some((m) => m.name === 'Breath Flow')).toBe(true);
    expect(airProgram.movements.some((m) => m.name === 'Cloud Hands')).toBe(true);
    expect(airProgram.movements.some((m) => m.name === 'Light Movement')).toBe(true);

    const waterProgram = getMasterProgram('water');
    expect(waterProgram.movements.some((m) => m.name === 'Flow Movement')).toBe(true);

    const fireProgram = getMasterProgram('fire');
    expect(fireProgram.movements.some((m) => m.name === 'Rooted Power')).toBe(true);

    const earthProgram = getMasterProgram('earth');
    expect(earthProgram.movements.some((m) => m.name === 'Stability')).toBe(true);
  });

  it('falls back gracefully to Air program if invalid or missing element provided', () => {
    const fallbackProgram = getMasterProgram('unknown_element' as any);
    expect(fallbackProgram).toBeDefined();
    expect(fallbackProgram.element).toBe('air');
  });
});
