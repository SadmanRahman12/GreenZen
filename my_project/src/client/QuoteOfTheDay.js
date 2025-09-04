import React, { useState, useEffect } from 'react';

const quotes = [
  'The greatest threat to our planet is the belief that someone else will save it.',
  'The Earth is what we all have in common.',
  'We do not inherit the Earth from our ancestors, we borrow it from our children.',
  'The best time to plant a tree was 20 years ago. The second best time is now.',
  'The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.',
];

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="feature-card">
      <h3>Quote of the Day</h3>
      <p>{quote}</p>
    </div>
  );
};

export default QuoteOfTheDay;
