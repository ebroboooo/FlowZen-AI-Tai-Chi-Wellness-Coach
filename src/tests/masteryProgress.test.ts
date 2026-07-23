/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  calculateMasteryLevel,
  calculateElementProgress,
  calculateAverages,
  calculateNextMilestone,
  calculateMasteryProfile
} from '../utils/masteryCalculations';

describe('Tai Chi Mastery Progress System', () => {
  it('calculates mastery levels accurately', () => {
    expect(calculateMasteryLevel(0).level).toBe('Student');
    expect(calculateMasteryLevel(250).level).toBe('Disciple');
    expect(calculateMasteryLevel(700).level).toBe('Practitioner');
    expect(calculateMasteryLevel(1600).level).toBe('Master');
    expect(calculateMasteryLevel(4000).level).toBe('Grand Master');
  });

  it('handles empty user fallback gracefully without throwing errors', () => {
    const emptyElements = calculateElementProgress([], [], 0);
    expect(emptyElements.air).toBeGreaterThan(0);
    expect(emptyElements.water).toBeGreaterThan(0);
    expect(emptyElements.fire).toBeGreaterThan(0);
    expect(emptyElements.earth).toBeGreaterThan(0);

    const emptyAverages = calculateAverages([], []);
    expect(emptyAverages.accuracy).toBeGreaterThan(50);
    expect(emptyAverages.balance).toBeGreaterThan(50);
    expect(emptyAverages.alignment).toBeGreaterThan(50);

    const profile = calculateMasteryProfile([], 0, [], 0);
    expect(profile.currentLevel).toBe('Student');
    expect(profile.xp).toBe(0);
  });

  it('calculates elemental progression accurately based on practice', () => {
    const sessions = [
      { id: '1', exerciseId: 'wave-hands', exerciseTitle: 'Wave Hands Like Clouds', timestamp: new Date().toISOString(), durationMinutes: 15, mindfulnessRating: 5, date: '2026-07-22' },
      { id: '2', exerciseId: 'grasp-sparrow', exerciseTitle: 'Grasp Sparrow Tail', timestamp: new Date().toISOString(), durationMinutes: 20, mindfulnessRating: 4, date: '2026-07-23' }
    ];
    const elements = calculateElementProgress(sessions, [], 5);
    expect(elements.air).toBeGreaterThan(20);
    expect(elements.earth).toBeGreaterThan(20);
    expect(elements.fire).toBeGreaterThan(20);
    expect(elements.water).toBeGreaterThan(20);
  });

  it('calculates next milestone guidance', () => {
    const milestoneStudent = calculateNextMilestone({ currentLevel: 'Student', totalPracticeMinutes: 10 });
    expect(milestoneStudent.title).toBe('Path to Disciple');
    expect(milestoneStudent.progressPercent).toBe(33);

    const milestoneMaster = calculateNextMilestone({ currentLevel: 'Master', totalPracticeMinutes: 200 });
    expect(milestoneMaster.title).toBe('Path to Grand Master');
  });

  it('correctly averages scores across sessions', () => {
    const sessions = [
      { id: '1', exerciseId: 'wave-hands', exerciseTitle: 'Wave Hands Like Clouds', timestamp: new Date().toISOString(), durationMinutes: 10, mindfulnessRating: 4, date: '2026-07-20' },
      { id: '2', exerciseId: 'grasp-sparrow', exerciseTitle: 'Grasp Sparrow Tail', timestamp: new Date().toISOString(), durationMinutes: 5, mindfulnessRating: 5, date: '2026-07-21' }
    ];
    const averages = calculateAverages(sessions, []);
    expect(averages.accuracy).toBeGreaterThanOrEqual(80);
    expect(averages.balance).toBeGreaterThanOrEqual(80);
    expect(averages.alignment).toBeGreaterThanOrEqual(80);
  });
});
