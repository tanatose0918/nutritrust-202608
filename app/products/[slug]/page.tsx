'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductDetailView from '@/components/features/product/ProductDetailView';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = (params?.slug as string) || 'p_001';

    return (
        <div className="pt-4 pb-16">
            <ProductDetailView initialProductId={slug} />
        </div>
    );
}
