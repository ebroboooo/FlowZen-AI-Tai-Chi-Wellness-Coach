/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { TaiChiMotionEngine } from '@/utils/motionEngine';

describe('TaiChiMotionEngine Physics & Biomechanics', () => {
  it('initializes default motion state correctly', () => {
    const engine = new TaiChiMotionEngine();
    const state = engine.getCurrentState();

    expect(state.position).toEqual({ x: 50, y: 50, z: 0 });
    expect(state.weightShift).toBe(0);
    expect(state.movementPhase).toBe('preparation');
  });

  it('steps motion physics smoothly over time dt towards target', () => {
    const engine = new TaiChiMotionEngine({ weightShift: 0 });
    engine.setTargetState({ weightShift: 0.8, movementPhase: 'extension' });

    const updatedState = engine.step(0.05, 'water');

    expect(updatedState.weightShift).toBeGreaterThan(0);
    expect(updatedState.weightShift).toBeLessThanOrEqual(0.8);
    expect(updatedState.movementPhase).toBe('extension');
  });

  it('calculates rooting stability score based on center of gravity', () => {
    const engine = new TaiChiMotionEngine({ weightShift: 0 });
    const stabilityCentral = engine.calculateRootingStability();

    expect(stabilityCentral).toBeGreaterThan(80);

    engine.setTargetState({ weightShift: 0.9 });
    engine.step(0.1, 'earth');
    const stabilityRooted = engine.calculateRootingStability();

    expect(stabilityRooted).toBeGreaterThan(50);
  });
});
