/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Trees, 
  Play, 
  ChevronRight, 
  Award, 
  Compass, 
  Sun,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { useGardenStore, GARDEN_STAGES } from '@/store/useGardenStore';
import { usePracticeStore } from '@/store/usePracticeStore';
import { useStore } from '@/store/useStore';
import { programs } from '@/data/curriculumData';
import { Lesson } from '@/types';

interface DailyRewardCardProps {
  onNavigateToGarden?: () => void;
  onNavigateToPractice?: () => void;
}

export default function DailyRewardCard({ onNavigateToGarden, onNavigateToPractice }: DailyRewardCardProps) {
  const { userGoals } = useStore();
  const { streak, isTodayCompleted, getTodayProgress, getDailyIntention } = useProgressStore();
  const { level: gardenLevel, xp: gardenXp } = useGardenStore();
  const { startPractice } = usePracticeStore();

  const isCompleted = isTodayCompleted();
  const dailyIntention = getDailyIntention();
  const targetMinutes = userGoals.dailyMinutesTarget || 15;
  const todayProgress = getTodayProgress(targetMinutes);

  // Find today's recommended lesson based on user focus area
  const recommendedLesson: Lesson | null = useMemo(() => {
    const foundProgram = programs.find(p => p.id === userGoals.focusArea) || programs[0];
    const beginnerLessons = foundProgram.levels.Beginner || [];
    return beginnerLessons[0] || null;
  }, [userGoals.focusArea]);

  // Determine next garden reward/unlock threshold
  const nextStage = useMemo(() => {
    const sorted = [...GARDEN_STAGES].sort((a, b) => a.xpThreshold - b.xpThreshold);
    return sorted.find(s => s.xpThreshold > gardenXp) || sorted[sorted.length - 1];
  }, [gardenXp]);

  const xpProgressPercent = useMemo(() => {
    if (!nextStage) return 100;
    const prevThreshold = nextStage.xpThreshold > 50 ? nextStage.xpThreshold - 150 : 0;
    const range = Math.max(1, nextStage.xpThreshold - prevThreshold);
    const currentInLevel = Math.max(0, gardenXp - prevThreshold);
    return Math.min(100, Math.round((currentInLevel / range) * 100));
  }, [gardenXp, nextStage]);

  return (
    <div 
      id="daily-journey-card-root"
      className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden text-left"
    >
      {/* Top Banner: Status Badge + Daily Streak */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100/90 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
              <span>Today's Journey Accomplished</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100/80 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>What Should I Do Today?</span>
            </span>
          )}
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-3.5 py-1.5 rounded-2xl text-xs font-semibold text-stone-800">
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span>{streak} Day Practice Streak</span>
        </div>
      </div>

      {/* Main Intention & Recommendation Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Intention & Practice Card */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Daily Somatic Intention
            </span>
            <h3 className="font-serif text-xl font-normal text-stone-900 flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-800" />
              <span>{dailyIntention.title}</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100 mt-2">
              "{dailyIntention.quote}"
            </p>
          </div>

          {/* Practice Recommendation */}
          {recommendedLesson && (
            <div className="p-4 bg-emerald-950/5 border border-emerald-900/10 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-950 flex items-center gap-1">
                  <Sun className="h-3.5 w-3.5 text-amber-600" />
                  <span>{recommendedLesson.title}</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  {targetMinutes} Mins Target
                </span>
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                {recommendedLesson.description}
              </p>
            </div>
          )}
        </div>

        {/* Right: Sanctuary Growth Preview & Reward Goal */}
        <div className="md:col-span-5 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-stone-100 rounded-2xl p-5 space-y-4 border border-stone-700/50 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1">
                <Trees className="h-3.5 w-3.5" /> Sanctuary Reward
              </span>
              <span className="text-[10px] font-medium text-stone-300">
                Level {gardenLevel}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-200 block">
                Next Garden Unlock
              </span>
              <p className="text-[11px] text-emerald-200/90 font-serif mt-0.5">
                {nextStage?.name || 'Full Bloom Sanctuary'}
              </p>
              <span className="text-[10px] text-stone-400 block mt-1">
                {nextStage?.unlockCondition || 'Accumulate Qi XP'}
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                <span>{gardenXp} Qi XP</span>
                <span>Target: {nextStage?.xpThreshold || 500} XP</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
                <motion.div 
                  className="bg-emerald-400 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgressPercent}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-700/60 flex items-center justify-between text-[10px] text-stone-300">
            <span>Completion Bonus:</span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Award className="h-3.5 w-3.5" /> +50 Qi XP & Streak +1
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer Button (Mobile-first large touch target >= 44px height) */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
        <div className="text-xs text-stone-500 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span>
            {isCompleted 
              ? 'Your physical mindfulness practice was logged for today.' 
              : `Completing today's ${targetMinutes}-minute session nurtures your living garden.`}
          </span>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-3">
          {isCompleted && onNavigateToGarden && (
            <button
              id="daily-reward-visit-garden-btn"
              onClick={onNavigateToGarden}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-stone-200"
            >
              <Trees className="h-4 w-4 text-emerald-800" />
              <span>Visit Sanctuary</span>
            </button>
          )}

          {recommendedLesson && (
            <button
              id="daily-reward-start-practice-btn"
              onClick={() => {
                if (onNavigateToPractice) {
                  startPractice(recommendedLesson);
                } else {
                  startPractice(recommendedLesson);
                }
              }}
              className={`w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] ${
                isCompleted 
                  ? 'bg-stone-900 hover:bg-stone-800 text-white shadow-stone-900/10' 
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-emerald-950/10'
              }`}
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{isCompleted ? 'Practice Again Today' : "Begin Today's Practice"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
