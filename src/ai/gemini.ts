/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * FlowZen AI Service Configuration & Endpoint Definitions.
 * Real AI processing is handled securely server-side via Express routes.
 */

export const AI_ENDPOINTS = {
  COACH_CHAT: '/api/ai/coach',
  ROUTINE_GEN: '/api/ai/routine',
} as const;

export const DEFAULT_AI_CONFIG = {
  model: 'gemini-2.5-flash',
  maxTokens: 1024,
  temperature: 0.2,
} as const;

export const getAIConfig = () => DEFAULT_AI_CONFIG;

