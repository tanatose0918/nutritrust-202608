'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FlaskConical, Award } from 'lucide-react';
import { IProduct, IIngredient } from '@/types/traceability';

const DataTableComp = DataTable as unknown as React.ComponentType<any>;
const ColumnComp = Column as unknown as React.ComponentType<any>;

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

  const parseVolumeNumber = (volStr: string) => {
    if (!volStr) return 0;
    const match = volStr.replace(/,/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const tableData = React.useMemo(() => {
    const set = new Set<string>();
    selectedProducts.forEach((p) => {
      (p.ingredient_list || []).forEach((ing) => set.add(ing.igd_id));
    });

    return Array.from(set).map((igdId) => {
      const ingObj = ingredientMap.get(igdId);
      const ingName = ingObj?.name || igdId;

      let maxVol = -1;
      const productVolumes: Record<string, { volume: string; isHighest: boolean }> = {};

      selectedProducts.forEach((prod) => {
        const found = (prod.ingredient_list || []).find((item) => item.igd_id === igdId);
        if (found) {
          const val = parseVolumeNumber(found.volume);
          if (val > maxVol) maxVol = val;
        }
      });

      selectedProducts.forEach((prod) => {
        const found = (prod.ingredient_list || []).find((item) => item.igd_id === igdId);
        const volNum = found ? parseVolumeNumber(found.volume) : 0;
        const isHighest = Boolean(found && volNum > 0 && volNum === maxVol && selectedProducts.length > 1);

        productVolumes[prod.id] = {
          volume: found ? found.volume : '-',
          isHighest,
        };
      });

      return {
        id: igdId,
        ingredientName: ingName,
        ...productVolumes,
      };
    });
  }, [selectedProducts, ingredientMap]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FlaskConical size={24} className="text-slate-800 shrink-0" />
          <h3 className="text-2xl font-bold text-slate-800">
            Active Ingredient Matrix (PrimeReact DataTable)
          </h3>
        </div>
        <p className="text-base font-normal text-slate-500 mt-0.5">
          เปรียบเทียบสารสกัดสำคัญและปริมาณความเข้มข้นต่อ 1 หน่วยบริโภค
        </p>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <DataTableComp
          value={tableData}
          sortMode="multiple"
          removableSort
          stripedRows
          responsiveLayout="scroll"
          className="p-datatable-sm"
        >
          <ColumnComp
            field="ingredientName"
            header="สารสกัดสำคัญ (Active Ingredient)"
            sortable
            style={{ minWidth: '220px' }}
            body={(rowData: any) => (
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{rowData.ingredientName}</span>
              </span>
            )}
          />

          {selectedProducts.map((prod) => (
            <ColumnComp
              key={prod.id}
              field={prod.id}
              header={prod.name}
              align="center"
              style={{ minWidth: '180px' }}
              body={(rowData: any) => {
                const info = rowData[prod.id];
                if (!info || info.volume === '-') {
                  return <span className="text-slate-300 font-normal text-xs">-</span>;
                }
                return (
                  <div className="flex flex-col items-center gap-1">
                    <Tag
                      value={info.volume}
                      severity={info.isHighest ? 'success' : 'secondary'}
                      className={info.isHighest ? 'font-black shadow-xs' : 'font-semibold'}
                    />
                    {info.isHighest && (
                      <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-0.5 uppercase tracking-wider">
                        <Award size={12} className="text-emerald-600" />
                        <span>Highest Potency</span>
                      </span>
                    )}
                  </div>
                );
              }}
            />
          ))}
        </DataTableComp>
      </div>
    </div>
  );
}
