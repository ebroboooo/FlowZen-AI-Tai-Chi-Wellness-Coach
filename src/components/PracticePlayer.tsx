/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Eye, 
  ShieldAlert, 
  Heart, 
  Activity, 
  Star, 
  Info,
  Sliders,
  Sparkles,
  Award,
  BookOpen,
  Bot
} from 'lucide-react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { useCoachStore } from '@/store/useCoachStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useCurriculumStore } from '@/store/useCurriculumStore';
import { generateAnimation, interpolatePose } from '@/data/skeletonAnimations';
import { audioPacer } from '@/utils/audioPacer';
import { elementalSoundscape } from '@/utils/elementalSoundscape';
import { speechQueue } from '@/utils/speechQueue';
import { Lesson, Movement, SkeletonPose } from '@/types';
import { FlowZenAvatar } from '@/components/avatar/FlowZenAvatar';
import { getElementalTheme } from '@/data/elementalThemes';
import { CameraPoseGuide } from '@/components/practice/CameraPoseGuide';
import { compareUserPoseToTarget, PoseFrame } from '@/utils/poseGuidance';
import { getMovementCoachingFeedback, CoachingFeedback } from '@/utils/movementFeedback';
import { getMasterProgram } from '@/data/masterCurriculum';
import { Camera, Compass, Target, ShieldCheck, Layers } from 'lucide-react';

export default function PracticePlayer() {
  const {
    currentLesson,
    currentMovement,
    isPlaying,
    speed,
    isMirrorMode,
    sessionTimer,
    isCompleted,
    isMuted,
    activeView,
    stopPractice,
    togglePlay,
    setSpeed,
    toggleMirrorMode,
    toggleMuted,
    setActiveView,
    nextMovement,
    prevMovement,
    incrementTimer,
    completePracticeSession,
    resetPractice,
    setMovement
  } = usePracticeStore();

  const [mindfulnessRating, setMindfulnessRating] = useState<number>(5);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSkeletonOverlay, setShowSkeletonOverlay] = useState<boolean>(false);
  const [isCameraMode, setIsCameraMode] = useState<boolean>(false);
  const [isAiGuidanceActive, setIsAiGuidanceActive] = useState<boolean>(true);
  const [trainingMode, setTrainingMode] = useState<'watch' | 'mirror' | 'master' | 'challenge'>('watch');
  const [trainingLevel, setTrainingLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [userPose, setUserPose] = useState<PoseFrame | null>(null);
  const [animationFrameIndex, setAnimationFrameIndex] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const elementalTheme = getElementalTheme(currentLesson?.element || currentMovement?.element || 'air');

  // Animation & audio loops refs
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const totalDurationRef = useRef<number>(0); // overall motion loop timeline position

  // Listen for prefers-reduced-motion media query changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return; // ignore when rating modal is open
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextMovement();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevMovement();
          break;
        case 'KeyM':
          toggleMuted();
          break;
        case 'KeyR':
          resetPractice();
          break;
        case 'KeyS': {
          // Cycle speed: 0.5 -> 0.75 -> 1.0 -> 1.25 -> 0.5
          const speeds = [0.5, 0.75, 1.0, 1.25];
          const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
          setSpeed(speeds[nextIdx]);
          break;
        }
        case 'KeyV':
          setActiveView(activeView === 'front' ? 'side' : 'front');
          break;
        case 'Escape':
          stopPractice();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextMovement, prevMovement, toggleMuted, resetPractice, speed, setSpeed, activeView, setActiveView, stopPractice, isCompleted]);

  // Handle ticking session elapsed timer
  useEffect(() => {
    if (!isPlaying || isCompleted) return;
    const interval = setInterval(() => {
      incrementTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, incrementTimer]);

  // Audio breathing sweeps and elemental soundscape controller
  // Phase loops every 8 seconds at 1x speed. Exhale/Inhale lasts 4 seconds each.
  const loopDuration = 8000; // 8 seconds cycle
  const currentCycleTime = totalDurationRef.current % loopDuration;
  const isCurrentlyInhaling = currentCycleTime < loopDuration / 2;

  useEffect(() => {
    if (!isPlaying || isMuted || isCompleted) {
      audioPacer.setVolume(0);
      elementalSoundscape.stop();
      return;
    }

    audioPacer.start();
    elementalSoundscape.setMuted(false);
    elementalSoundscape.playElement(elementalTheme.id);

    // Update breathing phase and intensity
    const phase = isCurrentlyInhaling ? 'inhale' : 'exhale';
    elementalSoundscape.updateBreathingPhase(phase);
    elementalSoundscape.updateMovementIntensity(speed * 0.8);

    // Sweeps pitch from 200Hz to 320Hz to guide somatic respiration matching circular motion
    if (isCurrentlyInhaling) {
      audioPacer.setFrequency(310, 0.6);
      audioPacer.setVolume(0.12, 0.6);
    } else {
      audioPacer.setFrequency(210, 0.6);
      audioPacer.setVolume(0.06, 0.6);
    }
  }, [isPlaying, isMuted, isCompleted, isCurrentlyInhaling, elementalTheme.id, speed]);

  // Stop sound and speech on player unmount
  useEffect(() => {
    return () => {
      audioPacer.stop();
      elementalSoundscape.stop();
      speechQueue.cancel();
    };
  }, []);

  // Sync mute state and handle TTS speech guidance lifecycle
  useEffect(() => {
    speechQueue.setMuted(isMuted);
    if (isMuted || !isPlaying || isCompleted || !currentMovement) {
      speechQueue.cancel();
    }
  }, [isMuted, isPlaying, isCompleted, currentMovement]);

  // Voice guidance announcement on movement change
  useEffect(() => {
    if (!currentMovement || !isPlaying || isMuted || isCompleted) return;
    const voiceText = `${currentMovement.name}. ${currentMovement.breathingPattern || ''}`;
    speechQueue.speak(voiceText);
  }, [currentMovement?.id, isPlaying, isMuted, isCompleted]);

  // Butter-smooth SVG coordinate interpolation engine with adaptive mobile performance optimizations
  useEffect(() => {
    // Stop animation loop when paused, completed, or no movement
    if (!currentMovement || !isPlaying || isCompleted) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      previousTimeRef.current = null;
      return;
    }

    // Load keyframe sequences (24 coordinates loop representing cyclic Tai Chi moves)
    const keyframes = generateAnimation(currentMovement.id);
    const keyframeCount = keyframes.length;
    let lastStateUpdateTime = 0;
    // Cap state update rate (~60 FPS / 16ms, or ~30 FPS on reduced motion) to prevent 120Hz/144Hz display over-rendering
    const minFrameIntervalMs = reducedMotion ? 33 : 16;

    const animate = (time: number) => {
      // Pause frame updates when tab is in background to preserve mobile battery
      if (typeof document !== 'undefined' && document.hidden) {
        previousTimeRef.current = null;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current;
        // Progress timeline matching user chosen speed coefficient
        totalDurationRef.current += deltaTime * speed;

        // Throttle state updates to minFrameIntervalMs
        if (time - lastStateUpdateTime >= minFrameIntervalMs) {
          lastStateUpdateTime = time;
          const exactFrame = (totalDurationRef.current / 150) % keyframeCount;
          setAnimationFrameIndex(exactFrame);
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      previousTimeRef.current = null;
    };
  }, [currentMovement, isPlaying, speed, isCompleted, reducedMotion]);

  if (!currentLesson || !currentMovement) return null;

  // Derive interpolated Skeleton Pose at current high-resolution timeline tick
  const keyframes = generateAnimation(currentMovement.id);
  const kfLength = keyframes.length;
  const currentIdx = Math.floor(animationFrameIndex) % kfLength;
  const nextIdx = (currentIdx + 1) % kfLength;
  const interpolationFactor = animationFrameIndex % 1;

  const currentPoseRaw = keyframes[currentIdx][activeView];
  const nextPoseRaw = keyframes[nextIdx][activeView];
  const activePose = reducedMotion 
    ? currentPoseRaw 
    : interpolatePose(currentPoseRaw, nextPoseRaw, interpolationFactor);

  // Helper helper to mirror X positions
  const getX = (val: number) => isMirrorMode ? (100 - val) : val;

  // Joint drawing positions
  const joints = {
    head: { x: getX(activePose.head.x), y: activePose.head.y },
    neck: { x: getX(activePose.neck.x), y: activePose.neck.y },
    leftShoulder: { x: getX(activePose.leftShoulder.x), y: activePose.leftShoulder.y },
    rightShoulder: { x: getX(activePose.rightShoulder.x), y: activePose.rightShoulder.y },
    leftElbow: { x: getX(activePose.leftElbow.x), y: activePose.leftElbow.y },
    rightElbow: { x: getX(activePose.rightElbow.x), y: activePose.rightElbow.y },
    leftWrist: { x: getX(activePose.leftWrist.x), y: activePose.leftWrist.y },
    rightWrist: { x: getX(activePose.rightWrist.x), y: activePose.rightWrist.y },
    leftHip: { x: getX(activePose.leftHip.x), y: activePose.leftHip.y },
    rightHip: { x: getX(activePose.rightHip.x), y: activePose.rightHip.y },
    leftKnee: { x: getX(activePose.leftKnee.x), y: activePose.leftKnee.y },
    rightKnee: { x: getX(activePose.rightKnee.x), y: activePose.rightKnee.y },
    leftAnkle: { x: getX(activePose.leftAnkle.x), y: activePose.leftAnkle.y },
    rightAnkle: { x: getX(activePose.rightAnkle.x), y: activePose.rightAnkle.y },
  };

  // Derive live pose analysis & AI coaching feedback
  const currentPoseComparison = userPose
    ? compareUserPoseToTarget(userPose, { timestamp: Date.now(), joints: joints as any })
    : { alignmentScore: 88, balanceScore: 92, corrections: ["Keep shoulders soft and drop your elbows naturally."], confidence: 0.9 };

  const liveCoachingFeedback = getMovementCoachingFeedback(currentPoseComparison, elementalTheme.id);

  // Retrieve master curriculum data & movement phase
  const masterProgram = getMasterProgram(elementalTheme.id);
  const masterMovement = masterProgram?.movements[0] || {
    id: 'master-default',
    name: currentMovement.name,
    element: elementalTheme.id,
    difficulty: 'beginner',
    duration: 300,
    phases: ['preparation', 'gathering', 'extension', 'recovery'],
    breathingPattern: { inhaleSeconds: 4, holdSeconds: 2, exhaleSeconds: 6 },
    avatarStyle: { robeColor: '#e0f2fe', energyEffect: 'soft wind ribbons' },
    commonMistakes: currentMovement.commonMistakes || ['Tensing upper shoulders'],
    masterTips: ['Relax your shoulders and sink your weight into the supporting leg.']
  };

  const getPhaseFromFrame = (idx: number): 'preparation' | 'movement' | 'transition' | 'completion' => {
    const progress = (idx % kfLength) / kfLength;
    if (progress < 0.25) return 'preparation';
    if (progress < 0.50) return 'movement';
    if (progress < 0.75) return 'transition';
    return 'completion';
  };
  const currentPhase = getPhaseFromFrame(animationFrameIndex);

  const handleSelectTrainingMode = (mode: 'watch' | 'mirror' | 'master' | 'challenge') => {
    setTrainingMode(mode);
    if (mode === 'mirror') {
      if (!isMirrorMode) toggleMirrorMode();
      setIsCameraMode(false);
    } else if (mode === 'challenge') {
      setIsCameraMode(true);
      setIsAiGuidanceActive(true);
    } else if (mode === 'master') {
      setIsAiGuidanceActive(true);
      setIsCameraMode(false);
    } else {
      setIsCameraMode(false);
    }
  };

  // Define bone connecting lines
  const bones = [
    // Torso Frame
    [joints.neck, joints.leftShoulder],
    [joints.neck, joints.rightShoulder],
    [joints.leftShoulder, joints.leftHip],
    [joints.rightShoulder, joints.rightHip],
    [joints.leftHip, joints.rightHip],
    // Left Arm
    [joints.leftShoulder, joints.leftElbow],
    [joints.leftElbow, joints.leftWrist],
    // Right Arm
    [joints.rightShoulder, joints.rightElbow],
    [joints.rightElbow, joints.rightWrist],
    // Left Leg
    [joints.leftHip, joints.leftKnee],
    [joints.leftKnee, joints.leftAnkle],
    // Right Leg
    [joints.rightHip, joints.rightKnee],
    [joints.rightKnee, joints.rightAnkle],
  ];

  // Duration parser (seconds to MM:SS string)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Lesson progression metadata
  const currentMovementIdx = currentLesson.movements.findIndex(m => m.id === currentMovement.id) + 1;
  const totalMovementsCount = currentLesson.movements.length;
  const progressPercent = (currentMovementIdx / totalMovementsCount) * 100;

  // Toggle local DOM full-screen view
  const toggleFullScreenMode = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFinishPractice = () => {
    // Open session rating modal
    usePracticeStore.setState({ isCompleted: true, isPlaying: false });
  };

  const handleSubmitRating = async () => {
    if (currentMovement) {
      useCoachStore.getState().recordPracticeResult({
        movementId: currentMovement.id,
        element: elementalTheme.id,
        alignmentScore: currentPoseComparison.alignmentScore,
        balanceScore: currentPoseComparison.balanceScore,
        duration: sessionTimer
      });
    }

    if (currentLesson) {
      useProgressStore.getState().addSession({
        exerciseId: currentLesson.id,
        exerciseTitle: currentLesson.title,
        durationMinutes: Math.max(1, Math.round(sessionTimer / 60)),
        mindfulnessRating,
        timestamp: new Date().toISOString()
      });
      useCurriculumStore.getState().markLessonCompleted(currentLesson.id);
    }

    await completePracticeSession(mindfulnessRating);
  };

  return (
    <div 
      id="active-player-root" 
      className={`fixed inset-0 bg-stone-950 text-stone-100 z-50 flex flex-col md:flex-row overflow-hidden select-none transition-all duration-500 ${
        isFullscreen ? 'p-0' : 'p-0 md:p-4'
      }`}
    >
      {/* LEFT SECTION: Main practice display viewport */}
      <div className="flex-1 flex flex-col relative bg-stone-900 border border-stone-800/40 md:rounded-3xl overflow-hidden shadow-2xl">
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <button
            id="player-exit-btn"
            onClick={stopPractice}
            className="pointer-events-auto p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-all flex items-center justify-center shadow-lg"
            title="Exit Practice (Esc)"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Lesson Metadata Badge */}
          <div className="bg-stone-900/90 border border-stone-800/80 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs">
            <span className="font-serif text-emerald-400 font-medium">{currentLesson.title}</span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">Step {currentMovementIdx} of {totalMovementsCount}</span>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            {/* Camera Training Mode Toggle */}
            <button
              onClick={() => setIsCameraMode(!isCameraMode)}
              className={`p-3 rounded-full border text-xs font-semibold transition-all shadow-lg flex items-center justify-center ${
                isCameraMode
                  ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle AI Camera Training Guidance"
            >
              <Camera className="h-4.5 w-4.5" />
            </button>

            {/* AI Guidance Toggle */}
            <button
              onClick={() => setIsAiGuidanceActive(!isAiGuidanceActive)}
              className={`p-3 rounded-full border text-xs font-semibold transition-all shadow-lg flex items-center justify-center ${
                isAiGuidanceActive
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle Live AI Somatic Guidance"
            >
              <Sparkles className="h-4.5 w-4.5" />
            </button>

            {/* Skeleton Overlay toggle */}
            <button
              onClick={() => setShowSkeletonOverlay(!showSkeletonOverlay)}
              className={`p-3 rounded-full border text-xs font-semibold transition-all shadow-lg flex items-center justify-center ${
                showSkeletonOverlay
                  ? 'bg-purple-950/80 border-purple-800 text-purple-300'
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle Biomechanical Joint Overlay"
            >
              <Eye className="h-4.5 w-4.5" />
            </button>

            {/* Reduced motion toggle */}
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`p-3 rounded-full border text-xs font-semibold transition-all shadow-lg flex items-center justify-center ${
                reducedMotion
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle Reduced Motion"
            >
              <Activity className="h-4.5 w-4.5" />
            </button>

            {/* Mute toggle */}
            <button
              id="player-mute-btn"
              onClick={toggleMuted}
              className={`p-3 rounded-full border transition-all shadow-lg flex items-center justify-center ${
                isMuted 
                  ? 'bg-rose-950/80 border-rose-800 text-rose-400' 
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle Respiration Sound (M)"
            >
              {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
            </button>

            {/* Viewport Maximizer toggle */}
            <button
              onClick={toggleFullScreenMode}
              className="p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all flex items-center justify-center shadow-lg"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Floating Training Mode Selector Bar */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-stone-900/90 border border-stone-800 p-1 rounded-2xl shadow-xl backdrop-blur-md">
          {(['watch', 'mirror', 'master', 'challenge'] as const).map((mode) => (
            <button
              key={mode}
              id={`training-mode-btn-${mode}`}
              onClick={() => handleSelectTrainingMode(mode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all flex items-center gap-1.5 ${
                trainingMode === mode
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              {mode === 'watch' && <Eye className="w-3.5 h-3.5" />}
              {mode === 'mirror' && <Compass className="w-3.5 h-3.5" />}
              {mode === 'master' && <BookOpen className="w-3.5 h-3.5" />}
              {mode === 'challenge' && <Target className="w-3.5 h-3.5" />}
              <span>{mode} Mode</span>
            </button>
          ))}
        </div>

        {/* Current Movement Phase Indicator Pill */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3.5 py-1 rounded-full text-[11px] backdrop-blur shadow">
          <span className="text-stone-400 font-mono text-[10px] uppercase font-bold">Phase:</span>
          <div className="flex items-center gap-1.5">
            {(['preparation', 'movement', 'transition', 'completion'] as const).map((ph) => {
              const isActive = currentPhase === ph;
              return (
                <span
                  key={ph}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                      : 'text-stone-500 opacity-60'
                  }`}
                >
                  {ph}
                </span>
              );
            })}
          </div>
        </div>

        {/* Dynamic Skeleton Canvas & HUD */}
        <div className="flex-1 flex items-center justify-center relative p-8">
          {/* Ambient glow container */}
          <div className="absolute inset-0 bg-radial-[circle_at_center] from-emerald-950/15 via-transparent to-transparent pointer-events-none" />

          {/* SVG Skeleton Vector Visualization */}
          <div id="skeleton-container" className="w-full max-w-[500px] aspect-square relative flex items-center justify-center">
            {/* Screen Reader Live Announcement Region */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {`Now practicing movement ${currentMovementIdx} of ${totalMovementsCount}: ${currentMovement.name}. ${isPlaying ? 'Movement active.' : 'Movement paused.'} ${isCurrentlyInhaling ? 'Breathe in.' : 'Breathe out.'} ${isMirrorMode ? 'Mirrored mode active.' : ''} ${activeView} view.`}
            </div>

            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full drop-shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-visible"
              role="img"
              aria-label={`FlowZen Tai Chi avatar visualization for ${currentMovement.name} (${activeView} view${isMirrorMode ? ', mirrored' : ''})`}
            >
              <FlowZenAvatar
                joints={joints}
                elementalTheme={elementalTheme}
                activeView={activeView}
                isCurrentlyInhaling={isCurrentlyInhaling}
                showSkeletonOverlay={showSkeletonOverlay}
              />
            </svg>

            {/* In-view overlay labels */}
            {isMirrorMode && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-950/60 border border-emerald-900 px-2.5 py-0.5 rounded-full">
                Mirrored View active
              </span>
            )}
          </div>

          {/* Camera Pose Guide Floating Picture-in-Picture Feed */}
          {isCameraMode && (
            <div className="absolute top-20 right-6 w-64 h-48 z-20 shadow-2xl rounded-2xl overflow-hidden border border-cyan-800/80 bg-stone-950/90 backdrop-blur">
              <CameraPoseGuide
                targetJoints={joints}
                isMirrorMode={isMirrorMode}
                onPoseDetected={(p) => setUserPose(p)}
                showSkeletonOverlay={showSkeletonOverlay}
                trainingLevel={trainingLevel}
              />
            </div>
          )}

          {/* Master Mode Instruction Card Overlay */}
          {trainingMode === 'master' && (
            <div className="absolute top-20 left-6 max-w-xs z-20 bg-stone-900/95 border border-emerald-800/80 p-4 rounded-2xl backdrop-blur-md shadow-2xl text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>Master Teaching Instruction</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 font-mono font-bold capitalize">
                  {elementalTheme.id}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Master Secret Tip</span>
                <p className="text-stone-200 font-serif leading-relaxed italic text-[11px] bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
                  "{masterMovement.masterTips[0]}"
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">Posture Correction</span>
                <p className="text-rose-300/90 text-[10px] leading-relaxed">
                  {masterMovement.commonMistakes[0]}
                </p>
              </div>

              <div className="pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
                <span>Pace: {masterMovement.breathingPattern.inhaleSeconds}s In / {masterMovement.breathingPattern.exhaleSeconds}s Out</span>
                <span className="text-amber-400 font-medium capitalize">{currentPhase}</span>
              </div>
            </div>
          )}

          {/* Live AI Somatic Posture Guidance Card Overlay */}
          {isAiGuidanceActive && (
            <div className="absolute top-20 left-6 max-w-xs z-20 bg-stone-900/90 border border-emerald-800/80 p-4 rounded-2xl backdrop-blur-md shadow-2xl text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{liveCoachingFeedback.headline}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 font-mono font-bold">
                  {Math.round((currentPoseComparison.alignmentScore + currentPoseComparison.balanceScore) / 2)}% Score
                </span>
              </div>

              {/* Training Level Selector Pills */}
              <div className="flex items-center gap-1 bg-stone-950/60 p-1 rounded-lg border border-stone-800">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setTrainingLevel(lvl)}
                    className={`flex-1 py-1 text-[10px] font-medium rounded-md capitalize transition-all ${
                      trainingLevel === lvl
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Balance & Alignment Visual Meters */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>Balance Rooting</span>
                  <span>{currentPoseComparison.balanceScore}%</span>
                </div>
                <div className="w-full bg-stone-950 h-1.5 rounded-full overflow-hidden border border-stone-800">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${currentPoseComparison.balanceScore}%` }}
                  />
                </div>
              </div>

              <p className="text-stone-300 leading-relaxed font-sans">
                {liveCoachingFeedback.coachingText}
              </p>

              <div className="text-[10px] text-stone-400 border-t border-stone-800/60 pt-1.5 italic flex items-center justify-between">
                <span>{liveCoachingFeedback.elementalPrompt}</span>
                <span className="text-amber-400 uppercase font-mono font-bold">{elementalTheme.id}</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-6 right-6 flex flex-col items-center gap-1.5 p-4 bg-stone-900/60 border border-stone-800 rounded-3xl backdrop-blur-md">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer Pulsing Aura */}
              <motion.div
                animate={{
                  scale: isCurrentlyInhaling ? [1, 1.4, 1.4] : [1.4, 1, 1],
                  opacity: isCurrentlyInhaling ? [0.1, 0.4, 0.4] : [0.4, 0.1, 0.1],
                }}
                transition={{ duration: 4 / speed, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-emerald-500"
              />
              {/* Inner Circle displaying Breathe text */}
              <motion.div
                animate={{
                  scale: isCurrentlyInhaling ? [1, 1.2, 1.2] : [1.2, 1, 1],
                }}
                transition={{ duration: 4 / speed, ease: "easeInOut", repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center"
              >
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {isCurrentlyInhaling ? 'In' : 'Out'}
                </span>
              </motion.div>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Breathing Pace</span>
              <span className="block text-[11px] text-stone-300 font-serif font-light max-w-[100px] truncate leading-none mt-0.5">
                {currentMovement.breathingPattern}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM TIMELINE & ACTIONS PANEL */}
        <div className="bg-stone-950 border-t border-stone-800 px-6 py-5 space-y-4">
          {/* Progress Timeline Scrubber */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Active Session Timer: <strong className="font-semibold text-stone-200">{formatTime(sessionTimer)}</strong>
              </span>
              <span className="text-stone-400 font-mono">
                {currentMovementIdx} / {totalMovementsCount} Sequences
              </span>
            </div>
            <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800/60">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Master Control Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Speed selection switches */}
            <div className="flex items-center gap-1.5 bg-stone-900/80 border border-stone-800 p-1.5 rounded-2xl">
              <Sliders className="h-3.5 w-3.5 text-stone-500 mx-2" />
              {[0.5, 0.75, 1.0, 1.25].map((s) => {
                const isActive = speed === s;
                return (
                  <button
                    key={s}
                    id={`speed-btn-${s}`}
                    onClick={() => setSpeed(s)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-emerald-500 text-stone-950 font-bold' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {s}x
                  </button>
                );
              })}
            </div>

            {/* Main playback panel */}
            <div className="flex items-center gap-4">
              <button
                id="player-prev-btn"
                onClick={prevMovement}
                className="p-3.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all"
                title="Previous Movement (←)"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>

              <button
                id="player-play-btn"
                onClick={togglePlay}
                className="p-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-all shadow-xl shadow-emerald-950/20"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause className="h-6 w-6 fill-stone-950" /> : <Play className="h-6 w-6 fill-stone-950 ml-0.5" />}
              </button>

              <button
                id="player-next-btn"
                onClick={nextMovement}
                className="p-3.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all"
                title="Next Movement (→)"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>

              <button
                id="player-restart-btn"
                onClick={resetPractice}
                className="p-3.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition-all"
                title="Restart Session (R)"
              >
                <RotateCcw className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Mirroring & complete action buttons */}
            <div className="flex items-center gap-3">
              <button
                id="player-mirror-btn"
                onClick={toggleMirrorMode}
                className={`px-4 py-2 text-xs font-semibold border rounded-2xl transition-all ${
                  isMirrorMode
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 font-bold'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title="Toggle Mirror Alignment"
              >
                Mirror Mode
              </button>

              <button
                id="player-finish-btn"
                onClick={handleFinishPractice}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-colors shadow-lg"
              >
                Finish Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Somatic biomechanics notes & common errors */}
      <div className="w-full md:w-[360px] flex flex-col bg-stone-950/50 p-6 space-y-6 overflow-y-auto">
        <div className="space-y-1 border-b border-stone-800/50 pb-4">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
            <Activity className="h-3 w-3" /> Movement Anatomy
          </span>
          <h2 className="font-serif text-xl font-normal text-stone-100">{currentMovement.name}</h2>
          <span className="text-xs text-stone-500 font-medium italic block">{currentMovement.traditionalName}</span>
        </div>

        {/* Form view selectors */}
        <div className="bg-stone-900/80 border border-stone-800/60 p-1 rounded-xl flex">
          {(['front', 'side'] as const).map((view) => {
            const isSel = activeView === view;
            return (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                  isSel 
                    ? 'bg-stone-800 text-stone-100 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {view} perspective
              </button>
            );
          })}
        </div>

        {/* Somatic biomechanics descriptions */}
        <div className="space-y-5 text-xs">
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-300 block uppercase tracking-wider text-[10px]">Biomechanics & Form</span>
            <p className="text-stone-400 leading-relaxed text-[11px] font-light">
              {currentMovement.description}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-stone-300 block uppercase tracking-wider text-[10px]">Target Benefits</span>
            <p className="text-emerald-300 bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-2xl leading-relaxed text-[11px] font-light">
              {currentMovement.benefits}
            </p>
          </div>

          {/* Common Mistakes Column */}
          <div className="p-4 bg-rose-950/15 border border-rose-900/30 rounded-2xl space-y-2">
            <span className="font-semibold text-rose-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
              Common Posture Pitfalls
            </span>
            <ul className="list-disc pl-4 space-y-1 text-rose-300/80 text-[10px] font-light">
              {currentMovement.commonMistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>

          {/* Safety note / limitation support */}
          <div className="p-4 bg-amber-950/15 border border-amber-900/30 rounded-2xl space-y-1.5">
            <span className="font-semibold text-amber-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <Info className="h-3.5 w-3.5 text-amber-500" />
              Safety Adaptation
            </span>
            <p className="text-amber-300/80 leading-relaxed text-[10px] font-light">
              {currentMovement.safetyNotes}
            </p>
          </div>
        </div>
      </div>

      {/* RATING MODAL (Session Completed overlay) */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            id="session-completion-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-stone-900 border border-stone-800 max-w-md w-full rounded-3xl p-8 space-y-6 text-center shadow-2xl"
            >
              <div className="space-y-2">
                <span className="mx-auto w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <Award className="h-6 w-6" />
                </span>
                <h3 className="font-serif text-2xl font-light text-stone-100">Somatic Practice Logged</h3>
                <p className="text-stone-400 text-xs max-w-xs mx-auto">
                  Your physical session has been logged in the FlowZen sanctuary records.
                </p>
              </div>

              {/* AI Master Practice Reflection card */}
              <div className="p-4 bg-gradient-to-r from-amber-950/40 via-stone-900 to-emerald-950/40 border border-amber-500/30 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
                  <Bot className="h-3.5 w-3.5 text-amber-400" />
                  <span>Master FlowZen's Reflection</span>
                </div>
                <p className="text-xs text-stone-200 italic leading-relaxed">
                  "{useCoachStore.getState().getPostPracticeReflection(currentLesson.title, Math.max(1, Math.round(sessionTimer / 60)), mindfulnessRating).reflection}"
                </p>
                <div className="text-[10px] text-emerald-300 font-medium pt-1 border-t border-stone-800/80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  <span>{useCoachStore.getState().getPostPracticeReflection(currentLesson.title, Math.max(1, Math.round(sessionTimer / 60)), mindfulnessRating).sanctuaryImpact}</span>
                </div>
              </div>

              {/* Practice stats review card */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-stone-950/60 border border-stone-800 rounded-2xl text-left text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">Pebbles Earned</span>
                  <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5" /> +15 Pebbles
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">Soma Duration</span>
                  <span className="text-stone-300 font-semibold text-sm mt-0.5 block">
                    {formatTime(sessionTimer)}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-800/60">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">Lesson Accomplished</span>
                  <span className="text-stone-300 mt-0.5 font-serif text-[11px] leading-relaxed block flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-stone-400" /> {currentLesson.title}
                  </span>
                </div>
              </div>

              {/* Mindfulness depth selector (1-5 stars) */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-stone-300 block uppercase tracking-wider">
                  Assess Mindfulness & Alignment Depth
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isSelected = star <= mindfulnessRating;
                    return (
                      <button
                        key={star}
                        id={`star-btn-${star}`}
                        onClick={() => setMindfulnessRating(star)}
                        className={`p-2.5 rounded-full transition-all border ${
                          isSelected 
                            ? 'bg-amber-950/20 border-amber-600 text-amber-400 scale-110' 
                            : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
                        }`}
                      >
                        <Star className={`h-5 w-5 ${isSelected ? 'fill-amber-400' : ''}`} />
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-stone-500 font-light block">
                  {mindfulnessRating === 5 && "Unbroken flow, pristine posture alignment & deep diaphragmatic release."}
                  {mindfulnessRating === 4 && "Strong somatic awareness with minimal alignment adjustments."}
                  {mindfulnessRating === 3 && "Moderate body presence, minor physical tension felt."}
                  {mindfulnessRating === 2 && "Scattered concentration, several form corrections required."}
                  {mindfulnessRating === 1 && "Restless flow, high tension, struggled to sync posture/breath."}
                </span>
              </div>

              {/* Submit session log actions */}
              <div className="space-y-2 pt-2">
                <button
                  id="submit-session-btn"
                  onClick={handleSubmitRating}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" /> Save Sanctuary Session
                </button>
                <button
                  id="cancel-completion-btn"
                  onClick={() => usePracticeStore.setState({ isCompleted: false, isPlaying: true })}
                  className="text-stone-500 hover:text-stone-300 text-[10px] font-semibold uppercase tracking-wider block mx-auto py-1"
                >
                  Return to Active Practice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
