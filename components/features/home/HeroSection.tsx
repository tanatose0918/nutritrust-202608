'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, X, Package, Building2, FlaskConical, Sparkles, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import { IProduct, IBrand, IIngredient } from '@/types/traceability';

import productsData from '@/mockup/products_mockup.json';
import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';
import { searchAllCollections, sendTelemetryEvent } from '@/services/api';

const PRODUCTS = [
  { id: 'p_001', name: 'Blackmores Bio C 1000 mg' },
  { id: 'p_002', name: 'Mega We Care Fish Oil 1000 mg' },
  { id: 'p_003', name: 'Now Foods Magnesium Glycinate 200 mg' },
  { id: 'p_004', name: 'Astaxanthin 12 mg' },
  { id: 'p_005', name: "Nature's Bounty Co Q-10 100 mg" },
  { id: 'p_006', name: 'Blackmores : Joint Plus Collagen UC-II (UC-II + Calcium & Vitamin D)' },
];

const SLIDE_DURATION = 12000;

export default function HeroSection() {
  const router = useRouter();

  // Carousel State & Effect
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(12.00);
  const [slideKey, setSlideKey] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const updateTimer = () => {
      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed >= SLIDE_DURATION) {
        setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
        setSlideKey((prev) => prev + 1);
        startTimeRef.current = Date.now();
        setCountdown(12.00);
      } else {
        const remaining = (SLIDE_DURATION - elapsed) / 1000;
        setCountdown(Math.max(0.01, remaining));
      }

      animFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentIndex]);

  const handleManualNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
    setSlideKey((prev) => prev + 1);
    startTimeRef.current = Date.now();
    setCountdown(12.00);
  };

  const handleManualPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
    setSlideKey((prev) => prev + 1);
    startTimeRef.current = Date.now();
    setCountdown(12.00);
  };

  const handleSelectCard = (index: number) => {
    setCurrentIndex(index);
    setSlideKey((prev) => prev + 1);
    startTimeRef.current = Date.now();
    setCountdown(12.00);
  };

  // Instant Categorized Search State & Logic
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [apiSearchResults, setApiSearchResults] = useState<{ products: any[]; brands: any[]; ingredients: any[] } | null>(null);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setApiSearchResults(null);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(() => {
      searchAllCollections(q).then((results) => {
        if (isMounted && results && (results.products.length > 0 || results.brands.length > 0 || results.ingredients.length > 0)) {
          setApiSearchResults(results);
        }
      });
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const localSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { products: [], brands: [], ingredients: [] };

    const typedProducts = productsData as unknown as IProduct[];
    const typedBrands = brandsData as unknown as IBrand[];
    const typedIngredients = ingredientsData as unknown as IIngredient[];

    const matchedProducts = typedProducts.filter((p: IProduct) =>
      p.name.toLowerCase().includes(q) ||
      p.category_slug.toLowerCase().includes(q) ||
      (p.sub_category && p.sub_category.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedBrands = typedBrands.filter((b: IBrand) =>
      b.name.toLowerCase().includes(q) ||
      b.provide_at.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedIngredients = typedIngredients.filter((i: IIngredient) =>
      i.name.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      products: matchedProducts,
      brands: matchedBrands,
      ingredients: matchedIngredients,
    };
  }, [searchQuery]);

  const searchResults = apiSearchResults || localSearchResults;

  const totalResultsCount =
    searchResults.products.length +
    searchResults.brands.length +
    searchResults.ingredients.length;

  const executeSearch = (targetQuery: string) => {
    const q = targetQuery.trim();
    if (!q) {
      setSearchError('กรุณาพิมพ์ข้อความที่ต้องการค้นหา');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setSearchError(null);
    setIsSearchOpen(false);
    sendTelemetryEvent('search');
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    setSearchError(null);
    executeSearch(text);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setSearchError(null);
    executeSearch(tag);
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full gap-8 md:gap-12 py-4 md:py-6">
      
      {/* Left side: Heading & Search Box */}
      <div className="w-full md:w-1/2 space-y-5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 tracking-tight">
          เลือกวิตามินและอาหารเสริมอย่างมั่นใจ <br />
          <span className="text-emerald-700">ด้วยข้อมูลที่ตรวจสอบได้</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg">
          เปรียบเทียบราคา ส่วนประกอบ รีวิว และข้อมูลทางวิทยาศาสตร์ เพื่อช่วยให้คุณเลือกผลิตภัณฑ์ที่เหมาะสมได้ง่ายขึ้น
        </p>

        {/* Search Input Box */}
        <div ref={searchContainerRef} className="relative w-full max-w-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeSearch(searchQuery);
            }}
            className={`flex w-full items-center bg-white rounded-full p-2 border transition-all duration-300 ${
              searchError
                ? 'border-red-500 ring-2 ring-red-200 shadow-md'
                : 'border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (searchError) setSearchError(null);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                if (searchError) setSearchError(null);
                setIsSearchOpen(true);
              }}
              placeholder="ค้นหาชื่อผลิตภัณฑ์, แบรนด์ หรือส่วนประกอบ..."
              className="flex-grow bg-transparent outline-none px-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchError(null);
                  setIsSearchOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 cursor-pointer transition"
                title="ล้างคำค้นหา"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              className="bg-emerald-700 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-emerald-800 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 shadow-sm"
            >
              <Search size={18} /> ค้นหา
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-red-500 font-semibold mt-2 ml-4 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14} />
              <span>{searchError}</span>
            </p>
          )}

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 backdrop-blur-md bg-white/95 rounded-3xl border border-slate-200/80 shadow-2xl z-50 overflow-hidden max-h-[440px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 p-3.5 space-y-4">
              <div className="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-100/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                  <Sparkles size={13} className="text-emerald-600 shrink-0" />
                  <span>Personalized Search Bias: ปรับแต่งผลลัพธ์ตามเป้าหมายสุขภาพของคุณ</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                  Active Profile
                </span>
              </div>

              {totalResultsCount > 0 ? (
                <div className="space-y-4">
                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-3 py-1.5 bg-emerald-50 rounded-lg mb-1">
                        <Package size={14} />
                        <span>ชื่อผลิตภัณฑ์ ({searchResults.products.length})</span>
                      </div>
                      <div className="space-y-0.5">
                        {searchResults.products.map((item: IProduct) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item.name)}
                            className="px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                          >
                            <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-emerald-700 transition">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                              {item.category_slug}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.brands.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 px-3 py-1.5 bg-teal-50 rounded-lg mb-1">
                        <Building2 size={14} />
                        <span>ชื่อแบรนด์ ({searchResults.brands.length})</span>
                      </div>
                      <div className="space-y-0.5">
                        {searchResults.brands.map((item: IBrand) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item.name)}
                            className="px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                          >
                            <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-teal-700 transition">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-medium bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full border border-teal-100">
                              กำเนิดที่ {item.provide_at}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.ingredients.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 px-3 py-1.5 bg-purple-50 rounded-lg mb-1">
                        <FlaskConical size={14} />
                        <span>ส่วนประกอบสารสกัด ({searchResults.ingredients.length})</span>
                      </div>
                      <div className="space-y-0.5">
                        {searchResults.ingredients.map((item: IIngredient) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item.name)}
                            className="px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                          >
                            <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-purple-700 transition">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-medium bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                              สารสกัดหลัก
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  <Sparkles size={24} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-slate-700">ไม่พบข้อมูลที่ตรงกับ &quot;{searchQuery}&quot;</p>
                  <p className="text-xs text-slate-400 mt-1">
                    ลองค้นหาด้วยชื่อผลิตภัณฑ์ เช่น &quot;Bio C&quot;, แบรนด์ เช่น &quot;Blackmores&quot; หรือส่วนประกอบ เช่น &quot;Vitamin C&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mt-3">
          <span className="mr-1">ยอดนิยม:</span>
          {['Vitamin C', 'Fish Oil', 'Magnesium', 'Blackmores', 'Vistra'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="bg-slate-50 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 hover:scale-105 active:scale-95 cursor-pointer border border-slate-200 transition text-xs font-medium"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Right side: Clickable Product Cards Carousel */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-sm relative">
          <button
            type="button"
            onClick={handleManualPrev}
            aria-label="Previous card"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-emerald-800 hover:bg-emerald-700 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={handleManualNext}
            aria-label="Next card"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-emerald-800 hover:bg-emerald-700 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>

          {/* Clickable Carousel Product Card */}
          <div className="w-full overflow-hidden py-1">
            <Link
              href={`/products/${PRODUCTS[currentIndex].id}`}
              className="block cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            >
              <div key={slideKey} className="w-full animate-slide-in-bottom">
                <ProductCard
                  name={PRODUCTS[currentIndex].name}
                  countdown={countdown}
                />
              </div>
            </Link>
          </div>

          {/* Carousel Dots */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleSelectCard(idx)}
                  title={prod.name}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-emerald-700'
                      : 'w-2 bg-emerald-300 hover:bg-emerald-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}