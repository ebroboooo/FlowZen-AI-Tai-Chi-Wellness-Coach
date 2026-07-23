/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SessionLog, JournalEntry, ElementalType } from '@/types';

export type MasteryLevel = 'Student' | 'Disciple' | 'Practitioner' | 'Master' | 'Grand Master';

export interface ElementMasteryScores {
  air: number;
  water: number;
  fire: number;
  earth: number;
}

export interface MasteryProfile {
  currentLevel: MasteryLevel;
  xp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  levelProgressPercent: number;
  totalPracticeMinutes: number;
  totalSessions: number;
  elementMastery: ElementMasteryScores;
  movementAccuracy: number;
  balanceAverage: number;
  alignmentAverage: number;
  meditationStreak: number;
  unlockedTitles: string[];
  strongestElement: ElementalType;
  suggestedFocus: string;
  recentImprovementText: string;
}

export const LEVEL_THRESHOLDS: { level: MasteryLevel; minXp: number; title: string }[] = [
  { level: 'Student', minXp: 0, title: 'Novice Seeker' },
  { level: 'Disciple', minXp: 200, title: 'Wayfarer of Zen' },
  { level: 'Practitioner', minXp: 600, title: 'Adept of Internal Flow' },
  { level: 'Master', minXp: 1500, title: 'Somatic Tai Chi Master' },
  { level: 'Grand Master', minXp: 3500, title: 'Grand Master of Harmony' },
];

/**
 * Calculates user's rank level, XP within level, next level target, and progress percentage.
 */
export function calculateMasteryLevel(xp: number = 0) {
  const safeXp = Math.max(0, isNaN(xp) ? 0 : xp);

  let currentLevel: MasteryLevel = 'Student';
  let title = 'Novice Seeker';
  let minXpForLevel = 0;
  let nextLevelXp = 200;

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (safeXp >= LEVEL_THRESHOLDS[i].minXp) {
      currentLevel = LEVEL_THRESHOLDS[i].level;
      title = LEVEL_THRESHOLDS[i].title;
      minXpForLevel = LEVEL_THRESHOLDS[i].minXp;
      nextLevelXp = LEVEL_THRESHOLDS[i + 1] ? LEVEL_THRESHOLDS[i + 1].minXp : LEVEL_THRESHOLDS[i].minXp + 2000;
      break;
    }
  }

  const xpInLevel = safeXp - minXpForLevel;
  const levelSpan = Math.max(1, nextLevelXp - minXpForLevel);
  const progressPercent = Math.min(100, Math.round((xpInLevel / levelSpan) * 100));

  return {
    level: currentLevel,
    title,
    xp: safeXp,
    xpInLevel,
    minXpForLevel,
    nextLevelXp,
    progressPercent,
  };
}

/**
 * Calculates scores (0 - 100) for each of the 4 elemental paths based on practice logs and journals.
 * Handles empty fallback gracefully.
 */
export function calculateElementProgress(
  sessions: SessionLog[] = [],
  journal: JournalEntry[] = [],
  streak: number = 0
): ElementMasteryScores {
  if (!sessions || sessions.length === 0) {
    return { air: 15, water: 15, fire: 15, earth: 15 };
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalSessions = sessions.length;
  const avgMindfulness = sessions.reduce((sum, s) => sum + (s.mindfulnessRating || 3), 0) / totalSessions;

  // Air: Breath control & flow consistency (driven by mindfulness rating & streak)
  const airScore = Math.min(100, Math.round(20 + avgMindfulness * 12 + Math.min( streak * 4, 30)));

  // Water: Movement smoothness & transitions (driven by total sessions & journal entries)
  const waterScore = Math.min(100, Math.round(20 + totalSessions * 5 + journal.length * 3));

  // Fire: Energy expression & power control (driven by total practice minutes)
  const fireScore = Math.min(100, Math.round(20 + Math.min(totalMinutes * 1.2, 70)));

  // Earth: Balance & stability (driven by consistency, streak, and baseline stance practice)
  const earthScore = Math.min(100, Math.round(25 + Math.min(streak * 5, 40) + totalSessions * 3));

  return {
    air: airScore,
    water: waterScore,
    fire: fireScore,
    earth: earthScore,
  };
}

/**
 * Calculates average alignment and balance metrics from sessions/journals.
 */
export function calculateAverages(sessions: SessionLog[] = [], journal: JournalEntry[] = []) {
  if (!sessions || sessions.length === 0) {
    return {
      accuracy: 82,
      balance: 80,
      alignment: 85,
    };
  }

  const sessionCount = sessions.length;
  const avgRating = sessions.reduce((sum, s) => sum + (s.mindfulnessRating || 3), 0) / sessionCount;

  // Scale 1-5 mindfulness to percentage base
  const basePercent = 70 + (avgRating / 5) * 25;
  const experienceBonus = Math.min(10, sessionCount * 0.5);

  const accuracy = Math.min(99, Math.round(basePercent + experienceBonus));
  const balance = Math.min(98, Math.round(basePercent - 2 + experienceBonus));
  const alignment = Math.min(99, Math.round(basePercent + 1 + experienceBonus));

  return { accuracy, balance, alignment };
}

/**
 * Calculates next milestone guidance based on current profile.
 */
export function calculateNextMilestone(profile: Partial<MasteryProfile>) {
  const level = profile.currentLevel || 'Student';
  const minutes = profile.totalPracticeMinutes || 0;
  const streak = profile.meditationStreak || 0;

  if (level === 'Student') {
    return {
      title: 'Path to Disciple',
      requirement: 'Complete 3 practice sessions or 30 total practice minutes.',
      progressPercent: Math.min(100, Math.round((minutes / 30) * 100)),
    };
  } else if (level === 'Disciple') {
    return {
      title: 'Path to Practitioner',
      requirement: 'Reach 60 practice minutes and a 7-day consistency streak.',
      progressPercent: Math.min(100, Math.round((streak / 7) * 100)),
    };
  } else if (level === 'Practitioner') {
    return {
      title: 'Path to Master',
      requirement: 'Accumulate 150 practice minutes and cultivate all 4 elemental paths.',
      progressPercent: Math.min(100, Math.round((minutes / 150) * 100)),
    };
  } else {
    return {
      title: 'Path to Grand Master',
      requirement: 'Maintain 300+ practice minutes and deep daily presence.',
      progressPercent: Math.min(100, Math.round((minutes / 300) * 100)),
    };
  }
}

/**
 * Builds full MasteryProfile from current user progress data.
 */
export function calculateMasteryProfile(
  sessions: SessionLog[] = [],
  streak: number = 0,
  journal: JournalEntry[] = [],
  completedLessonsCount: number = 0
): MasteryProfile {
  const totalPracticeMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalSessions = sessions.length;

  // XP calculation
  const totalXp =
    totalPracticeMinutes * 10 +
    totalSessions * 25 +
    streak * 15 +
    journal.length * 10 +
    completedLessonsCount * 30;

  const levelInfo = calculateMasteryLevel(totalXp);
  const elementMastery = calculateElementProgress(sessions, journal, streak);
  const averages = calculateAverages(sessions, journal);

  // Unlocked Titles
  const unlockedTitles = [levelInfo.title];
  if (streak >= 3) unlockedTitles.push('Breath Scholar');
  if (totalPracticeMinutes >= 60) unlockedTitles.push('Flow Guardian');
  if (completedLessonsCount >= 5) unlockedTitles.push('Somatic Virtuoso');

  // Identify strongest element
  let strongestElement: ElementalType = 'air';
  let maxScore = elementMastery.air;

  if (elementMastery.water > maxScore) {
    strongestElement = 'water';
    maxScore = elementMastery.water;
  }
  if (elementMastery.fire > maxScore) {
    strongestElement = 'fire';
    maxScore = elementMastery.fire;
  }
  if (elementMastery.earth > maxScore) {
    strongestElement = 'earth';
    maxScore = elementMastery.earth;
  }

  // Suggested next focus based on lowest element or accuracy
  let suggestedFocus = 'Relax shoulders during transitions and breathe deeply into the lower Dantian.';
  if (elementMastery.earth < 35) {
    suggestedFocus = 'Focus on Earth grounding poses to boost root stability and leg alignment.';
  } else if (elementMastery.water < 35) {
    suggestedFocus = 'Practice smooth, wave-like arm sweeps to cultivate fluid transitions.';
  } else if (elementMastery.air < 35) {
    suggestedFocus = 'Sync diaphragmatic inhale/exhale cycles directly with arm expansion.';
  } else if (elementMastery.fire < 35) {
    suggestedFocus = 'Embrace energetic weight transfers to build internal strength.';
  }

  // Monthly improvement sentence
  const recentImprovementText = `Balance and postural stability improved ${Math.min(24, 8 + totalSessions * 2)}% this month.`;

  return {
    currentLevel: levelInfo.level,
    xp: totalXp,
    currentLevelXp: levelInfo.xpInLevel,
    nextLevelXp: levelInfo.nextLevelXp,
    levelProgressPercent: levelInfo.progressPercent,
    totalPracticeMinutes,
    totalSessions,
    elementMastery,
    movementAccuracy: averages.accuracy,
    balanceAverage: averages.balance,
    alignmentAverage: averages.alignment,
    meditationStreak: streak,
    unlockedTitles,
    strongestElement,
    suggestedFocus,
    recentImprovementText,
  };
}
