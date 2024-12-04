import React from 'react';

export function MixLaserLogo() {
  return (
    <svg
      viewBox="0 0 500 300"
      className="h-full w-auto"
      style={{ minWidth: '120px' }}
    >
      <defs>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#ff0000', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#cc0000', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* M */}
      <path
        d="M50,200 L90,100 L130,200 L170,100 L210,200"
        stroke="url(#redGradient)"
        strokeWidth="40"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* I */}
      <path
        d="M240,100 L240,200"
        stroke="url(#redGradient)"
        strokeWidth="40"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* X */}
      <path
        d="M300,100 L380,200 M380,100 L300,200"
        stroke="#cccccc"
        strokeWidth="40"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Laser text */}
      <rect
        x="280"
        y="220"
        width="120"
        height="40"
        rx="20"
        fill="#ff0000"
      />
      <text
        x="340"
        y="247"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontFamily="Arial"
        fontWeight="bold"
      >
        LASER
      </text>
      
      {/* Soluções Visuais */}
      <text
        x="250"
        y="280"
        textAnchor="middle"
        fill="#666666"
        fontSize="16"
        fontFamily="Arial"
      >
        SOLUÇÕES VISUAIS
      </text>
    </svg>
  );
}
