'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Trash2, ArrowRight, Layers, Sparkles, Scale, CheckCircle2 } from 'lucide-react';
import { IProduct } from '@/types/traceability';

import brandsData from '@/mockup/brands_mockup.json';
import ingredientsData from '@/mockup/ingredients_mockup.json';

// Helper for formatting serving package
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

// Helper for formatting price range
const formatPriceRange = (min: number, max: number | null) => {
    if (max && max > min) {
        return `${min.toLocaleString()} - ${max.toLocaleString()} ฿`;
    }
    return `${min.toLocaleString()} ฿`;
};

interface ProductSearchResultsSectionProps {
    products: IProduct[];
    onClearAll: () => void;
    onRemoveProduct: (id: string) => void;
}

export default function ProductSearchResultsSection({
    products,
    onClearAll,
    onRemoveProduct,
}: ProductSearchResultsSectionProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Map helpers for Brand Name and Ingredient Name lookup
    const brandMap = useMemo(() => {
        const map = new Map<string, string>();
        brandsData.forEach(b => map.set(b.id, b.name));
        return map;
    }, []);

    const ingredientMap = useMemo(() => {
        const map = new Map<string, string>();
        ingredientsData.forEach(i => map.set(i.id, i.name));
        return map;
    }, []);

    // Ordering logic: Selected products stay FIRST, unselected/newly searched products come AFTER
    const sortedProducts = useMemo(() => {
        const selected = products.filter(p => selectedIds.includes(p.id));
        const unselected = products.filter(p => !selectedIds.includes(p.id));
        return [...selected, ...unselected];
    }, [products, selectedIds]);

    const toggleSelectProduct = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 animate-section-swap">
            
            {/* Unified 3-Column Control Bar (Text Less: Left | Center | Right) */}
            <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-md p-3.5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* 1. ชิดซ้าย: แสดงเฉพาะตัวเลข ค้นหาพบ & เลือกแล้ว */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-2 bg-gray-100/80 px-3 py-1.5 rounded-xl border border-gray-200">
                        <Layers size={15} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-500">ค้นพบ:</span>
                        <span className="text-sm font-black text-gray-900">{products.length}</span>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
                        selectedIds.length > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}>
                        <CheckCircle2 size={15} className={selectedIds.length > 0 ? 'text-emerald-600' : 'text-gray-400'} />
                        <span className="text-xs font-medium">เลือกแล้ว:</span>
                        <span className="text-sm font-black">{selectedIds.length}</span>
                    </div>
                </div>

                {/* 2. ตรงกลาง: ปุ่ม ยกเลิกเลือก & เปรียบเทียบผลิตภัณฑ์ */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setSelectedIds([])}
                            className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                            ยกเลิกเลือก
                        </button>
                    )}

                    <Link
                        href={`/compare?ids=${selectedIds.join(',')}`}
                        className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                            selectedIds.length >= 2
                                ? 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer shadow-md shadow-emerald-200 scale-105'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                        onClick={(e) => {
                            if (selectedIds.length < 2) e.preventDefault();
                        }}
                    >
                        <Scale size={15} />
                        <span>เปรียบเทียบผลิตภัณฑ์ {selectedIds.length >= 2 ? `(${selectedIds.length})` : ''}</span>
                    </Link>
                </div>

                {/* 3. ชิดขวา: แสดงแค่ ล้างการค้นหา ปุ่มเดียวพอ */}
                <div className="w-full md:w-auto flex justify-end">
                    <button
                        onClick={onClearAll}
                        className="w-full md:w-auto px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <Trash2 size={14} />
                        <span>ล้างการค้นหา</span>
                    </button>
                </div>

            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => {
                    const isSelected = selectedIds.includes(product.id);
                    const brandName = brandMap.get(product.brand_id) || product.brand_id;

                    return (
                        <div
                            key={product.id}
                            className={`relative bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl group ${
                                isSelected
                                    ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/20 shadow-md scale-[1.01]'
                                    : 'border-gray-200 hover:border-emerald-300'
                            }`}
                        >
                            {/* Card Top Header */}
                            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
                                <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-sm cursor-pointer transition select-none ${
                                    isSelected
                                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200'
                                        : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'
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

                                <button
                                    onClick={() => {
                                        setSelectedIds(prev => prev.filter(i => i !== product.id));
                                        onRemoveProduct(product.id);
                                    }}
                                    className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 flex items-center justify-center transition cursor-pointer shadow-sm text-xs font-bold"
                                    title="นำออก"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Image Placeholder Area */}
                            <div className="w-full h-44 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                                    <Sparkles size={30} />
                                </div>
                                <span className="text-xs font-semibold text-emerald-800 bg-white/90 px-3 py-0.5 rounded-full shadow-xs border border-emerald-200">
                                    {brandName}
                                </span>
                            </div>

                            {/* Product Info Body */}
                            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                                        <Tag value={product.category_slug} severity="success" className="text-[10px] font-bold" />
                                        {product.sub_category && (
                                            <Tag value={product.sub_category} severity="info" className="text-[10px] font-bold" />
                                        )}
                                    </div>

                                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug">
                                        {product.name}
                                    </h3>
                                </div>

                                {/* Ingredients preview */}
                                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        สารสกัดสำคัญ
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {product.ingredient_list.map((ing, idx) => {
                                            const ingName = ingredientMap.get(ing.igd_id) || ing.igd_id;
                                            return (
                                                <span
                                                    key={idx}
                                                    className="text-xs font-medium bg-gray-50 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1"
                                                >
                                                    <span>{ingName}</span>
                                                    <span className="font-bold text-emerald-700">({ing.volume})</span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Price and Package Info */}
                                <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium">ราคาเริ่มต้น</p>
                                        <p className="text-base font-black text-emerald-700">
                                            {product.min_price.toLocaleString()} ฿
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                                        {formatServingPackage(product.serving_package)}
                                    </span>
                                </div>

                                {/* Go to Product Detail Page Button */}
                                <Link
                                    href={`/products/${product.id}`}
                                    className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md group-hover:shadow-lg"
                                >
                                    <span>ดูรายละเอียดผลิตภัณฑ์</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
