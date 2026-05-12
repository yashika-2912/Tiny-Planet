import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import BudgetChart from '../BudgetChart/BudgetChart';
import { calculateBudgetBreakdown } from '../../utils/budgetCalculator';

const interests = ['Beach', 'Mountains', 'Food', 'History', 'Adventure', 'Nightlife', 'Shopping', 'Nature'];
const travelTypes = ['solo', 'couple', 'family', 'friends'];

export default function PlannerForm({ onSubmit, generating }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    destination: 'Goa',
    days: 3,
    travelType: 'solo',
    budget: 25000,
    interests: ['Beach', 'Food']
  });
  const breakdown = useMemo(() => calculateBudgetBreakdown(form), [form]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleInterest = (interest) => {
    update('interests', form.interests.includes(interest)
      ? form.interests.filter((item) => item !== interest)
      : [...form.interests, interest]);
  };

  return (
    <form className="panel stack" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, budgetBreakdown: breakdown }); }}>
      <div className="split">
        <div>
          <span className="eyebrow">AI planner</span>
          <h2>Mission details</h2>
        </div>
        <div className="progress-dots">{[1, 2, 3].map((dot) => <span key={dot} className={dot === step ? 'active' : ''} />)}</div>
      </div>
      {step === 1 && (
        <div className="form-grid">
          <label className="label">Destination<input className="input" value={form.destination} onChange={(event) => update('destination', event.target.value)} required /></label>
          <label className="label">Days<input className="input" type="number" min="1" max="30" value={form.days} onChange={(event) => update('days', Number(event.target.value))} required /></label>
          <div className="label" style={{ gridColumn: '1 / -1' }}>Travel type
            <div className="pill-group">
              {travelTypes.map((type) => <button type="button" className={`pill ${form.travelType === type ? 'active' : ''}`} key={type} onClick={() => update('travelType', type)}>{type}</button>)}
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="grid two-cols">
          <label className="label">Total budget: ₹{Number(form.budget).toLocaleString('en-IN')}
            <input type="range" min="1000" max="100000" step="1000" value={form.budget} onChange={(event) => update('budget', Number(event.target.value))} />
          </label>
          <BudgetChart breakdown={breakdown} />
        </div>
      )}
      {step === 3 && (
        <div className="label">Interests
          <div className="pill-group">
            {interests.map((interest) => <button type="button" className={`pill ${form.interests.includes(interest) ? 'active' : ''}`} key={interest} onClick={() => toggleInterest(interest)}>{interest}</button>)}
          </div>
        </div>
      )}
      <div className="split">
        <button type="button" className="btn ghost" disabled={step === 1} onClick={() => setStep((value) => value - 1)}><ArrowLeft size={16} /> Back</button>
        {step < 3
          ? <button type="button" className="btn primary" onClick={() => setStep((value) => value + 1)}>Next <ArrowRight size={16} /></button>
          : <button className="btn primary" disabled={generating}><Sparkles size={16} /> {generating ? 'Plotting...' : 'Generate'}</button>}
      </div>
    </form>
  );
}
