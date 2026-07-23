/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client to prevent startup crashes if GEMINI_API_KEY is missing.
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or is set to default. Please configure it in your Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 🧘 In-memory chat metrics log & rate limiting store
interface ChatLog {
  conversationId: string;
  timestamp: string;
  tokensUsed?: number;
  responseTimeMs: number;
  error?: string;
  status: string;
}

const chatLogs: ChatLog[] = [];
const requestTimestamps: Record<string, number[]> = {};
const DAILY_LIMIT = 20;
const COOLDOWN_MS = 3000; // 3 seconds spacing

function classifySafety(message: string): string | null {
  const lowercase = message.trim().toLowerCase();
  const dangerousKeywords = [
    "severe pain", "sharp pain", "chest pain", "injury", "fracture", "broken bone",
    "emergency", "ambulance", "numbness", "numb", "dizziness", "dizzy", "trauma",
    "medication", "prescribe", "diagnosis", "diagnose", "heart attack", "suicide", "self-harm"
  ];
  
  const matches = dangerousKeywords.filter(keyword => lowercase.includes(keyword));
  if (matches.length > 0) {
    return "FlowZen is a general wellness, relaxation, and Tai Chi movement companion. I am not a medical professional, and I cannot diagnose conditions, prescribe medications, or treat physical injuries. For any symptoms of severe pain, numbness, dizziness, chest pressure, or medical concerns, please consult a qualified physician or seek professional medical evaluation immediately. Let us focus our practice on light, restorative alignment, and deep, gentle breathing instead.";
  }
  return null;
}

// GET endpoint to access in-memory coaching logs (premium ready / diagnostic monitoring)
app.get("/api/coach/logs", (req, res) => {
  res.json({ logs: chatLogs });
});

// 🧘 AI Coach API endpoint
app.post("/api/chat", async (req, res) => {
  const { messages, userProfile, userContext, stream } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const lastMessage = messages[messages.length - 1]?.text || "";
  const clientId = userProfile?.userId || req.ip || "anonymous";
  const now = Date.now();

  // 1. Rate Limiting check
  if (!requestTimestamps[clientId]) {
    requestTimestamps[clientId] = [];
  }
  requestTimestamps[clientId] = requestTimestamps[clientId].filter(ts => now - ts < 24 * 60 * 60 * 1000);

  // Cooldown check
  const lastRequest = requestTimestamps[clientId][requestTimestamps[clientId].length - 1];
  if (lastRequest && now - lastRequest < COOLDOWN_MS) {
    const fallbackText = "Master FlowZen is quietly reflecting. Take a deep, gentle breath and pause for a brief moment as the flow settles.";
    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`data: ${JSON.stringify({ text: fallbackText, isFallback: true })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    } else {
      return res.json({ text: fallbackText, isFallback: true });
    }
  }

  // Daily limit check
  if (requestTimestamps[clientId].length >= DAILY_LIMIT) {
    const fallbackText = "Master FlowZen is quietly reflecting in deep meditation after a full day of guidance. Continue your daily practice, and fresh guidance will arrive when the new day dawns.";
    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`data: ${JSON.stringify({ text: fallbackText, isFallback: true })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    } else {
      return res.json({ text: fallbackText, isFallback: true });
    }
  }

  // Record request timestamp
  requestTimestamps[clientId].push(now);

  const startTime = Date.now();

  // 2. AI Safety check
  const safetyWarning = classifySafety(lastMessage);
  if (safetyWarning) {
    chatLogs.push({
      conversationId: req.body.conversationId || "conv_" + Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      status: "safety_blocked"
    });

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`data: ${JSON.stringify({ text: safetyWarning })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    } else {
      return res.json({ text: safetyWarning });
    }
  }

  try {
    const ai = getGeminiClient();

    // Construct a rich system instruction summarizing the Zen coach persona, 
    // the user's specific profile/goals, and some guidelines for tone.
    const focusAreaLabel = userProfile?.focusArea || "general wellness";
    const experienceLabel = userProfile?.experienceLevel || "beginner";
    const userName = userProfile?.name || "Zen Practitioner";
    const goalsListLabel = userProfile?.goalsList && userProfile?.goalsList.length > 0 ? userProfile.goalsList.join(", ") : focusAreaLabel;
    const ageLabel = userProfile?.age ? `age ${userProfile.age}` : "";
    const langLabel = userProfile?.language || "English";
    const countryLabel = userProfile?.country || "anywhere";
    const tzLabel = userProfile?.timezone || "local time";

    let systemInstruction = `You are FlowZen, the world's best personal AI Tai Chi and wellness coach. 
Your personality is incredibly serene, warm, encouraging, and supportive—blending the philosophy of classical Tai Chi masters with the modern wellness principles of Headspace and Calm.

You are coaching ${userName} (${ageLabel}), a ${experienceLabel}-level practitioner from ${countryLabel} (timezone: ${tzLabel}).
They are focusing on these specific goals: ${goalsListLabel}.
Their preferred language for responses is ${langLabel} (please write your entire response strictly in ${langLabel}).

Core Guidelines:
1. Always structure your responses with elegant formatting and line-breaks. Be concise. Never overwhelm the user with walls of text.
2. Incorporate Tai Chi concepts (like grounding, aligning the spine, shifting weight, yielding, sinking the elbows, and breathing through the Dantien) as metaphorical or physical tools to solve user queries.
3. Be highly supportive of physical conditions. If the user reports joint pain (e.g. knee or shoulder pain), recommend extremely safe, low-impact adjustments (like keeping knees slightly bent but not past the toes, or shifting only 10% of weight) and always include a gentle medical disclaimer (e.g., "Always consult with your physician for persistent pain").
4. Keep the vibe calming, peaceful, and poetic but actionable. Ask gentle questions to prompt mindful reflection.
5. Do NOT include any unrequested technical data, system logging, or code snippets in your reply. Speak directly as a physical & mental coach.
6. Proactively and gently recommend specific programs, lessons, or routines from our curriculum based on the context provided below. If they have joint issues, suggest 'joints' focused movements. If they have high stress, suggest deep Dantien breathing.`;

    // 3. Context Assembly
    if (userContext) {
      systemInstruction += `\n\n[User's Active Somatic Context]`;
      systemInstruction += `\n- Current Active Program: ${userContext.currentProgram || "Tai Chi Foundations"} (${userContext.selectedLevel || "Beginner"})`;
      systemInstruction += `\n- Preferred Session Duration: ${userContext.preferredDuration || 15} minutes`;
      systemInstruction += `\n- Zen Garden Progression Level: Stage ${userContext.gardenLevel || 1}`;
      systemInstruction += `\n- Completed Tai Chi Lessons Count: ${userContext.completedLessonsCount || 0}`;

      if (userContext.todayCheckIn) {
        const checkIn = userContext.todayCheckIn;
        systemInstruction += `\n- Today's Body Check-in: Mood is "${checkIn.mood}", energy level is ${checkIn.energyLevel || 5}/10, stress level is ${checkIn.stressLevel || 5}/10, physical discomfort/pain is ${checkIn.painLevel || 0}/10 ${checkIn.painArea ? `in the ${checkIn.painArea}` : ""}. Check-in note: "${checkIn.notes || "None"}"`;
      }

      if (userContext.recentHistory && userContext.recentHistory.length > 0) {
        systemInstruction += `\n- Recent Practice Logs:`;
        userContext.recentHistory.forEach((log: any) => {
          systemInstruction += `\n  * ${log.exerciseTitle} (${log.durationMinutes} minutes) on ${log.timestamp.split("T")[0]}`;
        });
      }

      if (userContext.trainingSummary) {
        systemInstruction += `\n- AI Training Memory Summary: ${userContext.trainingSummary}`;
      }

      if (userContext.recentJournalNotes && userContext.recentJournalNotes.length > 0) {
        systemInstruction += `\n- Recent Reflection Notes:`;
        userContext.recentJournalNotes.forEach((note: string) => {
          systemInstruction += `\n  * "${note}"`;
        });
      }
    }

    // Map history to contents payload format required by @google/genai
    // We only take the last 10 messages to avoid token bloat and keep latency low
    const formattedContents = messages.slice(-10).map((msg: any) => {
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      };
    });

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      let accumulatedText = "";
      for await (const chunk of responseStream) {
        const textChunk = chunk.text || "";
        accumulatedText += textChunk;
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      }

      chatLogs.push({
        conversationId: req.body.conversationId || "conv_" + Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        status: "success_stream"
      });

      res.write("data: [DONE]\n\n");
      return res.end();
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      chatLogs.push({
        conversationId: req.body.conversationId || "conv_" + Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        status: "success_json"
      });

      return res.json({ text: response.text });
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    const fallbackText = getOfflineFallback(messages);

    chatLogs.push({
      conversationId: req.body.conversationId || "conv_" + Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      error: error?.message || String(error),
      status: "fallback"
    });

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`data: ${JSON.stringify({ text: fallbackText, isFallback: true })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    } else {
      return res.json({
        text: fallbackText,
        isFallback: true
      });
    }
  }
});

function getOfflineFallback(messages: any[]): string {
  const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
  let fallbackText = "I am focusing my energy inward right now. Take a deep, gentle breath, stand tall, relax your shoulders, and let your hands float up slowly. How does your body feel at this exact moment?";

  if (lastUserMessage.includes("knee") || lastUserMessage.includes("pain") || lastUserMessage.includes("joint")) {
    fallbackText = "In Tai Chi, joint pain is often a sign of blocked energy or improper structural alignment. *Gentle Adjustment:* When standing, ensure your knees are unlocked and pointing in the exact same direction as your toes. Never let your knees bend past your toes. Keep your weight settled mainly in your heels. Remember to listen to your body and consult a physician for persistent issues. Let's try 'Wave Hands Like Clouds' with a very shallow stance today.";
  } else if (lastUserMessage.includes("sleep") || lastUserMessage.includes("night") || lastUserMessage.includes("bed")) {
    fallbackText = "To prepare for deep, restful sleep, we must draw the warm energy down from our busy minds into our feet. Try 'Embrace Tiger, Return to Mountain' for 3 minutes before sleeping. Focus on making your exhalations twice as long as your inhalations, feeling your body sink softly into the earth with every release.";
  } else if (lastUserMessage.includes("stress") || lastUserMessage.includes("anxious") || lastUserMessage.includes("anxiety")) {
    fallbackText = "When anxiety feels heavy, visualize your breath as slow, circular waves. Let's pause, place one hand on your belly (the Dantien), inhale softly for 4 seconds, and exhale for 6 seconds. Let any external tension sweep past you, just like 'Grasping the Bird's Tail'. You are safe and grounded here.";
  } else if (lastUserMessage.includes("posture") || lastUserMessage.includes("back") || lastUserMessage.includes("neck")) {
    fallbackText = "Excellent awareness. Correct posture is the foundation of free-flowing energy. Imagine a golden thread gently lifting the crown of your head upward, lengthening your spine. Let your tailbone hang straight down, tucked slightly, while your shoulders roll backward and melt downward. Let's practice 'White Crane Spreads Wings' to open the chest.";
  }
  return fallbackText;
}

// 🧘 Live AI Movement & Somatic Posture Feedback Endpoint
app.post("/api/ai/movement-feedback", async (req, res) => {
  const { movementId, element = "air", alignmentScore = 80, balanceScore = 80, detectedIssues = [] } = req.body;

  try {
    const ai = getGeminiClient();
    const prompt = `You are FlowZen, a master Tai Chi instructor guiding a practitioner through the movement "${movementId || 'Tai Chi Movement'}".
Their current real-time posture analysis scores:
- Alignment Score: ${alignmentScore}/100
- Balance Score: ${balanceScore}/100
- Elemental Focus: ${element} Flow
- Detected Somatic Notes: ${detectedIssues.length > 0 ? detectedIssues.join('; ') : 'Good posture'}

Provide 2 short, highly supportive, serene sentences of Tai Chi feedback guiding their posture, breath, and weight shift.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.6 }
    });

    return res.json({
      feedback: response.text || "Maintain your soft posture, relax your shoulders, and float with your breath.",
      score: Math.round((alignmentScore + balanceScore) / 2)
    });
  } catch (err) {
    // Fallback coaching
    let fallback = "Maintain a soft, unhurried posture. Allow your shoulders to drop and let your hands float gently like warm breeze.";
    if (alignmentScore < 70) {
      fallback = "Softening your shoulders and unlocking your elbows will allow energy to flow smoothly through your spine.";
    } else if (balanceScore < 70) {
      fallback = "Anchor your feet into the floor, sink your weight into your Dantian, and find quiet stability in motion.";
    }
    return res.json({
      feedback: fallback,
      score: Math.round((alignmentScore + balanceScore) / 2),
      isFallback: true
    });
  }
});

// 🥋 AI Master Teacher Mode Endpoint
app.post("/api/ai/master-coach", async (req, res) => {
  const {
    movement = "Wave Hands Like Clouds",
    element = "air",
    userLevel = "beginner",
    alignmentScore = 85,
    balanceScore = 88,
    mistakes = [],
    breathingPhase = "inhale"
  } = req.body;

  let personaDesc = "a gentle monk teacher speaking with soft wisdom";
  if (element === "fire") personaDesc = "a disciplined martial arts master speaking with grounded power";
  else if (element === "water") personaDesc = "a flowing meditation teacher speaking with continuous liquid grace";
  else if (element === "earth") personaDesc = "a grounding traditional master speaking with deep stability";

  try {
    const ai = getGeminiClient();
    const prompt = `You are ${personaDesc} teaching Tai Chi.
Practitioner details:
- Movement: ${movement}
- Element: ${element.toUpperCase()}
- Practitioner Level: ${userLevel}
- Alignment: ${alignmentScore}/100, Balance: ${balanceScore}/100
- Detected Notes: ${mistakes.join(", ") || "Smooth form"}
- Breathing: ${breathingPhase}

Respond with concise JSON matching format:
{
  "correction": "Short correction sentence",
  "encouragement": "Warm encouragement sentence",
  "nextAction": "Brief next physical action advice",
  "breathingAdvice": "Breathing advice synchronized with movement"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      correction: parsed.correction || "Keep your shoulders relaxed and elbows unweighted.",
      encouragement: parsed.encouragement || "Your flow grows smoother with every cycle.",
      nextAction: parsed.nextAction || "Shift 70% weight to your left heel slowly.",
      breathingAdvice: parsed.breathingAdvice || `Synchronize your ${breathingPhase} as your hands expand.`
    });
  } catch (err) {
    return res.json({
      correction: "Allow your elbows to sink toward your ribs without force.",
      encouragement: "Excellent focus and presence in this stance.",
      nextAction: "Sink gently into your supporting foot.",
      breathingAdvice: "Inhale through the nose as arms ascend, exhale smoothly on descent.",
      isFallback: true
    });
  }
});

// Configure Vite middleware in development vs static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite middleware in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🧘 FlowZen server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
