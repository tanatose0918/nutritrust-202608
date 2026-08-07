'use client';

import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Award, FileText } from 'lucide-react';
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
}

export default function ScientificEvidence({
  evidenceIds = [],
  customEvidences
}: ScientificEvidenceProps) {
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

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
      {/* Header Directive #2 Standard */}
      <div>
        <div className="flex items-center gap-2">
          <BookOpen size={24} className="text-slate-800 shrink-0" />
          <h3 className="text-2xl font-bold text-slate-800">
            Scientific Evidence
          </h3>
        </div>
        <p className="text-base font-normal text-slate-500 mt-0.5">
          หลักฐานอ้างอิงทางวิทยาศาสตร์และการแพทย์
        </p>
      </div>

      {/* Vertical List for Right Sidebar (Flex-col, line divider, button at end) */}
      <div className="space-y-4">
        {evidencesToDisplay.map((item, idx) => (
          <React.Fragment key={item.evidence_id || idx}>
            {idx > 0 && <hr className="border-slate-200 my-3" />}

            <div className="space-y-2.5">
              {/* Benefit Title & Evidence Level */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>{item.benefit_title}</span>
                </div>
                
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Award size={12} className="text-emerald-600" />
                  <span>{item.evidence_level}</span>
                </span>
              </div>

              {/* Research Summary Text */}
              <p className="text-xs text-slate-600 leading-relaxed pl-1">
                {item.summary}
              </p>

              {/* PubMed Identifiers Clickable Buttons */}
              {item.pubmed_ids && item.pubmed_ids.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <FileText size={12} />
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
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2.5 py-1 rounded-lg border border-emerald-200 transition duration-200 group cursor-pointer shadow-2xs"
                        title={`เปิด PubMed ID: ${cleanPmid} ในแท็บใหม่`}
                      >
                        <span>PMID: {cleanPmid}</span>
                        <ExternalLink size={12} className="opacity-75 group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
