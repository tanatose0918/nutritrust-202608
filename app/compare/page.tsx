'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Scale, Sparkles, Layers, AlertTriangle } from 'lucide-react';

import productsData from '@/mockup/products_mockup.json';
import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';
import providersData from '@/mockup/providers_mockup.json';

import ProductSelector from '@/components/features/compare/ProductSelector';
import ComparisonOverview from '@/components/features/compare/ComparisonOverview';
import IngredientCompare from '@/components/features/compare/IngredientCompare';
import ValueComparison from '@/components/features/compare/ValueComparison';
import EvidenceMatrix from '@/components/features/compare/EvidenceMatrix';
import SummaryRecommendation from '@/components/features/compare/SummaryRecommendation';

import { IProduct, IBrand, IIngredient, IProvider } from '@/types/traceability';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const products = productsData as unknown as IProduct[];
  const brands = brandsData as unknown as IBrand[];
  const ingredients = ingredientsData as unknown as IIngredient[];
  const providers = providersData as unknown as IProvider[];

  // Initial selected product IDs from URL query params or default preset (Fish Oil 3 brands)
  const initialIds = useMemo(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const split = idsParam.split(',').filter(Boolean);
      if (split.length >= 2) return split.slice(0, 3);
    }
    return ['p_001', 'p_002', 'p_003'];
  }, [searchParams]);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialIds);

  // Update URL search params whenever selected product IDs change
  const updateUrlParams = (ids: string[]) => {
    const params = new URLSearchParams();
    params.set('ids', ids.join(','));
    router.replace(`/compare?${params.toString()}`, { scroll: false });
  };

  const handleSelectProduct = (index: number, productId: string) => {
    const next = [...selectedProductIds];
    next[index] = productId;
    setSelectedProductIds(next);
    updateUrlParams(next);
  };

  const handleRemoveSlot = (index: number) => {
    if (selectedProductIds.length <= 2) return;
    const next = selectedProductIds.filter((_, i) => i !== index);
    setSelectedProductIds(next);
    updateUrlParams(next);
  };

  const handleAddSlot = () => {
    if (selectedProductIds.length >= 3) return;
    const available = products.find((p) => !selectedProductIds.includes(p.id)) || products[0];
    const next = [...selectedProductIds, available.id];
    setSelectedProductIds(next);
    updateUrlParams(next);
  };

  const handlePresetSelect = (presetIds: string[]) => {
    setSelectedProductIds(presetIds);
    updateUrlParams(presetIds);
  };

  const selectedProducts = useMemo(() => {
    return selectedProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is IProduct => p !== undefined);
  }, [products, selectedProductIds]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/?from=back"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>กลับไปหน้าหลัก</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NutriTrust Independent Comparison Engine</span>
        </div>
      </div>

      {/* Main Page Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
          <Scale size={16} />
          <span>NutriTrust Product Comparison Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          NutriTrust Comparison Matrix
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          เปรียบเทียบคุณค่าโภชนาการ ปริมาณสารสกัด ความคุ้มค่าเชิงราคา มาตรฐานโรงงานต้นน้ำ และงานวิจัยอ้างอิงของผลิตภัณฑ์เสริมอาหารข้างเคียงอย่างเป็นกลาง
        </p>
      </div>

      {/* Section 1: Multi-Product Selector */}
      <ProductSelector
        products={products}
        brands={brands}
        selectedProductIds={selectedProductIds}
        onSelectProduct={handleSelectProduct}
        onRemoveSlot={handleRemoveSlot}
        onAddSlot={handleAddSlot}
        onPresetSelect={handlePresetSelect}
      />

      {/* Section 2: Comparison Overview */}
      <ComparisonOverview
        selectedProducts={selectedProducts}
        brands={brands}
      />

      {/* Section 3: Active Ingredient Dosage Matrix */}
      <IngredientCompare
        selectedProducts={selectedProducts}
        ingredients={ingredients}
      />

      {/* Section 4: Value & Upstream Traceability Matrix */}
      <ValueComparison
        selectedProducts={selectedProducts}
        ingredients={ingredients}
        providers={providers}
      />

      {/* Section 5: Scientific Evidence & PubMed Links Matrix */}
      <EvidenceMatrix
        selectedProducts={selectedProducts}
      />

      {/* Section 6: Neutral Verdict Summary */}
      <SummaryRecommendation
        selectedProducts={selectedProducts}
        brands={brands}
      />

      {/* Task 3.2: Sticky Medical Disclaimer Banner */}
      <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <p className="text-slate-300 font-medium leading-relaxed">
            <strong className="text-white font-bold">NutriTrust Medical Disclaimer:</strong> ตารางเปรียบเทียบทั้งหมดจัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่สามารถใช้ทดแทนการวินิจฉัยหรือคำแนะนำทางการแพทย์ได้
          </p>
        </div>
        <Link href="/help#terms" className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl transition shrink-0 whitespace-nowrap shadow-xs">
          ข้อกำหนดการใช้งาน
        </Link>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm font-semibold">
        กำลังโหลดระบบเปรียบเทียบ NutriTrust...
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
