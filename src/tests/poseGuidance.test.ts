/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  PoseFrame,
  PosePoint,
  calculateJointDifference,
  calculateBalanceScore,
  calculateAlignmentScore,
  compareUserPoseToTarget,
} from '@/utils/poseGuidance';
import { getMovementCoachingFeedback } from '@/utils/movementFeedback';

describe('AI Somatic Pose Guidance & Movement Feedback Engine', () => {
  const createMockPose = (offset = 0): PoseFrame => {
    const joints: Record<string, PosePoint> = {
      head: { x: 50 + offset, y: 15, confidence: 0.95, jointName: 'head' },
      neck: { x: 50 + offset, y: 22, confidence: 0.95, jointName: 'neck' },
      leftShoulder: { x: 42 + offset, y: 28, confidence: 0.9, jointName: 'leftShoulder' },
      rightShoulder: { x: 58 + offset, y: 28, confidence: 0.9, jointName: 'rightShoulder' },
      leftElbow: { x: 35 + offset, y: 40, confidence: 0.85, jointName: 'leftElbow' },
      rightElbow: { x: 65 + offset, y: 40, confidence: 0.85, jointName: 'rightElbow' },
      leftWrist: { x: 30 + offset, y: 50, confidence: 0.8, jointName: 'leftWrist' },
      rightWrist: { x: 70 + offset, y: 50, confidence: 0.8, jointName: 'rightWrist' },
      leftHip: { x: 44 + offset, y: 55, confidence: 0.9, jointName: 'leftHip' },
      rightHip: { x: 56 + offset, y: 55, confidence: 0.9, jointName: 'rightHip' },
      leftKnee: { x: 42 + offset, y: 72, confidence: 0.85, jointName: 'leftKnee' },
      rightKnee: { x: 58 + offset, y: 72, confidence: 0.85, jointName: 'rightKnee' },
      leftAnkle: { x: 40 + offset, y: 90, confidence: 0.8, jointName: 'leftAnkle' },
      rightAnkle: { x: 60 + offset, y: 90, confidence: 0.8, jointName: 'rightAnkle' },
    };
    return { timestamp: Date.now(), joints };
  };

  it('calculates joint distance accurately', () => {
    const p1: PosePoint = { x: 0, y: 0, confidence: 1, jointName: 'p1' };
    const p2: PosePoint = { x: 3, y: 4, confidence: 1, jointName: 'p2' };
    expect(calculateJointDifference(p1, p2)).toBe(5);
  });

  it('returns high alignment and balance scores when user matches target pose', () => {
    const targetPose = createMockPose(0);
    const userPose = createMockPose(0);

    const alignScore = calculateAlignmentScore(userPose, targetPose);
    const balScore = calculateBalanceScore(userPose, targetPose);

    expect(alignScore).toBe(100);
    expect(balScore).toBe(100);

    const comparison = compareUserPoseToTarget(userPose, targetPose);
    expect(comparison.alignmentScore).toBe(100);
    expect(comparison.balanceScore).toBe(100);
    expect(comparison.corrections.length).toBeGreaterThan(0);
  });

  it('detects offset pose misalignment and provides constructive corrections', () => {
    const targetPose = createMockPose(0);
    const userPose = createMockPose(15); // Shifted by 15 units

    const alignScore = calculateAlignmentScore(userPose, targetPose);
    const balScore = calculateBalanceScore(userPose, targetPose);

    expect(alignScore).toBeLessThan(80);
    expect(balScore).toBeLessThan(80);

    const comparison = compareUserPoseToTarget(userPose, targetPose);
    expect(comparison.alignmentScore).toBeLessThan(80);
    expect(comparison.corrections.some((c) => c.length > 0)).toBe(true);
  });

  it('generates elemental coaching feedback tailored to Air, Fire, Water, Earth themes', () => {
    const targetPose = createMockPose(0);
    const userPose = createMockPose(5);
    const comparison = compareUserPoseToTarget(userPose, targetPose);

    const airCoaching = getMovementCoachingFeedback(comparison, 'air');
    expect(airCoaching.headline).toBeDefined();
    expect(airCoaching.elementalPrompt).toContain('Air');

    const fireCoaching = getMovementCoachingFeedback(comparison, 'fire');
    expect(fireCoaching.elementalPrompt).toContain('Fire');

    const waterCoaching = getMovementCoachingFeedback(comparison, 'water');
    expect(waterCoaching.elementalPrompt).toContain('Water');

    const earthCoaching = getMovementCoachingFeedback(comparison, 'earth');
    expect(earthCoaching.elementalPrompt).toContain('Earth');
  });
});
