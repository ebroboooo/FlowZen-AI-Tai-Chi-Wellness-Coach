/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { ChatMessage, ElementalType } from '@/types';
import { useStore } from './useStore';
import { useProgressStore } from './useProgressStore';
import { useCurriculumStore } from './useCurriculumStore';
import { useGardenStore } from './useGardenStore';

export interface TrainingMemory {
  favoriteElements: ElementalType[];
  weakMovements: string[];
  strongMovements: string[];
  balanceHistory: number[];
  alignmentHistory: number[];
  practiceConsistency: number;
  improvementNotes: string[];
}

export interface AiMasterProfile {
  userName: string;
  practiceLevel: string;
  mainGoal: string;
  elementalAlignment: ElementalType;
  practiceHistorySummary: string;
  streak: number;
  gardenStage: number;
  mentorName: string;
  title: string;
}

interface CoachState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  conversationId: string;
  isOfflineMode: boolean;
  memory: TrainingMemory;
  lastRequestTimestamp: number;

  // Actions
  loadHistory: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
  newConversation: () => void;
  recordPracticeResult: (result: {
    movementId: string;
    element: ElementalType;
    alignmentScore?: number;
    balanceScore?: number;
    duration: number;
  }) => void;
  updateMovementStrength: (movementId: string, score: number) => void;
  updateBalanceHistory: (score: number) => void;
  updateAlignmentHistory: (score: number) => void;
  getTrainingSummary: () => string;
  getAiMasterProfile: () => AiMasterProfile;
  getDailyMasterMessage: (timeOfDay?: 'morning' | 'afternoon' | 'evening') => { greeting: string; message: string; focusAdvice: string; postureTip: string };
  getPostPracticeReflection: (sessionTitle: string, durationMinutes: number, mindfulnessRating?: number) => { title: string; reflection: string; sanctuaryImpact: string };
}

const STORAGE_KEY = 'fz_coach_conversation_v1';
const CONV_ID_KEY = 'fz_coach_conv_id';
const MEMORY_KEY = 'fz_coach_memory_v1';

const DEFAULT_MEMORY: TrainingMemory = {
  favoriteElements: [],
  weakMovements: [],
  strongMovements: [],
  balanceHistory: [],
  alignmentHistory: [],
  practiceConsistency: 0,
  improvementNotes: []
};

function loadStoredMemory(): TrainingMemory {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(MEMORY_KEY) : null;
    if (raw) return { ...DEFAULT_MEMORY, ...JSON.parse(raw) };
  } catch {
    // Ignore parse errors
  }
  return { ...DEFAULT_MEMORY };
}

function saveMemory(mem: TrainingMemory) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
    }
  } catch {
    // Ignore storage quota errors
  }
}

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'model',
  text: 'Greetings, traveler. Welcome to this quiet corner of FlowZen. I am your somatic Tai Chi and wellness guide.\n\nWhether you are seeking to gently align your posture, protect your knees during stances, relieve physical stiffness, or find a moment of calm deep-breathing, I am here to yield and flow with you.\n\nHow is your body feeling today, and what aspect of your practice shall we explore together?',
  timestamp: new Date().toISOString()
};

export const useCoachStore = create<CoachState>((set, get) => ({
  messages: [INITIAL_GREETING],
  isLoading: false,
  error: null,
  conversationId: typeof localStorage !== 'undefined' ? (localStorage.getItem(CONV_ID_KEY) || 'conv_' + Math.random().toString(36).substring(2, 11)) : 'conv_default',
  isOfflineMode: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  memory: loadStoredMemory(),
  lastRequestTimestamp: 0,

  loadHistory: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const messages = stored ? JSON.parse(stored) : [INITIAL_GREETING];
      const isOfflineMode = !navigator.onLine;
      const memory = loadStoredMemory();
      set({ messages, isOfflineMode, memory });
    } catch {
      set({ messages: [INITIAL_GREETING], isOfflineMode: !navigator.onLine, memory: loadStoredMemory() });
    }
  },

  clearConversation: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ messages: [INITIAL_GREETING], error: null });
  },

  newConversation: () => {
    const newId = 'conv_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(CONV_ID_KEY, newId);
    localStorage.removeItem(STORAGE_KEY);
    set({
      messages: [INITIAL_GREETING],
      conversationId: newId,
      error: null
    });
  },

  recordPracticeResult: (result) => {
    const currentMemory = get().memory || DEFAULT_MEMORY;
    const balanceHist = result.balanceScore !== undefined
      ? [...currentMemory.balanceHistory, result.balanceScore].slice(-20)
      : currentMemory.balanceHistory;
    const alignHist = result.alignmentScore !== undefined
      ? [...currentMemory.alignmentHistory, result.alignmentScore].slice(-20)
      : currentMemory.alignmentHistory;

    const favElements = Array.from(new Set([result.element, ...currentMemory.favoriteElements])).slice(0, 4) as ElementalType[];

    let strong = [...currentMemory.strongMovements];
    let weak = [...currentMemory.weakMovements];

    const avgScore = (result.alignmentScore || 80) * 0.5 + (result.balanceScore || 80) * 0.5;
    if (avgScore >= 80) {
      if (!strong.includes(result.movementId)) strong.push(result.movementId);
      weak = weak.filter(m => m !== result.movementId);
    } else if (avgScore < 70) {
      if (!weak.includes(result.movementId)) weak.push(result.movementId);
      strong = strong.filter(m => m !== result.movementId);
    }

    const notes = [...currentMemory.improvementNotes];
    if (result.balanceScore && result.balanceScore > 85) {
      notes.unshift(`High balance root achieved (${result.balanceScore}%) during ${result.element} flow.`);
    }

    const updatedMemory: TrainingMemory = {
      favoriteElements: favElements,
      weakMovements: weak,
      strongMovements: strong,
      balanceHistory: balanceHist,
      alignmentHistory: alignHist,
      practiceConsistency: currentMemory.practiceConsistency + 1,
      improvementNotes: notes.slice(0, 10)
    };

    saveMemory(updatedMemory);
    set({ memory: updatedMemory });
  },

  updateMovementStrength: (movementId, score) => {
    const currentMemory = get().memory || DEFAULT_MEMORY;
    let strong = [...currentMemory.strongMovements];
    let weak = [...currentMemory.weakMovements];

    if (score >= 80) {
      if (!strong.includes(movementId)) strong.push(movementId);
      weak = weak.filter(m => m !== movementId);
    } else if (score < 70) {
      if (!weak.includes(movementId)) weak.push(movementId);
      strong = strong.filter(m => m !== movementId);
    }

    const updatedMemory = { ...currentMemory, strongMovements: strong, weakMovements: weak };
    saveMemory(updatedMemory);
    set({ memory: updatedMemory });
  },

  updateBalanceHistory: (score) => {
    const currentMemory = get().memory || DEFAULT_MEMORY;
    const updatedHistory = [...currentMemory.balanceHistory, score].slice(-20);
    const updatedMemory = { ...currentMemory, balanceHistory: updatedHistory };
    saveMemory(updatedMemory);
    set({ memory: updatedMemory });
  },

  updateAlignmentHistory: (score) => {
    const currentMemory = get().memory || DEFAULT_MEMORY;
    const updatedHistory = [...currentMemory.alignmentHistory, score].slice(-20);
    const updatedMemory = { ...currentMemory, alignmentHistory: updatedHistory };
    saveMemory(updatedMemory);
    set({ memory: updatedMemory });
  },

  getTrainingSummary: () => {
    const mem = get().memory || DEFAULT_MEMORY;
    if (mem.practiceConsistency === 0 && mem.balanceHistory.length === 0 && mem.alignmentHistory.length === 0) {
      return 'New practitioner. No previous practice history recorded yet.';
    }

    const avgBalance = mem.balanceHistory.length
      ? Math.round(mem.balanceHistory.reduce((a, b) => a + b, 0) / mem.balanceHistory.length)
      : null;
    const avgAlignment = mem.alignmentHistory.length
      ? Math.round(mem.alignmentHistory.reduce((a, b) => a + b, 0) / mem.alignmentHistory.length)
      : null;

    const favElem = mem.favoriteElements.length > 0 ? mem.favoriteElements[0] : 'Air';
    const strongStr = mem.strongMovements.length > 0 ? mem.strongMovements.join(', ') : 'Foundational forms';
    const weakStr = mem.weakMovements.length > 0 ? mem.weakMovements.join(', ') : 'Shoulder relaxation';

    let summary = `Total sessions recorded: ${mem.practiceConsistency}. Strong element: ${favElem}.`;
    if (avgBalance !== null) summary += ` Avg balance score: ${avgBalance}%.`;
    if (avgAlignment !== null) summary += ` Avg alignment score: ${avgAlignment}%.`;
    if (mem.strongMovements.length > 0) summary += ` Strong movements: ${strongStr}.`;
    if (mem.weakMovements.length > 0) summary += ` Main focus area: ${weakStr}.`;

    return summary;
  },

  getAiMasterProfile: () => {
    const userGoals = useStore.getState().userGoals;
    const { sessions, streak, minutes } = useProgressStore.getState();
    const gardenLevel = useGardenStore.getState().level;
    const mem = get().memory || DEFAULT_MEMORY;

    const userName = userGoals.name || 'Zen Practitioner';
    const practiceLevel = userGoals.experienceLevel || 'Beginner';
    const mainGoal = userGoals.focusArea || 'Stress Relief & Inner Harmony';
    const elementalAlignment = mem.favoriteElements[0] || 'air';

    return {
      userName,
      practiceLevel,
      mainGoal,
      elementalAlignment,
      practiceHistorySummary: `${sessions.length} sessions logged • ${minutes} total minutes cultivated`,
      streak,
      gardenStage: gardenLevel,
      mentorName: 'Master FlowZen',
      title: 'Personal AI Somatic Master Companion'
    };
  },

  getDailyMasterMessage: (timeOfDay) => {
    const userGoals = useStore.getState().userGoals;
    const name = userGoals.name || 'Practitioner';
    const goal = userGoals.focusArea || 'stress relief';
    const streak = useProgressStore.getState().streak;

    const hour = new Date().getHours();
    const tod = timeOfDay || (hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening');

    if (tod === 'morning') {
      return {
        greeting: `Good morning, ${name}.`,
        message: `As the early sun rises, let your breath settle into your belly (Dantien). Today, focus on gentle intention rather than physical force. A soft mind creates an effortless stance.`,
        focusAdvice: `Dedicated to your goal of ${goal}. Keep your neck long and crown lifted.`,
        postureTip: "Imagine your feet rooting three inches into warm, quiet earth with every exhale."
      };
    } else if (tod === 'afternoon') {
      return {
        greeting: `Peaceful afternoon, ${name}.`,
        message: `Pause amidst the day's activity. Roll your shoulders back once and release any accumulated tension. You have maintained a ${streak}-day streak of quiet mindfulness.`,
        focusAdvice: `To support ${goal}, allow your upper back to broaden and your elbows to sink lightly.`,
        postureTip: "Unclench your jaw and let your eyes soften as you take a slow, 5-second breath."
      };
    } else {
      return {
        greeting: `Quiet evening, ${name}.`,
        message: `As night approaches, draw your energy downward into your heels. Let go of the day's tasks with a slow, circular exhalation.`,
        focusAdvice: `Restoring your body supports ${goal}. Rest deeply to cultivate fresh Qi for tomorrow.`,
        postureTip: "Stand or sit with a relaxed spine, letting your hands rest naturally over your Dantien."
      };
    }
  },

  getPostPracticeReflection: (sessionTitle, durationMinutes, mindfulnessRating = 5) => {
    const userGoals = useStore.getState().userGoals;
    const name = userGoals.name || 'Practitioner';
    const gardenStage = useGardenStore.getState().level;

    const reflections = [
      `Honoring your devotion today, ${name}. Completing ${durationMinutes} minutes of '${sessionTitle}' cultivated deep physical ease.`,
      `With every unhurried movement in '${sessionTitle}', your breath and body align in natural harmony.`,
      `A beautiful session, ${name}. Your commitment to '${sessionTitle}' nourishes your living sanctuary with steady Qi.`
    ];

    const idx = Math.floor(Math.random() * reflections.length);

    return {
      title: "Master FlowZen's Post-Practice Reflection",
      reflection: reflections[idx],
      sanctuaryImpact: `+50 Qi XP awarded • Sanctuary Level ${gardenStage} thriving with fresh vitality.`
    };
  },

  sendMessage: async (text: string) => {
    if (!text.trim() || get().isLoading) return;

    // Client-side rate & duplicate request protection
    const now = Date.now();
    const lastTime = get().lastRequestTimestamp || 0;
    if (now - lastTime < 3000) {
      return;
    }
    set({ lastRequestTimestamp: now });

    const userMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 11),
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const currentMessages = [...get().messages, userMsg];
    set({ messages: currentMessages, isLoading: true, error: null });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMessages));

    // Prepare Context Assembly from client-side state
    const userGoals = useStore.getState().userGoals;
    const sessions = useProgressStore.getState().sessions;
    const journalEntries = useProgressStore.getState().journalEntries;
    const completedLessons = useCurriculumStore.getState().completedLessons;
    const selectedProgramId = useCurriculumStore.getState().selectedProgramId;
    const selectedLevel = useCurriculumStore.getState().selectedLevel;
    const gardenLevel = useGardenStore.getState().level;

    // Check if the latest check-in is today (local time)
    const todayStr = new Date().toISOString().split('T')[0];
    const latestJournal = journalEntries[0];
    const isTodayCheckIn = latestJournal?.timestamp.split('T')[0] === todayStr;

    const todayCheckIn = isTodayCheckIn ? {
      mood: latestJournal.mood,
      stressLevel: latestJournal.stressLevel,
      energyLevel: latestJournal.energyLevel,
      painLevel: latestJournal.painLevel,
      painArea: latestJournal.painArea,
      notes: latestJournal.notes
    } : undefined;

    const userContext = {
      currentProgram: selectedProgramId || 'Tai Chi Foundations',
      selectedLevel: selectedLevel || 'Beginner',
      preferredDuration: userGoals?.dailyMinutesTarget || 15,
      gardenLevel: gardenLevel || 1,
      completedLessonsCount: completedLessons.length,
      trainingSummary: get().getTrainingSummary(),
      todayCheckIn,
      recentHistory: sessions.slice(0, 5).map(s => ({
        exerciseTitle: s.exerciseTitle,
        durationMinutes: s.durationMinutes,
        timestamp: s.timestamp
      })),
      recentJournalNotes: journalEntries.slice(0, 3).map(j => j.notes).filter(Boolean)
    };

    const userProfile = {
      name: userGoals?.name || 'Zen Practitioner',
      age: userGoals?.age || '',
      experienceLevel: userGoals?.experienceLevel || 'beginner',
      focusArea: userGoals?.focusArea || 'stress',
      goalsList: userGoals?.goalsList || [],
      language: userGoals?.language || 'English',
      country: userGoals?.country || '',
      timezone: userGoals?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    };

    const modelMsgId = 'msg_' + Math.random().toString(36).substring(2, 11);
    const initialModelMsg: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: new Date().toISOString()
    };

    // Add empty model message for streaming updates
    set({ messages: [...currentMessages, initialModelMsg] });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages.map(m => ({ role: m.role, text: m.text })),
          userProfile,
          userContext,
          stream: true,
          conversationId: get().conversationId
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Please rest a moment before asking another question.');
        }
        throw new Error('Our mindful connection was interrupted. Please try again.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let streamedText = '';

      if (!reader) {
        throw new Error('Streaming connection failed to initialize.');
      }

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split('\n');
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
              const dataStr = trimmedLine.substring(6).trim();
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                const textChunk = parsed.text || '';
                streamedText += textChunk;

                // Update the last message in state in real-time
                set((state) => {
                  const updated = [...state.messages];
                  const lastIndex = updated.length - 1;
                  if (lastIndex >= 0 && updated[lastIndex].role === 'model') {
                    updated[lastIndex] = {
                      ...updated[lastIndex],
                      text: streamedText
                    };
                  }
                  return { messages: updated };
                });
              } catch {
                // Ignore partial JSON parsing errors during stream splits
              }
            }
          }
        }
      }

      // Persist full conversation with finalized streamed text
      set((state) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages));
        return { isLoading: false };
      });

    } catch (err: any) {
      console.warn('Chat routing fallback invoked:', err?.message || err);

      // Handle offline or error graceful fallbacks
      const fallbackText = getOfflineFallbackText(text);

      set((state) => {
        const updated = [...state.messages];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].role === 'model') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: fallbackText
          };
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return {
          messages: updated,
          isLoading: false,
          error: null
        };
      });
    }
  }
}));

function getOfflineFallbackText(message: string): string {
  const lastUserMessage = message.toLowerCase();
  let fallbackText = "I am focusing my energy inward right now. Take a deep, gentle breath, stand tall, relax your shoulders, and let your hands float up slowly. How does your body feel at this exact moment?";

  if (lastUserMessage.includes("knee") || lastUserMessage.includes("pain") || lastUserMessage.includes("joint")) {
    fallbackText = "In Tai Chi, joint pain is often a sign of blocked energy or improper structural alignment. *Gentle Adjustment:* When standing, ensure your knees are unlocked and pointing in the exact same direction as your toes. Never let your knees bend past your toes. Keep your weight settled mainly in your heels. Remember to listen to your body and consult a physician for persistent issues. Let's try 'Wave Hands Like Clouds' with a very shallow stance today.";
  } else if (lastUserMessage.includes("sleep") || lastUserMessage.includes("night") || lastUserMessage.includes("bed")) {
    fallbackText = "To prepare for deep, restful sleep, we must draw the warm energy down from our busy minds into our feet. Try 'Embrace Tiger, Return to Mountain' for 3 minutes before sleeping. Focus on making your exhalations twice as long as your inhalations, feeling your body sink softly into the earth with every release.";
  } else if (lastUserMessage.includes("stress") || lastUserMessage.includes("anxious") || lastUserMessage.includes("anxiety")) {
    fallbackText = "When anxiety feels heavy, visualize your breath as slow, circular waves. Let's pause, place one hand on your belly (the Dantien), inhale softly for 4 seconds, and exhale for 6 seconds. Let any external tension sweep past you, just like 'Grasping the Bird's Tail'. You are safe and grounded here.";
  } else if (lastUserMessage.includes("posture") || lastUserMessage.includes("back") || lastUserMessage.includes("neck")) {
    fallbackText = "Excellent awareness. Correct posture is the foundation of free-flowing energy. Imagine a golden thread gently lifting the crown of your head upward, lengthening your spine. Let your tailbone hang straight down, tucked slightly, while your shoulders roll backward and melt downward. Let's practice 'White Crane Spreads Wings' to open the chest.";
  }

  return fallbackText;
}

