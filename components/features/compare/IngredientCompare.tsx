'use client';

import React from 'react';
import { FlaskConical, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { IProduct, IIngredient } from '@/types/traceability';

interface IngredientCompareProps {
  selectedProducts: IProduct[];
  ingredients: IIngredient[];
}

export default function IngredientCompare({ selectedProducts, ingredients }: IngredientCompareProps) {
  const ingredientMap = React.useMemo(() => {
    const map = new Map<string, IIngredient>();
    ingredients.forEach((i) => map.set(i.id, i));
    return map;
  }, [ingredients]);

  // Extract all unique ingredients across all selected products
  const uniqueIngredientIds = React.useMemo(() => {
    const set = new Set<string>();
    selectedProducts.forEach((p) => {
      (p.ingredient_list || []).forEach((ing) => set.add(ing.igd_id));
    });
    return Array.from(set);
  }, [selectedProducts]);

  // Helper to parse volume number (e.g. "1,000 mg" -> 1000)
  const parseVolumeNumber = (volStr: string) => {
    if (!volStr) return 0;
    const match = volStr.replace(/,/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header Directive #2 Standard */}
      <div>
        <div className="flex items-center gap-2">
          <FlaskConical size={24} className="text-slate-800 shrink-0" />
          <h3 className="text-2xl font-bold text-slate-800">
            Active Ingredient Matrix
          </h3>
        </div>
        <p className="text-base font-normal text-slate-500 mt-0.5">
          เปรียบเทียบสารสกัดสำคัญและปริมาณความเข้มข้นต่อ 1 หน่วยบริโภค
        </p>
      </div>

      {/* Side-by-Side Ingredient Comparison Table */}
      <div className="border border-slate-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[600px]">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5 w-1/4">สารสกัดสำคัญ (Active Ingredient)</th>
              {selectedProducts.map((prod) => (
                <th key={prod.id} className="p-3.5 text-center border-l border-slate-200">
                  <span className="truncate max-w-[180px] block mx-auto">{prod.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
            {uniqueIngredientIds.map((igdId) => {
              const ingObj = ingredientMap.get(igdId);
              const ingName = ingObj?.name || igdId;

              // Find maximum dosage value for this ingredient across selected products
              let maxVol = -1;
              selectedProducts.forEach((prod) => {
                const found = (prod.ingredient_list || []).find((item) => item.igd_id === igdId);
                if (found) {
                  const val = parseVolumeNumber(found.volume);
                  if (val > maxVol) maxVol = val;
                }
              });

              return (
                <tr key={igdId} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/50">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{ingName}</span>
                    </span>
                  </td>

                  {selectedProducts.map((prod) => {
                    const found = (prod.ingredient_list || []).find((item) => item.igd_id === igdId);
                    const volNum = found ? parseVolumeNumber(found.volume) : 0;
                    const isHighest = found && volNum > 0 && volNum === maxVol && selectedProducts.length > 1;

                    return (
                      <td key={prod.id} className="p-3.5 text-center border-l border-slate-100">
                        {found ? (
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`px-3 py-1 rounded-full font-bold text-xs ${
                                isHighest
                                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 ring-2 ring-emerald-500/20'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {found.volume}
                            </span>

                            {isHighest && (
                              <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-0.5 uppercase tracking-wider">
                                <Award size={12} className="text-emerald-600" />
                                <span>Highest Potency</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 font-normal text-xs">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
