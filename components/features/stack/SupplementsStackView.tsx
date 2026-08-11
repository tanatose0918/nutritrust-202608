'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Layers, Trash2, CheckCircle2, AlertTriangle, Clock, Sparkles, UserCheck, Plus, Minus, ArrowRight, ShieldAlert } from 'lucide-react';
import productsData from '@/mockup/products_mockup.json';
import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';
import { IProduct, IBrand, IIngredient } from '@/types/traceability';

export default function SupplementsStackView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allProducts = productsData as unknown as IProduct[];
  const brands = brandsData as unknown as IBrand[];
  const ingredients = ingredientsData as unknown as IIngredient[];

  const brandMap = useMemo(() => {
    const map = new Map<string, IBrand>();
    brands.forEach((b) => map.set(b.id, b));
    return map;
  }, [brands]);

  // Selected product IDs from URL query params (or default fallback: p_001, p_002, p_003, p_081)
  const initialIds = useMemo(() => {
    const idsParam = searchParams ? searchParams.get('ids') : null;
    if (idsParam) {
      const split = idsParam.split(',').filter(Boolean);
      if (split.length > 0) return split;
    }
    return ['p_001', 'p_002', 'p_003', 'p_081'];
  }, [searchParams]);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialIds);

  const selectedProducts = useMemo(() => {
    return selectedProductIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is IProduct => p !== undefined);
  }, [allProducts, selectedProductIds]);

  const handleRemoveItem = (id: string) => {
    const next = selectedProductIds.filter((item) => item !== id);
    setSelectedProductIds(next);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (next.length > 0) {
        url.searchParams.set('ids', next.join(','));
      } else {
        url.searchParams.delete('ids');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Combination & Synergy Analysis Calculation
  const combinationAnalysis = useMemo(() => {
    const ingList = selectedProducts.flatMap((p) => p.ingredient_list.map((i) => i.igd_id.toLowerCase()));
    const catList = selectedProducts.map((p) => p.category_slug.toLowerCase());

    const hasVitD = catList.some((c) => c.includes('vitamin-d') || c.includes('d3')) || ingList.some((i) => i.includes('vitamind') || i.includes('d3'));
    const hasVitK2 = catList.some((c) => c.includes('k2') || c.includes('bone-vascular')) || ingList.some((i) => i.includes('vitamink2') || i.includes('k2') || i.includes('igd_013'));
    const hasFishOil = catList.some((c) => c.includes('fish-oil')) || ingList.some((i) => i.includes('fishoil') || i.includes('omega'));
    const hasMagnesium = catList.some((c) => c.includes('recovery-hydration')) || ingList.some((i) => i.includes('magnesium'));
    const hasAstaxanthin = catList.some((c) => c.includes('astaxanthin')) || ingList.some((i) => i.includes('astaxanthin'));

    const synergies: string[] = [];
    const cautions: string[] = [];

    synergies.push('✅ Safe Together: ผลิตภัณฑ์ที่เลือกมีโครงสร้างความปลอดภัยที่ทานร่วมกันได้');

    if (hasVitD && hasVitK2) {
      synergies.push('⚡ Better Calcium Absorption: วิตามิน D3 + K2 ช่วยเสริมมวลกระดูกและนำแคลเซียมลงสู่กระดูกโดยไม่ตกค้างในผนังหลอดเลือด');
    }
    if (hasFishOil && hasAstaxanthin) {
      synergies.push('⚡ Cellular Shield Synergy: Fish Oil (Omega-3) ทานร่วมกับ Astaxanthin ช่วยป้องกันปฏิกิริยาออกซิเดชันของกรดไขมัน EPA/DHA');
    }

    if (hasVitK2 || ingList.some((i) => i.includes('ginkgo'))) {
      cautions.push('⚠️ May Interact with Warfarin: ผู้ที่รับประทานยาต้านการแข็งตัวของเลือด (Warfarin/Aspirin) ควรปรึกษาแพทย์หรือเภสัชกรก่อนทาน Vitamin K2 หรือ Ginkgo');
    }
    if (selectedProducts.length >= 4) {
      cautions.push('⚠️ High Multi-Supplement Load: เมื่อทานอาหารเสริมรวมกันตั้งแต่ 4 ชนิดขึ้นไป ควรแบ่งมื้ออาหารทานตามเวลาแนะนำเพื่อการดูดซึมที่ดีที่สุด');
    }

    return { synergies, cautions, hasVitD, hasVitK2, hasFishOil, hasMagnesium };
  }, [selectedProducts]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/products?from=back"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>กลับไปหน้าค้นหาผลิตภัณฑ์</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NutriTrust Supplements Stack & Combination Engine</span>
        </div>
      </div>

      {/* Main Page Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
          <Layers size={16} />
          <span>My Supplements Stack & Combination Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          ตู้ยาอาหารเสริมและการวิเคราะห์ปฏิกิริยาร่วม (Supplements Stack Cart)
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          ตรวจเช็คความเข้ากันได้ ความปลอดภัย ผลเสริมฤทธิ์ทางชีวภาพ (Synergy) และตารางเวลาการรับประทานที่เหมาะสมเมื่อทานอาหารเสริมหลายตัวพร้อมกัน
        </p>
      </div>

      {/* Shopee/Lazada Cart Checkout Style Grid (Left List + Right Analytical Hub) */}
      {selectedProducts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Shopee/Lazada Style Selected Products Cart List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers size={18} className="text-amber-500" />
                  <span>รายการอาหารเสริมในตู้ยาของคุณ ({selectedProducts.length} รายการ)</span>
                </h3>
                <button
                  onClick={() => setSelectedProductIds([])}
                  className="text-xs font-bold text-red-600 hover:text-red-800 transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>ล้างตู้ยา</span>
                </button>
              </div>

              {/* Cart Item Cards */}
              <div className="space-y-3">
                {selectedProducts.map((product) => {
                  const brand = brandMap.get(product.brand_id);
                  return (
                    <div
                      key={product.id}
                      className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-emerald-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-200">
                          <Sparkles size={20} />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                            {brand?.name || product.brand_id}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            ขนาดบรรจุ: {product.serving_package}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                        <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {product.ingredient_list.map((i) => i.volume).join(' + ')}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(product.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="ลบออกจากตู้ยา"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add More Products CTA */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Link
                  href="/products?from=stack"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>เลือกเพิ่มอาหารเสริมเข้าตู้ยา</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Combination Analytics Box (Styled like Tier 2 Hub) */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-5">
              {/* Header Tier 2 Style */}
              <div className="border-b border-slate-800 pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                  <Sparkles size={14} />
                  <span>Tier 2: Combination Analytics Hub</span>
                </div>
                <h3 className="text-xl font-black text-white pt-1">
                  ผลการวิเคราะห์ปฏิกิริยาสารอาหารซ้อนทับ (Combination Analytics)
                </h3>
              </div>

              {/* Synergy & Safety Alerts */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={15} />
                  <span>การส่งเสริมฤทธิ์และความปลอดภัย (Synergy & Safety)</span>
                </h4>

                <div className="space-y-2">
                  {combinationAnalysis.synergies.map((syn, idx) => (
                    <div key={idx} className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-medium">
                      {syn}
                    </div>
                  ))}

                  {combinationAnalysis.cautions.map((cau, idx) => (
                    <div key={idx} className="bg-amber-950/80 p-3 rounded-2xl border border-amber-500/30 text-xs text-amber-200 leading-relaxed font-medium">
                      {cau}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Timing Schedule */}
              <div className="space-y-3 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={15} />
                  <span>ตารางเวลาการรับประทานที่แนะนำ (Recommended Timing)</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-amber-400 flex items-center gap-1">
                      ☀️ มื้อเช้า (Morning):
                    </span>
                    <p className="text-slate-300 pl-4 leading-relaxed">
                      {combinationAnalysis.hasVitD || combinationAnalysis.hasVitK2
                        ? 'Vitamin D3 + Vitamin K2 (รับประทานพร้อมอาหารเช้าที่มีไขมันสุขภาพ เพื่อการดูดซึมดีที่สุด)'
                        : 'อาหารเสริมกลุ่มวิตามินละลายในไขมัน และกลุ่มเพิ่มพลังงานประจำวัน'}
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-indigo-400 flex items-center gap-1">
                      🌙 มื้อเย็น / ก่อนนอน (Evening):
                    </span>
                    <p className="text-slate-300 pl-4 leading-relaxed">
                      {combinationAnalysis.hasMagnesium
                        ? 'Magnesium Glycinate (รับประทานหลังมื้อเย็นหรือก่อนนอน ช่วยให้กล้ามเนื้อผ่อนคลายและหลับสบาย)'
                        : 'อาหารเสริมกลุ่มช่วยการนอนหลับและการผ่อนคลายกล้ามเนื้อ'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tele-Doctor Health Guide CTA Button */}
              <div className="pt-2">
                <Link
                  href="/health-guide"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs py-3.5 px-4 rounded-2xl transition cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 hover:scale-[1.02] active:scale-95"
                >
                  <UserCheck size={16} />
                  <span>Proceed to Tele-Doctor Consult (Health Guide)</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <Layers size={40} className="mx-auto text-slate-300" />
          <h3 className="text-xl font-black text-slate-900">ยังไม่มีรายการอาหารเสริมในตู้ยาของคุณ</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            เลือกอาหารเสริมที่คุณต้องการวิเคราะห์ปฏิกิริยาร่วมจากหน้าค้นหาผลิตภัณฑ์ เพื่อเริ่มสร้างตู้ยาและดูผล Combination Analytics
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer"
          >
            <span>ไปที่หน้าค้นหาผลิตภัณฑ์</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
