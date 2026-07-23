/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementalType } from '@/types';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface MotionState {
  position: Vector3D;
  rotation: Vector3D; // pitch, yaw, roll in degrees
  velocity: Vector3D;
  acceleration: Vector3D;
  weightShift: number; // -1.0 (100% left foot) to +1.0 (100% right foot)
  breathingPhase: 'inhale' | 'exhale' | 'hold';
  muscleRelaxation: number; // 0.0 (tense) to 1.0 (completely relaxed/sung)
  movementPhase: 'preparation' | 'gathering' | 'extension' | 'recovery';
}

export interface JointPhysics {
  angle: number;
  angularVelocity: number;
  damping: number;
}

export class TaiChiMotionEngine {
  private currentState: MotionState;
  private targetState: MotionState;

  constructor(initialState?: Partial<MotionState>) {
    this.currentState = {
      position: { x: 50, y: 50, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      weightShift: 0,
      breathingPhase: 'inhale',
      muscleRelaxation: 0.85,
      movementPhase: 'preparation',
      ...initialState,
    };
    this.targetState = { ...this.currentState };
  }

  public getCurrentState(): MotionState {
    return { ...this.currentState };
  }

  public setTargetState(target: Partial<MotionState>): void {
    this.targetState = { ...this.targetState, ...target };
  }

  /**
   * Updates state with Tai Chi physics principles:
   * Smooth momentum, weight transfer curve, and natural deceleration
   */
  public step(dtSeconds: number, element: ElementalType = 'air'): MotionState {
    const dt = Math.min(dtSeconds, 0.1);
    const smoothness = element === 'water' ? 3.0 : element === 'earth' ? 5.0 : 4.0;

    // Weight shift interpolation with Tai Chi sine curve
    const weightDiff = this.targetState.weightShift - this.currentState.weightShift;
    this.currentState.weightShift += weightDiff * dt * smoothness;

    // Position spring physics
    const dx = this.targetState.position.x - this.currentState.position.x;
    const dy = this.targetState.position.y - this.currentState.position.y;
    const dz = this.targetState.position.z - this.currentState.position.z;

    this.currentState.velocity.x = dx * smoothness;
    this.currentState.velocity.y = dy * smoothness;
    this.currentState.velocity.z = dz * smoothness;

    this.currentState.position.x += this.currentState.velocity.x * dt;
    this.currentState.position.y += this.currentState.velocity.y * dt;
    this.currentState.position.z += this.currentState.velocity.z * dt;

    // Rotation interpolation
    const rx = this.targetState.rotation.x - this.currentState.rotation.x;
    const ry = this.targetState.rotation.y - this.currentState.rotation.y;
    const rz = this.targetState.rotation.z - this.currentState.rotation.z;

    this.currentState.rotation.x += rx * dt * smoothness;
    this.currentState.rotation.y += ry * dt * smoothness;
    this.currentState.rotation.z += rz * dt * smoothness;

    this.currentState.movementPhase = this.targetState.movementPhase;
    this.currentState.breathingPhase = this.targetState.breathingPhase;

    return this.getCurrentState();
  }

  /**
   * Calculates Tai Chi Rooting & Grounding stability score based on weight shift & center of gravity
   */
  public calculateRootingStability(): number {
    const weightFactor = 1 - Math.abs(this.currentState.weightShift) * 0.3; // Stable in both central or rooted single-leg stances
    const velocityFactor = Math.max(0, 1 - (Math.abs(this.currentState.velocity.x) + Math.abs(this.currentState.velocity.y)) * 0.05);
    return Math.round((weightFactor * 0.6 + velocityFactor * 0.4) * 100);
  }
}
