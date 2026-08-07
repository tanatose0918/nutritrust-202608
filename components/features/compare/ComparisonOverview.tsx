'use client';

import React from 'react';
import { Package, Sparkles, Star, DollarSign, Globe, CheckCircle } from 'lucide-react';
import { IProduct, IBrand } from '@/types/traceability';
import analyticsData from '@/mockup/products_analytics_mockup.json';

interface ComparisonOverviewProps {
  selectedProducts: IProduct[];
  brands: IBrand[];
}

export default function ComparisonOverview({ selectedProducts, brands }: ComparisonOverviewProps) {
  const brandMap = React.useMemo(() => {
    const map = new Map<string, IBrand>();
    brands.forEach((b) => map.set(b.id, b));
    return map;
  }, [brands]);

  const analyticsMap = React.useMemo(() => {
    const map = new Map<string, any>();
    (analyticsData as any[]).forEach((a) => map.set(a.product_id, a));
    return map;
  }, []);

  const formatServingCount = (servingPkg: string) => {
    if (!servingPkg) return 30;
    const match = servingPkg.match(/\d+/);
    return match ? parseInt(match[0], 10) : 30;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header Directive #2 Standard */}
      <div>
        <div className="flex items-center gap-2">
          <Package size={24} className="text-slate-800 shrink-0" />
          <h3 className="text-2xl font-bold text-slate-800">
            Overview Comparison
          </h3>
        </div>
        <p className="text-base font-normal text-slate-500 mt-0.5">
          เปรียบเทียบข้อมูลทั่วไป สรุปราคา และคะแนนมวลรวมร้านค้า
        </p>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {selectedProducts.map((product) => {
          const brandObj = brandMap.get(product.brand_id);
          const brandName = brandObj?.name || product.brand_id;
          const country = brandObj?.provide_at || 'นำเข้าต่างประเทศ';
          const analytics = analyticsMap.get(product.id) || analyticsData[0];
          const merchantScore = analytics?.merchant_score || 4.8;

          const servingCount = formatServingCount(product.serving_package);
          const costPerServing = (product.min_price / servingCount).toFixed(2);

          return (
            <div
              key={product.id}
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-4 flex flex-col justify-between hover:border-emerald-300 transition shadow-2xs"
            >
              {/* Product Visual Badge */}
              <div className="w-full h-36 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 rounded-xl flex flex-col items-center justify-center p-4 border border-emerald-200/60 relative">
                <div className="w-12 h-12 rounded-xl bg-white/90 shadow-md flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                  <Sparkles size={24} />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                  {brandName}
                </span>
              </div>

              {/* Title & Brand Info */}
              <div className="space-y-1">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
                  {product.category_slug}
                </span>
                <h4 className="font-extrabold text-base text-slate-900 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Globe size={13} className="text-slate-400" />
                  <span>ผลิตในประเทศ: <strong>{country}</strong></span>
                </p>
              </div>

              {/* Price & Cost Per Serving */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>ราคาประมาณการ:</span>
                  <span className="font-extrabold text-amber-500 text-base">
                    {product.min_price.toLocaleString()} ฿
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-1">
                  <span>ราคาต่อหน่วยบริโภค:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ~ {costPerServing} ฿ / เม็ด
                  </span>
                </div>
              </div>

              {/* Merchant Score */}
              <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-400 block uppercase">Merchant Score</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-white">{merchantScore.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-300 font-semibold block">/ 5.0</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
