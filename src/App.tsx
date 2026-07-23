/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Home from '@/routes/Home';
import Practice from '@/routes/Practice';
import Garden from '@/routes/Garden';
import Progress from '@/routes/Progress';
import Splash from '@/components/Splash';
import Onboarding from '@/components/Onboarding';
import { Compass, Trees, Award, Flame, Home as HomeIcon } from 'lucide-react';
import { useProgressStore } from '@/store/useProgressStore';
import { useStore } from '@/store/useStore';
import { analytics } from '@/utils/analytics';

export default function App() {
  const { userGoals } = useStore();
  const { streak } = useProgressStore();

  const [activeTab, setActiveTab] = useState<'home' | 'practice' | 'garden' | 'progress'>('home');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const completed = localStorage.getItem('fz_onboarding_completed');
        if (completed === 'true') return false;
      }
      return !userGoals.onboardingCompleted;
    } catch {
      return false;
    }
  });

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={() => {
          setShowOnboarding(false);
          setActiveTab('home');
        }}
        onStartPractice={() => {
          setShowOnboarding(false);
          setActiveTab('practice');
        }}
      />
    );
  }

  return (
    <div id="app-root" className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col font-sans antialiased">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/60 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo / Title */}
          <button
            id="app-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-stone-100 flex items-center justify-center shadow-sm">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-normal text-stone-900 tracking-tight">FlowZen</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  AI Somatic Coach
                </span>
              </div>
              <p className="text-[10px] text-stone-500 hidden sm:block">Mindful Tai Chi, Qigong & Elemental Garden Sanctuary</p>
            </div>
          </button>

          {/* Tab Navigation */}
          <nav className="flex items-center bg-stone-200/60 p-1 rounded-2xl gap-1">
            <button
              id="tab-home"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <HomeIcon className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Home</span>
            </button>

            <button
              id="tab-practice"
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'practice'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-emerald-800" />
              <span>Practice</span>
            </button>

            <button
              id="tab-garden"
              onClick={() => {
                setActiveTab('garden');
                analytics.track('garden_visited');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'garden'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Trees className="h-3.5 w-3.5 text-emerald-700" />
              <span>Garden</span>
            </button>

            <button
              id="tab-progress"
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'progress'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-600" />
              <span>Mastery</span>
            </button>
          </nav>

          {/* Right Streak Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs font-semibold text-amber-800">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{streak} Day Streak</span>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && <Home onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'practice' && <Practice />}
        {activeTab === 'garden' && <Garden />}
        {activeTab === 'progress' && <Progress />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-4 px-4 text-center text-[11px] text-stone-400">
        <p>FlowZen • AI-Powered Somatic Tai Chi & Physical Mindfulness Sanctuary</p>
      </footer>
    </div>
  );
}
