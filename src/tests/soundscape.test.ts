/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ElementalSoundscapeManager, elementalSoundscape } from '../utils/elementalSoundscape';
import { ElementalType } from '../types';

// Web Audio API Mock for Vitest / Node environment
class MockAudioNode {
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockParam {
  value = 0;
  setValueAtTime = vi.fn();
  linearRampToValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class MockGainNode extends MockAudioNode {
  gain = new MockParam();
}

class MockBiquadFilterNode extends MockAudioNode {
  type = 'lowpass';
  frequency = new MockParam();
  Q = new MockParam();
}

class MockOscillatorNode extends MockAudioNode {
  type = 'sine';
  frequency = new MockParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'suspended';
  currentTime = 0;
  destination = new MockAudioNode();

  createGain = vi.fn(() => new MockGainNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  createOscillator = vi.fn(() => new MockOscillatorNode());

  resume = vi.fn(async () => {
    this.state = 'running';
  });
  suspend = vi.fn(async () => {
    this.state = 'suspended';
  });
  close = vi.fn(async () => {
    this.state = 'closed';
  });
}

describe('Elemental Soundscape Immersion Engine', () => {
  let originalAudioContext: any;

  beforeEach(() => {
    originalAudioContext = (window as any).AudioContext;
    (window as any).AudioContext = MockAudioContext;
  });

  afterEach(() => {
    (window as any).AudioContext = originalAudioContext;
    vi.restoreAllMocks();
  });

  describe('Initialization and Audio Lifecycle', () => {
    it('should initialize AudioContext successfully when available', () => {
      const manager = new ElementalSoundscapeManager();
      const success = manager.initialize();
      expect(success).toBe(true);
    });

    it('should handle playElement for all 4 primary elemental profiles', () => {
      const manager = new ElementalSoundscapeManager();
      const elements: ElementalType[] = ['air', 'water', 'fire', 'earth'];

      elements.forEach((elem) => {
        manager.playElement(elem);
        expect(manager.getIsPlaying()).toBe(true);
        expect(manager.getCurrentElement()).toBe(elem);
      });
    });

    it('should fallback to default "air" profile when unknown or missing element is provided', () => {
      const manager = new ElementalSoundscapeManager();
      manager.playElement(undefined as any);
      expect(manager.getCurrentElement()).toBe('air');

      manager.playElement('unknown_element' as any);
      expect(manager.getCurrentElement()).toBe('air');
    });
  });

  describe('Dynamic Respiration & Movement Updates', () => {
    it('should update breathing phases without throwing', () => {
      const manager = new ElementalSoundscapeManager();
      manager.playElement('water');

      expect(() => manager.updateBreathingPhase('inhale')).not.toThrow();
      expect(() => manager.updateBreathingPhase('hold')).not.toThrow();
      expect(() => manager.updateBreathingPhase('exhale')).not.toThrow();
      expect(() => manager.updateBreathingPhase('rest')).not.toThrow();
    });

    it('should update movement intensity bounded between 0 and 1', () => {
      const manager = new ElementalSoundscapeManager();
      manager.playElement('fire');

      manager.updateMovementIntensity(0.8);
      manager.updateMovementIntensity(1.5); // Should cap at 1
      manager.updateMovementIntensity(-0.5); // Should floor at 0
    });

    it('should toggle mute state and update master volume', () => {
      const manager = new ElementalSoundscapeManager();
      manager.initialize();

      manager.setMuted(true);
      expect(manager.getIsMuted()).toBe(true);

      manager.setMuted(false);
      expect(manager.getIsMuted()).toBe(false);
    });
  });

  describe('Garden Weather Integration', () => {
    it('should adjust weather ambience filter sweeps', () => {
      const manager = new ElementalSoundscapeManager();
      manager.playElement('earth');

      expect(() => manager.setWeatherAmbience('rain')).not.toThrow();
      expect(() => manager.setWeatherAmbience('wind')).not.toThrow();
      expect(() => manager.setWeatherAmbience('sunrise')).not.toThrow();
    });
  });

  describe('Cleanup & Singleton Export', () => {
    it('should properly stop and cleanup active nodes', () => {
      const manager = new ElementalSoundscapeManager();
      manager.playElement('air');
      expect(manager.getIsPlaying()).toBe(true);

      manager.stop();
      expect(manager.getIsPlaying()).toBe(false);

      expect(() => manager.cleanup()).not.toThrow();
    });

    it('should export global singleton instance elementalSoundscape', () => {
      expect(elementalSoundscape).toBeDefined();
      expect(elementalSoundscape instanceof ElementalSoundscapeManager).toBe(true);
    });
  });
});
