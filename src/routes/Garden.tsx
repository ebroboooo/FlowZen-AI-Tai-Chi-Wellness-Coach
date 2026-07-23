/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useGardenStore, GARDEN_STAGES } from '@/store/useGardenStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import {
  Sparkles,
  Lock,
  CheckCircle,
  HelpCircle,
  Clock,
  Compass,
  Info,
  ChevronRight,
  Sun,
  Moon,
  Wind,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LivingGardenLayer } from '@/components/garden/LivingGardenLayer';
import { getElementalTheme } from '@/data/elementalThemes';
import {
  WeatherState,
  calculatePlantGrowth,
  calculateElementalMonuments,
  getWeatherLighting
} from '@/utils/gardenEvolution';
import { elementalSoundscape } from '@/utils/elementalSoundscape';

// Serene audio synthesis helpers for interactive sanctuary objects
function playSereneChime(frequency: number = 440) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.6);
  } catch {}
}
function playWaterSplashSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch {}
}

function playFlowerChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.8);
    });
  } catch {}
}

function playAnimalChirpSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {}
}

function playLanternBellSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.0);
  } catch {}
}

// Gentle raking sweep sound simulation
function playRakingSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Create a sweep of soft, warm frequencies
    const freqs = [220, 277, 330, 440];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 0.5);

      osc.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.15);
      osc.stop(ctx.currentTime + idx * 0.15 + 0.5);
    });
  } catch (err) {
    console.error('Sweep synthesis failed: ', err);
  }
}

type RakePattern = 'waves' | 'concentric' | 'spiral';
type Atmosphere = 'dawn' | 'daylight' | 'dusk' | 'twilight';

const ATMOSPHERES: Record<Atmosphere, {
  name: string;
  bgGradient: string;
  mountainFill: string;
  glowingDotsColor: string;
  ambientOpacity: number;
  lanternGlow: string;
}> = {
  dawn: {
    name: 'Amber Dawn',
    bgGradient: 'from-amber-100 via-orange-100 to-stone-200',
    mountainFill: 'fill-orange-800/10',
    glowingDotsColor: 'rgba(251, 191, 36, 0.65)',
    ambientOpacity: 0.15,
    lanternGlow: 'rgba(251, 146, 60, 0.9)'
  },
  daylight: {
    name: 'Gentle Daylight',
    bgGradient: 'from-stone-50 via-stone-100 to-stone-200',
    mountainFill: 'fill-stone-800/5',
    glowingDotsColor: 'rgba(255, 255, 255, 0.75)',
    ambientOpacity: 0.05,
    lanternGlow: 'rgba(253, 224, 71, 0.8)'
  },
  dusk: {
    name: 'Peach Dusk',
    bgGradient: 'from-rose-100 via-purple-100 to-stone-200',
    mountainFill: 'fill-purple-900/10',
    glowingDotsColor: 'rgba(244, 63, 94, 0.5)',
    ambientOpacity: 0.2,
    lanternGlow: 'rgba(251, 146, 60, 0.95)'
  },
  twilight: {
    name: 'Velvet Twilight',
    bgGradient: 'from-indigo-950 via-slate-900 to-stone-950',
    mountainFill: 'fill-indigo-900/15',
    glowingDotsColor: 'rgba(129, 140, 248, 0.7)',
    ambientOpacity: 0.45,
    lanternGlow: 'rgba(253, 224, 71, 1.0)'
  }
};

export default function Garden() {
  const {
    level,
    xp,
    unlockedItems,
    unlockedAtMap,
    activeItem,
    loadGarden,
    setActiveItem
  } = useGardenStore();

  const {
    sessions,
    journalEntries,
    streak,
    minutes,
    loadProgress
  } = useProgressStore();

  const { completedLessons, loadCurriculumProgress } = useCurriculumStore();

  // Settings & Sanctuary States
  const [rakePattern, setRakePattern] = useState<RakePattern>('waves');
  const [atmosphere, setAtmosphere] = useState<Atmosphere>('daylight');
  const [weather, setWeather] = useState<WeatherState>('clear');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isRaking, setIsRaking] = useState(false);
  const [isRealtimeSky, setIsRealtimeSky] = useState(false);
  const [activeTap, setActiveTap] = useState<{ id: number; x: number; y: number; type: 'flower' | 'water' | 'animal' | 'lantern'; timestamp: number } | null>(null);

  // Initialize data
  useEffect(() => {
    const init = async () => {
      await loadProgress();
      await loadGarden();
      if (loadCurriculumProgress) {
        await loadCurriculumProgress();
      }
    };
    init();

    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, [loadProgress, loadGarden, loadCurriculumProgress]);

  // Real-time day/night cycle clock handler
  useEffect(() => {
    if (!isRealtimeSky) return;

    const updateRealtimeSky = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8) setAtmosphere('dawn');
      else if (hour >= 8 && hour < 18) setAtmosphere('daylight');
      else if (hour >= 18 && hour < 20) setAtmosphere('dusk');
      else setAtmosphere('twilight');
    };

    updateRealtimeSky();
    const timer = setInterval(updateRealtimeSky, 60000);
    return () => clearInterval(timer);
  }, [isRealtimeSky]);

  // Handle stage tap interaction (water splash, flower chime, animal chirp, lantern bell)
  const handleStageClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    let tapType: 'flower' | 'water' | 'animal' | 'lantern' = 'flower';

    // Water region: river or pond
    if (y > 370 || (x > 420 && x < 580 && y > 300 && y < 380)) {
      tapType = 'water';
      playWaterSplashSound();
    } else if (x > 300 && x < 340 && y > 280 && y < 360) {
      tapType = 'lantern';
      playLanternBellSound();
    } else if ((x > 580 && y < 380) || (x < 240 && y < 380)) {
      tapType = 'flower';
      playFlowerChime();
    } else {
      tapType = 'animal';
      playAnimalChirpSound();
    }

    setActiveTap({
      id: Date.now(),
      x,
      y,
      type: tapType,
      timestamp: Date.now(),
    });
  };

  const totalSessions = sessions.length;
  const totalJournals = journalEntries.length;
  const totalLessons = completedLessons ? completedLessons.length : 0;

  // Garden Evolution Metrics
  const growth = calculatePlantGrowth(minutes);
  const monumentUnlocks = calculateElementalMonuments({ minutes, streak });

  // Sync Garden Weather Ambience with Elemental Soundscape
  useEffect(() => {
    elementalSoundscape.setWeatherAmbience(weather);
  }, [weather]);

  // Active Selected Item detail calculation
  const selectedStage = activeItem ? GARDEN_STAGES.find((s) => s.id === activeItem) : null;
  const isSelectedUnlocked = activeItem ? unlockedItems.includes(activeItem) : false;

  // Next Milestone determination
  const nextMilestone = GARDEN_STAGES.find((s) => !unlockedItems.includes(s.id));

  // Trigger tactile raking action
  const handleRake = () => {
    if (isRaking) return;
    setIsRaking(true);
    playRakingSound();
    setTimeout(() => {
      setIsRaking(false);
      // Play a peaceful finish chime
      playSereneChime(523.25); // high crisp C5
    }, 1200);
  };

  const handleSelectObject = (id: string, frequency: number) => {
    setActiveItem(id);
    if (unlockedItems.includes(id)) {
      playSereneChime(frequency);
    } else {
      // Soft minor chime for locked objects
      playSereneChime(220); // Low A3
    }
  };

  // Rake path generators for the 800x500 SVG stage
  const renderRakePaths = () => {
    if (rakePattern === 'waves') {
      const paths = [];
      for (let y = 300; y <= 490; y += 18) {
        // Rake straight waves with standard SVG paths
        paths.push(
          <path
            key={y}
            d={`M 0 ${y} Q 100 ${y - 10}, 200 ${y} T 400 ${y} T 600 ${y} T 800 ${y}`}
            fill="none"
            stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}
            strokeWidth="2"
            strokeDasharray="4, 4"
          />
        );
      }
      return paths;
    } else if (rakePattern === 'concentric') {
      // Concentric circles around stones (300, 410) and pond (500, 340)
      return (
        <>
          {/* Circular rings around River Stones */}
          <circle cx="300" cy="410" r="25" fill="none" stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'} strokeWidth="1.5" strokeDasharray="5, 3" />
          <circle cx="300" cy="410" r="45" fill="none" stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'} strokeWidth="1.5" strokeDasharray="5, 3" />
          <circle cx="300" cy="410" r="70" fill="none" stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'} strokeWidth="1.5" strokeDasharray="5, 3" />

          {/* Rings around Lotus Pond */}
          <ellipse cx="500" cy="340" rx="90" ry="50" fill="none" stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'} strokeWidth="1.5" strokeDasharray="6, 3" />
          <ellipse cx="500" cy="340" rx="120" ry="70" fill="none" stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'} strokeWidth="1.5" strokeDasharray="6, 3" />
        </>
      );
    } else {
      // A large majestic spiral curving across the background
      return (
        <path
          d="M 400 380 A 10 10 0 0 1 410 390 A 25 25 0 0 1 390 410 A 55 55 0 0 1 345 365 A 95 95 0 0 1 445 285 A 155 155 0 0 1 555 435 A 225 225 0 0 1 215 475"
          fill="none"
          stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}
          strokeWidth="2.5"
          strokeDasharray="8, 4"
        />
      );
    }
  };

  // Determine active atmosphere properties
  const activeAtmos = ATMOSPHERES[atmosphere];

  return (
    <div className="space-y-8 py-2 md:py-6">
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <h2 className="font-serif text-3xl font-light text-stone-900 flex items-center gap-2">
            Your Zen Sanctuary
            <Sparkles className="h-5 w-5 text-emerald-800 animate-pulse" />
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            A real-time reflection of your somatic progress. Each stone, path, and blossom emerges organically through your devotion to practice and mindful self-reflection.
          </p>
        </div>

        {/* Level Capsule Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/50 shadow-xs self-start md:self-auto">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-800 animate-ping" />
          <span className="text-xs font-semibold text-emerald-800">Garden Sanctuary Level {level}</span>
        </div>
      </div>

      {/* 2. Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left 3 columns: Interactive Canvas Container */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative w-full rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
            
            {/* Ambient Lighting Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${activeAtmos.bgGradient} transition-all duration-1000`}
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Screen Reader Live Announcement Region */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {`Zen Garden Sanctuary Level ${level}. ${isRaking ? 'Raking garden sand...' : ''} ${
                activeItem 
                  ? `Selected element: ${GARDEN_STAGES.find(s => s.id === activeItem)?.name}. ${GARDEN_STAGES.find(s => s.id === activeItem)?.description}` 
                  : 'Select an element in the garden to view details.'
              }`}
            </div>

            {/* Canvas Stage */}
            <svg
              viewBox="0 0 800 500"
              className="w-full h-auto select-none relative z-10 block cursor-crosshair"
              id="zen-garden-svg-stage"
              role="img"
              aria-label={`Interactive Zen Garden stage (Level ${level}) with ${unlockedItems.length} unlocked elements out of ${GARDEN_STAGES.length}`}
              onClick={handleStageClick}
            >
              {/* Ground Sand / Gravel Background */}
              <rect x="0" y="250" width="800" height="250" fill={atmosphere === 'twilight' ? '#1c1917' : '#f5f5f4'} />

              {/* Raked Wave Paths */}
              <g className={`transition-opacity duration-500 ${isRaking ? 'opacity-30' : 'opacity-100'}`}>
                {renderRakePaths()}
              </g>

              {/* Animated Raking Sweep Effect */}
              {isRaking && (
                <motion.path
                  d="M 50 300 Q 200 480 750 320"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.25)"
                  strokeWidth="32"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              )}

              {/* STAGE 9: Mountain Background */}
              {unlockedItems.includes('stage-9') ? (
                <g className="transition-all duration-700">
                  <path d="M 0 350 Q 150 150 350 350 L 350 500 L 0 500 Z" className={`${activeAtmos.mountainFill} transition-all duration-1000`} />
                  <path d="M 220 350 Q 420 110 620 350 L 620 500 L 220 500 Z" className={`${activeAtmos.mountainFill} transition-all duration-1000`} />
                  <path d="M 450 350 Q 620 180 800 350 L 800 500 L 450 500 Z" className={`${activeAtmos.mountainFill} transition-all duration-1000`} />
                </g>
              ) : (
                <g className="opacity-15 pointer-events-none">
                  {/* Faded translucent mountain placeholder */}
                  <path d="M 0 350 Q 150 150 350 350 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                  <path d="M 220 350 Q 420 110 620 350 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                </g>
              )}

              {/* STAGE 3: Pebble Path */}
              {unlockedItems.includes('stage-3') ? (
                <g className="transition-all duration-700">
                  {/* Winding gravel stones leading diagonally */}
                  <path d="M 390 490 Q 380 430, 440 380 T 520 340" fill="none" stroke="#d6d3d1" strokeWidth="24" strokeLinecap="round" />
                  <path d="M 390 490 Q 380 430, 440 380 T 520 340" fill="none" stroke="#a8a29e" strokeWidth="16" strokeLinecap="round" strokeDasharray="2, 10" />
                </g>
              ) : (
                <path d="M 390 490 Q 380 430, 440 380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2, 5" className="opacity-20" />
              )}

              {/* STAGE 6: Lotus Pond */}
              {unlockedItems.includes('stage-6') ? (
                <g className="transition-all duration-700">
                  {/* Blue pond ellipse */}
                  <ellipse cx="500" cy="340" rx="75" ry="40" fill={atmosphere === 'twilight' ? '#1e3a8a' : '#cbd5e1'} className="stroke-stone-300" strokeWidth="2" />
                  {/* Internal water rings */}
                  <ellipse cx="500" cy="340" rx="45" ry="22" fill="none" stroke={atmosphere === 'twilight' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.45)'} strokeWidth="1" />
                  {/* Lily Pad 1 */}
                  <circle cx="475" cy="335" r="12" fill="#15803d" />
                  <polygon points="475,335 487,330 487,340" fill={atmosphere === 'twilight' ? '#1e3a8a' : '#cbd5e1'} />
                  {/* Lily Pad 2 */}
                  <circle cx="530" cy="350" r="10" fill="#166534" />
                  {/* Lotus Flower */}
                  <g transform="translate(472, 323) scale(0.6)">
                    <path d="M 10 15 Q 10 0, 5 10 Q 0 0, 0 15 Z" fill="#f472b6" />
                    <path d="M 5 15 Q 5 2, 0 12 Q -5 2, -5 15 Z" fill="#ec4899" />
                  </g>
                </g>
              ) : (
                <ellipse cx="500" cy="340" rx="75" ry="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4, 4" className="opacity-20" />
              )}

              {/* STAGE 4: Young Bamboo */}
              {unlockedItems.includes('stage-4') ? (
                <motion.g
                  className="transition-all duration-700"
                  animate={!reducedMotion ? { rotate: [-1, 1, -1] } : {}}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  style={{ transformOrigin: '100px 390px' }}
                >
                  {/* Stalk 1 */}
                  <rect x="96" y="240" width="6" height="130" rx="2" fill="#15803d" />
                  <rect x="95" y="270" width="8" height="2" fill="#14532d" />
                  <rect x="95" y="305" width="8" height="2" fill="#14532d" />
                  <rect x="95" y="340" width="8" height="2" fill="#14532d" />
                  {/* Stalk 2 */}
                  <rect x="110" y="210" width="5" height="160" rx="2" fill="#16a34a" />
                  <rect x="109" y="250" width="7" height="2" fill="#14532d" />
                  <rect x="109" y="295" width="7" height="2" fill="#14532d" />
                  {/* Delicate Leaves */}
                  <path d="M 96 260 Q 75 250, 80 262 Z" fill="#22c55e" />
                  <path d="M 102 280 Q 125 270, 118 285 Z" fill="#22c55e" />
                  <path d="M 115 230 Q 135 220, 128 235 Z" fill="#4ade80" />
                </motion.g>
              ) : (
                <g className="opacity-20">
                  <line x1="100" y1="370" x2="100" y2="240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3, 3" />
                  <line x1="112" y1="370" x2="112" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3, 3" />
                </g>
              )}

              {/* STAGE 8: Ancient Bonsai Tree */}
              {unlockedItems.includes('stage-8') ? (
                <g className="transition-all duration-700">
                  {/* Tree Trunk */}
                  <path d="M 200 370 Q 210 320, 175 285 Q 160 270, 185 240 Q 210 215, 180 190" fill="none" stroke="#78350f" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 175 285 Q 230 270, 240 250" fill="none" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
                  {/* Foliage Layers */}
                  <ellipse cx="170" cy="180" rx="35" ry="18" fill="#14532d" />
                  <ellipse cx="205" cy="235" rx="40" ry="20" fill="#166534" />
                  <ellipse cx="245" cy="245" rx="30" ry="16" fill="#15803d" />
                  <ellipse cx="165" cy="285" rx="25" ry="14" fill="#14532d" />
                </g>
              ) : (
                <g className="opacity-20">
                  <path d="M 200 370 Q 210 320, 175 285 Q 160 270, 185 240" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4, 4" />
                  <circle cx="185" cy="240" r="28" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                </g>
              )}

              {/* STAGE 7: Cherry Blossom Tree */}
              {unlockedItems.includes('stage-7') ? (
                <motion.g
                  className="transition-all duration-700"
                  animate={!reducedMotion ? { rotate: [0.5, -0.5, 0.5] } : {}}
                  transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
                  style={{ transformOrigin: '640px 380px' }}
                >
                  {/* Tree Trunk */}
                  <path d="M 640 380 Q 630 320, 660 280 T 630 210" fill="none" stroke="#451a03" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 660 280 Q 700 270, 710 250" fill="none" stroke="#451a03" strokeWidth="7" strokeLinecap="round" />
                  {/* Soft Pink Blossom Clouds */}
                  <ellipse cx="630" cy="200" rx="42" ry="22" fill="#fbcfe8" opacity="0.9" />
                  <ellipse cx="615" cy="210" rx="30" ry="18" fill="#f9a8d4" opacity="0.85" />
                  <ellipse cx="665" cy="195" rx="35" ry="20" fill="#fbcfe8" opacity="0.9" />
                  <ellipse cx="710" cy="245" rx="32" ry="18" fill="#f472b6" opacity="0.85" />
                  <ellipse cx="680" cy="270" rx="25" ry="15" fill="#fbcfe8" opacity="0.8" />
                </motion.g>
              ) : (
                <g className="opacity-20">
                  <path d="M 640 380 Q 630 320, 660 280" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4, 4" />
                  <circle cx="640" cy="210" r="32" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                </g>
              )}

              {/* STAGE 5: Stone Lantern */}
              {unlockedItems.includes('stage-5') ? (
                <g className="transition-all duration-700">
                  {/* Base Pedestal */}
                  <path d="M 312 370 L 328 370 L 324 350 L 316 350 Z" fill="#78716c" />
                  <rect x="314" y="325" width="12" height="25" fill="#a8a29e" />
                  <rect x="306" y="321" width="28" height="4" fill="#57534e" />
                  {/* Glowing Fire Box / Light Window */}
                  <rect x="312" y="303" width="16" height="18" fill="#78716c" />
                  <rect x="315" y="306" width="10" height="12" fill="#fef08a" />
                  {/* Lantern Cap Pagoda Roof */}
                  <path d="M 298 303 L 342 303 L 320 286 Z" fill="#57534e" />
                  <circle cx="320" cy="284" r="3" fill="#78716c" />

                  {/* Window Light Glow effect */}
                  <motion.circle
                    cx="320"
                    cy="312"
                    r="12"
                    fill={activeAtmos.lanternGlow}
                    opacity="0.25"
                    animate={!reducedMotion ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  />
                </g>
              ) : (
                <g className="opacity-20">
                  <rect x="315" y="300" width="10" height="50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2, 4" />
                  <polygon points="305,300 325,300 315,285" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2, 4" />
                </g>
              )}

              {/* STAGE 10: Living Sanctuary (Torii Gate & Butterflies) */}
              {unlockedItems.includes('stage-10') ? (
                <g className="transition-all duration-700">
                  {/* Red/Curved Arch Torii Gate */}
                  {/* Left Column */}
                  <rect x="374" y="165" width="8" height="65" fill="#dc2626" />
                  <rect x="371" y="225" width="14" height="6" fill="#1c1917" />
                  {/* Right Column */}
                  <rect x="418" y="165" width="8" height="65" fill="#dc2626" />
                  <rect x="415" y="225" width="14" height="6" fill="#1c1917" />
                  {/* Middle Beam */}
                  <rect x="364" y="177" width="72" height="7" fill="#dc2626" />
                  {/* Top Curved Roof Beam */}
                  <path d="M 354 158 Q 400 162 446 158 L 444 165 Q 400 169 356 165 Z" fill="#1c1917" />
                  
                  {/* Floating Glowing Butterflies/Sparkles */}
                  {!reducedMotion && (
                    <>
                      <motion.circle
                        cx="360"
                        cy="150"
                        r="2.5"
                        fill="#67e8f9"
                        animate={{ y: [0, -12, 0], x: [0, 8, 0], opacity: [0.3, 0.9, 0.3] }}
                        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                      />
                      <motion.circle
                        cx="440"
                        cy="140"
                        r="3"
                        fill="#fef08a"
                        animate={{ y: [0, -18, 0], x: [0, -6, 0], opacity: [0.4, 1.0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut' }}
                      />
                    </>
                  )}
                </g>
              ) : (
                <g className="opacity-25">
                  {/* Dotted outlines representing Torii Gate */}
                  <line x1="378" y1="230" x2="378" y2="165" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                  <line x1="422" y1="230" x2="422" y2="165" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                  <line x1="365" y1="170" x2="435" y2="170" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                </g>
              )}

              {/* STAGE 2: Small Stone (River Stone foreground) */}
              {unlockedItems.includes('stage-2') ? (
                <g className="transition-all duration-700">
                  {/* Smooth river rock */}
                  <path d="M 280 425 Q 260 405, 300 395 T 330 415 T 300 430 Z" fill="#78716c" className="stroke-stone-600" strokeWidth="1" />
                  {/* Stone texture reflection */}
                  <path d="M 288 415 Q 275 408, 302 402" fill="none" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              ) : (
                <ellipse cx="300" cy="410" rx="20" ry="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2, 4" className="opacity-30" />
              )}

              {/* Living Zen Garden Environmental Layer */}
              <LivingGardenLayer
                atmosphere={atmosphere}
                weather={weather}
                practiceMinutes={minutes}
                streak={streak}
                unlockedItems={unlockedItems}
                elementalTheme={getElementalTheme(atmosphere === 'dawn' ? 'fire' : atmosphere === 'dusk' ? 'water' : atmosphere === 'twilight' ? 'earth' : 'air')}
                reducedMotion={reducedMotion}
                isRaking={isRaking}
                activeTap={activeTap}
              />

              {/* Interactive Clicking Target Overlays */}
              {/* These are transparent, responsive clickable shapes directly on top of the elements */}
              {GARDEN_STAGES.map((stage, idx) => {
                const isUnlocked = unlockedItems.includes(stage.id);
                // Standard visual frequencies for chimes based on standard scale (A3 to E5)
                const freqScale = [196, 220, 246.94, 261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25];
                const freq = freqScale[idx] || 440;

                return (
                  <g
                    key={stage.id}
                    className="cursor-pointer group pointer-events-auto focus:outline-none"
                    role="button"
                    tabIndex={0}
                    aria-label={`${stage.name}. ${isUnlocked ? 'Unlocked garden object.' : `Locked garden object - requirement: ${stage.unlockCondition}.`}`}
                    onClick={() => handleSelectObject(stage.id, freq)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectObject(stage.id, freq);
                      }
                    }}
                  >
                    {/* Glowing highlight circle surrounding the object when selected */}
                    {activeItem === stage.id && (
                      <circle
                        cx={stage.position.x}
                        cy={stage.position.y}
                        r="32"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="4, 2"
                        className="animate-spin-slow"
                      />
                    )}

                    {/* Circular invisible click boundary targeting exact coordinate */}
                    <circle
                      cx={stage.position.x}
                      cy={stage.position.y}
                      r="28"
                      fill="transparent"
                    />

                    {/* Little lock indicator for locked elements */}
                    {!isUnlocked && (
                      <g transform={`translate(${stage.position.x - 8}, ${stage.position.y - 8}) scale(0.65)`}>
                        <circle cx="12" cy="12" r="14" fill="rgba(0,0,0,0.4)" />
                        <path
                          d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                          fill="#ffffff"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom floating quick-hud details */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2 justify-between items-center bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-200/50">
              <span className="text-[10px] font-mono font-medium text-stone-500">
                Atmosphere: <strong className="text-stone-700">{ATMOSPHERES[atmosphere].name}</strong>
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRake}
                  disabled={isRaking}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-800 transition-all ${
                    isRaking ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:bg-emerald-100 active:scale-95'
                  }`}
                >
                  <Wind className="h-3.5 w-3.5 animate-pulse" />
                  <span>{isRaking ? 'Raking Gravel...' : 'Rake Sand'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Aesthetic Atmosphere, Weather, and Raking pattern selection panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Pattern Controls */}
            <div className="p-4 bg-white border border-stone-200/60 rounded-2xl flex flex-col justify-between gap-3 text-left">
              <div>
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Somatic Sand Rake Patterns</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Rake style changes gravel waveforms, focusing somatic concentration.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['waves', 'concentric', 'spiral'] as RakePattern[]).map((p) => (
                  <button
                    key={p}
                    id={`rake-pattern-btn-${p}`}
                    onClick={() => {
                      setRakePattern(p);
                      playSereneChime(349.23); // F4
                    }}
                    className={`py-1.5 rounded-xl text-[10px] font-semibold transition-all border ${
                      rakePattern === p
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Atmosphere Controls */}
            <div className="p-4 bg-white border border-stone-200/60 rounded-2xl flex flex-col justify-between gap-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Garden Lighting & Atmosphere</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">Lighting adapts smoothly to time of day & circadian rhythms.</p>
                </div>
                <button
                  onClick={() => {
                    setIsRealtimeSky(!isRealtimeSky);
                    playFlowerChime();
                  }}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all inline-flex items-center gap-1 ${
                    isRealtimeSky
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                  }`}
                  title="Sync garden sky automatically with real-time local clock"
                >
                  <Clock className="h-3 w-3" />
                  <span>{isRealtimeSky ? 'Real-Time' : 'Auto Clock'}</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['dawn', 'daylight', 'dusk', 'twilight'] as Atmosphere[]).map((a) => (
                  <button
                    key={a}
                    id={`atmosphere-btn-${a}`}
                    onClick={() => {
                      setIsRealtimeSky(false);
                      setAtmosphere(a);
                      playFlowerChime();
                    }}
                    className={`py-1.5 rounded-xl text-[10px] font-semibold transition-all border ${
                      atmosphere === a && !isRealtimeSky
                        ? 'bg-stone-900 text-white border-stone-950 shadow-sm'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Evolution Controls */}
            <div className="p-4 bg-white border border-stone-200/60 rounded-2xl flex flex-col justify-between gap-3 text-left">
              <div>
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Living Weather Evolution</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Precipitation and sky dynamics reflect internal emotional climate.</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['clear', 'rain', 'snow', 'wind', 'sunrise', 'sunset'] as WeatherState[]).map((w) => (
                  <button
                    key={w}
                    id={`weather-btn-${w}`}
                    onClick={() => {
                      setWeather(w);
                      playSereneChime(523.25);
                    }}
                    className={`py-1.5 rounded-xl text-[10px] font-semibold transition-all border capitalize ${
                      weather === w
                        ? 'bg-sky-700 text-white border-sky-800 shadow-sm'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right 1 column: Garden sidebar and milestones */}
        <div className="space-y-6">
          
          {/* Somatic Growth summary */}
          <div className="p-5 bg-white border border-stone-200/60 rounded-2xl text-left space-y-4 shadow-xs">
            <h3 className="font-serif text-lg font-light text-stone-800">Somatic Cultivation</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500 font-medium">
                <span>Sanctuary Growth Points</span>
                <span className="font-mono">{xp} XP</span>
              </div>
              {/* Gentle visual level bars */}
              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (xp / 1000) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-400">Total XP earned permanently from your somatic sessions and reflections.</p>
            </div>

            <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
              <div className="space-y-0.5">
                <span className="block text-[11px] font-mono text-stone-400 uppercase">Sessions</span>
                <span className="block text-sm font-bold text-stone-700 font-serif">{totalSessions}</span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-[11px] font-mono text-stone-400 uppercase">Journals</span>
                <span className="block text-sm font-bold text-stone-700 font-serif">{totalJournals}</span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-[11px] font-mono text-stone-400 uppercase">Streak</span>
                <span className="block text-sm font-bold text-stone-700 font-serif">{streak}d</span>
              </div>
            </div>

            {/* Flora Growth & Elemental Monuments Progress */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700">Flora Growth</span>
                <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  {growth.label} ({growth.bloomPercentage}%)
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Elemental Monuments</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-between ${monumentUnlocks.airTemple ? 'bg-sky-50 border-sky-200 text-sky-800' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                    <span>Air Cloud Temple</span>
                    <span className="font-bold">{monumentUnlocks.airTemple ? '✓' : '🔒'}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border flex items-center justify-between ${monumentUnlocks.waterSanctuary ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                    <span>Water Sanctuary</span>
                    <span className="font-bold">{monumentUnlocks.waterSanctuary ? '✓' : '🔒'}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border flex items-center justify-between ${monumentUnlocks.fireShrine ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                    <span>Fire Flame Shrine</span>
                    <span className="font-bold">{monumentUnlocks.fireShrine ? '✓' : '🔒'}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border flex items-center justify-between ${monumentUnlocks.earthTemple ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                    <span>Ancient Stone Temple</span>
                    <span className="font-bold">{monumentUnlocks.earthTemple ? '✓' : '🔒'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Item description / details */}
          <AnimatePresence mode="wait">
            {selectedStage ? (
              <motion.div
                key={selectedStage.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-5 bg-stone-50 border border-stone-200 rounded-2xl text-left space-y-3 relative overflow-hidden"
              >
                {/* Background watermarks or details */}
                <div className="absolute top-2 right-2 text-stone-200">
                  <Info className="h-12 w-12" />
                </div>

                <div className="flex items-start gap-2.5 relative z-10">
                  {isSelectedUnlocked ? (
                    <CheckCircle className="h-5 w-5 text-emerald-800 mt-0.5 shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-stone-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-serif text-md font-semibold text-stone-800 leading-tight">
                      {selectedStage.name}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mt-0.5">
                      {isSelectedUnlocked ? 'Cultivated Object' : 'Awaiting Devotion'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-stone-600 relative z-10 leading-relaxed">
                  <p>{selectedStage.description}</p>
                  
                  <div className="p-3 bg-white rounded-xl border border-stone-150 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Somatic Symbolism</span>
                    <p className="font-serif text-[11px] italic text-stone-500 leading-relaxed">
                      "{selectedStage.meaning}"
                    </p>
                  </div>

                  {!isSelectedUnlocked && (
                    <div className="pt-1.5 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Unlock Requirements</span>
                      <p className="text-[11px] text-stone-500 bg-amber-50/60 p-2 border border-amber-100 rounded-lg">
                        {selectedStage.unlockCondition}
                      </p>
                    </div>
                  )}

                  {isSelectedUnlocked && unlockedAtMap[selectedStage.id] && (
                    <span className="text-[10px] text-stone-400 block pt-1">
                      Cultivated on {new Date(unlockedAtMap[selectedStage.id]).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-5 bg-stone-50/50 border border-stone-200/50 border-dashed rounded-2xl text-center py-8 text-stone-400 space-y-2">
                <Compass className="h-6 w-6 mx-auto text-stone-300 animate-spin-slow" />
                <h4 className="font-serif text-sm font-medium">Explore Your Sanctuary</h4>
                <p className="text-[11px] max-w-xs mx-auto leading-relaxed">
                  Tap any object on the canvas or select a milestone below to read its somatic meaning and unlock criteria.
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* Vertical milestones checklist path */}
          <div className="p-5 bg-white border border-stone-200/60 rounded-2xl text-left space-y-3.5 shadow-xs">
            <h4 className="font-serif text-sm font-semibold text-stone-800">Garden Progression Path</h4>
            
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {GARDEN_STAGES.map((stage, idx) => {
                const isUnlocked = unlockedItems.includes(stage.id);
                const isActive = activeItem === stage.id;

                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      // Visual chime corresponding to selected stage index
                      const freqs = [196, 220, 246.94, 261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25];
                      handleSelectObject(stage.id, freqs[idx] || 440);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all border ${
                      isActive
                        ? 'bg-emerald-50/70 border-emerald-200/60'
                        : 'border-transparent hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      {isUnlocked ? (
                        <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-emerald-800" />
                        </div>
                      ) : (
                        <div className="h-4.5 w-4.5 rounded-full border border-stone-200 flex items-center justify-center">
                          <Lock className="h-2.5 w-2.5 text-stone-400" />
                        </div>
                      )}
                      <div>
                        <span className={`font-serif text-xs block ${isUnlocked ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>
                          {stage.name}
                        </span>
                        <span className="text-[9px] text-stone-400 block leading-none">Stage {idx + 1}</span>
                      </div>
                    </div>

                    <ChevronRight className={`h-3 w-3 text-stone-300 transition-transform ${isActive ? 'translate-x-0.5 text-emerald-800' : ''}`} />
                  </button>
                );
              })}
            </div>

            {nextMilestone && (
              <div className="p-3 bg-amber-50/50 border border-amber-100/40 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Next Cultivation Goal</span>
                <span className="font-serif text-xs font-semibold text-stone-800 block">{nextMilestone.name}</span>
                <p className="text-[10px] text-stone-500 leading-normal">{nextMilestone.unlockCondition}</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
