
import React from 'react';

const Logo = () => {
  return (
    <svg width="150" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <g>
        <text
          x="10"
          y="28"
          fontFamily="Arial, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="url(#logo-gradient)"
        >
          GreenZen
        </text>
      </g>
    </svg>
  );
};

export default Logo;
