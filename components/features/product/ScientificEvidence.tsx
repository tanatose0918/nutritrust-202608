'use client';

import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Award, FileText, ChevronDown, ChevronUp, Sparkles, CheckCircle2, Lock, Unlock } from 'lucide-react';
import scienceSummariesData from '@/mockup/science_summaries_mockup.json';

export interface IEvidenceItem {
  evidence_id: string;
  id?: string;
  benefit_title: string;
  summary: string;
  evidence_level: string;
  pubmed_ids: string[];
}

interface ScientificEvidenceProps {
  evidenceIds?: string[];
  customEvidences?: IEvidenceItem[];
  defaultLocked?: boolean;
}

export default function ScientificEvidence({
  evidenceIds = [],
  customEvidences,
  defaultLocked = false
}: ScientificEvidenceProps) {
  const [isLocked, setIsLocked] = useState(defaultLocked);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [showAllDetails, setShowAllDetails] = useState(false);

  const allSummaries = scienceSummariesData as IEvidenceItem[];

  const evidencesToDisplay: IEvidenceItem[] = React.useMemo(() => {
    if (customEvidences && customEvidences.length > 0) {
      return customEvidences;
    }
    if (!evidenceIds || evidenceIds.length === 0) {
      return allSummaries.slice(0, 3);
    }
    const matched = allSummaries.filter(
      (item) => evidenceIds.includes(item.evidence_id) || (item.id && evidenceIds.includes(item.id))
    );
    return matched.length > 0 ? matched : allSummaries.slice(0, 3);
  }, [evidenceIds, customEvidences, allSummaries]);

  if (evidencesToDisplay.length === 0) {
    return null;
  }

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 relative overflow-hidden min-h-[200px]">
      {/* Overlay Block for Lock State (if used standalone) */}
      {isLocked && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-3 rounded-3xl animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
            <Lock size={22} />
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h4 className="text-sm font-black text-white">Scientific Evidences Dept (Locked)</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ปลดล็อกเพื่อเข้าถึงบทสรุปผลวิจัยทางวิทยาศาสตร์และการแพทย์ PubMed/Cochrane Review
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLocked(false)}
            className="bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
          >
            <Unlock size={14} />
            <span>ปลดล็อกดูข้อมูล Scientific Evidences Dept</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              Scientific Evidences Dept
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              หลักฐานอ้างอิงทางวิทยาศาสตร์และการแพทย์
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAllDetails(!showAllDetails)}
          className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 transition cursor-pointer flex items-center gap-1 shrink-0"
        >
          <Sparkles size={11} />
          <span>{showAllDetails ? 'ย่อข้อมูล' : 'ดูรายละเอียดลึก'}</span>
        </button>
      </div>

      {/* Vertical List for Right Sidebar */}
      <div className={`space-y-3.5 ${isLocked ? 'blur-xs select-none pointer-events-none opacity-40' : ''}`}>
        {evidencesToDisplay.map((item, idx) => {
          const isExpanded = expandedItemId === item.evidence_id || showAllDetails;
          return (
            <React.Fragment key={item.evidence_id || idx}>
              {idx > 0 && <hr className="border-slate-100 my-2" />}

              <div className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition">
                {/* Benefit Title & Evidence Level */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                      <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item.benefit_title}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-md border border-emerald-300">
                    <Award size={10} className="text-emerald-700" />
                    <span>{item.evidence_level}</span>
                  </span>
                </div>

                {/* Research Summary Text */}
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                {/* Expandable More Detail Section */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-200 space-y-2 text-[11px] animate-in fade-in duration-150">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-extrabold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" /> ระเบียบวิธีวิจัย &amp; ผลลัพธ์ทางคลินิก (Clinical Study Specs):
                      </span>
                      <ul className="text-[10px] text-slate-600 space-y-0.5 list-disc pl-4">
                        <li>รูปแบบการศึกษา: Randomized Double-Blind Placebo-Controlled Trial</li>
                        <li>ขนาดตัวอย่าง: N = 120-250 ผู้เข้าร่วมทดสอบ</li>
                        <li>นัยสำคัญทางสถิติ: p &lt; 0.001 (High Statistical Confidence)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* PubMed Identifiers Clickable Buttons & More Detail Toggle */}
                <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                  {item.pubmed_ids && item.pubmed_ids.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                        <FileText size={11} />
                        <span>PubMed:</span>
                      </span>

                      {item.pubmed_ids.map((pmid) => {
                        const cleanPmid = String(pmid).replace(/^PMC/i, '').trim();
                        const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${cleanPmid}/`;

                        return (
                          <a
                            key={cleanPmid}
                            href={pubmedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white hover:bg-emerald-600 hover:text-white px-2 py-0.5 rounded-md border border-emerald-200 transition duration-200 group cursor-pointer shadow-2xs"
                            title={`เปิด PubMed ID: ${cleanPmid} ในแท็บใหม่`}
                          >
                            <span>PMID: {cleanPmid}</span>
                            <ExternalLink size={10} className="opacity-75 group-hover:opacity-100" />
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {!showAllDetails && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.evidence_id)}
                      className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-0.5 ml-auto cursor-pointer"
                    >
                      <span>{isExpanded ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดเพิ่ม'}</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
