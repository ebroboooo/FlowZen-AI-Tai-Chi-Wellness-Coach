/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface CurriculumState {
  selectedProgramId: string;
  selectedLevel: DifficultyLevel;
  favorites: string[];
  startedLessons: string[];
  completedLessons: string[];

  setSelectedProgramId: (id: string) => void;
  setSelectedLevel: (level: DifficultyLevel) => void;
  toggleFavorite: (lessonId: string) => Promise<void>;
  markLessonStarted: (lessonId: string) => void;
  markLessonCompleted: (lessonId: string) => void;
  loadCurriculumProgress: () => void;
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  selectedProgramId: 'tai-chi-foundations',
  selectedLevel: 'Beginner',
  favorites: [],
  startedLessons: [],
  completedLessons: [],

  setSelectedProgramId: (selectedProgramId) => set({ selectedProgramId }),
  setSelectedLevel: (selectedLevel) => set({ selectedLevel }),

  toggleFavorite: async (lessonId) => {
    const favorites = get().favorites;
    const exists = favorites.includes(lessonId);
    const updated = exists ? favorites.filter(id => id !== lessonId) : [...favorites, lessonId];
    set({ favorites: updated });
  },

  markLessonStarted: (lessonId) => {
    const started = get().startedLessons;
    if (!started.includes(lessonId)) {
      set({ startedLessons: [...started, lessonId] });
    }
  },

  markLessonCompleted: (lessonId) => {
    const completed = get().completedLessons;
    if (!completed.includes(lessonId)) {
      set({ completedLessons: [...completed, lessonId] });
    }
  },

  loadCurriculumProgress: () => {
    // Progress loaded from store or local state
  }
}));
