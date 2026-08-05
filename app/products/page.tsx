'use client';

import React, { useEffect, useState } from 'react';
import ProductDetailView from '@/components/features/product/ProductDetailView';

export default function ProductsMainPage() {
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

    return (
        <div className="pt-2 pb-16">
            <ProductDetailView isSearchOnlyMode={isFromNav} />
        </div>
    );
}
