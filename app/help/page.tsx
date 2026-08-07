'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown, FileText, ShieldAlert, Cookie } from 'lucide-react';

interface AccordionSectionProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ id, title, subtitle, icon: Icon, defaultOpen = false, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div id={id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-100/70 transition-colors duration-200 cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors duration-200">{title}</h2>
            <p className="text-xs font-semibold text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-2xs transition-transform duration-300 ${isOpen ? 'rotate-180 bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      {/* Smooth Grid Expand / Collapse Transition */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 sm:p-8 border-t border-slate-100 space-y-6 text-sm text-slate-700 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 font-sans space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>กลับสู่หน้าหลัก</span>
        </Link>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
          <HelpCircle size={14} className="text-emerald-600" />
          <span>NutriTrust Help & Information Center</span>
        </span>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          ศูนย์ช่วยเหลือและข้อข้อมูลกฎหมาย
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          รวมคำถามที่พบบ่อย (FAQ), ข้อกำหนดการใช้งาน, นโยบายความเป็นส่วนตัว และนโยบายคุกกี้ของ NutriTrust Platform
        </p>
      </div>

      {/* 4 Collapsible Accordion Sections with Smooth Grid Slide */}
      <div className="space-y-4">
        {/* 1. FAQ Section */}
        <CollapsibleSection
          id="faq"
          title="คำถามที่พบบ่อย (FAQ)"
          subtitle="คำถามและข้อสงสัยเกี่ยวกับการใช้งานและการประเมินของ NutriTrust"
          icon={HelpCircle}
          defaultOpen={true}
        >
          <div className="space-y-5">
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="text-emerald-600 font-black">Q:</span> NutriTrust ประเมินคะแนนอาหารเสริมอย่างไร?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                A: เราประเมินผ่าน 5 มิติหลัก ได้แก่ Standard วัตถุดิบต้นน้ำ, ความเข้มข้นสารสกัดจริงต่อวัน, ดัชนีหลักฐาน PubMed คลินิกมนุษย์, คะแนนรีวิว Merchant Score จากร้านค้าจริง และดัชนีความคุ้มค่าราคาต่อ 100mg โดยคำนวณผ่านอัลกอริทึมคณิตศาสตร์ ปราศจากอคติ
              </p>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="text-emerald-600 font-black">Q:</span> ข้อมูลงานวิจัย PubMed อ้างอิงมาจากไหน?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                A: ข้อมูลงานวิจัยดึงมาจากฐานข้อมูลสถาบันสุขภาพแห่งชาติสหรัฐฯ (NCBI / PubMed) โดยเน้นงานวิจัยทบทวนวรรณกรรมแบบเป็นระบบ (Systematic Review), งานวิจัยอภิวิเคราะห์ (Meta-Analysis) และการทดลองทางคลินิกแบบสุ่ม (Randomized Controlled Trials: RCT)
              </p>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="text-emerald-600 font-black">Q:</span> NutriTrust รับสปอนเซอร์จากแบรนด์อาหารเสริมหรือไม่?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                A: ไม่ครับ NutriTrust เป็นแพลตฟอร์มวิเคราะห์อิสระ 100% ไม่มีการรับสปอนเซอร์เพื่อดันอันดับหรือปรับผลการประเมินใดๆ ผลคะแนนทั้งหมดคำนวณตามมาตรฐานข้อมูลเปิด (Open Science & Market Data)
              </p>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="text-emerald-600 font-black">Q:</span> คะแนน Merchant Score คำนวณอย่างไร?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                A: ดึงข้อมูลคะแนนรีวิว ยอดขายสะสม และประเภทร้านค้า (Mall/Official Store) จาก Shopee, Lazada และ TikTok Shop แล้วนำมาถ่วงน้ำหนักด้วย Spider Chart 5 ด้าน เช่น ความคุ้มค่าราคา ความเร็วส่ง และอัตราพึงพอใจ
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. Terms of Service Section */}
        <CollapsibleSection
          id="terms"
          title="ข้อกำหนดการใช้งาน (Terms of Service)"
          subtitle="เงื่อนไขและข้อตกลงในการใช้งานแพลตฟอร์ม NutriTrust"
          icon={FileText}
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-800">
              ยินดีต้อนรับสู่ NutriTrust Platform การเข้าใช้แพลตฟอร์มนี้ถือว่าท่านตกลงยอมรับข้อกำหนดดังต่อไปนี้:
            </p>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">1. คำเตือนทางการแพทย์ (Medical Disclaimer)</h4>
              <p className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 leading-relaxed font-medium">
                ⚠️ ข้อมูลทั้งหมดบน NutriTrust มีวัตถุประสงค์เพื่อการให้ความรู้และการศึกษาเท่านั้น ไม่สามารถใช้ทดแทนคำแนะนำ การวินิจฉัย หรือการรักษาทางการแพทย์จากแพทย์หรือผู้ประกอบวิชาชีพเวชกรรมได้ หากท่านมีโรคประจำตัวหรือกำลังตั้งครรภ์ ควรปรึกษาแพทย์ก่อนรับประทานอาหารเสริมทุกครั้ง
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">2. สิทธิในทรัพย์สินทางปัญญา</h4>
              <p>
                เครื่องหมายการค้า โลโก้ อัลกอริทึมการคำนวณ และตารางเปรียบเทียบบน NutriTrust เป็นลิขสิทธิ์ของโครงการ Incubator NTT NutriTrust Platform ห้ามทำซ้ำ ดัดแปลง หรือนำไปใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">3. การเปลี่ยนแปลงข้อมูล</h4>
              <p>
                NutriTrust ขอสงวนสิทธิ์ในการปรับปรุงแก้ไขสูตรคำนวณ คะแนนประเมิน หรือราคาผลิตภัณฑ์ให้เป็นปัจจุบันตามข้อมูลการตลาดและงานวิจัยใหม่ๆ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. Privacy Policy Section */}
        <CollapsibleSection
          id="privacy"
          title="นโยบายความเป็นส่วนตัว (Privacy Policy)"
          subtitle="การคุ้มครองข้อมูลส่วนบุคคลและข้อมูลสมาชิกแบบ Anonymous"
          icon={ShieldAlert}
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-800">
              NutriTrust ให้ความสำคัญสูงสุดกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน (PDPA Compliance):
            </p>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">1. การเก็บข้อมูลแบบ Anonymous</h4>
              <p>
                เราจัดเก็บข้อมูลสมาชิก Early Access ในรูปแบบนามแฝง (Username) และอีเมลเพื่อการรับสิทธิ์เท่านั้น ข้อมูลเป้าหมายสุขภาพและปัญหาสุขภาพจะถูกจัดเก็บอย่างปลอดภัยบนระบบ MongoDB Cloud Server และใช้เป็น Prompt ตั้งต้นสำหรับระบบ AI MCP เท่านั้น
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">2. การรักษาความปลอดภัยรหัสผ่าน</h4>
              <p>
                รหัสผ่านของผู้ใช้จะถูกเข้ารหัสความปลอดภัยขั้นสูง (One-way Hash Encryption) ก่อนบันทึกลงฐานข้อมูล โดยทีมงานและระบบจะไม่สามารถอ่านรหัสผ่านจริงของท่านได้
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">3. การเปิดเผยข้อมูลแก่บุคคลที่สาม</h4>
              <p>
                NutriTrust จะไม่มีวันขาย ให้เช่า หรือเปิดเผยอีเมลและข้อมูลส่วนบุคคลของท่านแก่บริษัทภายนอกเพื่อการตลาดโดยเด็ดขาด
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. Cookie Policy Section */}
        <CollapsibleSection
          id="cookies"
          title="การใช้คุกกี้ (Cookie Policy)"
          subtitle="นโยบายการจัดเก็บและใช้คุกกี้บนเบราว์เซอร์ของผู้ใช้"
          icon={Cookie}
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-800">
              เว็บไซต์ NutriTrust มีการใช้คุกกี้และเทคโนโลยีการจัดเก็บข้อมูลบนเบราว์เซอร์ (SessionStorage/LocalStorage) เพื่อมอบประสบการณ์การใช้งานที่ดีที่สุด:
            </p>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">1. คุกกี้ที่จำเป็นสำหรับการทำงาน (Strictly Necessary Cookies)</h4>
              <p>
                ใช้สำหรับจดจำสถานะการเปรียบเทียบสินค้า (Compare Slots) และสถานะการเข้าใช้งานชั่วคราว เพื่อให้ผู้ใช้สามารถใช้งานระบบเปรียบเทียบสารสกัดได้อย่างราบรื่น
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">2. คุกกี้เพื่อการวิเคราะห์ (Analytics & Telemetry Cookies)</h4>
              <p>
                ใช้สำหรับบันทึก Session การเข้าชมที่ไม่ซ้ำรายวันและจำนวนการค้นหาผลิตภัณฑ์แบบนิรนาม ยิงผ่าน Fastify Telemetry เพื่อประมวลผลสรุปยอดผู้ใช้งานสดบนหน้าหลัก
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">3. การจัดการคุกกี้</h4>
              <p>
                ผู้ใช้สามารถปฏิเสธหรือลบคุกกี้ได้ตลอดเวลาผ่านการตั้งค่าเบราว์เซอร์ (Browser Settings) ของท่าน อย่างไรก็ตาม อาจส่งผลให้ฟังก์ชันการจดจำตารางเปรียบเทียบทำงานได้ไม่สมบูรณ์
              </p>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
