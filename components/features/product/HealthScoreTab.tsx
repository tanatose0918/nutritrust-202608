'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, Clock, UserCheck, Sparkles } from 'lucide-react';

interface SafetyProfile {
  warnings?: string[];
  contraindications?: string[];
  optimal_intake?: string;
  pros?: string[];
  considerations?: string[];
}

interface HealthScoreTabProps {
  safetyProfile?: SafetyProfile;
}

export default function HealthScoreTab({ safetyProfile }: HealthScoreTabProps) {
  const warnings = safetyProfile?.warnings || [];
  const contraindications = safetyProfile?.contraindications || [];
  const optimalIntake = safetyProfile?.optimal_intake || 'รับประทานพร้อมมื้ออาหารเช้าหรือเย็น';
  const pros = safetyProfile?.pros || [];
  const considerations = safetyProfile?.considerations || [];

  return (
    <div className="space-y-6 pt-2">
      {/* Header Directive #2 Standard */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert size={24} className="text-slate-800 shrink-0" />
          <h3 className="text-2xl font-bold text-slate-800">
            Health Score Analytics
          </h3>
        </div>
        <p className="text-base font-normal text-slate-500 mt-0.5">
          ผลการวิเคราะห์ความปลอดภัยทางสุขภาพและโปรไฟล์ทางโภชนาการ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Safety Profile Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          {/* Optimal Intake */}
          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-1">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <Clock size={16} className="text-emerald-600" />
              <span>คำแนะนำปริมาณและการทานที่เหมาะสม (Optimal Intake)</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed pl-6">
              {optimalIntake}
            </p>
          </div>

          {/* Warnings & Contraindications */}
          <div className="space-y-3">
            {contraindications.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold text-red-700 flex items-center gap-1.5 uppercase">
                  <AlertTriangle size={14} className="text-red-600" />
                  <span>ข้อห้ามรับประทานเด็ดขาด (Contraindications)</span>
                </span>
                <ul className="space-y-1 pl-5">
                  {contraindications.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-700 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {warnings.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold text-amber-700 flex items-center gap-1.5 uppercase">
                  <Info size={14} className="text-amber-600" />
                  <span>ข้อควรระวังเพิ่มเติม (Safety Warnings)</span>
                </span>
                <ul className="space-y-1 pl-5">
                  {warnings.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-700 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pros & Considerations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            {pros.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 uppercase">
                  <CheckCircle2 size={14} />
                  <span>จุดเด่นทางโภชนาการ (Pros)</span>
                </span>
                <ul className="space-y-1 pl-4">
                  {pros.map((item, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {considerations.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1 uppercase">
                  <Info size={14} />
                  <span>ข้อพิจารณา (Considerations)</span>
                </span>
                <ul className="space-y-1 pl-4">
                  {considerations.map((item, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reserved Placeholder for Personalize Health Data Spider Chart (6 Personas) */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white flex flex-col justify-between relative overflow-hidden min-h-[320px]">
          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles size={14} />
              <span>Personalize Health Data Radar Chart</span>
            </div>
            
            <h4 className="text-xl font-bold text-white">
              การเปรียบเทียบ Health Score รายบุคคล (6 Personas)
            </h4>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              พื้นที่สงวนสำหรับการคำนวณและแสดงผลกราฟ Spider Chart เปรียบเทียบค่าความเหมาะสมทางสุขภาพรายบุคคล ตามโปรไฟล์ 6 Personas (เช่น นักกีฬา, วัยทำงานออฟฟิศ, ผู้สูงอายุ, ผู้ควบคุมน้ำหนัก ฯลฯ)
            </p>
          </div>

          {/* Abstract Placeholder Graphic */}
          <div className="my-6 flex items-center justify-center z-10">
            <div className="w-48 h-48 rounded-full border border-dashed border-emerald-500/40 flex items-center justify-center relative bg-emerald-950/40 backdrop-blur-xs">
              <UserCheck className="w-16 h-16 text-emerald-400 opacity-60 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20" />
            </div>
          </div>

          <div className="z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <span>สถานะ: พร้อมรองรับ Mockup 6 Personas ใน Task ถัดไป</span>
            <span className="text-emerald-400 font-bold">NTT Health Algorithm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
