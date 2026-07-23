/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Lesson, Movement } from '@/types';
import { analytics } from '@/utils/analytics';

interface PracticeState {
  currentLesson: Lesson | null;
  currentMovement: Movement | null;
  isPlaying: boolean;
  speed: number;
  isMirrorMode: boolean;
  sessionTimer: number;
  isCompleted: boolean;
  isMuted: boolean;
  activeView: 'front' | 'side' | 'top';

  // Actions
  startPractice: (lesson: Lesson) => void;
  stopPractice: () => void;
  endPractice: () => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  toggleMirrorMode: () => void;
  toggleMuted: () => void;
  setActiveView: (view: 'front' | 'side' | 'top') => void;
  nextMovement: () => void;
  prevMovement: () => void;
  incrementTimer: () => void;
  completePracticeSession: (rating?: number) => void;
  resetPractice: () => void;
  setMovement: (movement: Movement) => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  currentLesson: null,
  currentMovement: null,
  isPlaying: false,
  speed: 1,
  isMirrorMode: false,
  sessionTimer: 0,
  isCompleted: false,
  isMuted: false,
  activeView: 'front',

  startPractice: (lesson) => {
    analytics.track('first_practice_started', { lessonId: lesson.id, title: lesson.title });
    set({
      currentLesson: lesson,
      currentMovement: lesson.movements?.[0] || null,
      isPlaying: true,
      sessionTimer: 0,
      isCompleted: false
    });
  },

  stopPractice: () => set({
    currentLesson: null,
    currentMovement: null,
    isPlaying: false
  }),

  endPractice: () => set({
    currentLesson: null,
    currentMovement: null,
    isPlaying: false
  }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  toggleMirrorMode: () => set((state) => ({ isMirrorMode: !state.isMirrorMode })),
  toggleMuted: () => set((state) => ({ isMuted: !state.isMuted })),
  setActiveView: (activeView) => set({ activeView }),

  nextMovement: () => {
    const { currentLesson, currentMovement } = get();
    if (!currentLesson?.movements?.length || !currentMovement) return;
    const currentIndex = currentLesson.movements.findIndex(m => m.id === currentMovement.id);
    if (currentIndex >= 0 && currentIndex < currentLesson.movements.length - 1) {
      set({ currentMovement: currentLesson.movements[currentIndex + 1] });
    }
  },

  prevMovement: () => {
    const { currentLesson, currentMovement } = get();
    if (!currentLesson?.movements?.length || !currentMovement) return;
    const currentIndex = currentLesson.movements.findIndex(m => m.id === currentMovement.id);
    if (currentIndex > 0) {
      set({ currentMovement: currentLesson.movements[currentIndex - 1] });
    }
  },

  incrementTimer: () => set((state) => ({ sessionTimer: state.sessionTimer + 1 })),
  completePracticeSession: (_rating?: number) => {
    analytics.track('first_practice_completed');
    analytics.track('daily_reward_claimed');
    set({ isCompleted: true, isPlaying: false });
  },
  resetPractice: () => set({ sessionTimer: 0, isCompleted: false, isPlaying: true }),
  setMovement: (currentMovement) => set({ currentMovement })
}));
