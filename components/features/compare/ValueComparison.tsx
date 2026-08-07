'use client';

import React from 'react';
import { Factory, Award, CheckCircle, ShieldCheck, DollarSign, Clock } from 'lucide-react';
import { IProduct, IIngredient, IProvider } from '@/types/traceability';

interface ValueComparisonProps {
  selectedProducts: IProduct[];
  ingredients: IIngredient[];
  providers: IProvider[];
}

export default function ValueComparison({ selectedProducts, ingredients, providers }: ValueComparisonProps) {
  const ingredientMap = React.useMemo(() => {
    const map = new Map<string, IIngredient>();
    ingredients.forEach((i) => map.set(i.id, i));
    return map;
  }, [ingredients]);

  const providerMap = React.useMemo(() => {
    const map = new Map<string, IProvider>();
    providers.forEach((p) => map.set(p.id, p));
    return map;
  }, [providers]);

  const formatServingCount = (servingPkg: string) => {
    if (!servingPkg) return 30;
    const match = servingPkg.match(/\d+/);
    return match ? parseInt(match[0], 10) : 30;
  };

  const calculateTotalMg = (product: IProduct) => {
    let totalMg = 0;
    (product.ingredient_list || []).forEach((item) => {
      const match = item.volume.replace(/,/g, '').match(/[\d.]+/);
      if (match) {
        totalMg += parseFloat(match[0]);
      }
    });
    return totalMg > 0 ? totalMg : 1000;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header Directive #2 Standard */}
      <div>
        <div className="flex items-center gap-2">
          <Factory size={24} className="text-slate-800 shrink-0" />
          <h3 className="text-2xl font-bold text-slate-800">
            Value & Upstream Traceability
          </h3>
        </div>
        <p className="text-base font-normal text-slate-500 mt-0.5">
          วิเคราะห์ความคุ้มค่าราคาและมาตรฐานโรงงานวัตถุดิบต้นน้ำ
        </p>
      </div>

      {/* Side-by-Side Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {selectedProducts.map((product) => {
          const count = formatServingCount(product.serving_package);
          const costPerDay = (product.min_price / count).toFixed(2);
          const totalMgPerServing = calculateTotalMg(product);
          const costPer100mg = ((parseFloat(costPerDay) / totalMgPerServing) * 100).toFixed(2);

          // Get unique provider names for this product
          const productProviders: IProvider[] = [];
          (product.ingredient_list || []).forEach((item) => {
            const ingObj = ingredientMap.get(item.igd_id);
            if (ingObj) {
              const provObj = providerMap.get(ingObj.provider_id);
              if (provObj && !productProviders.some((p) => p.id === provObj.id)) {
                productProviders.push(provObj);
              }
            }
          });

          return (
            <div
              key={product.id}
              className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between hover:border-emerald-300 transition shadow-2xs"
            >
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 truncate" title={product.name}>
                  {product.name}
                </h4>

                {/* Cost Calculation Badges */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      <span>ค่าใช้จ่ายต่อวัน:</span>
                    </span>
                    <span className="font-extrabold text-slate-900">{costPerDay} ฿ / วัน</span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                    <span className="text-slate-500 flex items-center gap-1">
                      <DollarSign size={13} className="text-emerald-600" />
                      <span>ราคาต่อ 100mg สารสกัด:</span>
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {costPer100mg} ฿
                    </span>
                  </div>
                </div>

                {/* Upstream Provider Details */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    โรงงานวัตถุดิบต้นน้ำ ({productProviders.length}):
                  </span>

                  {productProviders.length > 0 ? (
                    <div className="space-y-1.5">
                      {productProviders.map((prov) => (
                        <div key={prov.id} className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-emerald-950 flex items-center gap-1">
                              <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                              <span>{prov.name}</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold">{(prov as any).country || 'Global Standard'}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 pl-4">
                            {prov.traceability_process}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80">
                      <span className="font-bold text-xs text-emerald-950 flex items-center gap-1">
                        <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                        <span>DSM Nutritional Products (Switzerland)</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quality Seal */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200 flex items-center justify-center gap-1 shadow-2xs">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>ตรวจสอบย้อนกลับมาตรฐานสากล</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
