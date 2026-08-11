import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, Clock, ShieldCheck } from 'lucide-react';
import PersonaRadarOverlay from './PersonaRadarOverlay';
import { IProduct } from '@/types/traceability';

interface SafetyProfile {
  warnings?: string[];
  contraindications?: string[];
  optimal_intake?: string;
  pros?: string[];
  considerations?: string[];
}

interface HealthScoreTabProps {
  safetyProfile?: SafetyProfile;
  product?: IProduct;
}

export default function HealthScoreTab({ safetyProfile, product }: HealthScoreTabProps) {
  const warnings = safetyProfile?.warnings || product?.safety_profile?.warnings || [];
  const contraindications = safetyProfile?.contraindications || product?.safety_profile?.contraindications || [];
  const optimalIntake = safetyProfile?.optimal_intake || product?.safety_profile?.optimal_intake || 'รับประทานวันละ 1 เม็ด พร้อมมื้ออาหารเช้าหรือเย็นเพื่อการดูดซึมที่ดีที่สุด';
  const pros = safetyProfile?.pros || product?.safety_profile?.pros || [];
  const considerations = safetyProfile?.considerations || product?.safety_profile?.considerations || [];

  return (
    <div className="space-y-6 pt-2">
      {/* Header Directive #2 Standard */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert size={24} className="text-emerald-400 shrink-0" />
          <h3 className="text-2xl font-black text-white">
            Health Score Analytics
          </h3>
        </div>
        <p className="text-sm font-medium text-slate-300 mt-0.5">
          ผลการวิเคราะห์ความปลอดภัยทางสุขภาพและโปรไฟล์ทางโภชนาการ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Side: Safety Profile Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          {/* Optimal Intake & Specific Cautions Header */}
          <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <Clock size={16} className="text-emerald-600" />
              <span>คำแนะนำปริมาณและการทานที่เหมาะสม (Optimal Intake & Specific Cautions)</span>
            </div>
            <p className="text-xs text-emerald-850 font-medium leading-relaxed pl-6">
              {optimalIntake}
            </p>
            <div className="pl-6 pt-1 flex items-center gap-2 text-[11px] font-extrabold text-emerald-700">
              <ShieldCheck size={14} />
              <span>ผ่านการตรวจสอบข้อกำหนดความปลอดภัยโดย NutriTrust Standard Engine</span>
            </div>
          </div>

          {/* Warnings & Contraindications */}
          <div className="space-y-3">
            {contraindications.length > 0 && (
              <div className="space-y-1.5 bg-red-50/70 p-3.5 rounded-2xl border border-red-200">
                <span className="text-xs font-extrabold text-red-800 flex items-center gap-1.5 uppercase">
                  <AlertTriangle size={15} className="text-red-600 shrink-0" />
                  <span>ข้อห้ามรับประทานเด็ดขาด (Contraindications & Specific Cautions)</span>
                </span>
                <ul className="space-y-1 pl-6">
                  {contraindications.map((item, idx) => (
                    <li key={idx} className="text-xs text-red-950 font-medium list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {warnings.length > 0 && (
              <div className="space-y-1.5 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <span className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5 uppercase">
                  <Info size={15} className="text-amber-600 shrink-0" />
                  <span>ข้อควรระวังเพิ่มเติม (Safety Warnings)</span>
                </span>
                <ul className="space-y-1 pl-6">
                  {warnings.map((item, idx) => (
                    <li key={idx} className="text-xs text-amber-950 font-medium list-disc">
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

        {/* Right Side: Interactive Personalize Health Data Spider Chart (6 Personas) */}
        <PersonaRadarOverlay product={product} />
      </div>
    </div>
  );
}
