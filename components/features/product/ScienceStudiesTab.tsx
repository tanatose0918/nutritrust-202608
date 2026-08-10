'use client';

import React from 'react';
import { BookOpenCheck, ExternalLink, Award, FileText, Sparkles, CheckCircle } from 'lucide-react';
import scienceSummariesData from '@/mockup/science_summaries_mockup.json';

interface ScienceStudiesTabProps {
  evidenceIds?: string[];
}

const getEvidenceScore = (levelStr?: string) => {
  if (!levelStr) return 75;
  if (levelStr.includes('สูง') || levelStr.includes('Meta-analysis') || levelStr.includes('Cochrane')) return 95;
  if (levelStr.includes('ปานกลาง') || levelStr.includes('Clinical')) return 75;
  return 55;
};

const getShortTitle = (fullTitle: string) => {
  if (!fullTitle) return 'Evidence';
  const parts = fullTitle.split('&')[0].split('(')[0].split('(')[0];
  const title = parts.trim();
  return title.length > 16 ? title.slice(0, 16) + '...' : title;
};

export default function ScienceStudiesTab({ evidenceIds = [] }: ScienceStudiesTabProps) {
  const summaries = React.useMemo(() => {
    const all = scienceSummariesData as any[];
    if (!evidenceIds || evidenceIds.length === 0) return all.slice(0, 3);
    const filtered = all.filter(
      (item) => evidenceIds.includes(item.evidence_id) || (item.id && evidenceIds.includes(item.id))
    );
    return filtered.length > 0 ? filtered : all.slice(0, 3);
  }, [evidenceIds]);

  const N = summaries.length;
  const size = 300;
  const center = size / 2;
  const radius = size * 0.32;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, valPercent: number) => {
    const angleStep = 360 / Math.max(N, 3);
    const angle = (-90 + index * angleStep) * (Math.PI / 180);
    const r = radius * (valPercent / 100);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  const polygonPoints = summaries
    .map((item, i) => {
      const score = getEvidenceScore(item.evidence_level);
      const { x, y } = getCoordinates(i, score);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6 pt-2">
      {/* Header Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck size={22} className="text-emerald-400 shrink-0" />
            <h3 className="text-xl font-bold text-white">
              Science Studies & Evidence Radar
            </h3>
          </div>
          <p className="text-xs font-normal text-slate-300 mt-0.5">
            วิเคราะห์ความน่าเชื่อถือของหลักฐานทางการแพทย์ ({N} หลักฐานอ้างอิง)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
          <Sparkles size={14} className="text-emerald-400" />
          <span>{N <= 2 ? 'Candle Chart View' : `${N}-Axial Radar View`}</span>
        </div>
      </div>

      {/* CONDITIONAL RENDER: VERTICAL BAR CHART (N <= 2) VS SPIDER CHART (N >= 3) */}
      {N <= 2 ? (
        /* VERTICAL BAR CHART FOR 1-2 EVIDENCES */
        <div className="bg-slate-950/80 rounded-3xl p-6 border border-emerald-500/30 shadow-inner space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle size={14} /> Evidence Level Vertical Bar Chart ({N} {N === 1 ? 'Study' : 'Studies'})
            </span>
            <span className="bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Vertical Scale: 0% - 100%
            </span>
          </div>

          {/* Vertical Bar Chart Container with Y-Axis */}
          <div className="flex items-stretch gap-4 pt-2 h-64">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[10px] font-bold text-slate-500 pr-2 border-r border-slate-800 shrink-0 py-1">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Vertical Columns Area with Horizontal Grid Lines */}
            <div className="relative flex-grow flex items-end justify-around px-4 border-b border-slate-800">
              {/* Horizontal Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-1">
                <div className="border-b border-slate-800/80 w-full" />
                <div className="border-b border-slate-800/80 w-full" />
                <div className="border-b border-slate-800/80 w-full" />
                <div className="border-b border-slate-800/80 w-full" />
                <div className="border-b border-slate-800/80 w-full" />
              </div>

              {/* Vertical Bars */}
              {summaries.map((item, idx) => {
                const score = getEvidenceScore(item.evidence_level);
                const simpleLevelTag = score >= 90 ? 'ระดับสูง (95%)' : score >= 70 ? 'ระดับปานกลาง (75%)' : 'ระดับเริ่มต้น (55%)';
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-2 h-full justify-end w-28 sm:w-36 group">
                    {/* Score Label above Bar */}
                    <span className="text-[11px] font-black text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 shadow-md">
                      {score}%
                    </span>

                    {/* Column Bar Container */}
                    <div className="w-14 sm:w-16 bg-slate-900/90 rounded-t-2xl border border-slate-800 overflow-hidden flex items-end justify-center p-1 shadow-inner h-full">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-700 via-teal-500 to-emerald-400 rounded-t-xl transition-all duration-700 ease-out flex items-start justify-center pt-2 shadow-lg group-hover:brightness-110"
                        style={{ height: `${score}%` }}
                      >
                        <span className="text-[10px] font-black text-slate-950">{score}%</span>
                      </div>
                    </div>

                    {/* X-Axis Title & Simplified Level */}
                    <div className="text-center space-y-0.5 pt-1">
                      <h5 className="text-[11px] font-bold text-white line-clamp-1 max-w-[120px]" title={item.benefit_title}>
                        {item.benefit_title}
                      </h5>
                      <span className="text-[10px] font-semibold text-emerald-400 block">
                        {simpleLevelTag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* SPIDER CHART FOR 3+ EVIDENCES */
        <div className="bg-slate-950/80 rounded-3xl p-6 border border-emerald-500/30 shadow-inner flex flex-col items-center justify-center relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between w-full text-xs font-bold text-slate-300 border-b border-slate-800 pb-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle size={14} /> Level of Evidence Spectrum
            </span>
            <span className="bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Score Range: 55% - 95%
            </span>
          </div>

          {/* SVG Radar */}
          <div className="relative flex items-center justify-center my-2">
            <svg width={size} height={size} className="overflow-visible">
              {/* Grid Circles / Concentric Polygons */}
              {levels.map((lvl, lvlIdx) => {
                const gridPoints = summaries
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, lvl * 100);
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <polygon
                    key={lvlIdx}
                    points={gridPoints}
                    fill="none"
                    stroke="rgba(52, 211, 153, 0.25)"
                    strokeWidth="1"
                    strokeDasharray={lvl === 1 ? 'none' : '2,2'}
                  />
                );
              })}

              {/* Axis Lines */}
              {summaries.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(16, 185, 129, 0.35)"
                stroke="#34d399"
                strokeWidth="2.5"
                className="transition-all duration-700 ease-out"
              />

              {/* Data Dots */}
              {summaries.map((item, i) => {
                const score = getEvidenceScore(item.evidence_level);
                const { x, y } = getCoordinates(i, score);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4.5"
                    className="fill-emerald-400 stroke-slate-950 stroke-2"
                  />
                );
              })}

              {/* Axis Labels */}
              {summaries.map((item, i) => {
                const score = getEvidenceScore(item.evidence_level);
                const angleStep = 360 / Math.max(N, 3);
                const angle = (-90 + i * angleStep) * (Math.PI / 180);
                const labelRadius = radius + 22;
                const x = center + labelRadius * Math.cos(angle);
                const y = center + labelRadius * Math.sin(angle);

                let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                if (Math.cos(angle) > 0.3) textAnchor = 'start';
                if (Math.cos(angle) < -0.3) textAnchor = 'end';

                const shortTitle = getShortTitle(item.benefit_title);

                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className="text-[11px] font-bold fill-emerald-300"
                  >
                    {shortTitle} ({score}%)
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
