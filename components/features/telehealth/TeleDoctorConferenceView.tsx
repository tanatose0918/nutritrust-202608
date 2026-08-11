'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, CameraOff, Mic, MicOff, Video, Calendar, Clock, DollarSign, ShieldCheck, UserCheck, Heart, ArrowRight, Activity, Sparkles, CheckCircle2, ChevronRight, User } from 'lucide-react';
import DoctorCarousel from './DoctorCarousel';

export default function TeleDoctorConferenceView() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-10 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider">
            <Video size={16} />
            <span>NutriTrust Tele-Doctor & Pharmacist Consultation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ศูนย์รับคำปรึกษาทางเวชศาสตร์อาหารเสริมและโภชนาการ (Health Guide)
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
          <span className="text-xs font-extrabold text-emerald-800">
            HIPAA Compliant Secure Tele-Conference
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: GOOGLE MEET STYLE VIRTUAL CONFERENCE PRE-ROOM */}
      {/* ========================================================================= */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-lg font-black text-white">
              ส่วนที่ 1: ห้องเตรียมความพร้อมการเข้าร่วมปรึกษา (Google Meet Style Pre-Room)
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Session ID: NTT-CONF-2026-8809
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Panel (7 cols): Google Meet Style Video Preview Box */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-inner group">
              {isCameraOn ? (
                <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center">
                  {/* Mock Video User Frame */}
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg">
                    <User size={48} />
                  </div>
                  <span className="text-xs font-bold text-slate-300 mt-3 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                    ภาพตัวอย่างกล้องของคุณ (User Video Stream)
                  </span>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 text-[10px] text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Camera HD 1080p Active</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <CameraOff size={40} />
                  <span className="text-xs font-bold">กล้องปิดอยู่ (Camera Disabled)</span>
                </div>
              )}

              {/* Bottom Video Controls Toolbar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-700 shadow-xl">
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isCameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  title={isCameraOn ? 'ขออนุญาตปิดกล้อง' : 'ขออนุญาตเปิดกล้อง'}
                >
                  {isCameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
                </button>

                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  title={isMicOn ? 'ขออนุญาตปิดไมค์' : 'ขออนุญาตเปิดไมค์'}
                >
                  {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
              </div>
            </div>

            {/* Toggle Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isCameraOn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span>สถานะกล้อง: {isCameraOn ? 'ขออนุญาตเปิดกล้องแล้ว' : 'ปิดกล้อง'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isMicOn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span>สถานะไมค์: {isMicOn ? 'ขออนุญาตเปิดไมค์แล้ว' : 'ปิดไมค์'}</span>
              </span>
            </div>
          </div>

          {/* Right Panel (5 cols): Join Button & Conference Details Box */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              {/* Conference Topic */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  หัวข้อการรับคำปรึกษา
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  ปรึกษาปฏิกิริยาสารอาหารซ้อนทับ & จัดตารางการทานอาหารเสริม
                </h3>
              </div>

              {/* Reserved Booking Date & Time */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Calendar size={12} className="text-amber-400" /> วันที่นัดหมาย
                  </span>
                  <p className="font-extrabold text-white">11 สิงหาคม 2026</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Clock size={12} className="text-amber-400" /> เวลาการจอง
                  </span>
                  <p className="font-extrabold text-white">18:00 - 18:30 น.</p>
                </div>
              </div>

              {/* Duration & Large Bold Pricing Badge */}
              <div className="bg-gradient-to-r from-emerald-950 to-teal-950 p-4 rounded-xl border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 font-extrabold uppercase block">ระยะเวลาการปรึกษา</span>
                  <span className="text-sm font-bold text-white">30 Mins Conference</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 font-extrabold uppercase block">ค่าบริการปรึกษา</span>
                  <span className="text-2xl font-black text-amber-300 tracking-tight">290 ฿</span>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => setIsJoined(!isJoined)}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                  isJoined
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 hover:scale-[1.02] active:scale-95'
                }`}
              >
                <Video size={16} />
                <span>{isJoined ? '🔴 ออกจากการปรึกษา (Leave Conference)' : '🟢 เข้าร่วมการปรึกษา (Join Conference)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: CONSULTATION CONTEXT & HEALTH DETAILS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Activity size={20} className="text-emerald-600" />
          <span>ส่วนที่ 2: รายละเอียดสภาวะสุขภาพและรายการสินค้าที่เลือกเข้าปรึกษา</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Sub-Panel: Personal Health Metrics */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck size={18} className="text-emerald-600" />
              <span> Personal Health Metrics (ข้อมูลสุขภาพส่วนบุคคล)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">อายุ (Age)</span>
                <span className="font-black text-slate-900 text-sm">58 ปี</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">ดัชนีมวลกาย (BMI)</span>
                <span className="font-black text-slate-900 text-sm">24.5 (ปกติ)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">ความดันโลหิต</span>
                <span className="font-black text-amber-700 text-sm">135/85 mmHg</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900">💊 ยาประจำตัวที่รับประทานอยู่:</span>
                <p className="text-amber-800 pl-2">Warfarin (ยาต้านการแข็งตัวของเลือด) รับประทานวันละ 1 เม็ดมื้อเช้า</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900">🎯 สภาวะและเป้าหมายสุขภาพ:</span>
                <p className="text-emerald-800 pl-2">ต้องการเสริมสร้างมวลกระดูก ลดอาการปวดข้อพับ และดูแลสุขภาพหลอดเลือด</p>
              </div>
            </div>
          </div>

          {/* Right Sub-Panel: Selected Supplement Stack List (NO PRICES DISPLAYED) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles size={18} className="text-amber-500" />
              <span> รายชื่อผลิตภัณฑ์ในตู้ยาที่เลือกเข้าปรึกษา (Selected Stack List - No Prices)</span>
            </h3>

            <div className="space-y-2.5">
              {[
                { name: 'Blackmores Bio C 1000 mg', brand: 'Blackmores', dose: 'Vitamin C 1000mg' },
                { name: 'Mega We Care Vitamin K2 MK-7 100 mcg', brand: 'Mega We Care', dose: 'Vitamin K2 100mcg' },
                { name: 'Vistra Acerola Cherry 1000 mg', brand: 'Vistra', dose: 'Acerola Extract 1000mg' },
                { name: 'SWISSE Ultiboost Vitamin D3 + K2 Matrix', brand: 'SWISSE', dose: 'Vitamin D3 1000IU + K2 90mcg' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full inline-block">
                      {item.brand}
                    </span>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {item.dose}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: DOCTOR CARDS CAROUSEL SLIDER (RIGHT TO LEFT) */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <DoctorCarousel />
      </div>
    </div>
  );
}
