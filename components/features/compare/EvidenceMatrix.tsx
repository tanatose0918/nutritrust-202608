'use client';

import React, { useState } from 'react';
import { BookOpen, ExternalLink, Award, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { IProduct } from '@/types/traceability';
import scienceSummariesData from '@/mockup/science_summaries_mockup.json';

interface EvidenceMatrixProps {
  selectedProducts: IProduct[];
}

function EvidenceSummaryText({ summary }: { summary: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const isOver = summary.length > maxLength;

  return (
    <div className="space-y-1">
      <p className="text-[11px] text-slate-600 leading-relaxed break-words">
        {isOver && !isExpanded ? `${summary.slice(0, maxLength)}...` : summary}
      </p>
      {isOver && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
        >
          <span>{isExpanded ? 'ย่อข้อมูล' : 'More Detail (ดูเพิ่มเติม)'}</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      )}
    </div>
  );
}

function getEvidenceBadgeStyle(level: string) {
  const l = (level || '').toLowerCase();
  if (l.includes('สูง') || l.includes('high') || l.includes('level a') || l.includes('meta')) {
    return {
      bg: 'bg-emerald-800 text-emerald-50 border-emerald-700',
      icon: 'text-amber-300',
      subText: 'text-emerald-200'
    };
  }
  if (l.includes('ต่ำ') || l.includes('low') || l.includes('level c') || l.includes('vitro')) {
    return {
      bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      icon: 'text-emerald-700',
      subText: 'text-emerald-800'
    };
  }
  // Default: Moderate / Medium
  return {
    bg: 'bg-emerald-600 text-white border-emerald-500',
    icon: 'text-emerald-200',
    subText: 'text-emerald-100'
  };
}

function FormatEvidenceLevel({ level }: { level: string }) {
  if (!level) return null;
  const style = getEvidenceBadgeStyle(level);
  const parts = level.split('(');

  if (parts.length > 1) {
    const main = parts[0].trim();
    const sub = parts.slice(1).join('(').trim();
    return (
      <span className={`inline-flex flex-col text-[10px] font-bold p-2.5 rounded-xl border space-y-0.5 w-full shadow-2xs ${style.bg}`}>
        <span className="flex items-center gap-1 font-extrabold">
          <Award size={13} className={`${style.icon} shrink-0`} />
          <span>{main}</span>
        </span>
        <span className={`text-[9.5px] font-medium leading-snug pl-4 ${style.subText}`}>
          ({sub}
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border shadow-2xs ${style.bg}`}>
      <Award size={13} className={style.icon} />
      <span>{level}</span>
    </span>
  );
}

export default function EvidenceMatrix({ selectedProducts }: EvidenceMatrixProps) {
  const allSummaries = scienceSummariesData as any[];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header Directive #2 Standard */}
      <div>
        <div className="flex items-center gap-2">
          <BookOpen size={24} className="text-slate-800 shrink-0" />
          <h3 className="text-2xl font-bold text-slate-800">
            Scientific Evidence Matrix
          </h3>
        </div>
        <p className="text-base font-normal text-slate-500 mt-0.5">
          เปรียบเทียบ ระดับหลักฐานทางวิทยาศาสตร์ และ ดัชนี PubMed งานวิจัยคลินิก
        </p>
      </div>

      {/* Side-by-Side Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {selectedProducts.map((product) => {
          const matchedEvidences = allSummaries.filter(
            (item) => (product.evidence_ids || []).includes(item.evidence_id) || (item.id && (product.evidence_ids || []).includes(item.id))
          );
          const displayEvidences = matchedEvidences.length > 0 ? matchedEvidences : allSummaries.slice(0, 2);

          return (
            <div
              key={product.id}
              className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between hover:border-emerald-300 transition duration-300 shadow-2xs overflow-hidden"
            >
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 truncate" title={product.name}>
                  {product.name}
                </h4>

                <div className="space-y-3">
                  {displayEvidences.map((ev, idx) => (
                    <div key={ev.evidence_id || idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 overflow-hidden">
                      {/* Benefit Title */}
                      <div className="flex items-start gap-1.5 border-b border-slate-100 pb-2">
                        <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <h5 className="font-extrabold text-xs text-slate-900 leading-snug break-words flex-1">
                          {ev.benefit_title}
                        </h5>
                      </div>

                      {/* Evidence Level formatted with 3 green shades */}
                      <FormatEvidenceLevel level={ev.evidence_level} />

                      {/* Summary with 150 chars toggle */}
                      <EvidenceSummaryText summary={ev.summary} />

                      {/* PubMed Identifiers Clickable Buttons */}
                      {ev.pubmed_ids && ev.pubmed_ids.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-1 border-t border-slate-100">
                          {ev.pubmed_ids.map((pmid: string) => {
                            const cleanPmid = String(pmid).replace(/^PMC/i, '').trim();
                            const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${cleanPmid}/`;

                            return (
                              <a
                                key={cleanPmid}
                                href={pubmedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2 py-0.5 rounded border border-emerald-200 transition-colors duration-200 cursor-pointer"
                              >
                                <span>PMID: {cleanPmid}</span>
                                <ExternalLink size={10} />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400">
                  อ้างอิงฐานข้อมูล PubMed / Meta-Analysis
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
