'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Plus, Minus, ArrowLeft, ArrowRight, Sparkles, ChevronRight, CheckCircle, Award, Factory, ChevronDown, ChevronLeft, Layers, Check, RotateCw, Package, FlaskConical, Store, ShieldAlert, BookOpenCheck } from 'lucide-react';
import { IProduct, IBrand, IIngredient, IProvider } from '@/types/traceability';

import productsData from '@/mockup/products_mockup.json';
import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';
import providersData from '@/mockup/providers_mockup.json';

import ScientificEvidence from '@/components/features/product/ScientificEvidence';
import MerchantScoreChart from '@/components/features/product/MerchantScoreChart';
import HealthScoreTab from '@/components/features/product/HealthScoreTab';
import ScienceStudiesTab from '@/components/features/product/ScienceStudiesTab';
import { fetchProductDetail } from '@/services/api';

interface ProductDetailViewProps {
    initialProductId?: string;
    isSearchOnlyMode?: boolean;
}

type SearchCategory = 'ingredients' | 'products' | 'brands';
type ScoreTabType = 'merchant' | 'health' | 'science';

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

    // Score Analytics Tab Navigation State (Merchant | Health | Science Studies)
    const [activeScoreTab, setActiveScoreTab] = useState<ScoreTabType>('merchant');

    // Fastify API Integration & Latency Loading State
    const [isLoading, setIsLoading] = useState(false);
    const [apiProductDetail, setApiProductDetail] = useState<any | null>(null);

    useEffect(() => {
        if (!selectedProductId) return;

        let isMounted = true;
        setIsLoading(true);
        const startTime = Date.now();

        fetchProductDetail(selectedProductId)
            .then((data) => {
                if (isMounted && data) {
                    setApiProductDetail(data);
                }
            })
            .finally(() => {
                if (isMounted) {
                    const elapsed = Date.now() - startTime;
                    const delay = elapsed > 4000 ? 600 : 0;
                    setTimeout(() => setIsLoading(false), delay);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [selectedProductId]);

    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    // Directional Animation Class (750ms Smoothly)
    const [animationClass, setAnimationClass] = useState('animate-slide-left-750');

    // Carousel Pagination State (6 cards per page)
    const [carouselPageIndex, setCarouselPageIndex] = useState(0);
    const CAROUSEL_PAGE_SIZE = 6;

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

    // Current Selected Product for Spec View (Uses Fastify API data or local mockup fallback)
    const currentProduct = useMemo(() => {
        if (!selectedProductId) return null;
        return apiProductDetail || products.find(p => p.id === selectedProductId) || products[0];
    }, [products, selectedProductId, apiProductDetail]);

    const currentBrand = currentProduct ? brandMap.get(currentProduct.brand_id) : null;

    // Group ingredients by provider ID for currentProduct (deduplicate cards by provider)
    const providerTraceabilityGroup = useMemo(() => {
        if (!currentProduct) return [];

        const map = new Map<string, { provider: IProvider; ingredients: string[] }>();

        (currentProduct.ingredient_list || []).forEach((ingItem: { igd_id: string; volume: string }) => {
            const ingObj = ingredientMap.get(ingItem.igd_id);
            if (ingObj) {
                const provObj = providerMap.get(ingObj.provider_id);
                if (provObj) {
                    if (!map.has(provObj.id)) {
                        map.set(provObj.id, {
                            provider: provObj,
                            ingredients: [ingObj.name],
                        });
                    } else {
                        const existing = map.get(provObj.id)!;
                        if (!existing.ingredients.includes(ingObj.name)) {
                            existing.ingredients.push(ingObj.name);
                        }
                    }
                }
            }
        });

        return Array.from(map.values());
    }, [currentProduct, ingredientMap, providerMap]);

    // Dynamic Filtered Products for Related Carousel View (Mode B)
    const matchingProducts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return products;

        if (searchCategory === 'brands') {
            const matchedBrands = brands.filter(b => b.name.toLowerCase().includes(q)).map(b => b.id);
            return products.filter(p => matchedBrands.includes(p.brand_id));
        } else if (searchCategory === 'ingredients') {
            const matchedIngredients = ingredients.filter(i => i.name.toLowerCase().includes(q)).map(i => i.id);
            return products.filter(p => p.ingredient_list.some(ing => matchedIngredients.includes(ing.igd_id)));
        } else {
            return products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.category_slug.toLowerCase().includes(q) ||
                (p.sub_category && p.sub_category.toLowerCase().includes(q))
            );
        }
    }, [products, brands, ingredients, searchQuery, searchCategory]);

    const categoryOptions = [
        { key: 'products', label: 'ค้นหาจากชื่อผลิตภัณฑ์' },
        { key: 'brands', label: 'ค้นหาจากแบรนด์' },
        { key: 'ingredients', label: 'ค้นหาจากส่วนประกอบ' },
    ];

    const currentCategoryLabel = useMemo(() => {
        return categoryOptions.find(o => o.key === searchCategory)?.label || 'ค้นหาตามผลิตภัณฑ์';
    }, [searchCategory]);

    const totalCarouselPages = Math.ceil(matchingProducts.length / CAROUSEL_PAGE_SIZE);

    const paginatedProducts = useMemo(() => {
        const start = carouselPageIndex * CAROUSEL_PAGE_SIZE;
        return matchingProducts.slice(start, start + CAROUSEL_PAGE_SIZE);
    }, [matchingProducts, carouselPageIndex]);

    useEffect(() => {
        setCarouselPageIndex(0);
    }, [searchQuery, searchCategory]);

    // Badges Data Generator by Category
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
        <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8 overflow-x-hidden ${animationClass}`}>
            
            {/* Speed Bouncing Rotate Latency Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center z-50 transition-all duration-300">
                    <div className="bg-slate-900/95 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm mx-4">
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                            <RotateCw className="w-10 h-10 text-emerald-400 animate-speed-bounce-rotate" />
                        </div>
                        <div>
                            <h4 className="text-white font-extrabold text-lg">กำลังโหลดข้อมูลผลิตภัณฑ์...</h4>
                            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                                กำลัง Query ข้อมูลจาก NutriTrust Fastify Backend & MongoDB
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                            <Sparkles size={13} />
                            <span>Latency Control (4 - 10s) • Bouncing Speed Rotate</span>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Search Bar Block */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <Search className="text-green-700" size={20} />
                    <span>ค้นหาข้อมูลผลิตภัณฑ์และโภชนาการ</span>
                </h2>

                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 transition relative">
                    <div ref={categoryDropdownRef} className="relative w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen(prev => !prev)}
                            className="w-full sm:w-52 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 flex items-center justify-between shadow-2xs transition cursor-pointer"
                        >
                            <span>{currentCategoryLabel}</span>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

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

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`ค้นหา${searchCategory === 'brands' ? 'ชื่อแบรนด์' : searchCategory === 'ingredients' ? 'ส่วนประกอบ' : 'ชื่อผลิตภัณฑ์'}...`}
                        className="w-full flex-grow bg-transparent text-sm text-gray-800 outline-none px-3 py-2 placeholder-gray-400 font-medium"
                    />

                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                        <Search size={16} />
                        <span>ค้นหา</span>
                    </button>
                </form>

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

            {/* Section 2: Single Product View - Responsive 2-Column Layout */}
            {selectedProductId && currentProduct ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-slide-left-750">
                    
                    {/* LEFT COLUMN (2/3 Width): Main Specifications, Ingredients, Traceability & Score Analytics Tabs */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                                        Specs Sheet & Traceability Summary
                                    </span>
                                    <button
                                        onClick={() => setSelectedProductId(null)}
                                        className="text-xs font-medium text-slate-300 hover:text-white underline ml-2 cursor-pointer"
                                    >
                                        ดูสินค้าทั้งหมด ({matchingProducts.length})
                                    </button>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                    {currentProduct.name}
                                </h1>
                                <p className="text-xs text-slate-300 flex items-center gap-2">
                                    <span>แบรนด์: <strong className="text-emerald-300">{currentBrand?.name || currentProduct.brand_id}</strong></span>
                                    <span>•</span>
                                    <span>ประเทศผู้ผลิต: <strong className="text-emerald-300">{currentBrand?.provide_at || 'Australia'}</strong></span>
                                </p>
                            </div>

                            <div className="text-right sm:border-l border-slate-800 sm:pl-6">
                                <p className="text-xs text-slate-400 font-medium">ราคาประมาณการ</p>
                                <p className="text-2xl font-black text-amber-400">
                                    {formatPriceRange(currentProduct.min_price, currentProduct.max_price)}
                                </p>
                            </div>
                        </div>

                        {/* General Information Section (Image on RIGHT, Text Flex-Row on LEFT) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                            {/* Header Directive #2 Standard */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <Package size={24} className="text-slate-800 shrink-0" />
                                    <h3 className="text-2xl font-bold text-slate-800">
                                        Information Overview
                                    </h3>
                                </div>
                                <p className="text-base font-normal text-slate-500 mt-0.5">
                                    ข้อมูลทั่วไปของผลิตภัณฑ์
                                </p>
                            </div>

                            {/* Content: Left Text Paragraphs (Flex-Row), Right Product Image */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
                                {/* Left Side: Pure Paragraphs Flex-Row (No Box Wrapping) */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col items-start gap-y-2.5">
                                        <p className="text-sm font-normal text-slate-500">
                                            Category: <strong className="text-slate-800 font-bold text-base">{currentProduct.category_slug}</strong>
                                        </p>
                                        <p className="text-sm font-normal text-slate-500">
                                            Sub Category: <strong className="text-slate-800 font-bold text-base">{currentProduct.sub_category || '-'}</strong>
                                        </p>
                                        <p className="text-sm font-normal text-slate-500">
                                            Serving: <strong className="text-slate-800 font-bold text-base">{formatServingPackage(currentProduct.serving_package)}</strong>
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                                        ได้รับการตรวจสอบความบริสุทธิ์ของวัตถุดิบและขึ้นทะเบียนมาตรฐานความปลอดภัยทางโภชนาการ
                                    </p>
                                </div>

                                {/* Right Side: Product Image Placeholder */}
                                <div className="w-36 h-36 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-200 flex flex-col items-center justify-center p-4 shadow-sm">
                                    <div className="w-14 h-14 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                                        <Sparkles size={28} />
                                    </div>
                                    <span className="text-[11px] font-bold text-emerald-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                                        {currentBrand?.name || 'NutriTrust Spec'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients & Dosage Section */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                            {/* Header Directive #2 Standard */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <FlaskConical size={24} className="text-slate-800 shrink-0" />
                                    <h3 className="text-2xl font-bold text-slate-800">
                                        Ingredients & Dosage
                                    </h3>
                                </div>
                                <p className="text-base font-normal text-slate-500 mt-0.5">
                                    ส่วนประกอบสำคัญและปริมาณ
                                </p>
                            </div>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden pt-2">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="p-3.5">ชื่อส่วนประกอบ (Ingredient)</th>
                                            <th className="p-3.5">ปริมาณต่อหน่วย (Volume)</th>
                                            <th className="p-3.5">โรงงานสารสกัดต้นน้ำ (Upstream Provider)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                                        {(currentProduct.ingredient_list || []).map((ingItem: { igd_id: string; volume: string }, idx: number) => {
                                            const ingObj = ingredientMap.get(ingItem.igd_id);
                                            const provObj = ingObj ? providerMap.get(ingObj.provider_id) : undefined;

                                            return (
                                                <tr key={idx} className="hover:bg-slate-50 transition">
                                                    <td className="p-3.5 font-bold text-emerald-950">
                                                        {ingObj?.name || ingItem.igd_id}
                                                    </td>
                                                    <td className="p-3.5">
                                                        <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-bold">
                                                            {ingItem.volume}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5 text-slate-600">
                                                        {provObj?.name || 'DSM Nutritional Products'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Traceability Process Section (Card Layout with max-w-3xl) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                            {/* Header Directive #2 Standard */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <Factory size={24} className="text-slate-800 shrink-0" />
                                    <h3 className="text-2xl font-bold text-slate-800">
                                        Traceability Process
                                    </h3>
                                </div>
                                <p className="text-base font-normal text-slate-500 mt-0.5">
                                    กระบวนการตรวจสอบย้อนกลับสารสกัด
                                </p>
                            </div>

                            {/* Max Width Controlled Card List */}
                            <div className="space-y-4 max-w-3xl pt-2">
                                {providerTraceabilityGroup.map(({ provider, ingredients: ingNames }, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-start justify-between gap-4 transition hover:bg-emerald-50 shadow-2xs"
                                    >
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                                                <h4 className="font-bold text-sm text-emerald-950">
                                                    {provider.name}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-slate-700 leading-relaxed pl-6">
                                                {provider.traceability_process}
                                            </p>
                                        </div>

                                        <div className="md:w-48 shrink-0 flex flex-col justify-center gap-1 bg-white/90 p-3 rounded-xl border border-emerald-200/80 shadow-2xs">
                                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                                                สารสกัดจากโรงงานนี้ ({ingNames.length}):
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {ingNames.map((name, i) => (
                                                    <span key={i} className="text-xs font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
                                                        {name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Score Analytics Tab Section (Merchant Score | Health Score | Science Studies) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                            {/* Header Directive #2 Standard */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={24} className="text-slate-800 shrink-0" />
                                        <h3 className="text-2xl font-bold text-slate-800">
                                            Score Analytics
                                        </h3>
                                    </div>
                                    <p className="text-base font-normal text-slate-500 mt-0.5">
                                        ระบบการวิเคราะห์คะแนนเชิงเปรียบเทียบ
                                    </p>
                                </div>

                                {/* Tab Navigation Buttons */}
                                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setActiveScoreTab('merchant')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                            activeScoreTab === 'merchant'
                                                ? 'bg-slate-900 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                        }`}
                                    >
                                        <Store size={14} />
                                        <span>Merchant Score</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveScoreTab('health')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                            activeScoreTab === 'health'
                                                ? 'bg-slate-900 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                        }`}
                                    >
                                        <ShieldAlert size={14} />
                                        <span>Health Score</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveScoreTab('science')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                            activeScoreTab === 'science'
                                                ? 'bg-slate-900 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                        }`}
                                    >
                                        <BookOpenCheck size={14} />
                                        <span>Science Studies</span>
                                    </button>
                                </div>
                            </div>

                            {/* Active Tab Content */}
                            <div>
                                {activeScoreTab === 'merchant' && (
                                    <MerchantScoreChart productId={currentProduct.id} />
                                )}

                                {activeScoreTab === 'health' && (
                                    <HealthScoreTab safetyProfile={currentProduct.safety_profile} />
                                )}

                                {activeScoreTab === 'science' && (
                                    <ScienceStudiesTab evidenceIds={currentProduct.evidence_ids} />
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN (1/3 Width): Scientific Evidence Sidebar */}
                    <div className="lg:col-span-1 sticky top-8">
                        <ScientificEvidence
                            evidenceIds={currentProduct?.evidence_ids || []}
                            customEvidences={apiProductDetail?.evidences}
                        />
                    </div>

                </div>
            ) : (
                /* Mode B: Related Products Carousel View */
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {paginatedProducts.map((product) => {
                            const bName = brandMap.get(product.brand_id)?.name || product.brand_id;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-3xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl group"
                                >
                                    <div className="w-full h-44 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                                            <Sparkles size={30} />
                                        </div>
                                        <span className="text-xs font-semibold text-emerald-800 bg-white/90 px-3 py-0.5 rounded-full shadow-xs border border-emerald-200">
                                            {bName}
                                        </span>
                                    </div>

                                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block">
                                                {product.category_slug}
                                            </span>
                                            <h3 className="font-extrabold text-base text-gray-900 group-hover:text-emerald-700 transition line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                ขนาดบรรจุ: {formatServingPackage(product.serving_package)}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-gray-400 block font-medium">ราคาเริ่มต้น</span>
                                                <span className="text-lg font-black text-amber-500">
                                                    {formatPriceRange(product.min_price, product.max_price)}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setSelectedProductId(product.id);
                                                    setAnimationClass('animate-slide-left-750');
                                                }}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1"
                                            >
                                                <span>ดู Specs</span>
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
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
