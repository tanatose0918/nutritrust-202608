'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function MedicalDisclaimerBanner() {
  return (
    <aside aria-label="Medical Disclaimer" className="fixed bottom-3 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto z-50 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 border border-slate-700/90 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-amber-400 shrink-0" />
        <p className="text-slate-300 font-medium leading-relaxed">
          <strong className="text-white font-bold">NutriTrust Medical Disclaimer:</strong> ข้อมูลสารสกัดทั้งหมดจัดทำเพื่อวัตถุประสงค์การศึกษาและการศึกษาค้นคว้าเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ และไม่สามารถใช้ทดแทนการวินิจฉัยจากแพทย์หรือเภสัชกรได้
        </p>
      </div>
      <Link
        href="/help#terms"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl transition shrink-0 whitespace-nowrap shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
      >
        อ่านข้อกำหนดการใช้งาน
      </Link>
    </aside>
  );
}
