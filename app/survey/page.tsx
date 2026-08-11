'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import SurveyWaitlistForm from '@/components/features/survey/SurveyWaitlistForm';

export default function SurveyPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 font-sans space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/?from=back"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NutriTrust Early Register Pass</span>
        </div>
      </div>

      {/* Main Page Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-1.5">
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles size={15} />
          <span>Join Early Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          NutriTrust Early Register
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          ร่วมเป็นส่วนหนึ่งในการขับเคลื่อนแพลตฟอร์มวิเคราะห์อาหารเสริมอย่างเป็นกลาง ปลอดภัย และโปร่งใสที่สุด
        </p>
      </div>

      {/* Survey & Registration Form */}
      <SurveyWaitlistForm />
    </div>
  );
}
