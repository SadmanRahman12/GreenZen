import React, { useState, Suspense, lazy } from 'react';
import './CarbonCalculator.css';

const CalculatorChart = lazy(() => import('./CalculatorChart'));

const PerfectCarbonCalculator = () => {
  const [values, setValues] = useState({ transport: '', energy: '', diet: '', waste: '' });
  const [result, setResult] = useState(null);

  const categories = [
    { id: 'transport', icon: '🚗', label: 'Monthly Transport', unit: 'miles' },
    { id: 'energy', icon: '💡', label: 'Monthly Energy', unit: 'kWh' },
    { id: 'diet', icon: '🍔', label: 'Monthly Meat', unit: 'lbs' },
    { id: 'waste', icon: '🗑️', label: 'Weekly Waste', unit: 'lbs' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const getTips = (breakdown) => {
    const tips = [];
    const highestSource = Object.keys(breakdown).reduce((a, b) => breakdown[a] > breakdown[b] ? a : b);

    switch (highestSource) {
      case 'transport':
        tips.push('Transportation is your biggest contributor. Try biking for short trips or using public transit.');
        break;
      case 'energy':
        tips.push('Energy use is high. Switch to LED bulbs and unplug devices to save on emissions (and money!).');
        break;
      case 'diet':
        tips.push('Your diet is a key factor. Reducing meat consumption, especially red meat, makes a huge difference.');
        break;
      case 'waste':
        tips.push('Waste is your top source. Focus on recycling, composting, and choosing products with less packaging.');
        break;
      default:
        tips.push('Every small step counts! Try to reduce, reuse, and recycle whenever possible.');
    }
    return tips;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const factors = { transport: 0.41, energy: 0.85, diet: 3.3, waste: 0.57 * 4 };
    
    const breakdown = {
      transport: (parseFloat(values.transport) || 0) * factors.transport,
      energy: (parseFloat(values.energy) || 0) * factors.energy,
      diet: (parseFloat(values.diet) || 0) * factors.diet,
      waste: (parseFloat(values.waste) || 0) * factors.waste,
    };

    const totalMonthly = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    const totalAnnual = totalMonthly * 12;

    let rating;
    if (totalAnnual < 4000) rating = { title: 'Eco Hero', icon: '🌳' };
    else if (totalAnnual < 8000) rating = { title: 'Green Apprentice', icon: '🌱' };
    else rating = { title: 'Room to Improve', icon: '💨' };

    const tips = getTips(breakdown);

    setResult({
      total: totalAnnual,
      rating,
      breakdown,
      tips,
      trees: (totalAnnual / 21).toFixed(1),
    });
  };

  return (
    <div className="perfect-calc-container">
      <div className="perfect-calc-card">
        <header className="perfect-calc-header">
          <h1>Carbon Footprint Calculator</h1>
          <p>A simple, fast, and accurate way to check your impact.</p>
        </header>

        <form className="perfect-calc-form" onSubmit={handleSubmit}>
          <div className="inputs-grid">
            {categories.map(({ id, icon, label, unit }) => (
              <div key={id} className="input-group-perfect">
                <label htmlFor={id}>{icon} {label} <span>({unit})</span></label>
                <input
                  type="number"
                  id={id}
                  name={id}
                  value={values[id]}
                  onChange={handleChange}
                  placeholder="0"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
          <button type="submit">Calculate My Impact</button>
        </form>

        {result && (
          <div className="perfect-results">
            <div className="results-main-grid">
              <div className="results-summary-perfect">
                <div className="rating-icon-perfect">{result.rating.icon}</div>
                <div className="rating-title-perfect">{result.rating.title}</div>
                <div className="total-footprint-perfect">{(result.total / 1000).toFixed(2)}</div>
                <div className="unit-perfect">tonnes of CO2e / year</div>
                <p className="tree-comparison-perfect">Equivalent to the CO2 absorbed by <strong>{result.trees}</strong> trees!</p>
              </div>
              <div className="results-breakdown-perfect">
                  <h4>Your Emissions Breakdown</h4>
                  <div className="chart-wrapper">
                    <Suspense fallback={<div>Loading chart...</div>}>
                      <CalculatorChart data={result.breakdown} />
                    </Suspense>
                  </div>
              </div>
            </div>
            <div className="tips-section">
              <h4>💡 Actionable Tip</h4>
              <p>{result.tips[0]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfectCarbonCalculator;
