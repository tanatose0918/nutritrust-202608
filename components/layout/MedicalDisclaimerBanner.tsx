'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, X } from 'lucide-react';

export default function MedicalDisclaimerBanner() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-hide sticky banner when footer is visible in viewport or dismissed by user
  if (isFooterVisible || isDismissed) {
    return null;
  }

  return (
    <aside aria-label="Medical Disclaimer" className="hidden sm:flex fixed bottom-3 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 border border-slate-700/90 shadow-2xl items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertTriangle size={18} className="text-amber-400 shrink-0" />
        <p className="text-slate-300 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
          <strong className="text-white font-bold">NutriTrust Medical Disclaimer:</strong> ข้อมูลสารสกัดทั้งหมดจัดทำเพื่อวัตถุประสงค์การศึกษาและการศึกษาค้นคว้าเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ และไม่สามารถใช้ทดแทนการวินิจฉัยจากแพทย์หรือเภสัชกรได้
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/help#terms"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl transition whitespace-nowrap shadow-xs hover:scale-105 active:scale-95 cursor-pointer text-[11px]"
        >
          ข้อกำหนดการใช้งาน
        </Link>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
          title="ปิดแบนเนอร์"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
