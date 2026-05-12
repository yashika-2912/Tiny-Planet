export const calculateBudgetBreakdown = ({ budget, days = 1, travelType = 'solo', interests = [] }) => {
  const total = Number(budget) || 0;
  const ratios = { hotel: 0.4, food: 0.2, transport: 0.15, activities: 0.25 };
  if (total / Number(days || 1) < 5000) {
    ratios.hotel -= 0.08;
    ratios.food += 0.08;
  }
  if (travelType === 'luxury') {
    ratios.hotel = 0.55;
    ratios.food = 0.17;
    ratios.transport = 0.1;
    ratios.activities = 0.18;
  }
  if (interests.includes('Adventure')) {
    ratios.activities += 0.1;
    ratios.hotel -= 0.1;
  }
  return Object.fromEntries(Object.entries(ratios).map(([key, ratio]) => [key, Math.round(total * ratio)]));
};
