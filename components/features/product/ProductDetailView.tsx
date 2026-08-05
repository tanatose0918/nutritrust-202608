'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Plus, Minus, ArrowLeft, ArrowRight, Sparkles, ChevronRight, CheckCircle, Award, Factory, ChevronDown, ChevronLeft, Layers, Check } from 'lucide-react';
import { IProduct, IBrand, IIngredient, IProvider } from '@/types/traceability';

import productsData from '@/mockup/products_mockup.json';
import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';
import providersData from '@/mockup/providers_mockup.json';

interface ProductDetailViewProps {
    initialProductId?: string;
    isSearchOnlyMode?: boolean;
}

type SearchCategory = 'ingredients' | 'products' | 'brands';

// Helper for formatting serving package (e.g. tablet-150 -> 150 เม็ด, capsule-60 -> 60 แคปซูล)
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

// Helper for formatting price range (e.g. 1,090 - 1,390 ฿)
const formatPriceRange = (min: number, max: number | null) => {
    if (max && max > min) {
        return `${min.toLocaleString()} - ${max.toLocaleString()} ฿`;
    }
    return `${min.toLocaleString()} ฿`;
};

// Helper for smart badge truncation (don't truncate if <= 12 chars or if Brand)
const formatBadgeName = (name: string, isBrand = false) => {
    if (isBrand || name.length <= 12) return name;
    return `${name.substring(0, 11).trim()}...`;
};

export default function ProductDetailView({
    initialProductId = 'p_001',
    isSearchOnlyMode = false,
}: ProductDetailViewProps) {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        isSearchOnlyMode ? null : initialProductId
    );

    const [searchCategory, setSearchCategory] = useState<SearchCategory>('products');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMoreBadges, setShowMoreBadges] = useState(false);
    const [isTableExpanded, setIsTableExpanded] = useState(false);

    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    // Directional Animation Class (750ms Smoothly)
    const [animationClass, setAnimationClass] = useState('animate-slide-left-750');

    // Carousel Pagination State (3 cards per page)
    const [carouselPageIndex, setCarouselPageIndex] = useState(0);
    const CAROUSEL_PAGE_SIZE = 3;

    // Detect navigation direction from URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const from = params.get('from');
            if (from === 'nav') {
                setAnimationClass('animate-slide-bottom-750');
            } else if (from === 'card') {
                setAnimationClass('animate-slide-left-750');
            } else {
                setAnimationClass('animate-section-swap');
            }
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Data Lookups
    const products = productsData as unknown as IProduct[];
    const brands = brandsData as unknown as IBrand[];
    const ingredients = ingredientsData as unknown as IIngredient[];
    const providers = providersData as unknown as IProvider[];

    const brandMap = useMemo(() => {
        const map = new Map<string, IBrand>();
        brands.forEach(b => map.set(b.id, b));
        return map;
    }, [brands]);

    const ingredientMap = useMemo(() => {
        const map = new Map<string, IIngredient>();
        ingredients.forEach(i => map.set(i.id, i));
        return map;
    }, [ingredients]);

    const providerMap = useMemo(() => {
        const map = new Map<string, IProvider>();
        providers.forEach(p => map.set(p.id, p));
        return map;
    }, [providers]);

    // Current Selected Product for Spec Table View
    const currentProduct = useMemo(() => {
        if (!selectedProductId) return null;
        return products.find(p => p.id === selectedProductId) || products[0];
    }, [products, selectedProductId]);

    const currentBrand = currentProduct ? brandMap.get(currentProduct.brand_id) : null;

    // Category Display Options
    const categoryOptions = [
        { key: 'products', label: 'ชื่อผลิตภัณฑ์' },
        { key: 'brands', label: 'ชื่อแบรนด์ (Brands)' },
        { key: 'ingredients', label: 'ส่วนประกอบ (Ingredients)' },
    ];

    const currentCategoryLabel = categoryOptions.find(c => c.key === searchCategory)?.label || 'ชื่อผลิตภัณฑ์';

    // ----------------------------------------------------
    // Related Products Matching & Filtering
    // ----------------------------------------------------
    const matchingProducts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        // 1. If searching/selecting a Brand
        if (searchCategory === 'brands' && q) {
            const matchedBrandObj = brands.find(b => b.name.toLowerCase().includes(q));
            if (matchedBrandObj) {
                return products.filter(p => p.brand_id === matchedBrandObj.id);
            }
        }

        // 2. If searching/selecting an Ingredient
        if (searchCategory === 'ingredients' && q) {
            const matchedIngObj = ingredients.find(i => i.name.toLowerCase().includes(q));
            if (matchedIngObj) {
                return products.filter(p => p.ingredient_list.some(ing => ing.igd_id === matchedIngObj.id));
            }
        }

        // 3. If searching Products by name
        if (q) {
            return products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.category_slug.toLowerCase().includes(q) ||
                (p.sub_category && p.sub_category.toLowerCase().includes(q))
            );
        }

        // Default: return all products for carousel browsing
        return products;
    }, [searchCategory, searchQuery, products, brands, ingredients]);

    // Carousel Paginated Slices (3 products per page)
    const totalCarouselPages = Math.ceil(matchingProducts.length / CAROUSEL_PAGE_SIZE);
    const paginatedProducts = useMemo(() => {
        const start = carouselPageIndex * CAROUSEL_PAGE_SIZE;
        return matchingProducts.slice(start, start + CAROUSEL_PAGE_SIZE);
    }, [matchingProducts, carouselPageIndex]);

    useEffect(() => {
        setCarouselPageIndex(0);
    }, [searchQuery, searchCategory]);

    // ----------------------------------------------------
    // Badges Data Generator by Category (No Emojis, Smart Truncation)
    // ----------------------------------------------------
    const allBadgesForCategory = useMemo(() => {
        if (searchCategory === 'brands') {
            return brands.map(b => ({
                id: b.id,
                fullName: b.name,
                displayName: formatBadgeName(b.name, true),
                type: 'brand',
            }));
        } else if (searchCategory === 'ingredients') {
            return ingredients.map(i => ({
                id: i.id,
                fullName: i.name,
                displayName: formatBadgeName(i.name, false),
                type: 'ingredient',
            }));
        } else {
            return products.map(p => ({
                id: p.id,
                fullName: p.name,
                displayName: formatBadgeName(p.name, false),
                productId: p.id,
                type: 'product',
            }));
        }
    }, [searchCategory, brands, ingredients, products]);

    const visibleBadges = useMemo(() => {
        const limit = showMoreBadges ? 10 : 5;
        return allBadgesForCategory.slice(0, limit);
    }, [allBadgesForCategory, showMoreBadges]);

    const handleBadgeClick = (badge: { fullName: string; type: string; productId?: string }) => {
        setSearchQuery(badge.fullName);

        if (badge.type === 'product' && badge.productId) {
            setSelectedProductId(badge.productId);
            setAnimationClass('animate-slide-left-750');
        } else {
            setSelectedProductId(null);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim().toLowerCase();
        if (!q) return;

        if (searchCategory === 'products') {
            const matched = products.find(p => p.name.toLowerCase().includes(q));
            if (matched) {
                setSelectedProductId(matched.id);
                setAnimationClass('animate-slide-left-750');
            } else {
                setSelectedProductId(null);
            }
        } else {
            setSelectedProductId(null);
        }
    };

    return (
        <div className={`max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8 overflow-x-hidden ${animationClass}`}>
            
            {/* Top Navigation Back to Home Page */}
            <div className="flex items-center justify-between">
                <Link
                    href="/?from=back"
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-700 transition cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>กลับไปหน้าหลัก</span>
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <ShieldCheck size={14} />
                    <span>NutriTrust Product Specifications</span>
                </div>
            </div>

            {/* Section 1: Search Bar & Custom Modern Dropdown Menu */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <Search className="text-green-700" size={20} />
                    <span>ค้นหาข้อมูลผลิตภัณฑ์และโภชนาการ</span>
                </h2>

                {/* Search Input Box with Custom Modern Dropdown */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 transition relative">
                    
                    {/* Custom Modern Dropdown Popover (No Emojis) */}
                    <div ref={categoryDropdownRef} className="relative w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen(prev => !prev)}
                            className="w-full sm:w-52 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 flex items-center justify-between shadow-2xs transition cursor-pointer"
                        >
                            <span>{currentCategoryLabel}</span>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {isCategoryOpen && (
                            <div className="absolute left-0 top-full mt-1 w-full sm:w-56 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
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
                                            searchCategory === opt.key
                                                ? 'bg-green-50 text-green-800 font-bold'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        {searchCategory === opt.key && <Check size={14} className="text-green-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`ค้นหา${searchCategory === 'brands' ? 'ชื่อแบรนด์' : searchCategory === 'ingredients' ? 'ส่วนประกอบ' : 'ชื่อผลิตภัณฑ์'}...`}
                        className="w-full flex-grow bg-transparent text-sm text-gray-800 outline-none px-3 py-2 placeholder-gray-400 font-medium"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                        <Search size={16} />
                        <span>ค้นหา</span>
                    </button>
                </form>

                {/* Badges List with Smart Truncation & "+" Expansion Button */}
                <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-500">Top Search Badges:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {visibleBadges.map((badge) => (
                            <button
                                key={badge.id}
                                onClick={() => handleBadgeClick(badge)}
                                title={badge.fullName}
                                className="bg-gray-100 hover:bg-green-100 hover:text-green-800 hover:border-green-300 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 transition cursor-pointer flex items-center gap-1"
                            >
                                <span>{badge.displayName}</span>
                            </button>
                        ))}

                        {/* Expand/Collapse "+" Round Button */}
                        {allBadgesForCategory.length > 5 && (
                            <button
                                onClick={() => setShowMoreBadges(prev => !prev)}
                                title={showMoreBadges ? 'ย่อ Badges' : 'ดูเพิ่มอีก 5 Badges'}
                                className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 flex items-center justify-center font-extrabold text-xs transition cursor-pointer shadow-xs shrink-0"
                            >
                                {showMoreBadges ? <Minus size={14} /> : <Plus size={14} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2: MODE A - Single Product Specification Table View */}
            {selectedProductId && currentProduct ? (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden space-y-0 relative animate-slide-left-750">
                    
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-emerald-500/20 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                                    Specs Sheet & Traceability Summary
                                </span>
                                <button
                                    onClick={() => setSelectedProductId(null)}
                                    className="text-xs font-medium text-emerald-200 hover:text-white underline ml-2 cursor-pointer"
                                >
                                    ดูรายการสินค้าเกี่ยวข้องทั้งหมด ({matchingProducts.length})
                                </button>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                {currentProduct.name}
                            </h1>
                            <p className="text-sm text-green-100 flex items-center gap-2">
                                <span>แบรนด์: <strong>{currentBrand?.name || currentProduct.brand_id}</strong></span>
                                <span>•</span>
                                <span>ประเทศผู้ผลิต: <strong>{currentBrand?.provide_at || 'Australia'}</strong></span>
                            </p>
                        </div>

                        {/* Yellow Price Range Format ({min_price} - {max_price} ฿) */}
                        <div className="text-right sm:border-l border-green-700/60 sm:pl-6">
                            <p className="text-xs text-green-200 font-medium">ราคาประมาณการ</p>
                            <p className="text-2xl font-black text-amber-300">
                                {formatPriceRange(currentProduct.min_price, currentProduct.max_price)}
                            </p>
                        </div>
                    </div>

                    {/* Table Content Container */}
                    <div className={`p-6 sm:p-8 space-y-8 relative transition-all duration-500 ${
                        !isTableExpanded ? 'max-h-[480px] overflow-hidden' : 'max-h-none'
                    }`}>
                        
                        {/* 1. General Specs */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={16} className="text-green-600" />
                                <span>1. ข้อมูลทั่วไปของผลิตภัณฑ์ (General Info)</span>
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-medium">
                                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                                    <span className="text-gray-400 block mb-1">หมวดหมู่หลัก (Category)</span>
                                    <span className="font-bold text-gray-800 text-sm">{currentProduct.category_slug}</span>
                                </div>
                                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                                    <span className="text-gray-400 block mb-1">หมวดหมู่ย่อย (Sub Category)</span>
                                    <span className="font-bold text-gray-800 text-sm">{currentProduct.sub_category || '-'}</span>
                                </div>
                                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                                    <span className="text-gray-400 block mb-1">รูปแบบบรรจุภัณฑ์ (Serving Format)</span>
                                    <span className="font-bold text-gray-800 text-sm">{formatServingPackage(currentProduct.serving_package)}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Key Ingredients & Dosage */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Award size={16} className="text-green-600" />
                                <span>2. รายละเอียดส่วนประกอบหลักและปริมาณ (Key Ingredients & Dosage)</span>
                            </h3>

                            <div className="border border-gray-200 rounded-2xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                                        <tr>
                                            <th className="p-3">ชื่อส่วนประกอบ (Ingredient)</th>
                                            <th className="p-3">ปริมาณต่อหน่วยบริโภค (Volume)</th>
                                            <th className="p-3">โรงงานสารสกัดต้นน้ำ (Upstream Provider)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-800 font-medium">
                                        {currentProduct.ingredient_list.map((ingItem, idx) => {
                                            const ingObj = ingredientMap.get(ingItem.igd_id);
                                            const provObj = ingObj ? providerMap.get(ingObj.provider_id) : undefined;

                                            return (
                                                <tr key={idx} className="hover:bg-gray-50/80 transition">
                                                    <td className="p-3 font-bold text-green-900">
                                                        {ingObj?.name || ingItem.igd_id}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-bold">
                                                            {ingItem.volume}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-gray-600">
                                                        {provObj?.name || 'DSM Nutritional Products'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Upstream Traceability Chain */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Factory size={16} className="text-green-600" />
                                <span>3. ข้อมูลระบบตรวจสอบย้อนกลับสารสกัด (Traceability Process)</span>
                            </h3>

                            <div className="space-y-3">
                                {currentProduct.ingredient_list.map((ingItem, idx) => {
                                    const ingObj = ingredientMap.get(ingItem.igd_id);
                                    const provObj = ingObj ? providerMap.get(ingObj.provider_id) : undefined;

                                    if (!provObj) return null;

                                    return (
                                        <div key={idx} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                                                    <CheckCircle size={14} className="text-emerald-600" />
                                                    <span>{provObj.name}</span>
                                                </span>
                                                <span className="text-[11px] font-bold bg-white text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                    มาตรฐานตรวจสอบย้อนกลับได้จริง
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-700 leading-relaxed">
                                                {provObj.traceability_process}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* More Detail Click! Transparent Gradient Overlay */}
                    {!isTableExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-6 z-20 pointer-events-auto">
                            <button
                                onClick={() => setIsTableExpanded(true)}
                                className="bg-green-700 hover:bg-green-800 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer flex items-center gap-2 border border-green-600"
                            >
                                <span>More Detail Click! (ดูผลวิจัยและรายละเอียดเชิงลึกทั้งหมด)</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Section 3: MODE B - Multi-Product Related Carousel Pagination View (3 cards per page) */
                <div className="space-y-6 animate-section-swap">
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Layers size={14} /> ผลิตภัณฑ์ที่เกี่ยวข้อง
                                </span>
                                <span className="text-sm font-bold text-gray-600">
                                    (ค้นพบทั้งหมด {matchingProducts.length} รายการ)
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                แสดงผลลัพธ์แบบ Carousel (สูงสุด 3 สินค้าต่อหน้า) เลือกดูรายละเอียดของแต่ละตัวได้ทันที
                            </p>
                        </div>

                        {/* Carousel Pagination Controls */}
                        {totalCarouselPages > 1 && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCarouselPageIndex(prev => Math.max(0, prev - 1))}
                                    disabled={carouselPageIndex === 0}
                                    className="w-9 h-9 rounded-full bg-white border border-gray-300 shadow-xs flex items-center justify-center text-gray-700 hover:bg-green-700 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 transition cursor-pointer"
                                    title="หน้าก่อนหน้า"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <span className="text-xs font-bold text-gray-700">
                                    {carouselPageIndex + 1} / {totalCarouselPages}
                                </span>

                                <button
                                    onClick={() => setCarouselPageIndex(prev => Math.min(totalCarouselPages - 1, prev + 1))}
                                    disabled={carouselPageIndex >= totalCarouselPages - 1}
                                    className="w-9 h-9 rounded-full bg-white border border-gray-300 shadow-xs flex items-center justify-center text-gray-700 hover:bg-green-700 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 transition cursor-pointer"
                                    title="หน้าถัดไป"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 3 Product Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {paginatedProducts.map((product) => {
                            const bName = brandMap.get(product.brand_id)?.name || product.brand_id;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-3xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl group"
                                >
                                    {/* Product Image Placeholder */}
                                    <div className="w-full h-44 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                                            <Sparkles size={30} />
                                        </div>
                                        <span className="text-xs font-semibold text-emerald-800 bg-white/90 px-3 py-0.5 rounded-full shadow-xs border border-emerald-200">
                                            {bName}
                                        </span>
                                    </div>

                                    {/* Product Details Body */}
                                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block">
                                                {product.category_slug}
                                            </span>
                                            <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug">
                                                {product.name}
                                            </h3>
                                        </div>

                                        {/* Ingredients Preview */}
                                        <div className="space-y-1 pt-2 border-t border-gray-100">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                สารสกัดหลัก
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {product.ingredient_list.map((ing, idx) => {
                                                    const iName = ingredientMap.get(ing.igd_id)?.name || ing.igd_id;
                                                    return (
                                                        <span key={idx} className="text-xs font-medium bg-gray-50 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                                                            {iName} ({ing.volume})
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Price Range Format & Formatted Serving Package */}
                                        <div className="pt-2 border-t border-gray-100 flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-medium">ราคาเริ่มต้น</p>
                                                <p className="text-base font-black text-emerald-700">
                                                    {product.min_price.toLocaleString()} ฿
                                                </p>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                                                {formatServingPackage(product.serving_package)}
                                            </span>
                                        </div>

                                        {/* Select Product Action */}
                                        <button
                                            onClick={() => {
                                                setSelectedProductId(product.id);
                                                setAnimationClass('animate-slide-left-750');
                                            }}
                                            className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md group-hover:shadow-lg"
                                        >
                                            <span>ดูรายละเอียดผลิตภัณฑ์</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
