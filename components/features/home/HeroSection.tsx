'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X, Package, Building2, FlaskConical, Sparkles, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import { IProduct, IBrand, IIngredient } from '@/types/traceability';

import productsData from '@/mockup/products_mockup.json';
import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';
import { searchAllCollections } from '@/services/api';

const PRODUCTS = [
    { id: 1, name: 'Blackmores Bio C 1000 mg' },
    { id: 2, name: 'Mega We Care Fish Oil 1000 mg' },
    { id: 3, name: 'Now Foods Magnesium Glycinate 200 mg' },
    { id: 4, name: 'Astaxanthin 12 mg' },
    { id: 5, name: "Nature's Bounty Co Q-10 100 mg" },
    { id: 6, name: 'Blackmores : Joint Plus Collagen UC-II (UC-II + Calcium & Vitamin D)' },
];

const SLIDE_DURATION = 12000; // 12000 ms (12 วินาที)

interface HeroSectionProps {
    onSearch?: (products: IProduct[], query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
    // ----------------------------------------------------
    // Carousel State & Effect
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // Instant Categorized Search State & Logic
    // ----------------------------------------------------
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fastify API Search State & Async Effect
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

    // Filter ผลลัพธ์ (ใช้ข้อมูลจาก Fastify MongoDB API หรือ Local Fallback)
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

    // Execute comprehensive search across all mockups and emit to parent page
    const executeSearch = (targetQuery: string) => {
        const q = targetQuery.trim().toLowerCase();
        if (!q) {
            setSearchError('กรุณาพิมพ์ ข้อความ ที่ต้องการค้นหา');
            if (inputRef.current) inputRef.current.focus();
            return;
        }

        setSearchError(null);
        setIsSearchOpen(false);

        const typedProducts = productsData as unknown as IProduct[];
        const typedBrands = brandsData as unknown as IBrand[];
        const typedIngredients = ingredientsData as unknown as IIngredient[];

        // Find products matching query directly
        const directProducts = typedProducts.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category_slug.toLowerCase().includes(q) ||
            (p.sub_category && p.sub_category.toLowerCase().includes(q))
        );

        // Find brand ids matching query, then find their products
        const matchedBrandIds = typedBrands
            .filter(b => b.name.toLowerCase().includes(q))
            .map(b => b.id);
        const brandProducts = typedProducts.filter(p => matchedBrandIds.includes(p.brand_id));

        // Find ingredient ids matching query, then find products containing them
        const matchedIngIds = typedIngredients
            .filter(i => i.name.toLowerCase().includes(q))
            .map(i => i.id);
        const ingredientProducts = typedProducts.filter(p =>
            p.ingredient_list.some(ing => matchedIngIds.includes(ing.igd_id))
        );

        // Merge & Deduplicate
        const productMap = new Map<string, IProduct>();
        [...directProducts, ...brandProducts, ...ingredientProducts].forEach(p => {
            productMap.set(p.id, p);
        });

        const finalProducts = Array.from(productMap.values());
        // If query doesn't match anything specific, show all mockup products as default result set
        const resultsToEmit = finalProducts.length > 0 ? finalProducts : typedProducts;

        // Dispatch custom event to notify VisitorStats to increment search count
        try {
            const currentSearchCount = parseInt(localStorage.getItem('nutritrust_search_count') || '0', 10);
            localStorage.setItem('nutritrust_search_count', (currentSearchCount + 1).toString());
            window.dispatchEvent(new CustomEvent('nutritrust_search_performed'));
        } catch {
            // Ignore SSR or storage error
        }

        if (onSearch) {
            onSearch(resultsToEmit, targetQuery);
        }
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
        <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full gap-12 py-6">

            {/* ฝั่งซ้าย: ข้อความและช่องค้นหา */}
            <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight">
                    เลือกวิตามินและอาหารเสริมอย่างมั่นใจ <br />
                    <span className="text-green-700">ด้วยข้อมูลที่ตรวจสอบได้</span>
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                    เปรียบเทียบราคา ส่วนประกอบ รีวิว และข้อมูลทางวิทยาศาสตร์ เพื่อช่วยให้คุณเลือกผลิตภัณฑ์ที่เหมาะสมได้ง่ายขึ้น
                </p>

                {/* กล่องค้นหา (Instant Categorized Omni-Search) */}
                <div ref={searchContainerRef} className="relative w-full max-w-lg">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            executeSearch(searchQuery);
                        }}
                        className={`flex w-full items-center bg-white rounded-full p-2 border transition-all ${
                            searchError
                                ? 'border-red-500 ring-2 ring-red-200 shadow-md'
                                : 'border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-green-500'
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
                            className="flex-grow bg-transparent outline-none px-4 text-sm text-gray-700 placeholder-gray-400"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchError(null);
                                    setIsSearchOpen(false);
                                }}
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 mr-1 cursor-pointer transition"
                                title="ล้างคำค้นหา"
                            >
                                <X size={16} />
                            </button>
                        )}

                        <button
                            type="submit"
                            className="bg-green-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-green-800 transition cursor-pointer shrink-0 shadow-sm"
                        >
                            <Search size={18} /> ค้นหา
                        </button>
                    </form>

                    {/* Check null Error Message under Input */}
                    {searchError && (
                        <p className="text-xs text-red-500 font-semibold mt-2 ml-4 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={14} />
                            <span>{searchError}</span>
                        </p>
                    )}

                    {/* Auto-complete Dropdown Popup */}
                    {isSearchOpen && searchQuery.trim().length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden max-h-[420px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                            
                            {totalResultsCount > 0 ? (
                                <div className="p-3 space-y-4">
                                    {/* 1. หมวดผลิตภัณฑ์ (Products) */}
                                    {searchResults.products.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 px-3 py-1.5 bg-green-50 rounded-lg mb-1">
                                                <Package size={14} />
                                                <span>ชื่อผลิตภัณฑ์ ({searchResults.products.length})</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                {searchResults.products.map((item: IProduct) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleSelectSuggestion(item.name)}
                                                        className="px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                                                    >
                                                        <span className="text-sm font-medium text-gray-800 group-hover:text-green-700 transition">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[11px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                                                            {item.category_slug}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. หมวดแบรนด์ (Brands) */}
                                    {searchResults.brands.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 px-3 py-1.5 bg-blue-50 rounded-lg mb-1">
                                                <Building2 size={14} />
                                                <span>ชื่อแบรนด์ ({searchResults.brands.length})</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                {searchResults.brands.map((item: IBrand) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleSelectSuggestion(item.name)}
                                                        className="px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                                                    >
                                                        <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                                                            กำเนิดที่ {item.provide_at}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. หมวดส่วนประกอบ (Ingredients) */}
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
                                                        className="px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                                                    >
                                                        <span className="text-sm font-medium text-gray-800 group-hover:text-purple-700 transition">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[11px] font-medium bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                                                            สารสกัดหลัก
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    <Sparkles size={24} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">ไม่พบข้อมูลที่ตรงกับ &quot;{searchQuery}&quot;</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        ลองค้นหาด้วยชื่อผลิตภัณฑ์ เช่น &quot;Bio C&quot;, แบรนด์ เช่น &quot;Blackmores&quot; หรือส่วนประกอบ เช่น &quot;Vitamin C&quot;
                                    </p>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* แท็กค้นหายอดนิยม */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 mt-4">
                    <span className="mr-1">ยอดนิยม:</span>
                    {['Vitamin C', 'Fish Oil', 'Magnesium', 'Blackmores', 'Vistra'].map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            className="bg-gray-50 px-3 py-1.5 rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-300 cursor-pointer border border-gray-200 transition text-xs font-medium"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* ฝั่งขวา: Product Cards Carousel */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
                
                {/* Carousel wrapper */}
                <div className="w-full max-w-sm relative">
                    
                    {/* ปุ่มกด เลื่อนสไลด์ซ้าย-ขวา */}
                    <button
                        type="button"
                        onClick={handleManualPrev}
                        aria-label="Previous card"
                        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-green-800 hover:bg-green-700 hover:text-white transition-all hover:scale-105 cursor-pointer"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <button
                        type="button"
                        onClick={handleManualNext}
                        aria-label="Next card"
                        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-green-800 hover:bg-green-700 hover:text-white transition-all hover:scale-105 cursor-pointer"
                    >
                        <ChevronRight size={22} />
                    </button>

                    {/* Card Slide Container with 1200ms Slide-in Animation */}
                    <div className="w-full overflow-hidden py-1">
                        <div key={slideKey} className="w-full animate-slide-in-bottom">
                            <ProductCard
                                name={PRODUCTS[currentIndex].name}
                                countdown={countdown}
                            />
                        </div>
                    </div>

                    {/* Navigation Dots */}
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
                                            ? 'w-6 bg-green-700'
                                            : 'w-2 bg-green-300 hover:bg-green-400'
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