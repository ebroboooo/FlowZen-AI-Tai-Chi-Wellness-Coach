/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  priority?: boolean;
}

class SpeechQueueManager {
  private lastSpokenText: string = '';
  private lastSpokenTimestamp: number = 0;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Clean up speech synthesis if window is unloaded
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.addEventListener('beforeunload', () => {
        this.cancel();
      });
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.cancel();
    }
  }

  public speak(text: string, options: SpeechOptions = {}): void {
    if (!text || this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const trimmedText = text.trim();
    if (!trimmedText) return;

    const now = Date.now();
    // Prevent rapid duplicate announcements of the exact same text within 2 seconds
    if (trimmedText === this.lastSpokenText && now - this.lastSpokenTimestamp < 2000) {
      return;
    }

    try {
      // Safely cancel any active utterance first so voice guidance never overlaps
      this.cancel();

      const utterance = new SpeechSynthesisUtterance(trimmedText);
      utterance.rate = options.rate ?? 0.95; // Slightly measured rate for peaceful Tai Chi guidance
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 0.8;
      utterance.lang = options.lang ?? 'en-US';

      utterance.onend = () => {
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
        }
      };

      utterance.onerror = (e) => {
        // SpeechSynthesis error event handled gracefully (e.g., canceled or interrupted)
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
        }
      };

      this.lastSpokenText = trimmedText;
      this.lastSpokenTimestamp = now;
      this.currentUtterance = utterance;

      // Queue utterance
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis unavailable or failed:', err);
      this.currentUtterance = null;
    }
  }

  public cancel(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      // Handle potential browser speech engine exceptions
    } finally {
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    } catch {}
  }

  public resume(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {}
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    try {
      return window.speechSynthesis.speaking;
    } catch {
      return false;
    }
  }
}

export const speechQueue = new SpeechQueueManager();
