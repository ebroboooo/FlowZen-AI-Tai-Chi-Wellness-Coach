/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useGardenStore, GARDEN_STAGES } from '@/store/useGardenStore';
import { useCoachStore } from '@/store/useCoachStore';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import { usePracticeStore } from '@/store/usePracticeStore';
import DailyRewardCard from '@/components/daily/DailyRewardCard';
import AiMasterMessageCard from '@/components/daily/AiMasterMessageCard';
import { programs } from '@/data/curriculumData';
import { 
  Compass, 
  Trees, 
  Award, 
  Flame, 
  Sparkles, 
  Clock, 
  Play, 
  ChevronRight, 
  Bot, 
  Sun, 
  Moon, 
  CloudSun,
  ShieldCheck,
  Heart,
  Droplets,
  Wind
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: 'practice' | 'garden' | 'progress') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { userGoals } = useStore();
  const { streak, minutes, getMasteryProfile } = useProgressStore();
  const { level: gardenLevel, xp: gardenXp, weather } = useGardenStore();
  const { messages } = useCoachStore();
  const { startPractice } = usePracticeStore();

  const mastery = getMasteryProfile();

  // Time of day greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun };
    if (hour < 18) return { text: 'Good Afternoon', icon: CloudSun };
    return { text: 'Good Evening', icon: Moon };
  }, []);

  const GreetingIcon = greeting.icon;

  // Find a recommended lesson based on user's focus area or first program
  const recommendedLesson = useMemo(() => {
    const foundProgram = programs.find(p => p.id === userGoals.focusArea) || programs[0];
    const beginnerLessons = foundProgram.levels.Beginner || [];
    return beginnerLessons[0] || null;
  }, [userGoals.focusArea]);

  // AI Coach Wisdom message (use latest model response or default quote)
  const coachWisdom = useMemo(() => {
    const modelMessages = messages.filter(m => m.role === 'model');
    if (modelMessages.length > 0) {
      return modelMessages[modelMessages.length - 1].text.slice(0, 180) + '...';
    }
    return "Stand comfortably with your feet shoulder-width apart. Let your crown reach upward toward the sky while your shoulders sink into the earth like warm water.";
  }, [messages]);

  // Get active garden stage details
  const currentStage = GARDEN_STAGES.find(s => s.level === gardenLevel) || GARDEN_STAGES[0];

  return (
    <div id="home-dashboard" className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
            <GreetingIcon className="h-4 w-4 text-amber-600" />
            <span>{greeting.text}</span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-800 font-semibold">{mastery.unlockedTitles[0] || mastery.currentLevel} Tier</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-stone-900 tracking-tight">
            Welcome, {userGoals.name || 'Zen Practitioner'}
          </h1>
          <p className="text-xs text-stone-500 max-w-xl leading-relaxed">
            Your body and living sanctuary await today's physical mindfulness practice.
          </p>
        </div>

        {/* Header Quick Stats */}
        <div className="flex items-center gap-3 bg-white border border-stone-200/80 rounded-2xl p-3 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 px-3 border-r border-stone-100">
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            <div>
              <span className="block text-[10px] text-stone-400 uppercase font-bold">Streak</span>
              <strong className="text-stone-900">{streak} Days</strong>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 border-r border-stone-100">
            <Clock className="h-4 w-4 text-emerald-600" />
            <div>
              <span className="block text-[10px] text-stone-400 uppercase font-bold">Practice</span>
              <strong className="text-stone-900">{minutes} Mins</strong>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3">
            <Award className="h-4 w-4 text-amber-600" />
            <div>
              <span className="block text-[10px] text-stone-400 uppercase font-bold">Mastery</span>
              <strong className="text-stone-900">{mastery.currentLevel}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Today's Daily Journey & AI Master Companion Message */}
      <div className="space-y-6">
        <AiMasterMessageCard onOpenCoachModal={() => onNavigate('practice')} />

        <DailyRewardCard 
          onNavigateToGarden={() => onNavigate('garden')}
          onNavigateToPractice={() => onNavigate('practice')}
        />
      </div>

      {/* Grid Row 2: AI Coach Guidance & Foundational Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Somatic Coach Guidance Card */}
        <div className="lg:col-span-5 bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-800 text-stone-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-amber-200" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-stone-900">AI Somatic Coach Wisdom</h4>
              <span className="text-[10px] text-stone-500">Real-time Biomechanical & Posture Guidance</span>
            </div>
          </div>

          <p className="text-xs text-stone-700 italic leading-relaxed bg-white/80 p-4 rounded-2xl border border-amber-100">
            "{coachWisdom}"
          </p>

          <button
            id="home-open-practice-coach-btn"
            onClick={() => onNavigate('practice')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors pt-1"
          >
            Open Somatic Practice Player <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Practice Curriculum Pathways Card */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-serif text-base font-normal text-stone-900">
              Foundational Tai Chi Pathways
            </h4>
            <button
              id="home-view-all-curriculum-btn"
              onClick={() => onNavigate('practice')}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {programs.slice(0, 2).map((prog) => (
              <div
                key={prog.id}
                onClick={() => onNavigate('practice')}
                className="p-4 rounded-2xl border border-stone-100 hover:border-stone-300 bg-stone-50/50 hover:bg-white transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-emerald-100/60 text-emerald-800">
                    <Compass className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400 group-hover:text-stone-700">
                    Explore Pathway
                  </span>
                </div>
                <div>
                  <h5 className="font-serif text-sm font-semibold text-stone-900">{prog.title}</h5>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{prog.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
