/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface UserGoals {
  name: string;
  age: string;
  experienceLevel: string;
  focusArea: string;
  dailyMinutesTarget: number;
  goalsList: string[];
  language: string;
  country: string;
  timezone: string;
  onboardingCompleted?: boolean;
}

interface AppStore {
  userGoals: UserGoals;
  setUserGoals: (goals: Partial<UserGoals>) => void;
}

const DEFAULT_GOALS: UserGoals = {
  name: 'Zen Practitioner',
  age: '',
  experienceLevel: 'beginner',
  focusArea: 'stress',
  dailyMinutesTarget: 15,
  goalsList: ['Mindfulness', 'Balance'],
  language: 'English',
  country: '',
  timezone: 'UTC'
};

export const useStore = create<AppStore>((set) => ({
  userGoals: DEFAULT_GOALS,
  setUserGoals: (goals) => set((state) => ({ userGoals: { ...state.userGoals, ...goals } }))
}));
