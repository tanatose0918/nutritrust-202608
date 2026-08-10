'use client';

import React, { useEffect, useState, Suspense } from 'react';
import ProductDetailView from '@/components/features/product/ProductDetailView';

function ProductsContent() {
    const [isFromNav, setIsFromNav] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const from = params.get('from');
            if (from === 'nav') {
                setIsFromNav(true);
            }
        }
    }, []);

    return <ProductDetailView isSearchOnlyMode={isFromNav} />;
}

export default function ProductsMainPage() {
    return (
        <div className="pt-2 pb-16">
            <Suspense fallback={
                <div className="max-w-7xl mx-auto p-12 text-center text-slate-400 font-bold">
                    กำลังโหลดข้อมูลผลิตภัณฑ์...
                </div>
            }>
                <ProductsContent />
            </Suspense>
        </div>
    );
}
