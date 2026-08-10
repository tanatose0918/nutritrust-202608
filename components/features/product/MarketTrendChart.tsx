'use client';

import React, { useState } from 'react';
import { TrendingDown, Calendar, DollarSign, ShieldCheck } from 'lucide-react';

interface PricePoint {
  date: string;
  price: number;
}

interface MarketTrendChartProps {
  productName: string;
  currentPrice: number;
}

const MOCK_30_DAYS: PricePoint[] = [
  { date: '10 ก.ค.', price: 1290 },
  { date: '15 ก.ค.', price: 1250 },
  { date: '20 ก.ค.', price: 1200 },
  { date: '25 ก.ค.', price: 1180 },
  { date: '30 ก.ค.', price: 1150 },
  { date: '4 ส.ค.', price: 1190 },
  { date: '8 ส.ค.', price: 1150 },
];

const MOCK_90_DAYS: PricePoint[] = [
  { date: '15 พ.ค.', price: 1390 },
  { date: '1 มิ.ย.', price: 1350 },
  { date: '15 มิ.ย.', price: 1290 },
  { date: '1 ก.ค.', price: 1250 },
  { date: '15 ก.ค.', price: 1200 },
  { date: '1 ส.ค.', price: 1150 },
  { date: '8 ส.ค.', price: 1150 },
];

export default function MarketTrendChart({ productName, currentPrice }: MarketTrendChartProps) {
  const [timeframe, setTimeframe] = useState<'30' | '90'>('30');
  const data = timeframe === '30' ? MOCK_30_DAYS : MOCK_90_DAYS;

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const priceRange = maxPrice - minPrice || 1;

  // Calculate SVG path points for smooth trend line
  const svgWidth = 500;
  const svgHeight = 140;
  const padding = 20;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((d.price - minPrice) / priceRange) * (svgHeight - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${svgWidth - padding},${svgHeight - padding} L ${padding},${svgHeight - padding} Z`;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <TrendingDown size={16} /> B2B Marketplace & OEM Price Trend Analytics
          </div>
          <h4 className="text-xl font-extrabold text-white">แนวโน้มราคาตลาด (Historical Price Volatility)</h4>
          <p className="text-xs text-slate-400">วิเคราะห์ความผันผวนราคารีเทล {productName}</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe('30')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              timeframe === '30' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 วันล่าสุด
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('90')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              timeframe === '90' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            90 วันล่าสุด
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ราคาต่ำสุด (Lowest)</span>
          <span className="text-lg sm:text-xl font-black text-emerald-400">฿{minPrice.toLocaleString()}</span>
        </div>
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ราคาสูงสุด (Peak)</span>
          <span className="text-lg sm:text-xl font-black text-amber-400">฿{maxPrice.toLocaleString()}</span>
        </div>
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ราคาเฉลี่ย (Average)</span>
          <span className="text-lg sm:text-xl font-black text-white">฿{avgPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Interactive Trend SVG Chart */}
      <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-36 overflow-visible">
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#priceGradient)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Circles */}
          {data.map((d, idx) => {
            const x = padding + (idx / (data.length - 1)) * (svgWidth - padding * 2);
            const y = svgHeight - padding - ((d.price - minPrice) / priceRange) * (svgHeight - padding * 2);
            return (
              <g key={idx} className="group cursor-pointer">
                <circle cx={x} cy={y} r="5" className="fill-emerald-400 stroke-slate-950 stroke-2 group-hover:r-7 transition-all" />
                <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] font-bold fill-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  ฿{d.price}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Date Labels below SVG */}
        <div className="flex justify-between text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-800/80">
          {data.map((d, idx) => (
            <span key={idx}>{d.date}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 px-3.5 py-2 rounded-xl border border-slate-800">
        <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
        <span>ข้อมูลราคาตรวจสอบจาก Shopee, Lazada และ TikTok Shop Official Stores ย้อนหลัง</span>
      </div>
    </div>
  );
}
