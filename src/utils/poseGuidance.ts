/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PosePoint {
  x: number; // 0-100 coordinate
  y: number; // 0-100 coordinate
  confidence: number; // 0.0 to 1.0
  jointName: string;
}

export interface PoseFrame {
  timestamp: number;
  joints: Record<string, PosePoint>;
}

export interface PoseComparisonResult {
  alignmentScore: number; // 0 to 100
  balanceScore: number;   // 0 to 100
  corrections: string[];
  confidence: number;     // Average confidence 0 to 1
}

/**
 * Calculates Euclidean distance difference between two joint points
 */
export function calculateJointDifference(p1?: PosePoint, p2?: PosePoint): number {
  if (!p1 || !p2) return 100; // max penalty if joint missing
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates vertical spine / hips center balance comparison
 */
export function calculateBalanceScore(userPose: PoseFrame, targetPose: PoseFrame): number {
  const userLeftHip = userPose.joints.leftHip;
  const userRightHip = userPose.joints.rightHip;
  const targetLeftHip = targetPose.joints.leftHip;
  const targetRightHip = targetPose.joints.rightHip;

  if (!userLeftHip || !userRightHip || !targetLeftHip || !targetRightHip) {
    return 75; // Baseline estimation if hips low confidence
  }

  const userCenterX = (userLeftHip.x + userRightHip.x) / 2;
  const targetCenterX = (targetLeftHip.x + targetRightHip.x) / 2;

  const diffX = Math.abs(userCenterX - targetCenterX);
  // Convert offset to 0-100 score scale (diff of 0 -> 100%, diff of 20 -> 0%)
  const score = Math.max(0, Math.min(100, Math.round(100 - diffX * 5)));
  return score;
}

/**
 * Calculates overall joint alignment score across key limbs
 */
export function calculateAlignmentScore(userPose: PoseFrame, targetPose: PoseFrame): number {
  const keyJoints = [
    'head', 'neck',
    'leftShoulder', 'rightShoulder',
    'leftElbow', 'rightElbow',
    'leftWrist', 'rightWrist',
    'leftHip', 'rightHip',
    'leftKnee', 'rightKnee',
    'leftAnkle', 'rightAnkle'
  ];

  let totalDiff = 0;
  let evaluatedCount = 0;

  for (const jName of keyJoints) {
    const userPt = userPose.joints[jName];
    const targetPt = targetPose.joints[jName];

    if (userPt && targetPt) {
      const diff = calculateJointDifference(userPt, targetPt);
      totalDiff += diff;
      evaluatedCount++;
    }
  }

  if (evaluatedCount === 0) return 50;

  const avgDiff = totalDiff / evaluatedCount;
  // Diff of 0 => 100%, Diff of 25 => 0%
  const score = Math.max(0, Math.min(100, Math.round(100 - avgDiff * 4)));
  return score;
}

/**
 * Main pose comparison utility between user camera pose and target avatar pose
 */
export function compareUserPoseToTarget(
  userPose: PoseFrame,
  targetPose: PoseFrame
): PoseComparisonResult {
  const alignmentScore = calculateAlignmentScore(userPose, targetPose);
  const balanceScore = calculateBalanceScore(userPose, targetPose);

  // Calculate average confidence
  const userJointKeys = Object.keys(userPose.joints);
  let confSum = 0;
  userJointKeys.forEach(k => {
    confSum += userPose.joints[k]?.confidence ?? 0;
  });
  const confidence = userJointKeys.length > 0 ? confSum / userJointKeys.length : 0.8;

  const corrections: string[] = [];

  // Check specific limb alignment issues
  const userLS = userPose.joints.leftShoulder;
  const userRS = userPose.joints.rightShoulder;
  const targetLS = targetPose.joints.leftShoulder;
  const targetRS = targetPose.joints.rightShoulder;

  if (userLS && targetLS && calculateJointDifference(userLS, targetLS) > 12) {
    corrections.push("Softening left shoulder — drop elbows toward your ribs.");
  }

  if (userRS && targetRS && calculateJointDifference(userRS, targetRS) > 12) {
    corrections.push("Relax right shoulder and allow your upper back to open.");
  }

  const userLW = userPose.joints.leftWrist;
  const userRW = userPose.joints.rightWrist;
  const targetLW = targetPose.joints.leftWrist;
  const targetRW = targetPose.joints.rightWrist;

  if ((userLW && targetLW && calculateJointDifference(userLW, targetLW) > 15) ||
      (userRW && targetRW && calculateJointDifference(userRW, targetRW) > 15)) {
    corrections.push("Extend your hands gently in a soft arc without locking wrists.");
  }

  if (balanceScore < 70) {
    corrections.push("Center your weight over your Dantian and root through both heels.");
  }

  if (corrections.length === 0) {
    corrections.push("Excellent somatic posture! Seamless flow with the instructor avatar.");
  }

  return {
    alignmentScore,
    balanceScore,
    corrections,
    confidence
  };
}
