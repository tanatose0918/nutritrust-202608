'use client';

import React from 'react';
import { BookOpenCheck, ExternalLink, Award, FileText, Sparkles, CheckCircle } from 'lucide-react';
import scienceSummariesData from '@/mockup/science_summaries_mockup.json';

interface ScienceStudiesTabProps {
  evidenceIds?: string[];
}

export default function ScienceStudiesTab({ evidenceIds = [] }: ScienceStudiesTabProps) {
  const summaries = React.useMemo(() => {
    const all = scienceSummariesData as any[];
    if (!evidenceIds || evidenceIds.length === 0) return all.slice(0, 3);
    const filtered = all.filter(
      (item) => evidenceIds.includes(item.evidence_id) || (item.id && evidenceIds.includes(item.id))
    );
    return filtered.length > 0 ? filtered : all.slice(0, 3);
  }, [evidenceIds]);

  return (
    <div className="space-y-6 pt-2">
      {/* Header Directive #2 Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck size={24} className="text-slate-800 shrink-0" />
            <h3 className="text-2xl font-bold text-slate-800">
              Science Studies & Consensus
            </h3>
          </div>
          <p className="text-base font-normal text-slate-500 mt-0.5">
            บทสรุปการสังเคราะห์หลักฐานทางการแพทย์และงานวิจัยคลินิก (Consensus Style)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
          <Sparkles size={14} className="text-emerald-600" />
          <span>PubMed Literature Synthesis</span>
        </div>
      </div>

      {/* Consensus Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle size={14} />
            <span>High Consensus Level (94% Scientific Agreement)</span>
          </div>
          <h4 className="text-lg font-bold text-white">
            งานวิจัยตีพิมพ์ยืนยันประสิทธิผลของสารสกัดหลักในระดับคลินิก
          </h4>
          <p className="text-xs text-slate-300">
            รวบรวมข้อมูลจากการทดลองแบบสุ่มและมีกลุ่มควบคุม (RCTs) และการวิเคราะห์อภิมาน (Meta-Analysis) บนดรรชนี PubMed
          </p>
        </div>

        <div className="shrink-0 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-center">
          <span className="text-2xl font-extrabold text-emerald-300">{summaries.length}</span>
          <p className="text-[11px] text-slate-300 font-semibold">งานวิจัยอ้างอิงตรง</p>
        </div>
      </div>

      {/* Science Summaries List */}
      <div className="space-y-4">
        {summaries.map((item, idx) => (
          <div
            key={item.evidence_id || idx}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{item.benefit_title}</span>
              </h4>
              
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
                <Award size={12} className="text-emerald-600" />
                <span>{item.evidence_level}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pl-4 border-l-2 border-emerald-200">
              {item.summary}
            </p>

            {item.pubmed_ids && item.pubmed_ids.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <FileText size={12} />
                  <span>PubMed Identifiers:</span>
                </span>
                
                {item.pubmed_ids.map((pmid: string) => {
                  const cleanPmid = String(pmid).replace(/^PMC/i, '').trim();
                  const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${cleanPmid}/`;

                  return (
                    <a
                      key={cleanPmid}
                      href={pubmedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3 py-1 rounded-lg border border-emerald-200 transition duration-200 group"
                    >
                      <span>PMID: {cleanPmid}</span>
                      <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
