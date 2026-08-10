'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Package, HeartPulse, Stethoscope, Layers } from 'lucide-react';
import { sendTelemetryEvent } from '@/services/api';

export default function Header() {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const productsNavRef = useRef<HTMLDivElement>(null);

  const scrollToEarlyAccess = (e: React.MouseEvent) => {
    const el = document.getElementById('early-access');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      window.location.hash = 'early-access';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productsNavRef.current && !productsNavRef.current.contains(e.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="font-sans text-slate-900">
      <header className="bg-white backdrop-blur-md flex justify-between items-center p-4 md:px-10 border-b border-slate-100 sticky top-0 z-50 shadow-sm shadow-slate-200/50">
        
        {/* Brand Logo */}
        <Link
          href="/?from=logo"
          className="text-2xl font-extrabold text-emerald-700 flex items-center gap-2.5 hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <img
            src="/nutritrust_icon.jpg"
            alt="NutriTrust Logo"
            className="w-9 h-9 rounded-full border border-emerald-200/80 shadow-xs object-cover p-0.5 bg-white shrink-0"
          />
          <span>NutriTrust</span>
        </Link>

        {/* Navigation Bar Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          
          {/* Products Mega-Menu Dropdown Wrapper with MouseEnter & MouseLeave */}
          <div
            ref={productsNavRef}
            className="relative"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            <Link
              href="/products"
              onClick={() => sendTelemetryEvent('search')}
              className="inline-flex items-center gap-1 hover:text-emerald-700 transition font-semibold cursor-pointer py-2"
            >
              <span>Products</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180 text-emerald-700' : ''}`} />
            </Link>

            {isProductsDropdownOpen && (
              <div className="absolute left-0 top-full pt-1 w-80 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-600" /> Catalog Menu
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Directory
                  </span>
                </div>

                <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
                  {/* Category 1: By Product Type */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                      <Package size={13} className="text-emerald-600" /> By Product Category
                    </span>
                    <div className="grid grid-cols-1 gap-0.5">
                      {[
                        { name: 'Vitamins & Minerals', query: 'Vitamin C' },
                        { name: 'Fish Oil & Omega-3', query: 'Fish Oil' },
                        { name: 'Collagen & Joint Care', query: 'Collagen' },
                        { name: 'Antioxidants', query: 'Astaxanthin' },
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/products?search=${encodeURIComponent(item.query)}`}
                          onClick={() => setIsProductsDropdownOpen(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition flex items-center justify-between group"
                        >
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 font-bold">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: By Health Goal */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                      <HeartPulse size={13} className="text-teal-600" /> By Health Goal
                    </span>
                    <div className="grid grid-cols-1 gap-0.5">
                      {[
                        { name: 'Brain & Memory Care', query: 'Ginkgo' },
                        { name: 'Eye & Vision Protection', query: 'Astaxanthin' },
                        { name: 'Anti-Aging & Cellular Energy', query: 'Co Q-10' },
                        { name: 'Heart & Cardiovascular', query: 'Fish Oil' },
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/products?search=${encodeURIComponent(item.query)}`}
                          onClick={() => setIsProductsDropdownOpen(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition flex items-center justify-between group"
                        >
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-teal-600 font-bold">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Category 3: By Health Issue */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                      <Stethoscope size={13} className="text-amber-600" /> By Health Condition
                    </span>
                    <div className="grid grid-cols-1 gap-0.5">
                      {[
                        { name: 'Sleep Quality & Stress Relief', query: 'Magnesium' },
                        { name: 'Office Syndrome & Muscle Relief', query: 'Magnesium' },
                        { name: 'Joint Care & Cartilage Protection', query: 'Collagen' },
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/products?search=${encodeURIComponent(item.query)}`}
                          onClick={() => setIsProductsDropdownOpen(false)}
                          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-amber-900 hover:bg-amber-50/80 rounded-xl transition flex items-center justify-between group"
                        >
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-amber-700 font-bold">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href="/products?search=all"
                    onClick={() => setIsProductsDropdownOpen(false)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer text-center block shadow-xs hover:scale-[1.02] active:scale-95"
                  >
                    View All Products Directory
                  </Link>
                </div>
              </div>
            </div>
            )}
          </div>

          <Link
            href="/compare"
            onClick={() => sendTelemetryEvent('search')}
            className="hover:text-emerald-700 transition font-semibold"
          >
            Compare
          </Link>
          <a href="#early-access" onClick={scrollToEarlyAccess} className="hover:text-emerald-700 transition font-semibold">
            Health Guides
          </a>
          <Link href="/about" className="hover:text-emerald-700 transition-colors duration-200 font-semibold">
            About Us
          </Link>
        </nav>

        {/* Join Early Access Button */}
        <Link
          href="/survey"
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
        >
          Join Early Access
        </Link>
      </header>
    </div>
  );
}