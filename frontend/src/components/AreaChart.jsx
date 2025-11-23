import React from 'react';

const AreaChart = () => (
  <div className="w-full h-40 relative mt-4 group">
    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line x1="0" y1="120" x2="400" y2="120" stroke="#113322" strokeWidth="1" />
      <line x1="0" y1="80" x2="400" y2="80" stroke="#113322" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="0" y1="40" x2="400" y2="40" stroke="#113322" strokeWidth="1" strokeDasharray="4 4" />
      <path
        d="M0,120 C50,100 100,40 150,60 S250,90 300,50 S350,20 400,40 V150 H0 Z"
        fill="url(#gradientGreen)"
        className="transition-all duration-1000 ease-out origin-bottom animate-growUp"
        style={{ transformOrigin: 'bottom' }}
      />
      <path
        d="M0,120 C50,100 100,40 150,60 S250,90 300,50 S350,20 400,40"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#glowGreen)"
      />
    </svg>
    <div className="flex justify-between text-[8px] text-emerald-600 mt-2 px-2 font-mono uppercase tracking-widest">
      <span>T-01</span>
      <span>T-02</span>
      <span>T-03</span>
      <span>T-04</span>
      <span>T-05</span>
      <span>T-06</span>
      <span>AHORA</span>
    </div>
  </div>
);

export default AreaChart;
