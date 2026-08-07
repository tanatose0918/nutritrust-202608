'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles, Award, Search, BookOpen, Store, CheckCircle2, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-10 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>กลับสู่หน้าหลัก</span>
        </Link>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NutriTrust Platform : Blue Horizon Incubator</span>
        </span>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3.5 py-1 rounded-full border border-emerald-400/30 uppercase tracking-wider">
          <Building2 size={14} />
          <span>Incubator NTT NutriTrust Project</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          เกี่ยวกับ NutriTrust
        </h1>
        
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          NutriTrust คือแพลตฟอร์มวิเคราะห์และเปรียบเทียบอาหารเสริมอิสระแห่งแรกในประเทศไทย พัฒนาขึ้นภายใต้โครงการวิจัย Incubator NTT บนเล่ม Blue Horizon เพื่อมอบความโปร่งใส ปราศจากอคติ และสร้างมาตรฐานใหม่ให้กับวงการสุขภาพ
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 mb-2">
            <Sparkles size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">วิสัยทัศน์ของเรา (Vision)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            สร้างสังคมที่ทุกคนสามารถเข้าถึงข้อมูลทางวิทยาศาสตร์ของอาหารเสริมได้อย่างถูกต้อง ปลอดภัย และตัดสินใจเลือกซื้อผลิตภัณฑ์สุขภาพด้วยความมั่นใจ 100%
          </p>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 mb-2">
            <Award size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">พันธกิจของเรา (Mission)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            รวบรวมและวิเคราะห์ข้อมูลจากแหล่งวัตถุดิบต้นน้ำ งานวิจัยคลินิกมนุษย์บน PubMed และรีวิวร้านค้าจริง เพื่อส่งมอบตารางเปรียบเทียบที่เป็นกลาง ปราศจากการโฆษณาชวนเชื่อ
          </p>
        </div>
      </div>

      {/* 5-Dimension Evaluation Methodology */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Evaluation Standard</span>
          <h2 className="text-2xl font-black text-slate-900">วิธีการประเมิน 5 มิติ (NutriTrust Methodology)</h2>
          <p className="text-sm text-slate-500">
            ระบบการให้คะแนนและการวิเคราะห์เปรียบเทียบของเราใช้อัลกอริทึมประเมินใน 5 มิติหลัก:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[
            {
              icon: Search,
              title: '1. Upstream Traceability',
              desc: 'ตรวจสอบย้อนกลับมาตรฐานโรงงานสารสกัดต้นน้ำ (เช่น DSM, Kemin, Aker BioMarine) ว่าได้รับการรับรองระดับสากลหรือไม่'
            },
            {
              icon: ShieldCheck,
              title: '2. Ingredient Potency',
              desc: 'เปรียบเทียบปริมาณความเข้มข้นของสารสกัดสำคัญต่อหน่วยบริโภคจริง ไม่โดนหลอกด้วยตัวเลขขนาดเม็ด'
            },
            {
              icon: BookOpen,
              title: '3. Clinical Science (PubMed)',
              desc: 'อ้างอิงระดับหลักฐานงานวิจัยคลินิกในมนุษย์ (Meta-analysis, RCT) จากฐานข้อมูล PubMed'
            },
            {
              icon: Store,
              title: '4. Merchant Score & Reviews',
              desc: 'ประมวลผลคะแนนร้านค้า อัตราความพึงพอใจ และรีวิวผู้ซื้อจริงจาก Shopee, Lazada และ TikTok Shop'
            },
            {
              icon: Award,
              title: '5. Price Value Index',
              desc: 'คำนวณต้นทุนราคาจริงต่อปริมาณสารสกัด 100mg เพื่อให้ผู้บริโภคได้ตัวเลือกที่คุ้มค่าที่สุด'
            },
            {
              icon: CheckCircle2,
              title: '6. Neutral Assessment',
              desc: 'ไม่มีการรับสปอนเซอร์เพื่อดันอันดับ การประเมินผลคำนวณตามสูตรคณิตศาสตร์และงานวิจัยล้วนๆ'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-2">
              <item.icon size={22} className="text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Incubator NTT Context */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 border border-emerald-800 shadow-md space-y-3">
        <h2 className="text-xl font-extrabold text-amber-300">บ่มเพาะนวัตกรรมภายใต้ Blue Horizon Incubator</h2>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-3xl">
          โปรเจกต์ NutriTrust ถือกำเนิดจากการค้นคว้าและพัฒนาในสมุดบันทึก Blue Horizon : Incubator NTT NutriTrust Platform เพื่อแก้ปัญหาความเหลื่อมล้ำทางข้อมูลอาหารเสริมในตลาดไทย โดยมุ่งเน้นการสร้างแพลตฟอร์มที่พึ่งพาตนเองได้ ปลอดภัย และเปิดกว้างสำหรับผู้ใช้ทุกคน
        </p>
      </div>
    </div>
  );
}
