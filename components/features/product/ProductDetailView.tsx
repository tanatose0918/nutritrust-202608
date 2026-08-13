'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, ShieldCheck, Plus, Minus, ArrowLeft, Sparkles, ChevronDown, Factory, Check, RotateCw,
  Package, FlaskConical, Store, ShieldAlert, ExternalLink, AlertTriangle, Info, TrendingUp, Award, UserCheck,
  Layers, Scale, CheckCircle2, Trash2, ChevronLeft, ChevronRight, Lock, Unlock, ShoppingBag, BookOpen, Activity, Heart
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
import { addToBucket, removeFromBucket, isInBucket, BUCKET_UPDATED_EVENT } from '@/services/bucket';

interface ProductDetailViewProps {
  initialProductId?: string | null;
  isSearchOnlyMode?: boolean;
}

type SearchCategory = 'ingredients' | 'products' | 'brands' | 'issues' | 'goals';
type Tier2TabType = 'science' | 'merchant' | 'health';

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

/**
 * Stateful Bucket Toggle Button for instant real-time cart state updates
 */
function BucketToggleButton({ product, brandName }: { product: any; brandName?: string }) {
  const [inBucket, setInBucket] = useState(false);
  const productId = product.id || product._id;

  useEffect(() => {
    setInBucket(isInBucket(productId));

    const handleUpdate = () => {
      setInBucket(isInBucket(productId));
    };

    window.addEventListener(BUCKET_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(BUCKET_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inBucket) {
      removeFromBucket(productId);
      setInBucket(false);
    } else {
      addToBucket({
        _id: productId,
        name: product.name,
        brand_name: brandName || 'NutriTrust Brand',
        price_thb: product.min_price || product.price_thb || 850
      });
      setInBucket(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
        inBucket
          ? 'bg-emerald-600 text-white border border-emerald-500 hover:bg-emerald-700 shadow-sm'
          : 'bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 shadow-xs hover:scale-105 active:scale-95'
      }`}
      title={inBucket ? 'อยู่ใน Bucket แล้ว' : 'เพิ่มลงใน Bucket'}
    >
      {inBucket ? (
        <>
          <CheckCircle2 size={15} />
          <ShoppingBag size={15} />
        </>
      ) : (
        <>
          <Plus size={14} />
          <ShoppingBag size={15} />
        </>
      )}
    </button>
  );
}

export default function ProductDetailView({ initialProductId = null, isSearchOnlyMode = false }: ProductDetailViewProps) {
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

  const [showMoreBadges, setShowMoreBadges] = useState(false);
  const [isTier2RightLocked, setIsTier2RightLocked] = useState(true);
  const [isTier3Locked, setIsTier3Locked] = useState(true);
  const [tier2SubTab, setTier2SubTab] = useState<Tier2TabType>('science');

  const [apiProductDetail, setApiProductDetail] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  // Restore search query & category from sessionStorage or URL query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (searchParamQuery !== null) {
        if (searchParamQuery === 'all' || searchParamQuery === '') {
          setSearchQuery('');
        } else {
          setSearchQuery(decodeURIComponent(searchParamQuery));
        }
        setSelectedProductId(null);
        setCurrentPage(1);
      } else {
        const savedQuery = sessionStorage.getItem('ntt_last_search_query');
        const savedCat = sessionStorage.getItem('ntt_last_search_category') as SearchCategory;
        if (savedQuery) setSearchQuery(savedQuery);
        if (savedCat) setSearchCategory(savedCat);
      }
    }
  }, [searchParamQuery]);

  // Persist search query & category to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ntt_last_search_query', searchQuery);
      sessionStorage.setItem('ntt_last_search_category', searchCategory);
    }
  }, [searchQuery, searchCategory]);

  useEffect(() => {
    if (!selectedProductId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setIsTier2RightLocked(true);
    setIsTier3Locked(true);

    const fallback = (productsData as unknown as IProduct[]).find((p) => p.id === selectedProductId) || null;
    if (fallback) {
      setApiProductDetail(fallback);
      setIsLoading(false);
    }

    fetchProductDetail(selectedProductId)
      .then((data) => {
        if (data) setApiProductDetail(data);
      })
      .catch((err) => console.warn('Fetch detail error:', err))
      .finally(() => setIsLoading(false));
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
        (p.health_goals && p.health_goals.some((g) => g.toLowerCase().includes(q))) ||
        (p.health_issues && p.health_issues.some((i) => i.toLowerCase().includes(q))) ||
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
    setIsTier2RightLocked(true);
    setIsTier3Locked(true);
    setCurrentPage(1);

    if (badge.type === 'product' && badge.productId) {
      setSelectedProductId(badge.productId);
      setAnimationClass('animate-slide-left-750');
    } else {
      setSelectedProductId(null);
      setIsLoading(false);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedProductId(null);
    setIsLoading(false);
    setCurrentPage(1);
    setIsTier2RightLocked(true);
    setIsTier3Locked(true);
    const q = searchQuery.trim();
    if (typeof window !== 'undefined' && q) {
      const url = new URL(window.location.href);
      url.searchParams.set('search', q);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Unit price estimate
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

      {/* Top Navigation Back Handler */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (selectedProductId) {
              setSelectedProductId(null);
            } else {
              router.push('/?from=back');
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{selectedProductId ? 'กลับไปยังรายการสินค้า Catalog' : 'กลับไปหน้าหลัก'}</span>
        </button>
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${searchCategory === opt.key ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-100'
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
          {/* LEFT COLUMN (2/3 Width): TIER 1 Overview, Bio-Hacker Specs Box (Tabs Only), & TIER 3 Box */}
          <div className="lg:col-span-2 space-y-8">
            {/* TIER 1: Everyday Consumer Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Tier 1: Everyday Consumer Overview
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{currentProduct.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">สรุปภาพรวมผลิตภัณฑ์ สารสกัดหลัก และราคาร้านค้าทางการ</p>
                </div>

                <div className="relative bg-slate-950 border border-emerald-500/40 rounded-3xl p-4 text-white overflow-hidden shadow-xl text-center shrink-0 min-w-[120px]">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">NutriTrust Score</span>
                  <span className="text-3xl font-black text-white leading-none">4.5</span>
                  <span className="text-xs text-emerald-300 font-semibold block mt-0.5">/ 5.0</span>
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs">
                    <UserCheck size={16} className="text-emerald-600" />
                    <span>🎯 เหมาะสำหรับ</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentProduct.health_goals?.join(', ') || 'ผู้ที่ต้องการเสริมสารอาหารบำรุงสุขภาพอย่างสม่ำเสมอ'}
                  </p>
                </div>

                <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-xs">
                    <Sparkles size={16} className="text-teal-600" />
                    <span>🌟 จุดเด่นสำคัญ</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentProduct.safety_profile?.pros?.join(' • ') || 'ใช้สารสกัดจากโรงงานต้นน้ำมาตรฐานระดับโลก มีใบรับรอง CoA'}
                  </p>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs">
                    <Info size={16} className="text-amber-600" />
                    <span>⚖️ ข้อควรพิจารณา</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentProduct.safety_profile?.considerations?.join(' • ') || 'ควรรับประทานพร้อมมื้ออาหารเช้าหรือเย็น'}
                  </p>
                </div>
              </div>

              {/* Merchant Prices & Add to Bucket Button */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Store size={16} className="text-emerald-600" /> ราคาและช่องทางสั่งซื้อจากร้านค้าพันธมิตร
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      เฉลี่ยประมาณ ฿{unitPriceEstimate} / หน่วยรับประทาน
                    </span>
                    <BucketToggleButton product={currentProduct} brandName={currentBrand?.name} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { platform: 'Shopee Mall (Official Store)', price: currentProduct.min_price || 850, url: 'https://shopee.co.th', tag: 'ส่งฟรี + รับเงินคืน' },
                    { platform: 'Lazada LazMall Official', price: (currentProduct.min_price || 850) + 40, url: 'https://lazada.co.th', tag: 'โค้ดส่วนลดพิเศษ' },
                  ].map((merchant, idx) => (
                    <a
                      key={idx}
                      href={merchant.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full inline-block">
                          {merchant.tag}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {merchant.platform}
                        </h5>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 font-mono">
                          ฿{merchant.price.toLocaleString()}
                        </span>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-emerald-600 transition" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* REQUIREMENT #2: Bio-Hacker Specs Box (HEADER REMOVED, TABS ONLY, UNIFIED DARK BACKGROUND COLOR) */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              {/* 3 Tabs Navigation with Unified Dark Background */}
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold gap-1.5">
                <button
                  type="button"
                  onClick={() => setTier2SubTab('science')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition cursor-pointer text-center text-xs font-bold ${
                    tier2SubTab === 'science'
                      ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  🔬 Science Evidence (ลึก)
                </button>
                <button
                  type="button"
                  onClick={() => setTier2SubTab('merchant')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition cursor-pointer text-center text-xs font-bold ${
                    tier2SubTab === 'merchant'
                      ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  🏪 Merchant Score Analytics
                </button>
                <button
                  type="button"
                  onClick={() => setTier2SubTab('health')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition cursor-pointer text-center text-xs font-bold ${
                    tier2SubTab === 'health'
                      ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ❤️ Health Score Analytics
                </button>
              </div>

              {/* Tab Content Container - Unified Dark Matching Color */}
              <div className="pt-2 bg-slate-900 text-white rounded-2xl p-4 border border-slate-800/80">
                {tier2SubTab === 'science' && (
                  <ScienceStudiesTab evidenceIds={currentProduct.evidence_ids} />
                )}
                {tier2SubTab === 'merchant' && (
                  <MerchantScoreChart productId={currentProduct.id} />
                )}
                {tier2SubTab === 'health' && (
                  <HealthScoreTab product={currentProduct} />
                )}
              </div>
            </div>

            {/* TIER 3 Box (Directly under Bio-Hacker Specs Box with Overlay Lock Block) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 relative overflow-hidden">
              {/* Overlay Lock Block for Tier 3 */}
              {isTier3Locked && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
                    <Lock size={22} />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-sm font-black text-white">Tier 3: B2B Marketplace &amp; OEM Price Trend (Locked)</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      ปลดล็อกเพื่อเข้าถึงการวิเคราะห์แนวโน้มราคาตลาดและราคาสั่งผลิต OEM สำหรับผู้ประกอบการและ B2B
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTier3Locked(false)}
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
                  >
                    <Unlock size={14} />
                    <span>ปลดล็อกดูข้อมูล B2B &amp; OEM Price Trend Analytics</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase">
                    Tier 3: B2B &amp; OEM Specs
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    B2B Marketplace &amp; OEM Price Trend Analytics
                  </h4>
                </div>
              </div>

              <div className={`pt-1 ${isTier3Locked ? 'blur-xs select-none pointer-events-none opacity-40' : ''}`}>
                <MarketTrendChart productName={currentProduct.name} currentPrice={currentProduct.min_price || 850} />
              </div>
            </div>
          </div>

          {/* REQUIREMENT #1: RIGHT COLUMN (1/3 Width) - BOTH Scientific Evidences Dept AND Brand Card COVERED BY ONE SINGLE OVERLAY BLOCK */}
          <div className="relative overflow-hidden rounded-3xl p-1">
            {/* ONE SINGLE OVERLAY BLOCK COVERING BOTH CARDS */}
            {isTier2RightLocked && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-3 rounded-3xl animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                  <Lock size={22} />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <span className="text-[10px] font-extrabold text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-500/40 uppercase tracking-wider inline-block">
                    Tier 2: Bio-Hacker &amp; Health Enthusiast Specs
                  </span>
                  <h4 className="text-sm font-black text-white">Scientific Evidences &amp; Certified Brand Info (Locked)</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    ปลดล็อกเพื่อเข้าถึงบทสรุปผลวิจัยทางวิทยาศาสตร์ และใบรับรองมาตรฐานการผลิตแบรนด์
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTier2RightLocked(false)}
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
                >
                  <Unlock size={14} />
                  <span>ปลดล็อกดูข้อมูล Tier 2 (Evidences &amp; Brand Spec)</span>
                </button>
              </div>
            )}

            <div className={`space-y-6 ${isTier2RightLocked ? 'blur-xs select-none pointer-events-none opacity-40' : ''}`}>
              {/* Scientific Evidences Dept Card */}
              <ScientificEvidence evidenceIds={currentProduct.evidence_ids} defaultLocked={false} />

              {/* Brand Certificate Card (รูปที่ 2: Blackmores / Verified Supplier Card) */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                    {currentBrand?.name?.substring(0, 2) || 'NT'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{currentBrand?.name || 'Verified Brand'}</h4>
                    <p className="text-[10px] text-emerald-400 font-mono">NutriTrust Certified Supplier</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900 text-slate-300">
                    <span>ประเทศต้นกำเนิด:</span>
                    <span className="font-bold text-white">{currentBrand?.provide_at || 'Australia'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900 text-slate-300">
                    <span>ปีที่ก่อตั้ง:</span>
                    <span className="font-bold text-white">1932</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-300">
                    <span>มาตรฐานการผลิต:</span>
                    <span className="font-bold text-emerald-400">GMP, TGA Australia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Catalog Listing View (Directory of Products) */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Directory Catalog Results ({matchingProducts.length} รายการ)
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                รายการผลิตภัณฑ์อาหารเสริมที่ผ่านการตรวจสอบย้อนกลับ (Verified Traceability)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline-block">
              หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า
            </span>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => {
                  const brand = brandMap.get(product.brand_id);
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer"
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setAnimationClass('animate-slide-left-750');
                      }}
                    >
                      <div className="space-y-3">
                        {/* Image Placeholder + Brand Tag */}
                        <div className="w-full h-40 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-emerald-50/40 rounded-2xl border border-dashed border-emerald-200 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                            <Layers size={22} />
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full uppercase">
                            {brand?.name || 'Verified Brand'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                            <span>{product.category_slug}</span>
                            {product.health_goals && product.health_goals.length > 0 && (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                                {product.health_goals[0]}
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

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setAnimationClass('animate-slide-left-750');
                            }}
                            className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <span>ดูสเปก (Specs)</span>
                          </button>

                          {/* Stateful Bucket Toggle Button for immediate state update */}
                          <BucketToggleButton product={product} brandName={brand?.name} />
                        </div>
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
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition cursor-pointer ${currentPage === page
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
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('ntt_last_search_query');
                  }
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
    </div>
  );
}
