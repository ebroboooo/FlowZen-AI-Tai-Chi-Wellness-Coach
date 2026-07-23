/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [fadeState, setFadeState] = useState<'entering' | 'visible' | 'exiting'>('entering');

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Transition timer
    const visibleTimer = setTimeout(() => {
      setFadeState('visible');
    }, 100);

    const autoAdvanceTimer = setTimeout(() => {
      handleComplete();
    }, prefersReducedMotion ? 1200 : 2800);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(autoAdvanceTimer);
    };
  }, []);

  const handleComplete = () => {
    setFadeState('exiting');
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#fbf9f5] text-stone-800 p-6 sm:p-10 transition-opacity duration-500 ease-in-out ${
        fadeState === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top decorative spacing */}
      <div className="w-full flex justify-between items-center text-xs text-stone-400 font-serif tracking-widest uppercase">
        <span className="flex items-center gap-1.5 text-stone-500">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Somatic Tai Chi & Qigong
        </span>
        <button
          id="splash-skip-btn"
          onClick={handleComplete}
          className="text-stone-400 hover:text-stone-700 transition-colors flex items-center gap-1 text-[11px] font-sans font-medium px-2.5 py-1 rounded-full bg-stone-100/80 hover:bg-stone-200/60"
        >
          Skip <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Main Lotus Emblem & Breathing Concept */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto my-auto">
        <div className="relative flex items-center justify-center">
          {/* Outer Breathing Aura Ring */}
          <div className="absolute w-32 h-32 rounded-full bg-emerald-200/40 animate-ping-slow pointer-events-none" />
          <div className="absolute w-24 h-24 rounded-full bg-amber-100/50 animate-pulse pointer-events-none" />

          {/* Lotus / Compass Icon Badge */}
          <div className="relative w-20 h-20 rounded-3xl bg-emerald-900 text-stone-100 flex items-center justify-center shadow-xl shadow-emerald-900/10 border border-emerald-800/40 transform transition-transform duration-700 hover:scale-105">
            <svg
              className="w-10 h-10 text-emerald-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Organic Lotus petals */}
              <path d="M12 2C12 2 8 8 8 13C8 16 10 18 12 18C14 18 16 16 16 13C16 8 12 2 12 2Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 18C8 18 3 14 3 10C3 7 6 5 9 7C11 8.5 12 11 12 11C12 11 13 8.5 15 7C18 5 21 7 21 10C21 14 16 18 12 18Z" fill="currentColor" fillOpacity="0.1" />
              <circle cx="12" cy="18" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
            FlowZen
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-xs">
            Your living digital sanctuary for somatic movement, physical alignment, and present awareness.
          </p>
        </div>

        {/* Soft CTA Button */}
        <button
          id="splash-enter-btn"
          onClick={handleComplete}
          className="mt-4 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-stone-900/10 flex items-center gap-2 group hover:scale-[1.02]"
        >
          <span>Enter Sanctuary</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Footer copyright / subtle note */}
      <div className="text-center text-[10px] text-stone-400 font-light">
        FlowZen • AI-Powered Somatic Physical Mindfulness
      </div>
    </div>
  );
}
