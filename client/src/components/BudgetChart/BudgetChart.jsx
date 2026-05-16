import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563EB', '#14B8A6', '#F97316', '#F43F5E'];
const LABELS = { hotel: 'Hotel', food: 'Food', transport: 'Transport', activities: 'Activities' };

export default function BudgetChart({ breakdown = {} }) {
  const data = Object.entries(breakdown).map(([name, value]) => ({ name, value: Number(value) || 0 }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90} innerRadius={55} stroke="none">
            {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <text x="50%" y="48%" textAnchor="middle" fill="#0f172a" fontSize="22" fontWeight="900">
            Rs {Math.round(total).toLocaleString('en-IN')}
          </text>
          <text x="50%" y="60%" textAnchor="middle" fill="#64748b" fontSize="12">trip budget</text>
        </PieChart>
      </ResponsiveContainer>
      <div className="swatches">
        {data.map((item, index) => (
          <span className="swatch" key={item.name}>
            <i style={{ background: COLORS[index % COLORS.length] }} />
            {LABELS[item.name] || item.name}: Rs {item.value.toLocaleString('en-IN')}
          </span>
        ))}
      </div>
    </div>
  );
}
