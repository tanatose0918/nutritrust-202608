'use client';

import React from 'react';

interface SpiderChartProps {
  metrics: {
    authenticity: number;
    delivery_speed: number;
    packaging_quality: number;
    customer_service: number;
    repurchase_rate: number;
  };
  size?: number;
}

export default function SpiderChart({ metrics, size = 300 }: SpiderChartProps) {
  const values = [
    metrics.authenticity || 95,
    metrics.delivery_speed || 90,
    metrics.packaging_quality || 92,
    metrics.customer_service || 88,
    metrics.repurchase_rate || 90,
  ];

  const labels = [
    'ความแท้ & อย.',
    'จัดส่งไว',
    'แพ็คเกจกันกระแทก',
    'บริการลูกค้า',
    'การซื้อซ้ำ',
  ];

  const center = size / 2;
  const radius = size * 0.35;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (-90 + index * 72) * (Math.PI / 180);
    const r = radius * (valPercent / 100);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for data
  const polygonPoints = values
    .map((v, i) => {
      const { x, y } = getCoordinates(i, v);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid Concentric Pentagons */}
        {levels.map((level, lvlIdx) => {
          const points = [0, 1, 2, 3, 4]
            .map((i) => {
              const { x, y } = getCoordinates(i, level * 100);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={lvlIdx}
              points={points}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={level === 1 ? 'none' : '2,2'}
            />
          );
        })}

        {/* Axes lines from center */}
        {[0, 1, 2, 3, 4].map((i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Radar Polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(16, 185, 129, 0.25)"
          stroke="#10b981"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Points (Dots) */}
        {values.map((v, i) => {
          const { x, y } = getCoordinates(i, v);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-emerald-600 stroke-white stroke-2"
            />
          );
        })}

        {/* Axis Labels & Values */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (-90 + i * 72) * (Math.PI / 180);
          const labelRadius = radius + 22;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);

          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          if (Math.cos(angle) < -0.3) textAnchor = 'end';

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="text-[11px] font-semibold fill-slate-700"
            >
              {labels[i]} ({values[i]}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
}
