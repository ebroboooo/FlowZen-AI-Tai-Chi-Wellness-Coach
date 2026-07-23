/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCoachStore } from '../store/useCoachStore';

// Mock Firebase main module & Firestore
vi.mock('@/firebase/firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));

describe('FlowZen AI Coach Training Memory', () => {
  beforeEach(() => {
    localStorage.clear();
    useCoachStore.setState({
      messages: [],
      isLoading: false,
      error: null,
      conversationId: 'conv_test_123',
      isOfflineMode: false,
      memory: {
        favoriteElements: [],
        weakMovements: [],
        strongMovements: [],
        balanceHistory: [],
        alignmentHistory: [],
        practiceConsistency: 0,
        improvementNotes: []
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Memory Creation & Empty Fallback', () => {
    it('should initialize with empty default memory structure', () => {
      const memory = useCoachStore.getState().memory;
      expect(memory).toBeDefined();
      expect(memory.favoriteElements).toEqual([]);
      expect(memory.weakMovements).toEqual([]);
      expect(memory.strongMovements).toEqual([]);
      expect(memory.balanceHistory).toEqual([]);
      expect(memory.alignmentHistory).toEqual([]);
      expect(memory.practiceConsistency).toBe(0);
      expect(memory.improvementNotes).toEqual([]);
    });

    it('should return friendly empty fallback when generating training summary for new user', () => {
      const summary = useCoachStore.getState().getTrainingSummary();
      expect(summary).toBe('New practitioner. No previous practice history recorded yet.');
    });
  });

  describe('Practice Recording & Score History', () => {
    it('should record a practice session result and update memory state', () => {
      const store = useCoachStore.getState();

      store.recordPracticeResult({
        movementId: 'commencing-form',
        element: 'water',
        alignmentScore: 85,
        balanceScore: 90,
        duration: 300
      });

      const updatedMemory = useCoachStore.getState().memory;
      expect(updatedMemory.practiceConsistency).toBe(1);
      expect(updatedMemory.favoriteElements).toContain('water');
      expect(updatedMemory.alignmentHistory).toEqual([85]);
      expect(updatedMemory.balanceHistory).toEqual([90]);
      expect(updatedMemory.strongMovements).toContain('commencing-form');
    });

    it('should update balance history and alignment history individually', () => {
      const store = useCoachStore.getState();

      store.updateBalanceHistory(88);
      store.updateBalanceHistory(92);
      store.updateAlignmentHistory(80);

      const updatedMemory = useCoachStore.getState().memory;
      expect(updatedMemory.balanceHistory).toEqual([88, 92]);
      expect(updatedMemory.alignmentHistory).toEqual([80]);
    });

    it('should correctly classify strong vs weak movements', () => {
      const store = useCoachStore.getState();

      // Strong score (>= 80)
      store.updateMovementStrength('commencing-form', 85);
      let memory = useCoachStore.getState().memory;
      expect(memory.strongMovements).toContain('commencing-form');
      expect(memory.weakMovements).not.toContain('commencing-form');

      // Weak score (< 70)
      store.updateMovementStrength('wave-hands', 65);
      memory = useCoachStore.getState().memory;
      expect(memory.weakMovements).toContain('wave-hands');

      // Shift wave-hands to strong
      store.updateMovementStrength('wave-hands', 82);
      memory = useCoachStore.getState().memory;
      expect(memory.strongMovements).toContain('wave-hands');
      expect(memory.weakMovements).not.toContain('wave-hands');
    });
  });

  describe('Training Summary Generation', () => {
    it('should generate a compact training summary with practice metrics', () => {
      const store = useCoachStore.getState();

      store.recordPracticeResult({
        movementId: 'commencing-form',
        element: 'air',
        alignmentScore: 82,
        balanceScore: 88,
        duration: 180
      });

      store.recordPracticeResult({
        movementId: 'cloud-hands',
        element: 'air',
        alignmentScore: 78,
        balanceScore: 84,
        duration: 200
      });

      const summary = useCoachStore.getState().getTrainingSummary();
      expect(summary).toContain('Total sessions recorded: 2');
      expect(summary).toContain('Strong element: air');
      expect(summary).toContain('Avg balance score: 86%');
      expect(summary).toContain('Avg alignment score: 80%');
    });
  });
});
