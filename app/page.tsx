'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/features/home/HeroSection';
import TrustPropositions from '@/components/features/home/TrustPropositions';
import VisitorStats from '@/components/features/home/VisitorStats';
import SurveyEarlyAccess from '@/components/features/home/SurveyEarlyAccess';
import ProductSearchResultsSection from '@/components/features/home/ProductSearchResultsSection';
import { IProduct } from '@/types/traceability';

export default function HomePage() {
    const [stackedProducts, setStackedProducts] = useState<IProduct[]>([]);
    const [animationClass, setAnimationClass] = useState('animate-section-swap');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const from = params.get('from');
            if (from === 'logo') {
                setAnimationClass('animate-slide-bottom-750');
            } else if (from === 'back') {
                setAnimationClass('animate-slide-right-750');
            }
        }
    }, []);

    const handleSearch = (newProducts: IProduct[]) => {
        setStackedProducts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const freshProducts = newProducts.filter(p => !existingIds.has(p.id));
            return [...freshProducts, ...prev];
        });
    };

    const handleClearAll = () => {
        setStackedProducts([]);
    };

    const handleRemoveProduct = (id: string) => {
        setStackedProducts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className={`flex flex-col gap-12 md:gap-16 lg:gap-20 pt-6 md:pt-10 pb-16 md:pb-24 overflow-x-hidden ${animationClass}`}>
            {/* 1. ส่วนแบนเนอร์และค้นหา */}
            <HeroSection onSearch={handleSearch} />

            {/* 2 & 3. สลับส่วนแสดงผลพร้อม 750ms Smooth Transition */}
            {stackedProducts.length > 0 ? (
                <div key="search-results-section" className="animate-section-swap">
                    <ProductSearchResultsSection
                        products={stackedProducts}
                        onClearAll={handleClearAll}
                        onRemoveProduct={handleRemoveProduct}
                    />
                </div>
            ) : (
                <div key="default-stats-section" className="animate-section-swap flex flex-col gap-12 md:gap-16 lg:gap-20">
                    {/* ส่วนสถิติจำนวนผู้ใช้งานและจำนวนการค้นหา */}
                    <VisitorStats />

                    {/* ส่วนการ์ดจุดขาย 4 ข้อ */}
                    <TrustPropositions />
                </div>
            )}

            {/* 5. ฟอร์มรับอีเมล / Early Access */}
            <SurveyEarlyAccess />
        </div>
    );
}