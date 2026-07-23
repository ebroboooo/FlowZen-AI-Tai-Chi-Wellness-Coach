/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PoseComparisonResult } from '@/utils/poseGuidance';
import { ElementalType } from '@/types';

export interface CoachingFeedback {
  headline: string;
  coachingText: string;
  pacingAdvice: string;
  elementalPrompt: string;
}

/**
 * Converts live biomechanical alignment scores into elemental Tai Chi coaching instructions
 */
export function getMovementCoachingFeedback(
  result: PoseComparisonResult,
  element: ElementalType = 'air'
): CoachingFeedback {
  const { alignmentScore, balanceScore, corrections } = result;
  const overallScore = Math.round((alignmentScore + balanceScore) / 2);

  let headline = "Mindful Alignment";
  let coachingText = corrections[0] || "Maintain soft breath and vertical posture.";
  let pacingAdvice = "Breathe in deeply through the nose; exhale smoothly through relaxed lips.";
  let elementalPrompt = "Float gently with the wind.";

  // Custom elemental voice styling
  if (element === 'air') {
    elementalPrompt = "Air Flow: Let your shoulders feel feather-light like mountain breeze.";
    if (overallScore >= 85) {
      headline = "Weightless Air Alignment";
      coachingText = "Your arms move effortlessly like warm wind floating over mountain peaks.";
    } else if (overallScore < 70) {
      headline = "Unburden Shoulder Weight";
      coachingText = "Drop your shoulder blades gently down your back. Let your elbows sink softly.";
    }
  } else if (element === 'fire') {
    elementalPrompt = "Fire Flow: Channel focused warmth through your core and palms.";
    if (overallScore >= 85) {
      headline = "Radiant Vital Energy";
      coachingText = "Vibrant posture! Your core emits steady, intentional physical focus.";
    } else if (overallScore < 70) {
      headline = "Ignite Central Core Focus";
      coachingText = "Anchor your chest, press through your heels, and express warmth in your palms.";
    }
  } else if (element === 'water') {
    elementalPrompt = "Water Flow: Move smoothly without sudden breaks, like a winding river.";
    if (overallScore >= 85) {
      headline = "Fluid River Flow";
      coachingText = "Seamless continuous arc. Your wrists yield and flow like ocean tide.";
    } else if (overallScore < 70) {
      headline = "Softization & Yielding";
      coachingText = "Avoid rigid locks at the elbows. Allow your movement to ripple from hips to fingertips.";
    }
  } else if (element === 'earth') {
    elementalPrompt = "Earth Flow: Root your feet into the earth like an ancient cedar tree.";
    if (overallScore >= 85) {
      headline = "Deep Rooted Stance";
      coachingText = "Immovable center of gravity. Dantian is settled with quiet confidence.";
    } else if (overallScore < 70) {
      headline = "Sink Dantian Gravity";
      coachingText = "Bend knees slightly further. Press soles evenly into the floor to anchor your weight.";
    }
  }

  return {
    headline,
    coachingText,
    pacingAdvice,
    elementalPrompt,
  };
}
