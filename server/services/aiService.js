import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateBudgetBreakdown } from './budgetService.js';

const fallbackItinerary = ({ destination = 'Goa', budget = 25000, days = 3, interests = ['Food'], travelType = 'solo' }) => ({
  itinerary: Array.from({ length: Number(days) || 1 }, (_, index) => ({
    day: index + 1,
    slots: [
      { time: '09:00 AM', place: `${destination} heritage walk`, description: `Start with a grounded orientation around ${destination}.`, estimatedCost: 500 },
      { time: '01:00 PM', place: 'Local food stop', description: `Try regional dishes tuned for ${interests.join(', ') || 'local culture'}.`, estimatedCost: 800 },
      { time: '05:30 PM', place: 'Sunset viewpoint', description: `A relaxed close for ${travelType} travelers with low transit stress.`, estimatedCost: 300 }
    ]
  })),
  budgetBreakdown: calculateBudgetBreakdown({ budget, days, travelType, interests }),
  tips: ['Book intercity transfers early', 'Keep a buffer for local transport', 'Carry a reusable water bottle']
});

export const generateItinerary = async ({ destination, budget, days, interests = [], travelType }) => {
  if (!process.env.GEMINI_API_KEY) return fallbackItinerary({ destination, budget, days, interests, travelType });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `You are an expert travel planner for Indian travelers.
Generate a ${days}-day itinerary for ${destination}.
Budget: ₹${budget} total. Travel type: ${travelType}. Interests: ${interests.join(', ')}.

Respond ONLY with valid JSON — no markdown, no backticks, no explanation:
{
  "itinerary": [{ "day": 1, "slots": [{ "time": "09:00 AM", "place": "string", "description": "string", "estimatedCost": 500 }] }],
  "budgetBreakdown": { "hotel": 0, "food": 0, "transport": 0, "activities": 0 },
  "tips": ["string"]
}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

export const chatWithTiny = async ({ message, tripContext = {} }) => {
  const context = tripContext || {};
  if (!process.env.GEMINI_API_KEY) {
    return `For ${context.destination || 'your trip'}, keep plans tight, compare local transport before booking, and reserve 10% of your budget for surprises.`;
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const systemContext = `You are Tiny, a friendly AI travel assistant for Indian travelers.
Current trip context: destination=${context.destination}, days=${context.days}, budget=₹${context.budget}.
Be concise (under 80 words per reply), practical, and use ₹ for all prices.
Answer only travel-related questions. If asked anything else, redirect politely.`;
  const result = await model.generateContent(`${systemContext}\n\nUser: ${message}`);
  return result.response.text().trim();
};
