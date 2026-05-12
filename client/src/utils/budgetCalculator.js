const baseRatios = { hotel: 0.4, food: 0.2, transport: 0.15, activities: 0.25 };

export const calculateBudgetBreakdown = ({ budget, days = 1, travelType = 'solo', interests = [] }) => {
  const total = Number(budget) || 0;
  const ratios = { ...baseRatios };
  if (total / Number(days || 1) < 5000) {
    ratios.hotel -= 0.08;
    ratios.food += 0.08;
  }
  if (travelType === 'luxury') {
    ratios.hotel = 0.55;
    ratios.activities = 0.18;
    ratios.food = 0.17;
    ratios.transport = 0.1;
  }
  if (interests.includes('Adventure')) {
    const delta = 0.1;
    ratios.activities += delta;
    ratios.hotel -= delta;
  }
  return Object.fromEntries(Object.entries(ratios).map(([key, ratio]) => [key, Math.round(total * ratio)]));
};

export const rebalanceBudget = (breakdown, lockedKey, amount) => {
  const total = Object.values(breakdown).reduce((sum, value) => sum + Number(value || 0), 0);
  const next = { ...breakdown, [lockedKey]: Number(amount) || 0 };
  const remaining = Math.max(total - next[lockedKey], 0);
  const keys = Object.keys(next).filter((key) => key !== lockedKey);
  const currentOther = keys.reduce((sum, key) => sum + Number(breakdown[key] || 0), 0) || 1;
  keys.forEach((key) => {
    next[key] = Math.round(remaining * (Number(breakdown[key] || 0) / currentOther));
  });
  return next;
};
