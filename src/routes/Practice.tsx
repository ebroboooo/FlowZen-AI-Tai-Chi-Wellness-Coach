/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Heart, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Award, 
  AlertCircle, 
  ShieldAlert, 
  ChevronRight, 
  ChevronDown, 
  Flame, 
  Wind,
  Layers,
  HeartOff,
  Sparkles,
  RefreshCw,
  Eye,
  Play
} from 'lucide-react';
import { useCurriculumStore, DifficultyLevel } from '@/store/useCurriculumStore';
import { useAuthStore } from '@/store/useAuthStore';
import { usePracticeStore } from '@/store/usePracticeStore';
import PracticePlayer from '@/components/PracticePlayer';
import { programs } from '@/data/curriculumData';
import { Lesson, Movement } from '@/types';

export default function Practice() {
  const { 
    selectedProgramId, 
    selectedLevel, 
    favorites, 
    startedLessons, 
    completedLessons,
    setSelectedProgramId,
    setSelectedLevel,
    toggleFavorite,
    markLessonStarted,
    markLessonCompleted,
    loadCurriculumProgress 
  } = useCurriculumStore();

  const { currentLesson: activePracticeLesson, startPractice } = usePracticeStore();

  const currentUser = useAuthStore(state => state.currentUser);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // UI state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeMovement, setActiveMovement] = useState<Movement | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  // Sync state on mount/auth change
  useEffect(() => {
    loadCurriculumProgress();
  }, [currentUser, isAuthenticated, loadCurriculumProgress]);

  // Handle breathing guide animation cycle
  useEffect(() => {
    if (!activeMovement) return;
    const interval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000); // 4-second cycles
    return () => clearInterval(interval);
  }, [activeMovement]);

  // If there is an active practicing lesson, render the Biomechanical Practice Player overlay
  if (activePracticeLesson) {
    return <PracticePlayer />;
  }

  // Find currently selected program
  const currentProgram = programs.find(p => p.id === selectedProgramId) || programs[0];
  
  // Get lessons for selected program and difficulty
  const currentLessons: Lesson[] = currentProgram.levels[selectedLevel] || [];

  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    setActiveLesson(null);
    setActiveMovement(null);
  };

  const handleSelectLevel = (level: DifficultyLevel) => {
    setSelectedLevel(level);
    setActiveLesson(null);
    setActiveMovement(null);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    await toggleFavorite(lessonId);
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(activeLesson?.id === lesson.id ? null : lesson);
    setActiveMovement(null);
    // Mark as started automatically upon opening
    if (!startedLessons.includes(lesson.id)) {
      markLessonStarted(lesson.id);
    }
  };

  return (
    <div id="practice-container" className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-100 pb-6">
        <div className="text-left space-y-1">
          <h1 className="font-serif text-3xl font-light text-stone-900 tracking-tight">Practice Sanctuary</h1>
          <p className="text-xs text-stone-500 max-w-xl">
            Explore authentic somatic Tai Chi structures. Filter by pathway and depth to begin your physical meditation.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/60 rounded-2xl p-3.5 text-xs text-stone-700">
          <div className="flex items-center gap-1.5 pr-3 border-r border-stone-200">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            <span><strong className="text-stone-900">{favorites.length}</strong> Favorites</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 border-r border-stone-200">
            <Flame className="h-4 w-4 text-amber-500" />
            <span><strong className="text-stone-900">{startedLessons.length}</strong> Started</span>
          </div>
          <div className="flex items-center gap-1.5 pl-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span><strong className="text-stone-900">{completedLessons.length}</strong> Completed</span>
          </div>
        </div>
      </div>

      {/* Program Path Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Select Your Training Pathway</h2>
          {isAuthenticated && (
            <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Cloud Synced
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {programs.map((program) => {
            const isSelected = program.id === selectedProgramId;
            // Calculate progress for this program
            const allProgramLessons = [
              ...program.levels.Beginner,
              ...program.levels.Intermediate,
              ...program.levels.Advanced
            ];
            const completedCount = allProgramLessons.filter(l => completedLessons.includes(l.id)).length;
            const totalCount = allProgramLessons.length;
            const startedCount = allProgramLessons.filter(l => startedLessons.includes(l.id)).length;

            return (
              <button
                key={program.id}
                id={`program-btn-${program.id}`}
                onClick={() => handleSelectProgram(program.id)}
                className={`text-left p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[160px] ${
                  isSelected 
                    ? 'bg-white border-stone-900 shadow-sm shadow-stone-100' 
                    : 'bg-white border-stone-200/60 hover:border-stone-400 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className={`p-2.5 rounded-2xl ${isSelected ? 'bg-stone-950 text-white' : 'bg-stone-50 text-stone-600 group-hover:bg-stone-100'} transition-colors`}>
                      <Compass className="h-4.5 w-4.5" />
                    </span>
                    {completedCount === totalCount && totalCount > 0 ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
                        Mastered
                      </span>
                    ) : startedCount > 0 ? (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">
                        In Progress
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-normal text-stone-900 group-hover:text-stone-950 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-[10px] text-stone-400">
                  <div className="flex flex-wrap gap-1 max-w-[70%]">
                    {program.focus.slice(0, 2).map((f, i) => (
                      <span key={i} className="bg-stone-50 border border-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-stone-700">
                    {completedCount}/{totalCount} Completed
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Core Layout: Level tabs & lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: Lessons */}
        <div className="lg:col-span-7 space-y-6">
          {/* Level Selection Tabs */}
          <div className="flex items-center justify-between bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/40">
            <div className="flex gap-1 w-full">
              {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((level) => {
                const isSelected = level === selectedLevel;
                return (
                  <button
                    key={level}
                    id={`level-tab-${level}`}
                    onClick={() => handleSelectLevel(level)}
                    className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                      isSelected 
                        ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson Listing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                {selectedLevel} Lessons ({currentLessons.length})
              </h3>
            </div>

            <AnimatePresence mode="popLayout">
              {currentLessons.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 text-center bg-stone-50 rounded-3xl border border-stone-200/50 space-y-2"
                >
                  <BookOpen className="h-8 w-8 text-stone-300 mx-auto" />
                  <p className="text-sm font-light text-stone-600">No lessons prepared for this tier yet.</p>
                </motion.div>
              ) : (
                currentLessons.map((lesson) => {
                  const isOpened = activeLesson?.id === lesson.id;
                  const isFavorite = favorites.includes(lesson.id);
                  const isStarted = startedLessons.includes(lesson.id);
                  const isCompleted = completedLessons.includes(lesson.id);

                  return (
                    <motion.div
                      key={lesson.id}
                      id={`lesson-card-${lesson.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`p-6 rounded-3xl border transition-all duration-300 relative cursor-pointer ${
                        isOpened 
                          ? 'bg-white border-stone-800 shadow-sm' 
                          : 'bg-white border-stone-200/60 hover:border-stone-300'
                      }`}
                      onClick={() => handleOpenLesson(lesson)}
                    >
                      {/* Lesson Card Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-stone-600">
                              <Clock className="h-3 w-3" /> {lesson.duration} min
                            </span>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3" /> Completed
                              </span>
                            ) : isStarted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full animate-pulse">
                                In Progress
                              </span>
                            ) : null}
                          </div>
                          <h4 className="font-serif text-lg font-normal text-stone-950">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>

                        {/* Favorite & Toggle controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`fav-btn-${lesson.id}`}
                            onClick={(e) => handleToggleFavorite(e, lesson.id)}
                            className={`p-2.5 rounded-full border transition-all ${
                              isFavorite 
                                ? 'bg-rose-50 border-rose-100 text-rose-500' 
                                : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-600'
                            }`}
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                          </button>
                          <span className="p-2.5 text-stone-400 group-hover:text-stone-600 transition-colors">
                            {isOpened ? <ChevronDown className="h-4.5 w-4.5 text-stone-800" /> : <ChevronRight className="h-4.5 w-4.5" />}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Movements / Details */}
                      {isOpened && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-6 pt-6 border-t border-stone-100 space-y-6 cursor-default"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Benefits & Target Areas */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                              <span className="font-semibold text-stone-700 block">Somatic Benefits</span>
                              <ul className="list-disc pl-4 space-y-1 text-stone-500">
                                {lesson.benefits.map((benefit, idx) => (
                                  <li key={idx}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                              <span className="font-semibold text-stone-700 block">Target Areas</span>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {lesson.targetAreas.map((area, idx) => (
                                  <span key={idx} className="bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-lg text-[10px]">
                                    {area}
                                  </span>
                                ))}
                              </div>
                              <div className="pt-2">
                                <span className="text-[10px] text-stone-400 block">Prerequisite Experience</span>
                                <span className="text-[10px] font-medium text-stone-600">{lesson.requiredExperience}</span>
                              </div>
                            </div>
                          </div>

                          {/* Movements Checklist */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                              Movement Sequence ({lesson.movements.length})
                            </h5>
                            <div className="space-y-2">
                              {lesson.movements.map((movement) => {
                                const isSelected = activeMovement?.id === movement.id;
                                return (
                                  <button
                                    key={movement.id}
                                    id={`movement-row-${movement.id}`}
                                    onClick={() => setActiveMovement(isSelected ? null : movement)}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                                      isSelected
                                        ? 'bg-stone-900 border-stone-900 text-white'
                                        : 'bg-white border-stone-100 hover:border-stone-200 text-stone-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-50 border border-stone-200 text-stone-600'
                                      }`}>
                                        <Layers className="h-3 w-3" />
                                      </span>
                                      <div>
                                        <span className="text-xs font-medium block">{movement.name}</span>
                                        <span className={`text-[10px] block ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                                          {movement.traditionalName}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100/5 text-stone-400">
                                      <Eye className="h-3 w-3" /> View Guides
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center w-full">
                            <button
                              id={`start-practice-btn-${lesson.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                startPractice(lesson);
                              }}
                              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/10 hover:scale-[1.01]"
                            >
                              <Play className="h-4 w-4 fill-white" /> Begin Somatic Practice
                            </button>

                            {!isCompleted ? (
                              <button
                                id={`complete-btn-${lesson.id}`}
                                onClick={() => markLessonCompleted(lesson.id)}
                                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="h-4 w-4 text-stone-500" /> Mark Complete
                              </button>
                            ) : (
                              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-emerald-800 w-full sm:w-auto gap-4">
                                <span className="flex items-center gap-1 font-medium">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  Mastered
                                </span>
                                <button
                                  id={`restart-btn-${lesson.id}`}
                                  onClick={async () => {
                                    // Reset completed state
                                    const filtered = completedLessons.filter(id => id !== lesson.id);
                                    useCurriculumStore.setState({ completedLessons: filtered });
                                    localStorage.setItem('fz_curriculum_completed', JSON.stringify(filtered));
                                  }}
                                  className="text-[10px] underline font-semibold flex items-center gap-1 text-emerald-700 hover:text-emerald-900 whitespace-nowrap"
                                >
                                  <RefreshCw className="h-3 w-3" /> Practice Again
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right pane: Movement Detail & Visualizer Placeholder */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {!activeMovement ? (
              <motion.div
                key="empty-movement"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-8 bg-stone-50 border border-stone-200/50 rounded-3xl text-center space-y-4 min-h-[400px] flex flex-col justify-center items-center"
              >
                <Compass className="h-10 w-10 text-stone-300 animate-spin-slow" />
                <h4 className="font-serif text-lg font-light text-stone-800">Movement Biomechanical Visuals</h4>
                <p className="text-stone-400 text-xs max-w-xs mx-auto leading-relaxed">
                  Select a movement in the list to reveal anatomical alignment details, breathing pace indicators, and common posture corrections.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeMovement.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-stone-200 rounded-3xl p-6 space-y-6 shadow-xs sticky top-4"
              >
                {/* Movement Title */}
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md uppercase font-bold tracking-wide">
                    Active Biomechanics Guide
                  </span>
                  <h3 className="font-serif text-xl font-normal text-stone-900 mt-1">
                    {activeMovement.name}
                  </h3>
                  <span className="text-xs text-stone-500 font-medium block mt-0.5 italic">
                    {activeMovement.traditionalName}
                  </span>
                </div>

                {/* Simulated Breathing Guide Component */}
                <div className="p-6 bg-stone-50 border border-stone-100 rounded-2xl text-center space-y-4 relative overflow-hidden">
                  <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-bold text-stone-400 uppercase tracking-wide">
                    <Wind className="h-3 w-3" /> Pacing Guide
                  </div>
                  
                  {/* Glowing Pulse Circle */}
                  <div className="relative flex items-center justify-center h-28 my-2">
                    <motion.div
                      animate={{
                        scale: breathPhase === 'inhale' ? [1, 1.4, 1.4] : [1.4, 1, 1],
                        opacity: breathPhase === 'inhale' ? [0.15, 0.35, 0.35] : [0.35, 0.15, 0.15],
                      }}
                      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                      className="absolute w-20 h-20 rounded-full bg-emerald-500"
                    />
                    <motion.div
                      animate={{
                        scale: breathPhase === 'inhale' ? [1, 1.25, 1.25] : [1.25, 1, 1],
                      }}
                      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                      className="absolute w-16 h-16 rounded-full bg-emerald-600/30 flex items-center justify-center text-xs font-semibold text-emerald-800 uppercase tracking-widest"
                    >
                      {breathPhase}
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-stone-800 block">Breathing Rhythm</span>
                    <p className="text-[11px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                      {activeMovement.breathingPattern}
                    </p>
                  </div>
                </div>

                {/* Biomechanical Descriptions */}
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="font-semibold text-stone-700 block mb-1">Execution & Form</span>
                    <p className="text-stone-500 leading-relaxed text-[11px]">
                      {activeMovement.description}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-700 block mb-1">Target Health Benefits</span>
                    <p className="text-emerald-800 bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-xl leading-relaxed text-[11px]">
                      {activeMovement.benefits}
                    </p>
                  </div>

                  {/* Mistakes Column */}
                  <div className="p-3.5 bg-red-50/40 border border-red-100 rounded-2xl space-y-2">
                    <span className="font-semibold text-red-800 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                      Common Alignment Pitfalls
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-red-700/80 text-[10px]">
                      {activeMovement.commonMistakes.map((mistake, idx) => (
                        <li key={idx}>{mistake}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety Guidance */}
                  <div className="p-3.5 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-1.5">
                    <span className="font-semibold text-amber-800 flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                      Safety & Injury Prevention
                    </span>
                    <p className="text-amber-700/90 leading-relaxed text-[10px]">
                      {activeMovement.safetyNotes}
                    </p>
                  </div>
                </div>

                {/* Animation placeholder description */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                  <span>Front Reference: <strong className="font-medium text-stone-500">{activeMovement.frontAnimationPlaceholderId}</strong></span>
                  <span>Side Reference: <strong className="font-medium text-stone-500">{activeMovement.sideAnimationPlaceholderId}</strong></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
