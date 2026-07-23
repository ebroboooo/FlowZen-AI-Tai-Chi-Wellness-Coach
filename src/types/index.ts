/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserGoals {
  name: string;
  focusArea: string;
  experienceLevel: string;
  dailyMinutesTarget: number;
  age: string;
  gender: string;
  height: string;
  weight: string;
  country: string;
  language: string;
  timezone: string;
  goalsList: string[];
  reminderTime: string;
  onboardingCompleted?: boolean;
  limitations?: string[];
  reminderPreference?: boolean;
}

export interface ExerciseStep {
  id: number;
  instruction: string;
  focus: string;
  durationSeconds: number;
}

export interface Exercise {
  id: string;
  title: string;
  chineseName: string;
  pronunciation: string;
  tagline: string;
  outcomeCategory: 'sleep' | 'joints' | 'balance' | 'stress' | 'posture';
  benefits: string[];
  steps: ExerciseStep[];
  difficulty: 'Gentle' | 'Moderate' | 'Deep';
  breathingPacing: string; // e.g. "Inhale 4s, Hold 4s, Exhale 6s"
  color: string; // Tailwind color class for ambient glow
  caloriesEstimated: number;
  targetBodyParts: string[];
  musclesInvolved: string[];
  contraindications: string[];
  safetyNotes: string;
  cooldownInstruction: string;
  commonMistakes: string[];
  regression: string;
  progression: string;
  masteryScore: number;
}

export interface SessionLog {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  durationMinutes: number;
  mindfulnessRating: number; // 1 to 5
  timestamp: string; // ISO String
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  mood: 'calm' | 'peaceful' | 'energetic' | 'anxious' | 'tired' | 'stiff' | string;
  stressLevel: number; // 1 to 10
  energyLevel: number; // 1 to 10
  sleepQuality: number; // 1 to 10
  painLevel: number; // 0 to 10
  painArea: string;
  notes: string;
  bodyFeeling?: string;
  afterPracticeFeeling?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface GardenItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
}

export interface GardenState {
  level: number;
  xp: number;
  unlockedItems: string[];
  placedItems: GardenItem[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string; // ISO string
}

export interface LocalDataPayload {
  userGoals: UserGoals | null;
  logs: SessionLog[];
  journal: JournalEntry[];
  garden: GardenState | null;
  achievements: Achievement[];
}

export type ElementalType = 'air' | 'fire' | 'water' | 'earth';
export type AvatarStyle = 'flowing' | 'powerful' | 'balanced' | 'grounded';

export interface ParticleConfig {
  particleType: string;
  density: number;
  speed: number;
  lifetime: number;
  intensity: number;
}

export interface SoundscapeConfig {
  ambientType: string;
  breathingStyle: string;
  intensity: number;
}

export interface ElementalThemeConfig {
  id: ElementalType;
  name: string;
  tagline: string;
  description: string;
  avatarStyle: AvatarStyle;
  visuals: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    glowColor: string;
    particleConfig: ParticleConfig;
  };
  soundscape: SoundscapeConfig;
  environmentMood: {
    name: string;
    description: string;
    ambientColor: string;
    fogDensity: number;
  };
  avatarGuidanceStyle: {
    movementCadence: string;
    breathingFocus: string;
    guidancePromptPrefix: string;
  };
}

export interface Movement {
  id: string;
  name: string;
  traditionalName?: string;
  description: string;
  benefits: string;
  breathingPattern: string;
  commonMistakes: string[];
  safetyNotes: string;
  frontAnimationPlaceholderId: string;
  sideAnimationPlaceholderId: string;
  element?: ElementalType;
  avatarStyle?: AvatarStyle;
  environmentTheme?: string;
  soundscape?: SoundscapeConfig;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  targetAreas: string[];
  requiredExperience: string;
  movements: Movement[];
  element?: ElementalType;
  avatarStyle?: AvatarStyle;
  environmentTheme?: string;
  soundscape?: SoundscapeConfig;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  focus: string[];
  levels: {
    Beginner: Lesson[];
    Intermediate: Lesson[];
    Advanced: Lesson[];
  };
  element?: ElementalType;
  avatarStyle?: AvatarStyle;
  environmentTheme?: string;
  soundscape?: SoundscapeConfig;
}

export interface Joint {
  x: number;
  y: number;
}

export interface SkeletonPose {
  head: Joint;
  neck: Joint;
  leftShoulder: Joint;
  rightShoulder: Joint;
  leftElbow: Joint;
  rightElbow: Joint;
  leftWrist: Joint;
  rightWrist: Joint;
  leftHip: Joint;
  rightHip: Joint;
  leftKnee: Joint;
  rightKnee: Joint;
  leftAnkle: Joint;
  rightAnkle: Joint;
}

export interface AnimationFrame {
  front: SkeletonPose;
  side: SkeletonPose;
}



