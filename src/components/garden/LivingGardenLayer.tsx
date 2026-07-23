/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ElementalThemeConfig } from '@/types';
import { getElementalTheme } from '@/data/elementalThemes';
import {
  WeatherState,
  calculatePlantGrowth,
  calculateStreakUnlocks,
  calculateElementalMonuments,
  getWeatherLighting
} from '@/utils/gardenEvolution';

export type GardenAtmosphere = 'dawn' | 'daylight' | 'dusk' | 'twilight';

export interface InteractiveTapEvent {
  id: number;
  x: number;
  y: number;
  type: 'flower' | 'water' | 'animal' | 'lantern';
  timestamp: number;
}

export interface LivingGardenLayerProps {
  atmosphere: GardenAtmosphere;
  weather?: WeatherState;
  practiceMinutes?: number;
  streak?: number;
  unlockedItems: string[];
  elementalTheme?: ElementalThemeConfig;
  reducedMotion?: boolean;
  isRaking?: boolean;
  activeTap?: InteractiveTapEvent | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  type: 'petal' | 'firefly' | 'mist' | 'ember' | 'mote' | 'rain' | 'snow' | 'cloud' | 'bird' | 'sparkle';
  phase: number;
  length?: number;
  life?: number;
}

export const LivingGardenLayer: React.FC<LivingGardenLayerProps> = ({
  atmosphere,
  weather = 'clear',
  practiceMinutes = 0,
  streak = 0,
  unlockedItems,
  elementalTheme,
  reducedMotion = false,
  isRaking = false,
  activeTap = null,
}) => {
  const theme = elementalTheme || getElementalTheme('air');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Growth & Unlocks
  const growth = calculatePlantGrowth(practiceMinutes);
  const streakUnlocks = calculateStreakUnlocks(streak);
  const monuments = calculateElementalMonuments({ minutes: practiceMinutes, streak });

  // Determine particle pool size
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxParticles = isMobile ? 32 : 75;

  const particlesRef = useRef<Particle[]>([]);
  const [ripples, setRipples] = useState<{ id: number; r: number; opacity: number }[]>([
    { id: 1, r: 8, opacity: 0.8 },
    { id: 2, r: 24, opacity: 0.4 },
  ]);

  // Handle active interactive tap bursts
  useEffect(() => {
    if (!activeTap || reducedMotion) return;

    const burstParticles: Particle[] = [];
    const count = activeTap.type === 'water' ? 14 : 10;
    const colors =
      activeTap.type === 'flower'
        ? ['#fbcfe8', '#f472b6', '#fb7185', '#fef08a']
        : activeTap.type === 'water'
        ? ['#38bdf8', '#0284c7', '#7dd3fc', '#e0f2fe']
        : activeTap.type === 'lantern'
        ? ['#fef08a', '#fb923c', '#f97316', '#ffffff']
        : ['#a855f7', '#ec4899', '#38bdf8', '#fef08a'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 2.5;

      burstParticles.push({
        x: activeTap.x,
        y: activeTap.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (activeTap.type === 'flower' ? 0.8 : 0),
        radius: 2 + Math.random() * 3,
        alpha: 0.9,
        maxAlpha: 1.0,
        color: colors[i % colors.length],
        type: 'sparkle',
        phase: Math.random() * Math.PI * 2,
        life: 1.0,
      });
    }

    particlesRef.current = [...particlesRef.current, ...burstParticles];
  }, [activeTap, reducedMotion]);

  // Pre-initialize particle pool once per weather/atmosphere/theme change
  useEffect(() => {
    const particles: Particle[] = [];
    const particleTypes: Particle['type'][] = [];

    if (weather === 'rain') {
      particleTypes.push('rain', 'mist');
    } else if (weather === 'snow') {
      particleTypes.push('snow', 'mist');
    } else if (weather === 'wind') {
      particleTypes.push('petal', 'mote', 'cloud');
    } else if (weather === 'sunrise' || weather === 'sunset') {
      particleTypes.push('mote', 'ember', 'cloud');
    } else {
      if (atmosphere === 'dawn') particleTypes.push('mist', 'mote');
      else if (atmosphere === 'dusk' || atmosphere === 'twilight') particleTypes.push('firefly', 'ember');
      else particleTypes.push('petal', 'mote', 'cloud');
    }

    if (streakUnlocks.birdsUnlocked && !reducedMotion) {
      particleTypes.push('bird');
    }

    const primaryColor = theme.visuals.primaryColor;
    const accentColor = theme.visuals.accentColor;

    for (let i = 0; i < maxParticles; i++) {
      const pType = particleTypes[i % particleTypes.length];
      let color = accentColor;
      if (pType === 'firefly') color = '#fef08a';
      else if (pType === 'petal') color = '#fbcfe8';
      else if (pType === 'ember') color = '#fb923c';
      else if (pType === 'mist') color = '#f0f9ff';
      else if (pType === 'rain') color = '#93c5fd';
      else if (pType === 'snow') color = '#ffffff';
      else if (pType === 'cloud') color = '#ffffff';
      else if (pType === 'bird') color = '#334155';

      const isRain = pType === 'rain';
      const isSnow = pType === 'snow';

      particles.push({
        x: Math.random() * 820 - 10,
        y: isRain ? Math.random() * 500 : isSnow ? Math.random() * 500 : 80 + Math.random() * 380,
        vx: isRain ? -1.5 - Math.random() : weather === 'wind' ? 1.8 + Math.random() : (Math.random() - 0.2) * 0.5,
        vy: isRain ? 12 + Math.random() * 8 : isSnow ? 0.8 + Math.random() * 0.8 : (Math.random() - 0.5) * 0.3,
        radius: pType === 'mist' ? 3.5 + Math.random() * 4 : pType === 'cloud' ? 18 + Math.random() * 15 : isSnow ? 1.5 + Math.random() * 2 : 1.2 + Math.random() * 2,
        alpha: isRain ? 0.4 + Math.random() * 0.4 : 0.2 + Math.random() * 0.6,
        maxAlpha: 0.4 + Math.random() * 0.5,
        color,
        type: pType,
        phase: Math.random() * Math.PI * 2,
        length: isRain ? 12 + Math.random() * 10 : undefined,
      });
    }

    particlesRef.current = particles;
  }, [atmosphere, weather, theme, maxParticles, streakUnlocks.birdsUnlocked, reducedMotion]);

  // Animation Loop on Canvas
  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.phase += dt * 1.5;

        if (p.type === 'sparkle' && p.life !== undefined) {
          p.life -= dt * 1.5;
          p.alpha = Math.max(0, p.life);
          p.x += p.vx * dt * 30;
          p.y += p.vy * dt * 30;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
        } else if (p.type === 'rain') {
          p.x += p.vx * dt * 40;
          p.y += p.vy * dt * 45;
        } else if (p.type === 'snow') {
          p.x += (Math.sin(p.phase) * 0.8 + p.vx) * dt * 25;
          p.y += p.vy * dt * 30;
        } else if (p.type === 'cloud') {
          p.x += 0.15 * dt * 30;
        } else if (p.type === 'bird') {
          p.x += 1.2 * dt * 30;
          p.y += Math.sin(p.phase * 2) * 0.4;
        } else {
          p.x += (p.vx + (isRaking ? 0.8 : 0)) * dt * 30;
          p.y += (p.vy + Math.sin(p.phase) * 0.2) * dt * 30;
        }

        // Firefly pulsing
        if (p.type === 'firefly') {
          p.alpha = 0.2 + (Math.sin(p.phase) * 0.5 + 0.5) * p.maxAlpha;
        }

        // Wrap boundaries
        if (p.x > 830) p.x = -20;
        if (p.x < -20) p.x = 830;
        if (p.y > 510) p.y = -10;
        if (p.y < -10) p.y = 510;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.type === 'firefly') {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#fef08a';
        } else if (p.type === 'ember') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f97316';
        }

        ctx.beginPath();
        if (p.type === 'rain') {
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3, p.y + (p.length || 14));
          ctx.stroke();
        } else if (p.type === 'petal') {
          ctx.ellipse(p.x, p.y, p.radius * 1.4, p.radius * 0.8, p.phase, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'cloud') {
          ctx.globalAlpha = 0.12;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.arc(p.x + 12, p.y - 5, p.radius * 0.8, 0, Math.PI * 2);
          ctx.arc(p.x - 12, p.y - 2, p.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'bird') {
          // Draw small silhouette V shape for bird
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x - 4, p.y + Math.sin(p.phase) * 2);
          ctx.lineTo(p.x, p.y - 2);
          ctx.lineTo(p.x + 4, p.y + Math.sin(p.phase) * 2);
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion, isRaking]);

  // Water Ripple Loop for Lotus Pond (stage-6) & River
  useEffect(() => {
    if (reducedMotion || (!unlockedItems.includes('stage-6') && !monuments.waterSanctuary)) return;

    const interval = setInterval(() => {
      setRipples((prev) =>
        prev.map((r) => {
          const nextR = r.r + 1.2;
          const nextOpacity = Math.max(0, 0.8 - nextR / 45);
          if (nextR > 45) {
            return { id: r.id, r: 4, opacity: 0.8 };
          }
          return { ...r, r: nextR, opacity: nextOpacity };
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [reducedMotion, unlockedItems, monuments.waterSanctuary]);

  const hasPond = unlockedItems.includes('stage-6') || monuments.waterSanctuary || practiceMinutes >= 15;
  const hasLantern = unlockedItems.includes('stage-5') || streakUnlocks.floatingLanternsUnlocked;
  const hasBamboo = unlockedItems.includes('stage-4');
  const hasCherryTree = unlockedItems.includes('stage-7');
  const lighting = getWeatherLighting(weather);

  const isDay = atmosphere === 'daylight' || atmosphere === 'dawn';
  const isNight = atmosphere === 'twilight' || atmosphere === 'dusk';

  return (
    <g className="living-garden-layer pointer-events-none">
      <defs>
        <linearGradient id="sunbeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="moonbeamGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="mistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* 1. Mountain Silhouette Background */}
      <g className="mountain-silhouettes opacity-30">
        <path d="M -50 320 Q 120 160 300 320 L 300 500 L -50 500 Z" fill={lighting.skyColor} />
        <path d="M 220 320 Q 450 110 680 320 L 680 500 L 220 500 Z" fill={lighting.skyColor} opacity="0.8" />
        <path d="M 500 320 Q 670 170 850 320 L 850 500 L 500 500 Z" fill={lighting.skyColor} opacity="0.6" />
      </g>

      {/* 2. Ambient Light Beams (Sunbeams or Moonbeams) */}
      {isDay && (
        <g className="sunbeams-overlay">
          <polygon points="60,0 180,0 480,500 320,500" fill="url(#sunbeamGrad)" />
          <polygon points="220,0 320,0 620,500 500,500" fill="url(#sunbeamGrad)" opacity="0.6" />
        </g>
      )}
      {isNight && (
        <g className="moonbeams-overlay">
          <polygon points="720,0 800,0 420,500 320,500" fill="url(#moonbeamGrad)" />
        </g>
      )}

      {/* 3. Weather Mist/Fog Layer */}
      {(weather === 'rain' || weather === 'wind' || atmosphere === 'dawn') && (
        <g className="weather-mist-layer">
          <rect x="0" y="220" width="800" height="70" fill="url(#mistGrad)" />
          <rect x="0" y="340" width="800" height="50" fill="url(#mistGrad)" opacity="0.5" />
        </g>
      )}

      {/* 4. Animated River Flow */}
      <g className="animated-river-flow">
        <path
          d="M 0 380 Q 200 360, 400 420 T 800 390"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="14"
          opacity="0.25"
        />
        <path
          d="M 0 380 Q 200 360, 400 420 T 800 390"
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="3"
          strokeDasharray="16, 12"
          opacity="0.6"
          className={!reducedMotion ? 'animate-pulse' : ''}
        />
      </g>

      {/* 5. Garden Progress Vegetation (Flora density scaling with practice) */}
      <g className="progress-flora-patches">
        {/* Stage 2+ Moss cushions on river stones */}
        {growth.stage >= 2 && (
          <g className="moss-cushions opacity-80">
            <ellipse cx="295" cy="408" rx="8" ry="4" fill="#059669" />
            <ellipse cx="310" cy="412" rx="10" ry="5" fill="#10b981" />
            <ellipse cx="420" cy="432" rx="7" ry="3.5" fill="#047857" />
          </g>
        )}

        {/* Stage 3+ Wild Iris and Camellia flower blossoms along river bank */}
        {growth.stage >= 3 && (
          <g className="wild-flowers">
            {/* Wild Iris near river */}
            <g transform="translate(260, 420)">
              <line x1="0" y1="0" x2="-2" y2="-12" stroke="#059669" strokeWidth="1.5" />
              <circle cx="-2" cy="-14" r="3" fill="#8b5cf6" />
              <circle cx="-2" cy="-14" r="1.5" fill="#fef08a" />
            </g>
            <g transform="translate(430, 405)">
              <line x1="0" y1="0" x2="2" y2="-10" stroke="#059669" strokeWidth="1.5" />
              <circle cx="2" cy="-12" r="2.5" fill="#ec4899" />
            </g>
          </g>
        )}

        {/* Stage 4 Full Bloom Flower Clusters */}
        {growth.stage >= 4 && (
          <g className="blooming-clusters">
            <circle cx="370" cy="440" r="3" fill="#f43f5e" />
            <circle cx="375" cy="438" r="2.5" fill="#fb7185" />
            <circle cx="368" cy="444" r="2.5" fill="#fbcfe8" />
            <circle cx="490" cy="365" r="3.5" fill="#38bdf8" />
            <circle cx="510" cy="370" r="3" fill="#a855f7" />
          </g>
        )}
      </g>

      {/* 3. Canvas overlay for particle physics */}
      <foreignObject x="0" y="0" width="800" height="500">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full pointer-events-none"
        />
      </foreignObject>

      {/* 4. Elemental Monuments Unlocks */}
      {/* Air: Floating Cloud Temple */}
      {monuments.airTemple && (
        <g transform="translate(140, 110) scale(0.9)" className="elemental-monument-air">
          {/* Cloud pedestal */}
          <ellipse cx="60" cy="50" rx="40" ry="12" fill="#ffffff" opacity="0.85" />
          <ellipse cx="40" cy="46" rx="22" ry="10" fill="#f0f9ff" opacity="0.9" />
          <ellipse cx="80" cy="48" rx="24" ry="11" fill="#f0f9ff" opacity="0.9" />
          {/* Mini Air Pagoda */}
          <path d="M 45 35 L 75 35 L 60 18 Z" fill="#38bdf8" />
          <rect x="52" y="35" width="16" height="12" fill="#e0f2fe" />
          <circle cx="60" cy="12" r="3" fill="#38bdf8" className="animate-pulse" />
        </g>
      )}

      {/* Water: Lotus Sanctuary */}
      {monuments.waterSanctuary && (
        <g transform="translate(480, 290)" className="elemental-monument-water">
          <ellipse cx="25" cy="15" rx="30" ry="15" fill="#0284c7" opacity="0.3" />
          <circle cx="25" cy="15" r="14" fill="#38bdf8" opacity="0.8" />
          <path d="M 25 2 Q 35 15, 25 22 Q 15 15, 25 2 Z" fill="#7dd3fc" />
          <path d="M 12 15 Q 25 20, 25 8 Q 25 25, 12 15 Z" fill="#e0f2fe" />
        </g>
      )}

      {/* Fire: Mountain Flame Shrine */}
      {monuments.fireShrine && (
        <g transform="translate(680, 280)" className="elemental-monument-fire">
          <rect x="15" y="20" width="20" height="25" rx="3" fill="#78350f" />
          <path d="M 10 20 L 40 20 L 25 8 Z" fill="#b45309" />
          <circle cx="25" cy="30" r="5" fill="#ef4444" className="animate-ping" style={{ animationDuration: '2s' }} />
          <circle cx="25" cy="30" r="4" fill="#fbbf24" />
        </g>
      )}

      {/* Earth: Ancient Stone Temple */}
      {monuments.earthTemple && (
        <g transform="translate(250, 230)" className="elemental-monument-earth">
          <rect x="10" y="25" width="30" height="20" fill="#57534e" rx="2" />
          <rect x="5" y="20" width="40" height="5" fill="#44403c" rx="1" />
          <path d="M 12 20 L 38 20 L 25 8 Z" fill="#292524" />
          <rect x="22" y="32" width="6" height="13" fill="#1c1917" />
        </g>
      )}

      {/* 5. Streak & Ambient Creature Unlocks */}
      {streakUnlocks.floatingLanternsUnlocked && (
        <g className="floating-lanterns-streak">
          <g transform="translate(360, 200)" className={!reducedMotion ? 'animate-bounce' : ''} style={{ animationDuration: '4s' }}>
            <rect x="0" y="0" width="10" height="14" rx="2" fill="#fb923c" />
            <circle cx="5" cy="7" r="3" fill="#fef08a" />
          </g>
          <g transform="translate(420, 180)" className={!reducedMotion ? 'animate-bounce' : ''} style={{ animationDuration: '5s' }}>
            <rect x="0" y="0" width="8" height="12" rx="2" fill="#f97316" />
            <circle cx="4" cy="6" r="2.5" fill="#fef08a" />
          </g>
        </g>
      )}

      {streakUnlocks.butterfliesUnlocked && !reducedMotion && (
        <g className="butterflies-streak">
          <circle cx="180" cy="320" r="2" fill="#ec4899" className="animate-pulse" />
          <circle cx="184" cy="318" r="1.5" fill="#f472b6" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        </g>
      )}

      {/* Water Ripple Layer over Lotus Pond (cx: 500, cy: 340) */}
      {hasPond && (
        <g className="pond-living-ripples">
          {ripples.map((r) => (
            <ellipse
              key={`ripple-${r.id}`}
              cx="500"
              cy="340"
              rx={r.r * 1.5}
              ry={r.r * 0.8}
              fill="none"
              stroke="#67e8f9"
              strokeWidth="0.8"
              opacity={r.opacity}
            />
          ))}
        </g>
      )}

      {/* Flame Flicker Effect on Stone Lantern (320, 312) */}
      {hasLantern && (
        <g className="lantern-living-flame">
          <circle
            cx="320"
            cy="312"
            r="4"
            fill="#fef08a"
            opacity="0.9"
            className="animate-pulse"
          />
          <circle
            cx="320"
            cy="312"
            r="8"
            fill="#fb923c"
            opacity="0.35"
            className={!reducedMotion ? 'animate-ping' : ''}
            style={{ animationDuration: '3s' }}
          />
        </g>
      )}

      {/* Wind Sway Lines over Bamboo (100, 300) */}
      {hasBamboo && !reducedMotion && (
        <path
          d="M 70 270 Q 110 260 130 280"
          fill="none"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1"
          strokeDasharray="12, 12"
          className="animate-pulse"
        />
      )}

      {/* Soft Floating Blossom Petals SVG overlay for Cherry Tree */}
      {hasCherryTree && !reducedMotion && (
        <g className="cherry-living-petals">
          <circle cx="630" cy="220" r="1.5" fill="#fbcfe8" className="animate-bounce" style={{ animationDuration: '4s' }} />
          <circle cx="670" cy="260" r="1.8" fill="#f472b6" className="animate-bounce" style={{ animationDuration: '5s' }} />
        </g>
      )}
    </g>
  );
};
