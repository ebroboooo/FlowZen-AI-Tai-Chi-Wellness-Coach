/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { analytics } from '@/utils/analytics';
import { 
  Bot, 
  Sparkles, 
  Compass, 
  Sun, 
  Moon, 
  Wind, 
  Droplets, 
  Flame, 
  Mountain, 
  Send, 
  Crown, 
  ShieldCheck, 
  MessageSquare,
  Zap
} from 'lucide-react';
import { useCoachStore } from '@/store/useCoachStore';

interface AiMasterMessageCardProps {
  onOpenCoachModal?: () => void;
}

export default function AiMasterMessageCard({ onOpenCoachModal }: AiMasterMessageCardProps) {
  const { getAiMasterProfile, getDailyMasterMessage, sendMessage, isLoading, error } = useCoachStore();

  const masterProfile = getAiMasterProfile();
  const dailyMsg = getDailyMasterMessage();

  const [questionText, setQuestionText] = useState('');
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [showPremiumPreview, setShowPremiumPreview] = useState(false);

  // Elemental icon mapping
  const getElementalIcon = (element: string) => {
    switch (element.toLowerCase()) {
      case 'water': return <Droplets className="h-3.5 w-3.5 text-cyan-500" />;
      case 'fire': return <Flame className="h-3.5 w-3.5 text-amber-500" />;
      case 'earth': return <Mountain className="h-3.5 w-3.5 text-emerald-600" />;
      default: return <Wind className="h-3.5 w-3.5 text-sky-500" />;
    }
  };

  useEffect(() => {
    analytics.track('ai_master_opened');
  }, []);

  const handleAskMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || isLoading) return;
    const query = questionText;
    setQuestionText('');
    setShowQuickChat(true);
    analytics.track('ai_master_opened', { query: query.substring(0, 30) });
    await sendMessage(query);
  };

  return (
    <div 
      id="ai-master-message-card-root"
      className="bg-gradient-to-br from-amber-900/10 via-stone-900 to-emerald-950 text-stone-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-amber-800/20 relative overflow-hidden text-left"
    >
      {/* Top Banner: Master Identity & User Profile Alignment */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-700/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-xs">
            <Bot className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-normal text-amber-100">
                {masterProfile.mentorName}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-400" /> AI Master Companion
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              Personal Mentor for <strong className="text-amber-200">{masterProfile.userName}</strong>
            </p>
          </div>
        </div>

        {/* Personalized User Profile Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-stone-800/80 border border-stone-700 text-stone-300 px-3 py-1 rounded-xl flex items-center gap-1.5 text-[11px]">
            {getElementalIcon(masterProfile.elementalAlignment)}
            <span className="capitalize">{masterProfile.elementalAlignment} Element</span>
          </span>
          <span className="bg-stone-800/80 border border-stone-700 text-amber-200 px-3 py-1 rounded-xl text-[11px] font-medium">
            Goal: {masterProfile.mainGoal}
          </span>
          <span className="bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-3 py-1 rounded-xl text-[11px] font-medium">
            {masterProfile.practiceLevel} Path
          </span>
        </div>
      </div>

      {/* Main AI Daily Master Message Body */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sun className="h-4 w-4 text-amber-400" />
            <span>Daily Master Intention</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-light text-white leading-snug">
            "{dailyMsg.greeting} {dailyMsg.message}"
          </h4>
        </div>

        {/* Guidance Grid: Focus Advice & Posture Tip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-amber-700/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" /> Goal Alignment
            </span>
            <p className="text-xs text-stone-300 leading-relaxed">
              {dailyMsg.focusAdvice}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-emerald-800/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Somatic Posture Key
            </span>
            <p className="text-xs text-stone-300 leading-relaxed">
              {dailyMsg.postureTip}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Quick AI Dialogue Form */}
      <form onSubmit={handleAskMaster} className="pt-2 space-y-3 border-t border-amber-700/20">
        <div className="flex items-center justify-between text-xs text-stone-300">
          <span className="flex items-center gap-1.5 font-medium text-amber-200">
            <MessageSquare className="h-4 w-4 text-amber-400" /> Ask Master FlowZen
          </span>
          <button
            type="button"
            onClick={() => setShowPremiumPreview(!showPremiumPreview)}
            className="text-[11px] text-amber-300/80 hover:text-amber-200 underline font-medium flex items-center gap-1 transition-colors"
          >
            <Zap className="h-3 w-3 text-amber-400" />
            {showPremiumPreview ? 'Hide AI Master Features' : 'Preview Master AI Foundation'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Ask about your posture, joint alignment, or daily stress..."
            className="flex-1 bg-stone-900/90 border border-stone-700 focus:border-amber-500 text-stone-100 placeholder-stone-500 rounded-2xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !questionText.trim()}
            className="min-h-[40px] px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isLoading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Reflect</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Premium Foundation Placeholders (Non-blocking, clearly marked as Preview) */}
      <AnimatePresence>
        {showPremiumPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-amber-700/30 pb-2">
              <span className="font-semibold text-amber-200 flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-amber-400" /> AI Master Premium Foundation (Preview)
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                Upcoming Roadmap
              </span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Our AI Master architecture is built to support advanced future expansions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
                <strong className="text-amber-200 block font-medium">3D Skeleton Biomechanics</strong>
                <span className="text-stone-400 block text-[10px]">Real-time joint angle trajectory analysis & knee safety warnings.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
                <strong className="text-amber-200 block font-medium">Voice Master Dialogue</strong>
                <span className="text-stone-400 block text-[10px]">Natural conversational spoken guidance during active stances.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
                <strong className="text-amber-200 block font-medium">Adaptive Daily Flow</strong>
                <span className="text-stone-400 block text-[10px]">Personalized curriculum auto-synthesized from your check-in journal.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
