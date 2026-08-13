'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles, Trash2, X, Minimize2, Maximize2 } from 'lucide-react';
import { getBucketItems, removeFromBucket, clearBucket, BUCKET_UPDATED_EVENT, IBucketItem } from '@/services/bucket';

export default function FloatingStackBar() {
  const [items, setItems] = useState<IBucketItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getBucketItems());

    if (window.innerWidth < 640) {
      setIsMinimized(true);
    }

    const handleUpdate = (e: Event) => {
      const customEv = e as CustomEvent;
      setItems(customEv.detail || getBucketItems());
    };

    window.addEventListener(BUCKET_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', () => setItems(getBucketItems()));

    return () => {
      window.removeEventListener(BUCKET_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  if (!mounted || items.length === 0) return null;

  const totalCost = items.reduce((sum, item) => sum + (item.price_thb || 0), 0);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      {/* Messenger-Style Minimized Circular Floating Button */}
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white flex items-center justify-center shadow-2xl border-2 border-emerald-400/90 hover:scale-110 active:scale-95 transition cursor-pointer group"
          title="ขยายรายการ Bucket List"
        >
          <ShoppingBag size={22} className="text-emerald-200 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[11px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
            {items.length}
          </span>
        </button>
      ) : (
        /* Right Side Vertical Stack Box (max-w: 200px, max-h: 324px) */
        <div className="w-[200px] max-w-[200px] max-h-[324px] bg-slate-950/95 backdrop-blur-md text-white border border-emerald-500/40 rounded-2xl p-3 shadow-2xl flex flex-col justify-between space-y-2 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header with Title & Minimize + Clear Buttons */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <ShoppingBag size={14} className="text-emerald-400 shrink-0" />
              <span className="text-[11px] font-black text-white truncate">
                Bucket ({items.length})
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Minimize Button to collapse to Messenger icon */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="ย่อเป็นไอคอน Messenger"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
              >
                <Minimize2 size={12} />
              </button>

              {/* Clear All Button */}
              <button
                type="button"
                onClick={() => clearBucket()}
                title="ล้างทั้งหมด"
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Scrollable Items Container (fits 4 rows smoothly) */}
          <div className="flex-1 overflow-y-auto max-h-[175px] space-y-1.5 pr-1 custom-scrollbar">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900/90 hover:bg-slate-850 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs group transition"
              >
                <div className="min-w-0 pr-1 space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-200 truncate leading-tight">
                    {item.name}
                  </p>
                  <p className="text-[9px] font-mono text-emerald-400 font-bold">
                    ฿{(item.price_thb || 0).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromBucket(item._id)}
                  className="text-slate-500 hover:text-red-400 p-0.5 rounded transition shrink-0 opacity-80 group-hover:opacity-100 cursor-pointer"
                  title="ลบออก"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer with Total Cost & Analyze Button */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[10px] text-slate-400 font-bold">รวม:</span>
              <span className="font-mono font-black text-amber-300">
                ฿{totalCost.toLocaleString()}
              </span>
            </div>

            <Link
              href="/bucket"
              className="w-full bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 text-[11px] font-black py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-md hover:scale-[1.02] active:scale-95"
            >
              <Sparkles size={13} />
              <span>Analyze Bucket</span>
              <ArrowRight size={12} />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
