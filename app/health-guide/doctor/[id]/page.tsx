'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Star, Calendar, Clock, Award, CheckCircle2, UserCheck, Video } from 'lucide-react';
import { DOCTORS_LIST } from '@/components/features/telehealth/DoctorCarousel';

export default function DoctorDetailPage() {
  const params = useParams();
  const docId = params?.id as string;

  const doctor = useMemo(() => {
    return DOCTORS_LIST.find((d) => d.id === docId) || DOCTORS_LIST[0];
  }, [docId]);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 font-sans space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/health-guide"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>กลับไปหน้าศูนย์รับคำปรึกษา Tele-Doctor</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NutriTrust Verified Medical Specialist</span>
        </div>
      </div>

      {/* Doctor Card Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-5xl shadow-xl shrink-0 border border-emerald-200">
            {doctor.avatar_url}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                VERIFIED MEDICAL SPECIALIST
              </span>
              <div className="flex items-center gap-1 bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-800 text-xs font-bold">
                <Star size={13} className="fill-amber-400 text-amber-500" />
                <span>{doctor.rating}</span>
                <span className="text-[10px] text-slate-400 font-normal">({doctor.reviews_count} รีวิว)</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{doctor.name}</h1>
            <p className="text-sm font-semibold text-emerald-300 leading-snug">{doctor.title}</p>
            <p className="text-xs text-slate-400">{doctor.hospital}</p>
          </div>
        </div>
      </div>

      {/* Detailed Credentials & Schedule Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award size={18} className="text-emerald-600" />
            <span>ความเชี่ยวชาญทางการแพทย์ & คุณวุฒิ</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-700">
            <p className="leading-relaxed">
              <strong>สาขาความเชี่ยวชาญ:</strong> {doctor.specialty}
            </p>
            <p className="leading-relaxed">
              <strong>ประสบการณ์วิชาชีพ:</strong> {doctor.experience_years} ปี ในโรงพยาบาลและสถาบันวิจัยระดับประเทศ
            </p>
            <p className="leading-relaxed">
              <strong>จำนวนเคสคำปรึกษาสำเร็จ:</strong> {doctor.consultations_count}+ เคส ยอดความพึงพอใจ 98%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar size={18} className="text-emerald-600" />
              <span>ตารางเวลาออกตรวจ & รับคำปรึกษา</span>
            </h3>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1 text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <Clock size={14} className="text-emerald-600" /> เวลาปฏิบัติงานประจำสัปดาห์:
              </span>
              <p className="text-emerald-800 font-extrabold pl-5">{doctor.schedule}</p>
            </div>
          </div>

          <Link
            href="/health-guide"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95"
          >
            <Video size={16} />
            <span>จองนัดหมาย & เข้าร่วม Tele-Conference (290 ฿)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
