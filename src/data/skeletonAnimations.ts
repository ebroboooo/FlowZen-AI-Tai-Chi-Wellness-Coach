/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkeletonPose } from '@/types';

export function generateAnimation(_movementId?: string): SkeletonPose[] {
  return [
    {
      head: { x: 0, y: -0.8 },
      neck: { x: 0, y: -0.6 },
      leftShoulder: { x: -0.3, y: -0.5 },
      rightShoulder: { x: 0.3, y: -0.5 },
      leftElbow: { x: -0.4, y: -0.2 },
      rightElbow: { x: 0.4, y: -0.2 },
      leftWrist: { x: -0.3, y: 0.1 },
      rightWrist: { x: 0.3, y: 0.1 },
      leftHip: { x: -0.2, y: 0.2 },
      rightHip: { x: 0.2, y: 0.2 },
      leftKnee: { x: -0.2, y: 0.6 },
      rightKnee: { x: 0.2, y: 0.6 },
      leftAnkle: { x: -0.2, y: 0.9 },
      rightAnkle: { x: 0.2, y: 0.9 }
    }
  ];
}

export function interpolatePose(pose1: SkeletonPose, pose2: SkeletonPose, _factor: number): SkeletonPose {
  return pose1 || pose2;
}
