'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, ShieldCheck, Plus, Minus, ArrowLeft, Sparkles, ChevronDown, Factory, Check, RotateCw,
  Package, FlaskConical, Store, ShieldAlert, ExternalLink, AlertTriangle, Info, TrendingUp, Award, UserCheck,
  Layers, Scale, CheckCircle2, Trash2, ChevronLeft, ChevronRight, Lock
} from 'lucide-react';
import { IProduct, IBrand, IIngredient, IProvider } from '@/types/traceability';

import productsData from '@/mockup/products_mockup.json';
import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';
import providersData from '@/mockup/providers_mockup.json';

import ScientificEvidence from '@/components/features/product/ScientificEvidence';
import MerchantScoreChart from '@/components/features/product/MerchantScoreChart';
import HealthScoreTab from '@/components/features/product/HealthScoreTab';
import ScienceStudiesTab from '@/components/features/product/ScienceStudiesTab';
import MarketTrendChart from '@/components/features/product/MarketTrendChart';
import { fetchProductDetail } from '@/services/api';

interface ProductDetailViewProps {
  initialProductId?: string;
  isSearchOnlyMode?: boolean;
}

type SearchCategory = 'ingredients' | 'products' | 'brands' | 'issues' | 'goals';
type ScoreTabType = 'merchant' | 'health' | 'science';

const formatServingPackage = (pkg: string) => {
  if (!pkg) return pkg;
  const parts = pkg.split('-');
  if (parts.length === 2) {
    const [type, count] = parts;
    if (type === 'tablet') return `${count} เม็ด`;
    if (type === 'capsule') return `${count} แคปซูล`;
    return `${count} ${type}`;
  }
  return pkg;
};

const formatPriceRange = (min?: number, max?: number) => {
  if (min !== undefined && max !== undefined) {
    if (min === max) return `${min.toLocaleString()} ฿`;
    return `${min.toLocaleString()} - ${max.toLocaleString()} ฿`;
  }
  if (min !== undefined) return `เริ่มต้น ${min.toLocaleString()} ฿`;
  return 'ติดต่อผู้จัดจำหน่าย';
};

export default function ProductDetailView({ initialProductId = 'p_bm_vitc_1000', isSearchOnlyMode = false }: ProductDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamQuery = searchParams ? searchParams.get('search') : null;

  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialProductId);
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [products, setProducts] = useState<IProduct[]>(productsData as unknown as IProduct[]);
  const [brands, setBrands] = useState<IBrand[]>(brandsData as unknown as IBrand[]);
  const [ingredients, setIngredients] = useState<IIngredient[]>(ingredientsData as unknown as IIngredient[]);
  const [providers, setProviders] = useState<IProvider[]>(providersData as unknown as IProvider[]);

  const [activeScoreTab, setActiveScoreTab] = useState<ScoreTabType>('science');
  const [showMoreBadges, setShowMoreBadges] = useState(false);
  const [isTier2Unlocked, setIsTier2Unlocked] = useState(false);
  const [isTier3Unlocked, setIsTier3Unlocked] = useState(false);

  const [apiProductDetail, setApiProductDetail] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 6;

  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // React dynamically whenever URL search parameter changes
  useEffect(() => {
    if (searchParamQuery !== null) {
      if (searchParamQuery === 'all' || searchParamQuery === '') {
        setSearchQuery('');
      } else {
        setSearchQuery(decodeURIComponent(searchParamQuery));
      }
      setSelectedProductId(null);
      setCurrentPage(1);
    }
  }, [searchParamQuery]);

  useEffect(() => {
    if (!selectedProductId) return;
    setIsLoading(true);
    setIsTier2Unlocked(false);
    setIsTier3Unlocked(false);
    let isMounted = true;

    const fallback = (productsData as unknown as IProduct[]).find((p) => p.id === selectedProductId) || null;
    if (fallback) {
      setApiProductDetail(fallback);
    }

    fetchProductDetail(selectedProductId)
      .then((detail) => {
        if (isMounted && detail) {
          setApiProductDetail(detail);
        }
      })
      .catch((err) => {
        console.warn('Backend product fetch error:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const autoDismissTimer = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(autoDismissTimer);
    };
  }, [selectedProductId]);

  const brandMap = useMemo(() => {
    const map = new Map<string, IBrand>();
    brands.forEach((b) => map.set(b.id, b));
    return map;
  }, [brands]);

  const ingredientMap = useMemo(() => {
    const map = new Map<string, IIngredient>();
    ingredients.forEach((i) => map.set(i.id, i));
    return map;
  }, [ingredients]);

  const providerMap = useMemo(() => {
    const map = new Map<string, IProvider>();
    providers.forEach((p) => map.set(p.id, p));
    return map;
  }, [providers]);

  // Concept & Keyword matching for health goals and health issues
  const matchHealthConcept = (product: IProduct, qLower: string) => {
    if (qLower.includes('eye') || qLower.includes('vision') || qLower.includes('ตา')) {
      return product.ingredient_list.some((i) => i.igd_id.includes('astaxanthin') || i.igd_id.includes('vitaminc') || i.igd_id.includes('lutein'));
    }
    if (qLower.includes('brain') || qLower.includes('memory') || qLower.includes('สมอง') || qLower.includes('ความจำ')) {
      return product.ingredient_list.some((i) => i.igd_id.includes('ginkgo') || i.igd_id.includes('fishoil'));
    }
    if (qLower.includes('sleep') || qLower.includes('stress') || qLower.includes('muscle') || qLower.includes('office') || qLower.includes('นอน') || qLower.includes('เครียด')) {
      return product.ingredient_list.some((i) => i.igd_id.includes('magnesium') || i.igd_id.includes('bvit'));
    }
    if (qLower.includes('joint') || qLower.includes('cartilage') || qLower.includes('ข้อ') || qLower.includes('กระดูก')) {
      return product.ingredient_list.some((i) => i.igd_id.includes('collagen') || i.igd_id.includes('joint') || i.igd_id.includes('magnesium'));
    }
    if (qLower.includes('aging') || qLower.includes('energy') || qLower.includes('co q-10') || qLower.includes('coq10') || qLower.includes('fatigue')) {
      return product.ingredient_list.some((i) => i.igd_id.includes('coq10') || i.igd_id.includes('lcarnitine') || i.igd_id.includes('egcg'));
    }
    if (qLower.includes('heart') || qLower.includes('cardio') || qLower.includes('หัวใจ')) {
      return product.ingredient_list.some((i) => i.igd_id.includes('fishoil'));
    }
    if (qLower.includes('immune') || qLower.includes('allergy') || qLower.includes('ภูมิคุ้มกัน')) {
      return product.ingredient_list.some((i) => i.igd_id.includes('vitaminc') || i.igd_id.includes('bio c'));
    }
    return false;
  };

  const matchingProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;

    if (searchCategory === 'brands') {
      const matchedBrands = brands.filter((b) => b.name.toLowerCase().includes(q));
      const brandIds = matchedBrands.map((b) => b.id);
      return products.filter((p) => brandIds.includes(p.brand_id) || p.brand_id.toLowerCase().includes(q));
    }

    if (searchCategory === 'ingredients') {
      const matchedIngs = ingredients.filter((i) => i.name.toLowerCase().includes(q));
      const ingIds = matchedIngs.map((i) => i.id);
      return products.filter((p) => p.ingredient_list.some((ing) => ingIds.includes(ing.igd_id) || ing.igd_id.toLowerCase().includes(q)));
    }

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category_slug.toLowerCase().includes(q) ||
        (p.sub_category && p.sub_category.toLowerCase().includes(q)) ||
        p.ingredient_list.some((ing) => ing.igd_id.toLowerCase().includes(q)) ||
        matchHealthConcept(p, q)
    );
  }, [products, brands, ingredients, searchCategory, searchQuery]);

  const currentProduct = useMemo(() => {
    if (apiProductDetail && apiProductDetail.id === selectedProductId) {
      return apiProductDetail;
    }
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId) || null;
  }, [selectedProductId, apiProductDetail, products]);

  const currentBrand = currentProduct ? brandMap.get(currentProduct.brand_id) : null;

  const categoryOptions = [
    { key: 'products', label: 'ชื่อผลิตภัณฑ์' },
    { key: 'brands', label: 'ชื่อแบรนด์' },
    { key: 'ingredients', label: 'ส่วนประกอบ' },
    { key: 'issues', label: 'ปัญหาสุขภาพ' },
    { key: 'goals', label: 'เป้าหมายสุขภาพ' },
  ];

  const currentCategoryLabel = categoryOptions.find((o) => o.key === searchCategory)?.label || 'ชื่อผลิตภัณฑ์';

  const allBadgesForCategory = useMemo(() => {
    if (searchCategory === 'brands') {
      return brands.map((b) => ({ id: b.id, fullName: b.name, displayName: b.name, type: 'brand' }));
    }
    if (searchCategory === 'ingredients') {
      return ingredients.map((i) => ({ id: i.id, fullName: i.name, displayName: i.name, type: 'ingredient' }));
    }
    if (searchCategory === 'issues') {
      return [
        { id: 'iss_1', fullName: 'Sleep Quality & Stress Relief', displayName: '🌙 Sleep & Stress', type: 'issue' },
        { id: 'iss_2', fullName: 'Office Syndrome & Muscle Relief', displayName: '💻 Office Syndrome', type: 'issue' },
        { id: 'iss_3', fullName: 'Joint Care & Cartilage Protection', displayName: '🦴 Joint Care', type: 'issue' },
        { id: 'iss_4', fullName: 'Fatigue Recovery & Stamina', displayName: '⚡ Fatigue & Energy', type: 'issue' },
        { id: 'iss_5', fullName: 'Allergy & Immune Shield', displayName: '🌿 Allergy Shield', type: 'issue' },
      ];
    }
    if (searchCategory === 'goals') {
      return [
        { id: 'gol_1', fullName: 'Eye & Vision Protection', displayName: '👁️ Eye & Vision', type: 'goal' },
        { id: 'gol_2', fullName: 'Brain & Memory Care', displayName: '🧠 Brain & Memory', type: 'goal' },
        { id: 'gol_3', fullName: 'Anti-Aging & Cellular Energy', displayName: '✨ Anti-Aging', type: 'goal' },
        { id: 'gol_4', fullName: 'Heart & Cardiovascular Health', displayName: '❤️ Heart & Cardio', type: 'goal' },
        { id: 'gol_5', fullName: 'Immune System Support', displayName: '🛡️ Immune Support', type: 'goal' },
      ];
    }
    return products.map((p) => ({ id: p.id, fullName: p.name, displayName: p.name, type: 'product', productId: p.id }));
  }, [searchCategory, brands, ingredients, products]);

  const visibleBadges = useMemo(() => {
    if (showMoreBadges) {
      return allBadgesForCategory.slice(0, 10);
    }
    return allBadgesForCategory.slice(0, 5);
  }, [allBadgesForCategory, showMoreBadges]);

  const handleBadgeClick = (badge: { fullName: string; type: string; productId?: string }) => {
    setSearchQuery(badge.fullName);
    setIsTier2Unlocked(false);
    setIsTier3Unlocked(false);
    setCurrentPage(1);

    if (badge.type === 'product' && badge.productId) {
      setSelectedProductId(badge.productId);
      setAnimationClass('animate-slide-left-750');
    } else {
      setSelectedProductId(null);
    }

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('search', badge.fullName);
      window.history.pushState({}, '', url.toString());
    }
  };

  const totalPages = Math.max(1, Math.ceil(matchingProducts.length / itemsPerPage));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return matchingProducts.slice(start, start + itemsPerPage);
  }, [matchingProducts, currentPage]);

  const toggleSelectProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedProductId(null);
    setCurrentPage(1);
    setIsTier2Unlocked(false);
    setIsTier3Unlocked(false);
    const q = searchQuery.trim();
    if (typeof window !== 'undefined' && q) {
      const url = new URL(window.location.href);
      url.searchParams.set('search', q);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Calculate unit price (Price per serving/tablet)
  const unitPriceEstimate = useMemo(() => {
    if (!currentProduct || !currentProduct.min_price) return 0;
    const count = parseInt(currentProduct.serving_package.split('-')[1] || '60', 10);
    return Math.round(currentProduct.min_price / count);
  }, [currentProduct]);

  return (
    <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8 overflow-x-hidden ${animationClass}`}>
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center z-50 transition-all duration-300">
          <div className="bg-slate-900/95 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm mx-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <RotateCw className="w-10 h-10 text-emerald-400 animate-speed-bounce-rotate" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-lg">กำลังโหลดข้อมูลผลิตภัณฑ์...</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">กำลัง Query ข้อมูลจาก NutriTrust Fastify Backend & MongoDB</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Back to Home */}
      <div className="flex items-center justify-between">
        <Link href="/?from=back" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer">
          <ArrowLeft size={16} />
          <span>กลับไปหน้าหลัก</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NutriTrust 3-Tier Progressive Disclosure Spec</span>
        </div>
      </div>

      {/* Search Bar Block */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Search className="text-emerald-700" size={20} />
          <span>ค้นหาข้อมูลผลิตภัณฑ์และโภชนาการ</span>
        </h2>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-500 transition relative">
          <div ref={categoryDropdownRef} className="relative flex items-center gap-2 w-full sm:w-auto pl-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 shrink-0">ค้นหาด้วย:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className="w-full sm:w-40 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs transition cursor-pointer shrink-0"
              >
                <span>{currentCategoryLabel}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setSearchCategory(opt.key as SearchCategory);
                      setIsCategoryOpen(false);
                      setShowMoreBadges(false);
                      setSelectedProductId(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      searchCategory === opt.key ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {searchCategory === opt.key && <Check size={14} className="text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`ค้นหา${searchCategory === 'brands' ? 'ชื่อแบรนด์' : searchCategory === 'ingredients' ? 'ส่วนประกอบ' : 'ชื่อผลิตภัณฑ์'}...`}
            className="w-full flex-grow bg-transparent text-sm text-slate-800 outline-none px-3 py-2 placeholder-slate-400 font-medium"
          />

          <button type="submit" className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs">
            <Search size={16} />
            <span>ค้นหา</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500">Top Search Badges:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {visibleBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                title={badge.fullName}
                className="bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 transition cursor-pointer flex items-center gap-1"
              >
                <span>{badge.displayName}</span>
              </button>
            ))}

            {allBadgesForCategory.length > 5 && (
              <button
                onClick={() => setShowMoreBadges((prev) => !prev)}
                title={showMoreBadges ? 'ย่อ Badges' : 'ดูเพิ่มอีก 5 Badges'}
                className="w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 flex items-center justify-center font-extrabold text-xs transition cursor-pointer shadow-xs shrink-0"
              >
                {showMoreBadges ? <Minus size={14} /> : <Plus size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main 3-Tier Progressive Disclosure Layout */}
      {selectedProductId && currentProduct ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-slide-left-750">
          {/* LEFT COLUMN (2/3 Width): TIER 1, TIER 2 & TIER 3 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Product Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                    Specs Sheet & Traceability Summary
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProductId(null);
                      router.push('/products');
                    }}
                    className="text-xs font-medium text-slate-300 hover:text-white underline ml-2 cursor-pointer"
                  >
                    ดูสินค้าทั้งหมด ({matchingProducts.length})
                  </button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{currentProduct.name}</h1>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <span>แบรนด์: <strong className="text-emerald-300">{currentBrand?.name || currentProduct.brand_id}</strong></span>
                  <span>•</span>
                  <span>ประเทศผู้ผลิต: <strong className="text-emerald-300">{currentBrand?.provide_at || 'Australia'}</strong></span>
                </p>
              </div>

              <div className="text-right sm:border-l border-slate-800 sm:pl-6">
                <p className="text-xs text-slate-400 font-medium">ราคาประมาณการ</p>
                <p className="text-2xl font-black text-amber-400">{formatPriceRange(currentProduct.min_price ?? undefined, currentProduct.max_price ?? undefined)}</p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* EPIC 1.1: TIER 1 - NORMAL CONSUMER VIEW (ABOVE THE FOLD) */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Tier 1: Everyday Consumer Overview
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">สรุปภาพรวมผลิตภัณฑ์แบบเข้าใจง่าย</h3>
                </div>

                {/* NutriTrust Score Badge with Soft Green Radial Glow */}
                <div className="relative bg-slate-950 border border-emerald-500/40 rounded-3xl p-4 text-white overflow-hidden shadow-xl text-center shrink-0 min-w-[120px]">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">NutriTrust Score</span>
                  <span className="text-3xl font-black text-white leading-none">4.5</span>
                  <span className="text-xs text-emerald-300 font-semibold block mt-0.5">/ 5.0</span>
                </div>
              </div>

              {/* Quick Summary Card: เหมาะสำหรับ, จุดเด่น, ข้อควรพิจารณา */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs">
                    <UserCheck size={16} className="text-emerald-600" />
                    <span>🎯 เหมาะสำหรับ</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    ผู้ที่ต้องการเสริมสารอาหารบำรุงสุขภาพอย่างสม่ำเสมอ และผู้ต้องการวัตถุดิบมาตรฐานสากล
                  </p>
                </div>

                <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-xs">
                    <Sparkles size={16} className="text-teal-600" />
                    <span>🌟 จุดเด่นสำคัญ</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    ใช้สารสกัดจากโรงงานต้นน้ำมาตรฐานระดับโลก มีใบรับรอง CoA และรายงานวิจัยทางคลินิกรองรับ
                  </p>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs">
                    <Info size={16} className="text-amber-600" />
                    <span>⚖️ ข้อควรพิจารณา</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    ควรรับประทานพร้อมมื้ออาหารเช้าหรือเย็น และเก็บไว้ในอุณหภูมิห้องเพื่อคงคุณค่าสารสกัด
                  </p>
                </div>
              </div>

              {/* Merchant Price Table with Unit Price & Affiliate Outbound Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Store size={16} className="text-emerald-600" /> ราคาและช่องทางสั่งซื้อจากร้านค้าพันธมิตร
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    เฉลี่ยประมาณ ฿{unitPriceEstimate} / หน่วยรับประทาน
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">ร้านค้าพันธมิตร</th>
                        <th className="p-3">ราคาต่ำสุด</th>
                        <th className="p-3">ราคาเฉลี่ยต่อเม็ด</th>
                        <th className="p-3 text-right">ลิงก์ไปยังร้านค้า</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" /> Shopee Mall Official
                        </td>
                        <td className="p-3 font-extrabold text-emerald-800">฿{currentProduct.min_price?.toLocaleString() || '1,090'}</td>
                        <td className="p-3 text-slate-600">~ ฿{unitPriceEstimate} / เม็ด</td>
                        <td className="p-3 text-right">
                          <a
                            href="https://shopee.co.th"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                          >
                            <span>เช็คราคา Shopee</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" /> Lazada LazMall
                        </td>
                        <td className="p-3 font-extrabold text-emerald-800">฿{((currentProduct.min_price || 1000) + 30).toLocaleString()}</td>
                        <td className="p-3 text-slate-600">~ ฿{unitPriceEstimate + 1} / เม็ด</td>
                        <td className="p-3 text-right">
                          <a
                            href="https://lazada.co.th"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                          >
                            <span>เช็คราคา Lazada</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SWAPPED COMPONENT: คะแนนการประเมิน 5 มิติ (Soft Muted Emerald Theme) */}
            {/* ========================================================================= */}
            <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-emerald-950/70 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                    5-Dimension Evaluation System
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                    <Award className="text-emerald-400" size={24} />
                    <span>คะแนนการประเมิน 5 มิติ</span>
                  </h3>
                </div>

                <div className="bg-emerald-950/90 border border-emerald-400/40 text-white rounded-2xl px-4 py-2 text-center shadow-lg shrink-0">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Overall Score</span>
                  <span className="text-2xl font-black text-white leading-none">4.5 / 5.0</span>
                </div>
              </div>

              {/* Score Tabs */}
              <div className="flex bg-slate-950/90 p-1.5 rounded-2xl border border-emerald-500/20 shadow-inner">
                <button
                  onClick={() => setActiveScoreTab('science')}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                    activeScoreTab === 'science' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md' : 'text-emerald-200/80 hover:text-white font-bold'
                  }`}
                >
                  Science Evidence
                </button>
                <button
                  onClick={() => setActiveScoreTab('health')}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                    activeScoreTab === 'health' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md' : 'text-emerald-200/80 hover:text-white font-bold'
                  }`}
                >
                  Health Score
                </button>
                <button
                  onClick={() => setActiveScoreTab('merchant')}
                  className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                    activeScoreTab === 'merchant' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md' : 'text-emerald-200/80 hover:text-white font-bold'
                  }`}
                >
                  Merchant Analytics
                </button>
              </div>

              {/* Tab Views wrapped in clean dark container with uniform min-height */}
              <div className="bg-slate-950/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20 shadow-inner text-slate-100 min-h-[420px]">
                {activeScoreTab === 'science' && <ScienceStudiesTab evidenceIds={currentProduct.evidence_ids} />}
                {activeScoreTab === 'health' && <HealthScoreTab />}
                {activeScoreTab === 'merchant' && <MerchantScoreChart productId={currentProduct.id} />}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* EPIC 1.3: TIER 3 - BUSINESS TIER (B2B MARKETPLACE & OEM INSIGHTS) WITH OVERLAY */}
            {/* ========================================================================= */}
            <div className="relative space-y-6 overflow-hidden rounded-3xl">
              <div className={!isTier3Unlocked ? "filter blur-xs opacity-30 pointer-events-none transition-all duration-300 space-y-6" : "transition-all duration-300 space-y-6"}>
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                    Tier 3: B2B Marketplace & OEM Insights
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">ข้อมูลวิเคราะห์เชิงลึกสำหรับแบรนด์และโรงงานผลิต (OEM)</h3>
                  <p className="text-xs text-slate-400 mt-1">ประเมินดัชนีความน่าเชื่อถือ อัตราการซื้อซ้ำ และความผันผวนของราคาตลาด</p>
                </div>

                {/* Historical Price Volatility Line Chart */}
                <MarketTrendChart productName={currentProduct.name} currentPrice={currentProduct.min_price || 1150} />
              </div>

              {/* Overlay for Tier 3 */}
              {!isTier3Unlocked && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-emerald-500/30 space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg">
                    <Lock size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 uppercase tracking-wider">
                      Tier 3 Subscription Access
                    </span>
                    <h4 className="text-xl font-black text-white pt-1">B2B Marketplace & OEM Insights</h4>
                    <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                      ปลดล็อคข้อมูลวิเคราะห์เชิงลึกสำหรับแบรนด์และโรงงานผลิต ประเมินดัชนีความน่าเชื่อถือ และความผันผวนของราคาตลาด
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTier3Unlocked(true)}
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-400/20 transition cursor-pointer flex items-center gap-2 transform hover:scale-105 active:scale-95"
                  >
                    <Sparkles size={16} />
                    <span>More detail (ปลดล็อคข้อมูล)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (1/3 Width): Swapped Tier 2 Container & Brand Typographic Card */}
          <div className="space-y-6">
            {/* SWAPPED TIER 2 CONTAINER WITH OVERLAY */}
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6 overflow-hidden">
              <div className={!isTier2Unlocked ? "filter blur-xs opacity-30 pointer-events-none transition-all duration-300 p-6 space-y-6" : "transition-all duration-300 p-6 space-y-6"}>
                <div>
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    Tier 2: The Deep Science & Safety Hub
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">ตารางวัตถุดิบและหลักฐานทางวิทยาศาสตร์</h3>
                </div>

                {/* Elderly & Active Fitness Drug Interaction Alert Banner */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                    <span>คำเตือนปฏิกิริยาระหว่างสารสกัดกับยา (Drug Interaction Alert)</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    ⚠️ สำหรับผู้สูงอายุหรือผู้ที่รับประทานยาประจำตัว (เช่น ยาละลายลิ่มเลือด Warfarin, Aspirin หรือยาลดความดัน) ควรระวังการรับประทานคู่กับสารสกัดอาหารเสริมกลุ่ม Omega-3 Fish Oil, Ginkgo Biloba หรือ Vitamin E
                  </p>
                </div>

                {/* Ingredients & Upstream Traceability Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FlaskConical size={14} className="text-emerald-600" /> ส่วนประกอบสำคัญต่อหน่วยรับประทาน
                  </h4>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">ส่วนประกอบ</th>
                          <th className="p-2.5">ปริมาณ</th>
                          <th className="p-2.5">โรงงานต้นน้ำ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                        {(currentProduct.ingredient_list || []).map((ingItem, idx) => {
                          const ingObj = ingredientMap.get(ingItem.igd_id);
                          const provObj = ingObj ? providerMap.get(ingObj.provider_id) : undefined;
                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                              <td className="p-2.5 font-bold text-emerald-950">{ingObj?.name || ingItem.igd_id}</td>
                              <td className="p-2.5">
                                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                                  {ingItem.volume}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-600 font-semibold">{provObj?.name || 'DSM (Switzerland)'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3-Tier Scientific Evidence Component */}
                <ScientificEvidence evidenceIds={currentProduct.evidence_ids} />
              </div>

              {/* Overlay for Tier 2 */}
              {!isTier2Unlocked && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-lg">
                    <Lock size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800 uppercase tracking-wider">
                      Tier 2 Access Required
                    </span>
                    <h4 className="text-lg font-black text-white pt-1">The Deep Science & Safety Hub</h4>
                    <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                      ปลดล็อคข้อมูลตารางวัตถุดิบเชิงลึก หลักฐานทางวิทยาศาสตร์ และคำเตือนปฏิกิริยายา
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTier2Unlocked(true)}
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-teal-400/20 transition cursor-pointer flex items-center gap-2 transform hover:scale-105 active:scale-95"
                  >
                    <Sparkles size={16} />
                    <span>More detail (ปลดล็อคข้อมูล)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Task 3.1: Text-Only Brand Typographic Representation & Fallback Badge */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-black text-emerald-400 text-xl tracking-tighter">
                  {(currentBrand?.name || 'NTT')[0]}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">{currentBrand?.name || 'NutriTrust Certified'}</h4>
                  <span className="text-[11px] text-emerald-400 font-semibold block">Text-Only Verified Typographic Brand Spec</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                แสดงผลเครื่องหมายการค้าแบรนด์ในรูปแบบตัวอักษรที่เป็นกลางตามมาตรฐาน IP Protection ไม่ใช้ภาพที่ไม่ได้รับอนุญาต
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Multi-Select Compare & Filter Control Bar */}
          <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Discovered count & Selected count */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Layers size={15} className="text-slate-500" />
                <span className="text-xs font-medium text-slate-500">ค้นพบ:</span>
                <span className="text-sm font-black text-slate-900">{matchingProducts.length} รายการ</span>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
                selectedIds.length > 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                <CheckCircle2 size={15} className={selectedIds.length > 0 ? 'text-emerald-600' : 'text-slate-400'} />
                <span className="text-xs font-medium">เลือกแล้ว:</span>
                <span className="text-sm font-black">{selectedIds.length}</span>
              </div>
            </div>

            {/* Center: Compare Button */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  ยกเลิกเลือก
                </button>
              )}

              <Link
                href={`/compare?ids=${selectedIds.join(',')}`}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  selectedIds.length >= 2
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md shadow-emerald-200 scale-105'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
                onClick={(e) => {
                  if (selectedIds.length < 2) e.preventDefault();
                }}
              >
                <Scale size={15} />
                <span>เปรียบเทียบผลิตภัณฑ์ {selectedIds.length >= 2 ? `(${selectedIds.length})` : ''}</span>
              </Link>
            </div>

            {/* Right: Clear Search Button */}
            <div className="w-full md:w-auto flex justify-end">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProductId(null);
                    setCurrentPage(1);
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      url.searchParams.delete('search');
                      window.history.replaceState({}, '', url.toString());
                    }
                  }}
                  className="w-full md:w-auto px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>ล้างการค้นหา</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Cards Grid (6 items per page) */}
          {matchingProducts.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const brandName = brandMap.get(product.brand_id)?.name || product.brand_id;

                  return (
                    <div
                      key={product.id}
                      className={`relative bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl group ${
                        isSelected
                          ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/20 shadow-md scale-[1.01]'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {/* Top Checkbox */}
                      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
                        <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-2xs cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200'
                            : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white'
                        }`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectProduct(product.id)}
                            className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                          />
                          <span className="text-xs font-semibold">
                            {isSelected ? 'เลือกแล้ว' : 'เลือกเปรียบเทียบ'}
                          </span>
                        </label>
                      </div>

                      {/* Card Image Placeholder Header */}
                      <div className="w-full h-44 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xs shadow-md flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                          <Sparkles size={28} />
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-white/90 px-3 py-0.5 rounded-full shadow-2xs border border-emerald-200">
                          {brandName}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-semibold">
                              {product.category_slug}
                            </span>
                            {product.sub_category && (
                              <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-semibold">
                                {product.sub_category}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            สารสกัดสำคัญ
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {product.ingredient_list.map((ing, idx) => {
                              const ingName = ingredientMap.get(ing.igd_id)?.name || ing.igd_id;
                              return (
                                <span
                                  key={idx}
                                  className="text-xs font-medium bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1"
                                >
                                  <span>{ingName}</span>
                                  <span className="font-bold text-emerald-700">({ing.volume})</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                          <div>
                            <p className="text-[11px] text-slate-400 font-medium">ราคาประมาณการ</p>
                            <p className="text-base font-black text-emerald-700">
                              {formatPriceRange(product.min_price ?? undefined, product.max_price ?? undefined)}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            {product.serving_package}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setAnimationClass('animate-slide-left-750');
                          }}
                          className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs hover:scale-[1.02] active:scale-95"
                        >
                          <span>ดูสเปกอย่างละเอียด (Specs Sheet)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    ‹ ก่อนหน้า
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        currentPage === page
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    ถัดไป ›
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
              <Sparkles size={32} className="mx-auto text-slate-400" />
              <h3 className="text-lg font-black text-slate-900">ไม่พบผลลัพธ์การค้นหาสำหรับ &quot;{searchQuery}&quot;</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ไม่พบผลิตภัณฑ์ที่ตรงกับคำค้นหาที่คุณระบุ กรุณาลองค้นหาด้วยคำอื่น หรือกดล้างการค้นหาเพื่อดูสินค้าทั้งหมด
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedProductId(null);
                  setCurrentPage(1);
                  router.push('/products');
                }}
                className="mt-2 inline-flex items-center gap-1.5 bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
              >
                ดูสินค้าทั้งหมดในแคตตาล็อก
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EPIC 3.2: FIXED STICKY FLOATING MEDICAL DISCLAIMER BANNER AT BOTTOM */}
      {/* ========================================================================= */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto z-50 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <p className="text-slate-300 font-medium leading-relaxed">
            <strong className="text-white font-bold">NutriTrust Medical Disclaimer:</strong> ข้อมูลสารสกัดทั้งหมดจัดทำเพื่อวัตถุประสงค์การศึกษาและการศึกษาค้นคว้าเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ และไม่สามารถใช้ทดแทนการวินิจฉัยจากแพทย์หรือเภสัชกรได้
          </p>
        </div>
        <Link href="/help#terms" className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl transition shrink-0 whitespace-nowrap shadow-xs">
          อ่านข้อกำหนดการใช้งาน
        </Link>
      </div>
    </div>
  );
}
