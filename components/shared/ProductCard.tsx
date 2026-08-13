'use client';

import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Plus, ShoppingBag } from 'lucide-react';

import { addToStack, removeFromStack, isInStack, STACK_UPDATED_EVENT } from '@/services/stack';

interface ProductCardProps {
  id?: string;
  name: string;
  brand_name?: string;
  price_thb?: number;
  countdown?: number; // e.g. 12.00 down to 0.01
  className?: string;
}

export default function ProductCard({
  id = 'p_001',
  name,
  brand_name,
  price_thb = 850,
  countdown = 12,
  className = ''
}: ProductCardProps) {
  const [inStack, setInStack] = useState(false);

  useEffect(() => {
    setInStack(isInStack(id));

    const handleUpdate = () => setInStack(isInStack(id));
    window.addEventListener(STACK_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STACK_UPDATED_EVENT, handleUpdate);
  }, [id]);

  const handleToggleStack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inStack) {
      removeFromStack(id);
    } else {
      addToStack({
        _id: id,
        name,
        brand_name: brand_name || 'NutriTrust Verified',
        price_thb
      });
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between w-full max-w-sm mx-auto transition-all hover:shadow-md ${className}`}>
      {/* Image Container + Overlay Name */}
      <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-emerald-50/50 rounded-2xl border border-dashed border-emerald-300/80 flex flex-col items-center justify-center relative overflow-hidden mb-3 group shadow-inner">
        <div className="text-center p-4 pb-16">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
            <Layers size={24} />
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wide uppercase block">
            {brand_name || 'NutriTrust Supplement'}
          </span>
        </div>

        {/* Product Name Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-900/65 to-transparent backdrop-blur-[1px] flex flex-col justify-end text-white">
          <h3 className="text-sm font-bold leading-snug line-clamp-2 drop-shadow-md text-white">
            {name}
          </h3>
        </div>
      </div>

      {/* Price & Add to Stack Action Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Price Index</span>
          <span className="text-sm font-black text-slate-900 font-mono">
            ฿{price_thb.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleStack}
          className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
            inStack
              ? 'bg-emerald-600 text-white border border-emerald-500 hover:bg-emerald-700'
              : 'bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 hover:scale-105 active:scale-95'
          }`}
          title={inStack ? 'อยู่ใน Bucket แล้ว' : 'เพิ่มลงใน Bucket'}
        >
          {inStack ? (
            <>
              <CheckCircle2 size={15} />
              <ShoppingBag size={15} />
            </>
          ) : (
            <>
              <Plus size={14} />
              <ShoppingBag size={15} />
            </>
          )}
        </button>

      </div>
    </div>
  );
}
