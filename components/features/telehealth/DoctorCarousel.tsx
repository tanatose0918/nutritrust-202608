'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Star, Calendar, ArrowRight, Award, ShieldCheck, Sparkles } from 'lucide-react';

export interface IDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews_count: number;
  consultations_count: number;
  avatar_url: string;
  experience_years: number;
  schedule: string;
}

export const DOCTORS_LIST: IDoctor[] = [
  {
    id: 'doc_001',
    name: 'นพ. ธนดล พานิชเจริญ',
    title: 'แพทย์ผู้เชี่ยวชาญเวชศาสตร์ป้องกัน & เวชศาสตร์ชะลอวัย',
    specialty: 'Anti-Aging, Supplement Interaction & Cellular Medicine',
    hospital: 'โรงพยาบาลสมิติเวช สุขุมวิท / NutriTrust Senior Advisor',
    rating: 4.9,
    reviews_count: 342,
    consultations_count: 1250,
    avatar_url: '👨‍⚕️',
    experience_years: 12,
    schedule: 'จันทร์ - ศุกร์ (17:00 - 20:00 น.)',
  },
  {
    id: 'doc_002',
    name: 'ภญ. อภิญญา กิตติวัฒน์',
    title: 'เภสัชกรคลินิกผู้เชี่ยวชาญอันตรกิริยายาและอาหารเสริม',
    specialty: 'Clinical Pharmacist, Supplement Synergy & Safety Cautions',
    hospital: 'ศูนย์เภสัชกรรมคลินิกจุฬาลงกรณ์ / NutriTrust Chief Pharmacist',
    rating: 4.95,
    reviews_count: 512,
    consultations_count: 2100,
    avatar_url: '👩‍⚕️',
    experience_years: 10,
    schedule: 'ทุกวัน (09:00 - 21:00 น.)',
  },
  {
    id: 'doc_003',
    name: 'นพ. จิรภัทร อัศวเดชา',
    title: 'แพทย์ผู้เชี่ยวชาญระบบหลอดเลือดและโภชนบำบัด',
    specialty: 'Vascular Medicine, Omega-3 & Bone Mineral Density',
    hospital: 'สถาบันโรคหัวใจกรุงเทพ / NutriTrust Medical Specialist',
    rating: 4.88,
    reviews_count: 280,
    consultations_count: 980,
    avatar_url: '🩺',
    experience_years: 15,
    schedule: 'เสาร์ - อาทิตย์ (10:00 - 16:00 น.)',
  },
  {
    id: 'doc_004',
    name: 'ภญ. นภาพร สุวรรณรัตน์',
    title: 'เภสัชกรผู้เชี่ยวชาญด้านสมุนไพรและสารสกัดธรรมชาติ',
    specialty: 'Phytotherapy, Natural Extracts & Bioavailability',
    hospital: 'คณะเภสัชศาสตร์ ม.มหิดล / NutriTrust Research Fellow',
    rating: 4.92,
    reviews_count: 410,
    consultations_count: 1650,
    avatar_url: '🌿',
    experience_years: 11,
    schedule: 'อังคาร - พฤหัสบดี (13:00 - 18:00 น.)',
  },
];

export default function DoctorCarousel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Verified Medical Council & Clinical Pharmacists
          </span>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck size={20} className="text-emerald-700" />
            <span>ส่วนที่ 3: ทีมแพทย์และเภสัชกรคลินิกผู้เชี่ยวชาญ (Doctor Cards Carousel)</span>
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-bold hidden sm:inline-block">
          สไลด์จากขวาไปซ้ายเพื่อดูรายชื่อแพทย์ ›
        </span>
      </div>

      {/* Horizontal Carousel Container (Right to Left Sliding / Smooth Scroll) */}
      <div className="flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-slate-100 select-none">
        {DOCTORS_LIST.map((doc) => (
          <div
            key={doc.id}
            className="w-72 sm:w-80 shrink-0 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-3xl shadow-inner border border-emerald-200">
                  {doc.avatar_url}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-800 text-xs font-black">
                  <Star size={13} className="fill-amber-400 text-amber-500" />
                  <span>{doc.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({doc.reviews_count})</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition line-clamp-1">
                  {doc.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 leading-snug line-clamp-1">
                  {doc.title}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{doc.hospital}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">ประสบการณ์:</span>
                  <span className="font-bold">{doc.experience_years} ปี</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ให้คำปรึกษาสำเร็จ:</span>
                  <span className="font-bold text-emerald-700">{doc.consultations_count}+ เคส</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href={`/health-guide/doctor/${doc.id}`}
                className="w-full bg-slate-900 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-95"
              >
                <span>ดูรายละเอียดประวัติแพทย์ & นัดหมาย</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
