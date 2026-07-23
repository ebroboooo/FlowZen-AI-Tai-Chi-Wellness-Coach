/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AnalyticsEventType =
  | 'app_opened'
  | 'onboarding_completed'
  | 'first_practice_started'
  | 'first_practice_completed'
  | 'garden_visited'
  | 'daily_reward_claimed'
  | 'ai_master_opened';

export interface AnalyticsEvent {
  name: AnalyticsEventType;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

const STORAGE_KEY = 'fz_analytics_events_v1';

class FlowZenAnalytics {
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          this.events = JSON.parse(raw);
        }
      }
    } catch {
      this.events = [];
    }
  }

  private saveEvents() {
    try {
      if (typeof localStorage !== 'undefined') {
        // Keep max 100 recent local events to respect device memory
        const trimmed = this.events.slice(-100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      }
    } catch {
      // Storage safety
    }
  }

  public track(name: AnalyticsEventType, metadata?: Record<string, string | number | boolean>) {
    const event: AnalyticsEvent = {
      name,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.events.push(event);
    this.saveEvents();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Track]: ${name}`, metadata || '');
    }
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public hasTracked(name: AnalyticsEventType): boolean {
    return this.events.some((e) => e.name === name);
  }
}

export const analytics = new FlowZenAnalytics();
