/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore, UserGoals } from '@/store/useStore';
import { analytics } from '@/utils/analytics';
import { 
  Compass, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Wind, 
  Flame, 
  Droplets, 
  Mountain,
  Heart,
  Shield,
  Clock,
  Award,
  Trees
} from 'lucide-react';
import { ElementalType } from '@/types';

interface OnboardingProps {
  onComplete: () => void;
  onStartPractice?: () => void;
}

const ELEMENTAL_OPTIONS: { id: ElementalType; name: string; tagline: string; description: string; icon: any; color: string; bg: string }[] = [
  {
    id: 'air',
    name: 'Air Pathway',
    tagline: 'Clarity & Deep Breath',
    description: 'Light, expansive breathing forms that clear mental fog and lengthen posture.',
    icon: Wind,
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200'
  },
  {
    id: 'water',
    name: 'Water Pathway',
    tagline: 'Flow & Joint Mobility',
    description: 'Continuous, wave-like movements designed to lubricate stiffness and restore fluid grace.',
    icon: Droplets,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: 'fire',
    name: 'Fire Pathway',
    tagline: 'Energy & Vitality',
    description: 'Dynamic, focused stances that generate internal warmth and metabolic vigor.',
    icon: Flame,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200'
  },
  {
    id: 'earth',
    name: 'Earth Pathway',
    tagline: 'Grounding & Stability',
    description: 'Deep, rooted stances and slow weight shifts that restore physical balance and calm.',
    icon: Mountain,
    color: 'text-stone-700',
    bg: 'bg-stone-100 border-stone-300'
  }
];

const GOAL_OPTIONS = [
  { id: 'stress', title: 'Stress Relief & Anxiety', desc: 'Calm the nervous system through diaphragmatic breathing.', icon: Heart },
  { id: 'posture', title: 'Posture & Spine Alignment', desc: 'Lengthen the back and decompress neck & shoulder tension.', icon: Shield },
  { id: 'joints', title: 'Joint Mobility & Pain Relief', desc: 'Protect knees, hips, and elbows with gentle circular flow.', icon: Droplets },
  { id: 'balance', title: 'Physical Balance & Rooting', desc: 'Strengthen ankle stability and ground bodily weight.', icon: Mountain }
];

export default function Onboarding({ onComplete, onStartPractice }: OnboardingProps) {
  const { userGoals, setUserGoals } = useStore();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(userGoals.name || '');
  const [selectedGoal, setSelectedGoal] = useState<string>(userGoals.focusArea || 'stress');
  const [experienceLevel, setExperienceLevel] = useState<string>(userGoals.experienceLevel || 'beginner');
  const [dailyMinutes, setDailyMinutes] = useState<number>(userGoals.dailyMinutesTarget || 10);
  const [elementalChoice, setElementalChoice] = useState<ElementalType>('air');

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const finishOnboarding = (startPracticeDirectly: boolean = false) => {
    const updatedGoals: Partial<UserGoals> = {
      name: name.trim() || 'Zen Practitioner',
      focusArea: selectedGoal,
      experienceLevel,
      dailyMinutesTarget: dailyMinutes,
      goalsList: [selectedGoal, elementalChoice],
    };
    
    // Save to store
    setUserGoals(updatedGoals);
    
    // Save completion flag in localStorage
    try {
      localStorage.setItem('fz_onboarding_completed', 'true');
      analytics.track('onboarding_completed', { name: name.trim(), focusArea: selectedGoal });
    } catch {
      // Storage fallback
    }

    if (startPracticeDirectly && onStartPractice) {
      onStartPractice();
    } else {
      onComplete();
    }
  };

  return (
    <div id="onboarding-screen" className="min-h-screen bg-[#faf8f5] flex flex-col justify-between p-4 sm:p-8 max-w-2xl mx-auto font-sans">
      {/* Header / Progress Bar */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-serif text-stone-900 font-semibold tracking-tight text-sm flex items-center gap-2">
            <Compass className="h-4 w-4 text-emerald-700" /> FlowZen Onboarding
          </span>
          <span>Step {step} of 5</span>
        </div>

        {/* Visual Progress Steps */}
        <div className="flex gap-1.5 h-1.5 w-full bg-stone-200/60 rounded-full overflow-hidden">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? 'bg-emerald-800' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="my-auto py-8">
        {/* Step 1: User Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-block">
                Welcome Practitioner
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
                How should we address you in your sanctuary?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                Your AI Somatic Coach uses this to personalize daily guidance and session debriefs.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="user-name-input" className="text-xs font-semibold text-stone-700 block">
                Your Name or Preferred Title
              </label>
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ebram, Zen Seeker, Master Ebram"
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-700 shadow-xs transition-all"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 2: Wellness Goals */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-block">
                Personal Intentions
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
                What brings you to physical practice today?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                Select your primary focus area. We will tailor movement forms to your goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOAL_OPTIONS.map((g) => {
                const IconComponent = g.icon;
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-stone-900 shadow-sm ring-1 ring-stone-900'
                        : 'bg-white/80 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-emerald-700" />}
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-normal text-stone-900">{g.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{g.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Experience & Pacing */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-block">
                Experience & Routine
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
                Set your movement pace and daily goal
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                FlowZen adapts to your current level. No prior flexibility or Tai Chi experience required.
              </p>
            </div>

            {/* Experience Tiers */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Gentle Beginner', sub: 'New to Tai Chi' },
                  { id: 'intermediate', label: 'Moderate Flow', sub: 'Some practice' },
                  { id: 'advanced', label: 'Deep Master', sub: 'Experienced' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setExperienceLevel(tier.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      experienceLevel === tier.id
                        ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{tier.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${experienceLevel === tier.id ? 'text-stone-300' : 'text-stone-400'}`}>
                      {tier.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Target Minutes */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Daily Practice Target: <strong className="text-emerald-800">{dailyMinutes} minutes/day</strong>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDailyMinutes(mins)}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      dailyMinutes === mins
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Personal Sanctuary Creation */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-block">
                Elemental Sanctuary Alignment
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
                Choose your starting elemental path
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                This shapes your initial garden environment, music soundscapes, and practice focus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ELEMENTAL_OPTIONS.map((elem) => {
                const IconComponent = elem.icon;
                const isSelected = elementalChoice === elem.id;
                return (
                  <button
                    key={elem.id}
                    onClick={() => setElementalChoice(elem.id)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? `${elem.bg} border-2 shadow-xs`
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${elem.color}`}>
                        {elem.tagline}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-serif text-sm font-semibold text-stone-900">{elem.name}</h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{elem.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: First Practice Invitation */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/10">
              <Trees className="h-8 w-8 text-emerald-300" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-block">
                Sanctuary Initialized
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
                Welcome, {name || 'Zen Practitioner'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                Your living garden is ready to bloom with your practice. Begin your first 3-minute somatic session now or explore your dashboard.
              </p>
            </div>

            {/* Selection Summary Badge */}
            <div className="p-4 bg-white border border-stone-200 rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between text-stone-600 border-b border-stone-100 pb-2">
                <span>Primary Goal</span>
                <strong className="text-stone-900 capitalize">{selectedGoal}</strong>
              </div>
              <div className="flex justify-between text-stone-600 border-b border-stone-100 pb-2">
                <span>Elemental Alignment</span>
                <strong className="text-emerald-800 capitalize">{elementalChoice} Pathway</strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Daily Goal</span>
                <strong className="text-stone-900">{dailyMinutes} minutes / day</strong>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                id="onboarding-start-practice-btn"
                onClick={() => finishOnboarding(true)}
                className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 group"
              >
                <Sparkles className="h-4 w-4" />
                <span>Begin First Somatic Session (3 Min)</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                id="onboarding-go-home-btn"
                onClick={() => finishOnboarding(false)}
                className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
              >
                Go to Home Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer Controls (Steps 1-4) */}
      {step < 5 && (
        <div className="flex items-center justify-between pt-4 border-t border-stone-200/60">
          <button
            id="onboarding-back-btn"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl transition-all ${
              step === 1
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>

          <button
            id="onboarding-next-btn"
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs font-semibold px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-xs"
          >
            Continue <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
