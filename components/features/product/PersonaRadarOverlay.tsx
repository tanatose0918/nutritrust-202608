'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, User, ShieldCheck, HeartPulse, Info } from 'lucide-react';
import personasData from '@/mockup/personas_mockup.json';
import { IPersona, IPersonaMetrics } from '@/types/persona';
import { IProduct } from '@/types/traceability';

interface PersonaRadarOverlayProps {
  product?: IProduct;
}

export default function PersonaRadarOverlay({ product }: PersonaRadarOverlayProps) {
  const personas = personasData as IPersona[];
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(personas[0].id);

  const selectedPersona = useMemo(() => {
    return personas.find((p) => p.id === selectedPersonaId) || personas[0];
  }, [personas, selectedPersonaId]);

  // Calculate Product Boost to Persona Metrics based on Product Category & Ingredients
  const productBoost = useMemo<IPersonaMetrics>(() => {
    const defaultBoost: IPersonaMetrics = {
      immunity: 10,
      cardio: 10,
      cognitive: 10,
      joint_bone: 10,
      cellular_energy: 10,
      metabolic: 10,
    };

    if (!product) return defaultBoost;

    const cat = product.category_slug?.toLowerCase() || '';
    const ingIds = (product.ingredient_list || []).map((i) => i.igd_id.toLowerCase());

    if (cat.includes('vitamin-c') || ingIds.some((i) => i.includes('vitaminc') || i.includes('bio c'))) {
      defaultBoost.immunity += 35;
      defaultBoost.cellular_energy += 20;
    }
    if (cat.includes('fish-oil') || ingIds.some((i) => i.includes('fishoil') || i.includes('omega'))) {
      defaultBoost.cardio += 40;
      defaultBoost.cognitive += 25;
      defaultBoost.metabolic += 15;
    }
    if (cat.includes('astaxanthin') || ingIds.some((i) => i.includes('astaxanthin') || i.includes('lutein'))) {
      defaultBoost.cellular_energy += 40;
      defaultBoost.cognitive += 30;
      defaultBoost.immunity += 15;
    }
    if (cat.includes('collagen') || ingIds.some((i) => i.includes('collagen') || i.includes('joint'))) {
      defaultBoost.joint_bone += 45;
      defaultBoost.immunity += 10;
    }
    if (ingIds.some((i) => i.includes('ginkgo'))) {
      defaultBoost.cognitive += 40;
      defaultBoost.cardio += 20;
    }
    if (ingIds.some((i) => i.includes('magnesium') || i.includes('bvit'))) {
      defaultBoost.cognitive += 30;
      defaultBoost.joint_bone += 20;
      defaultBoost.metabolic += 25;
    }

    return defaultBoost;
  }, [product]);

  // Compatibility Verdict Logic (Can Take / Caution / Not Recommended)
  const compatibilityVerdict = useMemo(() => {
    if (!product) {
      return {
        status: 'can_take' as const,
        badge: '🟢 สามารถทานได้ (Recommended)',
        bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
        reason: 'ส่วนประกอบทั่วไปปลอดภัยสำหรับโปรไฟล์นี้',
      };
    }

    const contraindications = product.safety_profile?.contraindications || [];
    const warnings = product.safety_profile?.warnings || [];
    const ingIds = (product.ingredient_list || []).map((i) => i.igd_id.toLowerCase());

    // Check specific Persona Risks
    if (selectedPersona.id === 'per_006') {
      // Post-Illness Severe Recovery
      if (ingIds.some((i) => i.includes('astaxanthin') || i.includes('ginkgo')) || contraindications.length > 2) {
        return {
          status: 'not_recommended' as const,
          badge: '🔴 ไม่แนะนำเด็ดขาด (Not Recommended)',
          bg: 'bg-red-950/90 border-red-500/50 text-red-300',
          reason: 'ผู้ป่วยระยะฟื้นฟูตับและไตอ่อนแอ ควรหลีกเลี่ยงสารสกัดเข้มข้นสูง หรือต้องอยู่ภายใต้คำสั่งแพทย์เท่านั้น',
        };
      }
    }

    if (selectedPersona.id === 'per_004') {
      // Senior Joint & Cardio (Taking Blood Thinners)
      if (ingIds.some((i) => i.includes('fishoil') || i.includes('ginkgo')) || warnings.some((w) => w.includes('ยาละลายลิ่มเลือด'))) {
        return {
          status: 'caution' as const,
          badge: '🟡 ควรระวังปริมาณ (Special Caution)',
          bg: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
          reason: 'ผู้สูงวัยที่รับประทานยาละลายลิ่มเลือด (Warfarin/Aspirin) ควรจำกัดปริมาณ Fish Oil / Ginkgo ไม่ให้เกินขนาดแนะนำ',
        };
      }
    }

    if (selectedPersona.id === 'per_005') {
      // Metabolic & Weight Care
      if (ingIds.some((i) => i.includes('sugar') || i.includes('syrup'))) {
        return {
          status: 'caution' as const,
          badge: '🟡 ควรระวังส่วนผสม (Sugar Caution)',
          bg: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
          reason: 'ผู้ควบคุมระดับน้ำตาลควรตรวจสอบปริมาณสารให้ความหวานหรือน้ำตาลแฝงในผลิตภัณฑ์',
        };
      }
    }

    return {
      status: 'can_take' as const,
      badge: '🟢 สามารถทานได้ (Recommended)',
      bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
      reason: `ส่งเสริมสุขภาพตรงจุดตามเป้าหมายของ ${selectedPersona.name} ได้อย่างปลอดภัย`,
    };
  }, [product, selectedPersona]);

  // SVG Radar Dimensions
  const size = 260;
  const center = size / 2;
  const radius = size * 0.32;
  const categories: Array<{ key: keyof IPersonaMetrics; label: string }> = [
    { key: 'immunity', label: 'ภูมิคุ้มกัน' },
    { key: 'cardio', label: 'หลอดเลือด' },
    { key: 'cognitive', label: 'สมอง/สมาธิ' },
    { key: 'joint_bone', label: 'ข้อต่อ/กระดูก' },
    { key: 'cellular_energy', label: 'พลังงานเซลล์' },
    { key: 'metabolic', label: 'เมแทบอลิซึม' },
  ];

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (-90 + index * 60) * (Math.PI / 180);
    const r = radius * (Math.min(100, valPercent) / 100);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Base Persona Polygon
  const personaPoints = categories
    .map((cat, i) => {
      const val = selectedPersona.metrics[cat.key];
      const { x, y } = getCoordinates(i, val);
      return `${x},${y}`;
    })
    .join(' ');

  // Overlaid Product Match Polygon (Persona + Boost)
  const productPoints = categories
    .map((cat, i) => {
      const baseVal = selectedPersona.metrics[cat.key];
      const boost = productBoost[cat.key];
      const totalVal = Math.min(100, baseVal + boost);
      const { x, y } = getCoordinates(i, totalVal);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 text-white flex flex-col justify-between space-y-4 shadow-xl">
      {/* Top Banner Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles size={14} />
            <span>Personalize Health Data Radar Chart</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">6 Personas Algorithm</span>
        </div>
        <h4 className="text-base font-bold text-white">
          วิเคราะห์ความเหมาะสมรายบุคคล (Personalized Match)
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          กดเลือกโปรไฟล์ Persona เพื่อดูการซ้อนทับ (Overlay) ระหว่าง **สุขภาพพื้นฐาน** กับ **ผลลัพธ์ของผลิตภัณฑ์**
        </p>
      </div>

      {/* Persona Selector Buttons (6 Personas) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        {personas.map((p) => {
          const isSelected = p.id === selectedPersonaId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPersonaId(p.id)}
              className={`p-2 rounded-xl text-left transition cursor-pointer border ${
                isSelected
                  ? 'bg-emerald-950 border-emerald-400 text-white shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{p.avatar_emoji}</span>
                <span className="text-xs font-extrabold line-clamp-1">{p.name.split(' ')[0]}</span>
              </div>
              <span className="text-[9px] font-semibold block text-slate-400 mt-0.5 line-clamp-1">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Persona Brief Banner */}
      <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">{selectedPersona.name}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
              Score: {selectedPersona.health_score}/100
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">{selectedPersona.description}</p>
        </div>
      </div>

      {/* SVG Radar Chart Overlay Section */}
      <div className="relative flex flex-col items-center justify-center py-2">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric Hexagons */}
          {[0.25, 0.5, 0.75, 1.0].map((lvl, idx) => {
            const points = categories
              .map((_, i) => {
                const { x, y } = getCoordinates(i, lvl * 100);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={idx}
                points={points}
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray={lvl === 1 ? 'none' : '2,2'}
              />
            );
          })}

          {/* Spokes Lines */}
          {categories.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}

          {/* Persona Baseline Polygon (Indigo/Slate) */}
          <polygon
            points={personaPoints}
            fill="rgba(99, 102, 241, 0.25)"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="3,3"
          />

          {/* Product Match Overlaid Polygon (Emerald) */}
          <polygon
            points={productPoints}
            fill="rgba(16, 185, 129, 0.35)"
            stroke="#10b981"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out"
          />

          {/* Spoke Labels */}
          {categories.map((cat, i) => {
            const angle = (-90 + i * 60) * (Math.PI / 180);
            const labelRadius = radius + 22;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);

            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            if (Math.cos(angle) > 0.3) textAnchor = 'start';
            if (Math.cos(angle) < -0.3) textAnchor = 'end';

            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="text-[10px] font-bold fill-slate-300"
              >
                {cat.label}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-300 mt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-500 border border-indigo-400 inline-block" />
            <span>สุขภาพพื้นฐาน Persona</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-emerald-500/50 border border-emerald-400 inline-block rounded-xs" />
            <span>ระดับหลังได้รับ Product</span>
          </span>
        </div>
      </div>

      {/* Compatibility Verdict Box */}
      <div className={`p-3.5 rounded-2xl border ${compatibilityVerdict.bg} space-y-1.5`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black flex items-center gap-1">
            <ShieldCheck size={16} />
            <span>{compatibilityVerdict.badge}</span>
          </span>
          <span className="text-[10px] font-mono opacity-80 uppercase">NutriTrust Verdict</span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-95">
          {compatibilityVerdict.reason}
        </p>
      </div>
    </div>
  );
}
