'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Trash2, ChevronDown, Check, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { IProduct, IBrand } from '@/types/traceability';

interface ProductSelectorProps {
  products: IProduct[];
  brands: IBrand[];
  selectedProductIds: string[];
  onSelectProduct: (index: number, productId: string) => void;
  onRemoveSlot: (index: number) => void;
  onAddSlot: () => void;
  onPresetSelect: (presetIds: string[]) => void;
}

const PRESET_COMPARISONS = [
  {
    label: '🐟 เทียบ Fish Oil 3 แบรนด์ดัง',
    ids: ['p_001', 'p_002', 'p_003'],
  },
  {
    label: '🍊 เทียบ Vitamin C 3 แบรนด์',
    ids: ['p_016', 'p_017', 'p_018'],
  },
  {
    label: '🦴 เทียบ Joint & Cartilage',
    ids: ['p_006', 'p_007', 'p_008'],
  },
  {
    label: '⚡ เทียบ Energy & Metabolism',
    ids: ['p_011', 'p_012', 'p_013'],
  },
];

export default function ProductSelector({
  products,
  brands,
  selectedProductIds,
  onSelectProduct,
  onRemoveSlot,
  onAddSlot,
  onPresetSelect,
}: ProductSelectorProps) {
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<number, string>>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

  const brandMap = React.useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [brands]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="text-emerald-600 shrink-0" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">
              Product Comparison Selector
            </h2>
          </div>
          <p className="text-base font-normal text-slate-500">
            เลือกผลิตภัณฑ์ที่ต้องการเปรียบเทียบแบบ Side-by-Side (สูงสุด 3 รายการ)
          </p>
        </div>

        {/* Preset Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">ชุดเปรียบเทียบยอดนิยม:</span>
          {PRESET_COMPARISONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPresetSelect(preset.ids)}
              className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200/80 transition cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Selection Slots Grid */}
      <div ref={dropdownRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selectedProductIds.map((selectedId, slotIdx) => {
          const currentProd = products.find((p) => p.id === selectedId);
          const currentBrandName = currentProd ? brandMap.get(currentProd.brand_id) || currentProd.brand_id : '';
          const query = searchQueries[slotIdx] || '';
          const isOpen = activeDropdownIndex === slotIdx;

          const filteredProducts = products.filter((p) => {
            if (!query.trim()) return true;
            const q = query.toLowerCase();
            const bName = (brandMap.get(p.brand_id) || '').toLowerCase();
            return p.name.toLowerCase().includes(q) || bName.includes(q) || p.category_slug.toLowerCase().includes(q);
          });

          return (
            <div
              key={slotIdx}
              className={`relative bg-slate-50 p-4 sm:p-5 rounded-2xl border transition-all ${
                isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">
                    {slotIdx + 1}
                  </span>
                  <span>ผลิตภัณฑ์ช่องที่ {slotIdx + 1}</span>
                </span>

                {selectedProductIds.length > 2 && (
                  <button
                    type="button"
                    onClick={() => onRemoveSlot(slotIdx)}
                    className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                    title="ลบช่องนี้"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Selector Button / Dropdown Toggle */}
              <button
                type="button"
                onClick={() => setActiveDropdownIndex(isOpen ? null : slotIdx)}
                className="w-full bg-white hover:bg-slate-50 text-left p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2 transition cursor-pointer"
              >
                {currentProd ? (
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 shrink-0 flex items-center justify-center text-emerald-600">
                      <Sparkles size={18} />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-emerald-700 block truncate">{currentBrandName}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 truncate">{currentProd.name}</h4>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">คลิกเลือกผลิตภัณฑ์...</span>
                )}
                <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Popover */}
              {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-2 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                  <div className="relative p-1">
                    <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setSearchQueries((prev) => ({ ...prev, [slotIdx]: e.target.value }))}
                      placeholder="พิมพ์ค้นหาชื่อผลิตภัณฑ์ หรือแบรนด์..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => {
                      const bName = brandMap.get(prod.brand_id) || prod.brand_id;
                      const isSelected = selectedProductIds.includes(prod.id);

                      return (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => {
                            onSelectProduct(slotIdx, prod.id);
                            setActiveDropdownIndex(null);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                            isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <span className="text-[10px] text-slate-400 block font-semibold">{bName}</span>
                            <span className="font-bold text-slate-900 block truncate">{prod.name}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-emerald-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Slot Button (Max 3) */}
        {selectedProductIds.length < 3 && (
          <button
            type="button"
            onClick={onAddSlot}
            className="h-full min-h-[120px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col items-center justify-center p-4 gap-2 transition cursor-pointer text-slate-400 hover:text-emerald-700 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition">
              <Plus size={20} className="group-hover:text-emerald-700" />
            </div>
            <span className="text-xs font-bold">เพิ่มผลิตภัณฑ์เปรียบเทียบ (สูงสุด 3)</span>
          </button>
        )}
      </div>
    </div>
  );
}
