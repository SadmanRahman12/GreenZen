import React, { useState, useEffect } from 'react';

const tips = [
  'Turn off lights when you leave a room.',
  'Use reusable bags when you go shopping.',
  'Unplug electronics when they are not in use.',
  'Take shorter showers.',
  'Use a reusable water bottle.',
  'Compost your food scraps.',
  'Plant a tree.',
  'Use public transportation, bike, or walk instead of driving.',
  'Switch to energy-efficient light bulbs.',
  'Eat less meat.',
];

const TipOfTheDay = () => {
  const [tip, setTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  return (
    <div className="feature-card">
      <h3>Tip of the Day</h3>
      <p>{tip}</p>
    </div>
  );
};

export default TipOfTheDay;
