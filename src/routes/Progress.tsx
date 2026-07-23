/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Flame, Clock, Compass, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import { calculateNextMilestone } from '@/utils/masteryCalculations';

export default function Progress() {
  const { getMasteryProfile, streak } = useProgressStore();
  const { completedLessons } = useCurriculumStore();
  
  const profile = getMasteryProfile();
  const milestone = calculateNextMilestone(profile);

  return (
    <div id="progress-container" className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 uppercase tracking-wider">
              {profile.currentLevel} Path
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-medium text-stone-500">{profile.unlockedTitles[0] || 'Novice Seeker'}</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-stone-900 tracking-tight">Somatic Mastery</h1>
          <p className="text-xs text-stone-500 max-w-xl">
            Track your elemental balance, posture alignment, practice streak, and physical cultivation journey.
          </p>
        </div>

        {/* Level XP Card */}
        <div className="bg-stone-900 text-white p-4 rounded-3xl min-w-[260px] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400 font-medium">Rank Progress</span>
            <span className="font-semibold text-emerald-400">{profile.xp} total XP</span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${profile.levelProgressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>Level: {profile.currentLevel}</span>
            <span>Target: {profile.nextLevelXp} XP</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-stone-200/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="font-serif text-2xl font-semibold text-stone-900">{streak} Days</div>
          <span className="text-[10px] text-stone-500 block">Active daily mindfulness</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Practice Time</span>
            <Clock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-stone-900">{profile.totalPracticeMinutes} mins</div>
          <span className="text-[10px] text-stone-500 block">Total somatic movement</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Postural Accuracy</span>
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="font-serif text-2xl font-semibold text-stone-900">{profile.movementAccuracy}%</div>
          <span className="text-[10px] text-stone-500 block">Biomechanical precision</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-stone-200/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Form Mastered</span>
            <Award className="h-4 w-4 text-rose-500" />
          </div>
          <div className="font-serif text-2xl font-semibold text-stone-900">{completedLessons.length} Forms</div>
          <span className="text-[10px] text-stone-500 block">Completed lesson modules</span>
        </div>
      </div>

      {/* Elemental Balance Progress & Milestone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Elemental Paths */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/60 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-serif text-lg font-normal text-stone-900">4 Elemental Paths</h3>
              <p className="text-xs text-stone-500">Cultivate harmony across Air, Water, Fire, and Earth somatic qualities.</p>
            </div>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>

          <div className="space-y-4">
            {[
              { key: 'air', label: 'Air Path (Breath & Flow)', score: profile.elementMastery.air, color: 'bg-sky-500' },
              { key: 'water', label: 'Water Path (Fluid Transitions)', score: profile.elementMastery.water, color: 'bg-cyan-500' },
              { key: 'fire', label: 'Fire Path (Energy Expression)', score: profile.elementMastery.fire, color: 'bg-amber-500' },
              { key: 'earth', label: 'Earth Path (Root Stability)', score: profile.elementMastery.earth, color: 'bg-emerald-600' }
            ].map((elem) => (
              <div key={elem.key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>{elem.label}</span>
                  <span>{elem.score}/100</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${elem.score}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-2.5 rounded-full ${elem.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
            <span className="font-semibold text-stone-800 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Guide Insight
            </span>
            <p className="text-stone-600 leading-relaxed">{profile.suggestedFocus}</p>
          </div>
        </div>

        {/* Right: Milestone & Titles */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 text-stone-100 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Compass className="h-4 w-4" /> Next Milestone
            </div>
            <h3 className="font-serif text-xl text-white">{milestone.title}</h3>
            <p className="text-xs text-stone-300 leading-relaxed">{milestone.requirement}</p>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${milestone.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/60 space-y-4">
            <h4 className="font-serif text-base text-stone-900 font-normal">Unlocked Somatic Titles</h4>
            <div className="flex flex-wrap gap-2">
              {profile.unlockedTitles.map((title, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-full flex items-center gap-1.5"
                >
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  {title}
                </span>
              ))}
            </div>
          </div>

          {/* Premium AI Master Foundation Card (Placeholder preview) */}
          <div className="bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/20 rounded-3xl p-6 text-stone-100 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-amber-100">AI Master Premium Foundation</h4>
                  <span className="text-[10px] text-stone-400">Future Mastery Capabilities</span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Preview
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Future releases of FlowZen expand your personal AI Master companion with deep biomechanical tools:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                <span className="font-semibold text-amber-200 block text-[11px]">1. Advanced AI Guidance</span>
                <p className="text-[10px] text-stone-400 leading-normal">
                  Real-time conversational voice instruction synchronized with active diaphragmatic breath loops.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                <span className="font-semibold text-amber-200 block text-[11px]">2. Deeper Movement Analysis</span>
                <p className="text-[10px] text-stone-400 leading-normal">
                  3D Skeleton trajectory tracking with joint angle feedback and knee overload protection.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                <span className="font-semibold text-amber-200 block text-[11px]">3. Personalized Programs</span>
                <p className="text-[10px] text-stone-400 leading-normal">
                  Dynamic multi-week curriculum auto-generated from your daily physical check-in logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
