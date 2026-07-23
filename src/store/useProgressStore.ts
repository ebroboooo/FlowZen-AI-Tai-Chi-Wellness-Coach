/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { SessionLog, JournalEntry } from '@/types';
import { calculateMasteryProfile, MasteryProfile } from '@/utils/masteryCalculations';
import { useGardenStore } from './useGardenStore';

const PROGRESS_STORAGE_KEY = 'fz_progress_v1';

export interface DailyRewardResult {
  xpGained: number;
  streak: number;
  isNewDay: boolean;
  gardenLevel: number;
  newlyUnlocked: string[];
  message: string;
}

interface ProgressState {
  sessions: SessionLog[];
  journalEntries: JournalEntry[];
  streak: number;
  minutes: number;
  lastPracticeDate: string | null;

  addSession: (session: Omit<SessionLog, 'id'>) => DailyRewardResult;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  getMasteryProfile: () => MasteryProfile;
  isTodayCompleted: () => boolean;
  getTodayProgress: (targetMinutes?: number) => { minutesToday: number; targetMinutes: number; isCompleted: boolean };
  getDailyIntention: () => { title: string; quote: string; focusArea: string };
  loadProgress: () => void;
}

const DAILY_INTENTIONS = [
  { title: "Cultivate Rooted Quiet", quote: "Let your weight sink into the earth like warm mountain water, releasing upper body tension.", focusArea: "Stress Relief" },
  { title: "Yielding Like Bamboo", quote: "Yield to physical resistance with softness. Bending gracefully preserves effortless strength.", focusArea: "Joint Protection" },
  { title: "Unburden Shoulders & Spine", quote: "Imagine a golden thread gently raising your crown skyward while your shoulders melt downward.", focusArea: "Posture Alignment" },
  { title: "Flow Like Mountain Waves", quote: "Synchronize slow circular movement with deep diaphragmatic breathing. Mind and body unite as one.", focusArea: "Mindful Breath" },
  { title: "Center the Dantien", quote: "Gather focus two inches below the navel. A stable center brings quiet poise to every movement.", focusArea: "Balance & Core" }
];

function getTodayIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

function loadStoredProgress() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return null;
}

function saveProgressState(data: { sessions: SessionLog[]; journalEntries: JournalEntry[]; streak: number; minutes: number; lastPracticeDate: string | null }) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
    }
  } catch {}
}

const defaultStored = loadStoredProgress();

export const useProgressStore = create<ProgressState>((set, get) => ({
  sessions: defaultStored?.sessions || [],
  journalEntries: defaultStored?.journalEntries || [],
  streak: defaultStored?.streak !== undefined ? defaultStored.streak : 1,
  minutes: defaultStored?.minutes !== undefined ? defaultStored.minutes : 45,
  lastPracticeDate: defaultStored?.lastPracticeDate || null,

  addSession: (sessionData) => {
    const todayStr = getTodayIsoDate();
    const current = get();
    const lastDateStr = current.lastPracticeDate ? current.lastPracticeDate.split('T')[0] : null;

    let newStreak = current.streak;
    let isNewDay = false;

    if (!lastDateStr) {
      newStreak = 1;
      isNewDay = true;
    } else if (lastDateStr === todayStr) {
      // Already completed a session today, maintain streak
      isNewDay = false;
    } else {
      // Check day difference
      const lastDate = new Date(lastDateStr);
      const today = new Date(todayStr);
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        newStreak = current.streak + 1;
        isNewDay = true;
      } else {
        newStreak = 1;
        isNewDay = true;
      }
    }

    const newSession: SessionLog = {
      ...sessionData,
      id: 'session_' + Math.random().toString(36).substring(2, 11)
    };

    const newSessions = [newSession, ...current.sessions];
    const newMinutes = current.minutes + (sessionData.durationMinutes || 15);

    // Award Qi XP to Living Garden Store
    const xpReward = 50 + (isNewDay ? 25 : 0);
    const gardenReward = useGardenStore.getState().addXp(xpReward);

    set({
      sessions: newSessions,
      minutes: newMinutes,
      streak: newStreak,
      lastPracticeDate: new Date().toISOString()
    });

    saveProgressState({
      sessions: newSessions,
      journalEntries: current.journalEntries,
      streak: newStreak,
      minutes: newMinutes,
      lastPracticeDate: new Date().toISOString()
    });

    const calmMessages = [
      "Your Qi flows gently like mountain water. Your living sanctuary thrives with every mindful breath.",
      "Rooted like an ancient pine, your physical practice brings quiet stability to your sanctuary.",
      "Softness and alignment united. Your body and garden reflect calm harmony today."
    ];
    const message = calmMessages[Math.floor(Math.random() * calmMessages.length)];

    return {
      xpGained: xpReward,
      streak: newStreak,
      isNewDay,
      gardenLevel: gardenReward.newLevel,
      newlyUnlocked: gardenReward.newlyUnlocked,
      message
    };
  },

  addJournalEntry: (entryData) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: 'journal_' + Math.random().toString(36).substring(2, 11)
    };
    set((state) => {
      const updatedEntries = [newEntry, ...state.journalEntries];
      saveProgressState({
        sessions: state.sessions,
        journalEntries: updatedEntries,
        streak: state.streak,
        minutes: state.minutes,
        lastPracticeDate: state.lastPracticeDate
      });
      return { journalEntries: updatedEntries };
    });
  },

  getMasteryProfile: () => {
    const { sessions, streak, journalEntries } = get();
    return calculateMasteryProfile(sessions, streak, journalEntries, sessions.length);
  },

  isTodayCompleted: () => {
    const { lastPracticeDate } = get();
    if (!lastPracticeDate) return false;
    const todayStr = getTodayIsoDate();
    return lastPracticeDate.split('T')[0] === todayStr;
  },

  getTodayProgress: (targetMinutes = 15) => {
    const { sessions, lastPracticeDate } = get();
    const todayStr = getTodayIsoDate();
    const isCompleted = lastPracticeDate ? lastPracticeDate.split('T')[0] === todayStr : false;

    const todaySessions = sessions.filter(s => s.timestamp.split('T')[0] === todayStr);
    const minutesToday = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    return {
      minutesToday: isCompleted ? Math.max(minutesToday, targetMinutes) : minutesToday,
      targetMinutes,
      isCompleted
    };
  },

  getDailyIntention: () => {
    // Deterministic daily index based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const idx = dayOfYear % DAILY_INTENTIONS.length;
    return DAILY_INTENTIONS[idx];
  },

  loadProgress: () => {
    const stored = loadStoredProgress();
    if (stored) {
      set({
        sessions: stored.sessions || [],
        journalEntries: stored.journalEntries || [],
        streak: stored.streak !== undefined ? stored.streak : 1,
        minutes: stored.minutes !== undefined ? stored.minutes : 45,
        lastPracticeDate: stored.lastPracticeDate || null
      });
    }
  }
}));

