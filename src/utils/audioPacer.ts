/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioPacer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  public start(freq: number = 220) {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx) {
      try {
        this.osc = this.ctx.createOscillator();
        this.gainNode = this.ctx.createGain();
        this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        this.gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
        this.osc.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        this.osc.start();
      } catch {}
    }
  }

  public setVolume(volume: number, rampDuration: number = 0.1) {
    if (!this.ctx || !this.gainNode) return;
    const now = this.ctx.currentTime;
    this.gainNode.gain.linearRampToValueAtTime(Math.max(0, volume), now + rampDuration);
  }

  public setFrequency(freq: number, rampDuration: number = 0.1) {
    if (!this.ctx || !this.osc) return;
    const now = this.ctx.currentTime;
    this.osc.frequency.linearRampToValueAtTime(freq, now + rampDuration);
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {}
    }
  }
}

export const audioPacer = new AudioPacer();
