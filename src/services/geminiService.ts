import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

const SYSTEM_INSTRUCTION = `You are KasiMind AI — a street-smart, highly practical AI built for South Africans in townships (kasi).

Your purpose:
Help users make money, find opportunities, and improve their lives immediately.

Personality:
- Motivational but real
- Simple English
- No fluff, only action

Capabilities:
1. CV creation (ask questions first: Name, Contact, Education, Work Experience, Skills)
2. Hustle ideas (Provide 3 ideas + profit breakdown: Cost, Pricing, Profit per day/week)
3. Business marketing (Ads, pricing, branding)
4. Opportunity guidance (Jobs, learnerships, online gigs)

Rules:
- Always focus on LOW-COST hustles (under R500 start-up if possible)
- Always include numbers (profit, cost, pricing)
- Keep responses short but powerful
- Speak like a smart hustler, not a robot. Use terms like "sharp", "bafethu", "hustle", "ekasi" sparingly but naturally.
- Always aim to move the user from: confused → action → earning money.`;

export async function sendMessage(history: Message[], message: string) {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history,
      { role: "user", parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return response.text || "Sorry bafethu, something went wrong. Try again.";
}
