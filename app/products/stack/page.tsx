'use client';

import React, { Suspense } from 'react';
import SupplementsStackView from '@/components/features/stack/SupplementsStackView';

export default function ProductsStackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-slate-400 font-bold">
          กำลังโหลดตู้ยาอาหารเสริม NutriTrust Stack...
        </div>
      }
    >
      <SupplementsStackView />
    </Suspense>
  );
}
