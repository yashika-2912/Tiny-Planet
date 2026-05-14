import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateBudgetBreakdown } from './budgetService.js';

const cleanList = (items = []) => items.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);

const destinationTemplates = {
  goa: [
    ['09:00 AM', 'Baga Beach', 'Start with a relaxed beach walk and light breakfast near the shore.', 500],
    ['01:00 PM', 'Fontainhas Latin Quarter', 'Explore colorful lanes, cafes, and Indo-Portuguese heritage.', 900],
    ['05:30 PM', 'Fort Aguada', 'Catch sunset from the fort and keep the evening low-stress.', 300],
    ['10:00 AM', 'Dudhsagar Falls day route', 'Use a guided transfer for a nature-heavy waterfall outing.', 1800],
    ['02:30 PM', 'Spice plantation lunch', 'Try a Goan thali and tour a working spice estate.', 1200],
    ['07:00 PM', 'Anjuna night market', 'Browse stalls, snacks, and live music without overcommitting spend.', 700],
    ['08:30 AM', 'Old Goa churches', 'Visit Basilica of Bom Jesus and Se Cathedral before crowds build.', 400],
    ['12:30 PM', 'Panjim riverside lunch', 'Choose a local seafood or veg thali spot around the Mandovi.', 900],
    ['05:00 PM', 'Miramar sunset walk', 'End with a calm promenade and short cafe stop.', 350]
  ],
  manali: [
    ['09:00 AM', 'Hadimba Temple', 'Start with cedar forest trails and a gentle cultural stop.', 250],
    ['12:30 PM', 'Old Manali cafes', 'Take a budget-friendly lunch break with mountain views.', 700],
    ['04:30 PM', 'Mall Road Manali', 'Walk the central market for snacks, woollens, and easy shopping.', 500],
    ['08:00 AM', 'Solang Valley', 'Plan adventure activities early while weather is more stable.', 1800],
    ['02:00 PM', 'Vashisht hot springs', 'Recover with a relaxed temple and hot spring visit.', 300],
    ['06:00 PM', 'Beas River viewpoint', 'Keep the evening scenic and light on travel time.', 250]
  ],
  default: [
    ['09:00 AM', 'Old city orientation walk', 'Start with a guided walk through the historic center.', 500],
    ['01:00 PM', 'Regional lunch stop', 'Try a local thali or street-food cluster suited to your interests.', 800],
    ['05:30 PM', 'Sunset viewpoint', 'Close the day with a scenic stop and minimal transit.', 300],
    ['08:30 AM', 'Museum and heritage circuit', 'Use the cooler morning for culture, history, and photo stops.', 650],
    ['12:30 PM', 'Local market lunch', 'Eat near a popular market and leave room for snacks.', 700],
    ['04:30 PM', 'Neighborhood cafe trail', 'Explore a compact area with cafes, shops, and short walks.', 600],
    ['09:30 AM', 'Nature or waterfront route', 'Pick a park, lake, beach, or hill viewpoint for an outdoor block.', 700],
    ['02:00 PM', 'Craft and shopping stop', 'Buy local crafts without stretching the daily budget.', 900],
    ['07:00 PM', 'Dinner near stay area', 'Stay close to the hotel for a safer, cheaper final evening.', 900]
  ]
};

const templateFor = (destination = '') => {
  const key = Object.keys(destinationTemplates).find((item) => destination.toLowerCase().includes(item));
  return destinationTemplates[key] || destinationTemplates.default;
};

const fallbackItinerary = ({ destination = 'Goa', budget = 25000, days = 3, interests = ['Food'], travelType = 'solo' }) => {
  const templates = templateFor(destination);
  const normalizedDays = Math.max(1, Number(days) || 1);
  const interestText = cleanList(interests).join(', ') || 'local experiences';
  const itinerary = Array.from({ length: normalizedDays }, (_, dayIndex) => {
    const start = (dayIndex * 3) % templates.length;
    const slots = [0, 1, 2].map((offset) => {
      const [time, place, description, estimatedCost] = templates[(start + offset) % templates.length];
      return {
        time,
        place,
        description: `${description} Best for ${travelType} travelers interested in ${interestText}.`,
        estimatedCost
      };
    });
    return { day: dayIndex + 1, slots };
  });

  return {
    itinerary,
    budgetBreakdown: calculateBudgetBreakdown({ budget, days, travelType, interests }),
    tips: [
      'Keep one flexible evening for weather or traffic delays.',
      'Book stays near the first or last activity to reduce local transport cost.',
      'Carry some cash for small vendors and parking.'
    ],
    source: 'fallback'
  };
};

const extractJson = (text = '') => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first < 0 || last < first) throw new Error('AI response did not contain JSON');
  return JSON.parse(cleaned.slice(first, last + 1));
};

const normalizeItinerary = (candidate, input) => {
  if (!candidate?.itinerary?.length) throw new Error('AI response missing itinerary');
  const days = Math.max(1, Number(input.days) || 1);
  const itinerary = candidate.itinerary.slice(0, days).map((day, index) => ({
    day: Number(day.day) || index + 1,
    slots: (day.slots || []).slice(0, 4).map((slot, slotIndex) => ({
      time: slot.time || ['09:00 AM', '01:00 PM', '05:30 PM', '08:00 PM'][slotIndex] || '10:00 AM',
      place: slot.place || `${input.destination} local stop`,
      description: slot.description || 'A practical stop selected for this travel plan.',
      estimatedCost: Math.max(0, Number(slot.estimatedCost) || 500)
    }))
  })).filter((day) => day.slots.length);

  if (itinerary.length !== days) throw new Error('AI response returned too few days');

  return {
    itinerary,
    budgetBreakdown: candidate.budgetBreakdown || calculateBudgetBreakdown(input),
    tips: Array.isArray(candidate.tips) ? candidate.tips.slice(0, 4) : [],
    source: 'gemini'
  };
};

export const generateItinerary = async ({ destination, budget, days, interests = [], travelType }) => {
  const input = { destination, budget, days, interests, travelType };
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('<')) return fallbackItinerary(input);

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an expert travel planner for Indian travelers.
Generate a ${days}-day itinerary for ${destination}.
Budget: Rs ${budget} total. Travel type: ${travelType}. Interests: ${cleanList(interests).join(', ')}.

Rules:
- Each day must be different.
- Use real or plausible place names near ${destination}.
- Costs must be realistic for Indian travelers and should fit the budget.
- Respond only with valid JSON. No markdown, no backticks.

JSON shape:
{
  "itinerary": [{ "day": 1, "slots": [{ "time": "09:00 AM", "place": "string", "description": "string", "estimatedCost": 500 }] }],
  "budgetBreakdown": { "hotel": 0, "food": 0, "transport": 0, "activities": 0 },
  "tips": ["string"]
}`;
    const result = await model.generateContent(prompt);
    return normalizeItinerary(extractJson(result.response.text()), input);
  } catch (error) {
    console.warn(`Gemini itinerary fallback used: ${error.message}`);
    return fallbackItinerary(input);
  }
};

const formatHistory = (history = []) => history
  .slice(-8)
  .map((item) => `${item.role === 'assistant' ? 'Tiny' : 'User'}: ${item.content}`)
  .join('\n');

export const chatWithTiny = async ({ message, tripContext = {}, history = [] }) => {
  const context = tripContext || {};
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('<')) {
    const previous = history.length ? ' Based on our earlier chat, keep that preference in mind.' : '';
    return `For ${context.destination || 'your trip'}, keep plans tight, compare local transport before booking, and reserve 10% of your budget for surprises.${previous}`;
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const systemContext = `You are Tiny, a friendly AI travel assistant for Indian travelers.
Current trip context: destination=${context.destination}, days=${context.days}, budget=Rs ${context.budget}.
Be concise under 80 words per reply, practical, and use Rs for all prices.
Answer only travel-related questions. If asked anything else, redirect politely.`;
  const dialogue = formatHistory(history);
  const result = await model.generateContent(`${systemContext}\n\nRecent conversation:\n${dialogue || 'No previous turns.'}\n\nUser: ${message}`);
  return result.response.text().trim();
};
