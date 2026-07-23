/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementalType } from '@/types';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface SoundscapeState {
  currentElement: ElementalType | 'air' | 'water' | 'fire' | 'earth';
  breathingPhase: BreathingPhase;
  movementIntensity: number; // 0 to 1
  isMuted: boolean;
  isPlaying: boolean;
  weatherAmbience?: string;
}

export class ElementalSoundscapeManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  private currentElement: ElementalType = 'air';
  private breathingPhase: BreathingPhase = 'inhale';
  private movementIntensity: number = 0.5;

  // Synthesis Nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private elementGain: GainNode | null = null;

  private visibilityHandler: (() => void) | null = null;

  constructor() {
    // Visibility listener to auto-suspend audio when tab is hidden
    if (typeof document !== 'undefined') {
      this.visibilityHandler = () => {
        if (this.ctx) {
          if (document.hidden && this.ctx.state === 'running') {
            this.ctx.suspend().catch(() => {});
          } else if (!document.hidden && this.isPlaying && !this.isMuted && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
          }
        }
      };
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  /**
   * Initializes the AudioContext if available.
   */
  public initialize(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;

      if (!this.ctx) {
        this.ctx = new AudioContextClass();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      if (!this.masterGain && this.ctx) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }

      return true;
    } catch (e) {
      console.warn('ElementalSoundscapeManager: Web Audio API initialization failed/blocked', e);
      return false;
    }
  }

  /**
   * Starts playing or transitions to the selected elemental soundscape profile.
   */
  public playElement(element?: ElementalType | string): void {
    const validElement = this.normalizeElement(element);
    this.currentElement = validElement;
    this.isPlaying = true;

    if (!this.initialize()) return;
    if (!this.ctx || !this.masterGain) return;

    // Stop current active nodes before setting up new elemental profile
    this.stopNodesOnly();

    const now = this.ctx.currentTime;
    this.elementGain = this.ctx.createGain();
    this.elementGain.gain.setValueAtTime(0, now);
    this.elementGain.gain.linearRampToValueAtTime(1, now + 0.5);
    this.elementGain.connect(this.masterGain);

    this.filterNode = this.ctx.createBiquadFilter();

    switch (validElement) {
      case 'air':
        this.setupAirProfile(now);
        break;
      case 'water':
        this.setupWaterProfile(now);
        break;
      case 'fire':
        this.setupFireProfile(now);
        break;
      case 'earth':
      default:
        this.setupEarthProfile(now);
        break;
    }

    // Apply current breathing and intensity modulations
    this.updateBreathingPhase(this.breathingPhase);
    this.updateMovementIntensity(this.movementIntensity);
  }

  /**
   * Adjusts frequency and filter characteristics based on breathing phase.
   */
  public updateBreathingPhase(phase: BreathingPhase): void {
    this.breathingPhase = phase;
    if (!this.ctx || !this.isPlaying || !this.filterNode) return;

    const now = this.ctx.currentTime;
    const rampTime = 2.0;

    switch (phase) {
      case 'inhale':
        // Frequency and brightness swell upward
        this.filterNode.frequency.exponentialRampToValueAtTime(
          this.getInhaleCutoff(this.currentElement),
          now + rampTime
        );
        if (this.droneOsc1) {
          this.droneOsc1.frequency.linearRampToValueAtTime(
            this.getBaseFrequency(this.currentElement) * 1.08,
            now + rampTime
          );
        }
        break;

      case 'hold':
        // Steady resonant sustain
        this.filterNode.frequency.setValueAtTime(this.getInhaleCutoff(this.currentElement), now);
        break;

      case 'exhale':
        // Frequency and brightness sink downward for grounding
        this.filterNode.frequency.exponentialRampToValueAtTime(
          this.getBaseCutoff(this.currentElement),
          now + rampTime
        );
        if (this.droneOsc1) {
          this.droneOsc1.frequency.linearRampToValueAtTime(
            this.getBaseFrequency(this.currentElement),
            now + rampTime
          );
        }
        break;

      case 'rest':
      default:
        this.filterNode.frequency.linearRampToValueAtTime(
          this.getBaseCutoff(this.currentElement) * 0.9,
          now + rampTime
        );
        break;
    }
  }

  /**
   * Modulates soundscape intensity dynamically (e.g., from motion tracking or flow state).
   */
  public updateMovementIntensity(value: number): void {
    this.movementIntensity = Math.max(0, Math.min(1, value));
    if (!this.ctx || !this.masterGain || !this.elementGain) return;

    const now = this.ctx.currentTime;
    // Scale volume slightly with movement, capping at safe limits
    const targetGain = 0.12 + this.movementIntensity * 0.08;
    if (!this.isMuted) {
      this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.3);
    }
  }

  /**
   * Adjusts weather ambience for Garden integration.
   */
  public setWeatherAmbience(weather: string): void {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;

    if (weather === 'rain' || weather === 'snow') {
      this.filterNode.frequency.linearRampToValueAtTime(600, now + 1.0);
    } else if (weather === 'wind') {
      this.filterNode.frequency.linearRampToValueAtTime(1200, now + 1.0);
    } else if (weather === 'sunrise' || weather === 'sunset') {
      this.filterNode.frequency.linearRampToValueAtTime(800, now + 1.0);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.15, now + 0.1);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentElement(): ElementalType {
    return this.currentElement;
  }

  /**
   * Stops active oscillators and audio generation.
   */
  public stop(): void {
    this.isPlaying = false;
    this.stopNodesOnly();
  }

  /**
   * Full cleanup of nodes, event listeners, and AudioContext.
   */
  public cleanup(): void {
    this.stop();

    if (typeof document !== 'undefined' && this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }

    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch {}
      this.masterGain = null;
    }

    if (this.ctx) {
      try {
        if (this.ctx.state !== 'closed') {
          this.ctx.close().catch(() => {});
        }
      } catch {}
      this.ctx = null;
    }
  }

  // Private Helper Methods for Profiles

  private normalizeElement(element?: ElementalType | string): ElementalType {
    if (!element) return 'air';
    const lower = element.toLowerCase();
    if (lower === 'water') return 'water';
    if (lower === 'fire') return 'fire';
    if (lower === 'earth') return 'earth';
    return 'air';
  }

  private stopNodesOnly(): void {
    if (this.droneOsc1) {
      try { this.droneOsc1.stop(); this.droneOsc1.disconnect(); } catch {}
      this.droneOsc1 = null;
    }
    if (this.droneOsc2) {
      try { this.droneOsc2.stop(); this.droneOsc2.disconnect(); } catch {}
      this.droneOsc2 = null;
    }
    if (this.lfoNode) {
      try { this.lfoNode.stop(); this.lfoNode.disconnect(); } catch {}
      this.lfoNode = null;
    }
    if (this.lfoGain) {
      try { this.lfoGain.disconnect(); } catch {}
      this.lfoGain = null;
    }
    if (this.filterNode) {
      try { this.filterNode.disconnect(); } catch {}
      this.filterNode = null;
    }
    if (this.elementGain) {
      try { this.elementGain.disconnect(); } catch {}
      this.elementGain = null;
    }
  }

  // Profile 1: AIR - Flute-like tones & breeze filter sweeps
  private setupAirProfile(now: number): void {
    if (!this.ctx || !this.elementGain || !this.filterNode) return;

    this.filterNode.type = 'bandpass';
    this.filterNode.frequency.setValueAtTime(800, now);
    this.filterNode.Q.setValueAtTime(2.0, now);

    // Primary Flute Sine Tone (440Hz - A4)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(440, now);

    // Bamboo breeze Harmonic (660Hz - E5)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(660, now);

    // Gentle LFO for wind vibrato
    this.lfoNode = this.ctx.createOscillator();
    this.lfoNode.type = 'sine';
    this.lfoNode.frequency.setValueAtTime(0.2, now); // 0.2 Hz slow breath swell

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(15, now);

    this.lfoNode.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);

    this.droneOsc1.connect(this.filterNode);
    this.droneOsc2.connect(this.filterNode);
    this.filterNode.connect(this.elementGain);

    this.lfoNode.start(now);
    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  // Profile 2: WATER - Flowing frequency sweeps & wave textures
  private setupWaterProfile(now: number): void {
    if (!this.ctx || !this.elementGain || !this.filterNode) return;

    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(400, now);

    // Deep water wave drone (220Hz - A3)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(220, now);

    // Flowing ripple sweep (330Hz)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(330, now);

    // Slow wave swell LFO
    this.lfoNode = this.ctx.createOscillator();
    this.lfoNode.type = 'sine';
    this.lfoNode.frequency.setValueAtTime(0.12, now);

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(120, now);

    this.lfoNode.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);

    this.droneOsc1.connect(this.filterNode);
    this.droneOsc2.connect(this.filterNode);
    this.filterNode.connect(this.elementGain);

    this.lfoNode.start(now);
    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  // Profile 3: FIRE - Warm ember pulse & rhythmic energy
  private setupFireProfile(now: number): void {
    if (!this.ctx || !this.elementGain || !this.filterNode) return;

    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(350, now);

    // Fire fundamental (110Hz - A2)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(110, now);

    // Ember warmth harmonic (165Hz - E3)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(165, now);

    // Faster crackle/pulse LFO
    this.lfoNode = this.ctx.createOscillator();
    this.lfoNode.type = 'square';
    this.lfoNode.frequency.setValueAtTime(3.5, now);

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(40, now);

    this.lfoNode.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);

    this.droneOsc1.connect(this.filterNode);
    this.droneOsc2.connect(this.filterNode);
    this.filterNode.connect(this.elementGain);

    this.lfoNode.start(now);
    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  // Profile 4: EARTH - Singing bowl resonance & deep grounding drone
  private setupEarthProfile(now: number): void {
    if (!this.ctx || !this.elementGain || !this.filterNode) return;

    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(300, now);

    // Earth Singing Bowl fundamental (136.1 Hz - Ohm frequency)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(136.1, now);

    // Grounding sub harmonic (68.05 Hz)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(68.05, now);

    // Deep singing bowl vibration LFO
    this.lfoNode = this.ctx.createOscillator();
    this.lfoNode.type = 'sine';
    this.lfoNode.frequency.setValueAtTime(0.08, now);

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(30, now);

    this.lfoNode.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);

    this.droneOsc1.connect(this.filterNode);
    this.droneOsc2.connect(this.filterNode);
    this.filterNode.connect(this.elementGain);

    this.lfoNode.start(now);
    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  private getBaseFrequency(element: ElementalType): number {
    switch (element) {
      case 'air': return 440;
      case 'water': return 220;
      case 'fire': return 110;
      case 'earth': default: return 136.1;
    }
  }

  private getBaseCutoff(element: ElementalType): number {
    switch (element) {
      case 'air': return 800;
      case 'water': return 400;
      case 'fire': return 350;
      case 'earth': default: return 300;
    }
  }

  private getInhaleCutoff(element: ElementalType): number {
    switch (element) {
      case 'air': return 1400;
      case 'water': return 800;
      case 'fire': return 750;
      case 'earth': default: return 600;
    }
  }
}

// Global Singleton Instance
export const elementalSoundscape = new ElementalSoundscapeManager();
