'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, HeartPulse, Stethoscope, FlaskConical } from 'lucide-react';
import { sendTelemetryEvent } from '@/services/api';

const HEALTH_GOALS = [
  { name: 'Brain & Memory Care', query: 'Brain & Memory Care', icon: '🧠', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100' },
  { name: 'Eye & Vision Protection', query: 'Eye & Vision Protection', icon: '👁️', bg: 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100' },
  { name: 'Anti-Aging & Cellular Energy', query: 'Anti-Aging & Cellular Energy', icon: '✨', bg: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100' },
  { name: 'Heart & Cardiovascular Health', query: 'Heart & Cardiovascular Health', icon: '❤️', bg: 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100' },
  { name: 'Immune System Support', query: 'Immune System Support', icon: '🛡️', bg: 'bg-green-50 text-green-900 border-green-200 hover:bg-green-100' },
];

const HEALTH_ISSUES = [
  { name: 'Sleep Quality & Stress Relief', query: 'Sleep Quality & Stress Relief', icon: '🌙', bg: 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100' },
  { name: 'Office Syndrome & Muscle Relief', query: 'Office Syndrome & Muscle Relief', icon: '💻', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100' },
  { name: 'Joint Care & Cartilage Protection', query: 'Joint Care & Cartilage Protection', icon: '🦴', bg: 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100' },
  { name: 'Fatigue Recovery & Stamina', query: 'Fatigue Recovery & Stamina', icon: '⚡', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100' },
  { name: 'Allergy & Immune Shield', query: 'Allergy & Immune Shield', icon: '🌿', bg: 'bg-lime-50 text-lime-900 border-lime-200 hover:bg-lime-100' },
];

const KEY_INGREDIENTS = [
  { name: 'Vitamin D3 1000IU', query: 'Vitamin D', type: 'Cholecalciferol' },
  { name: 'Vitamin C 1000mg', query: 'Vitamin C', type: 'Ascorbic Acid' },
  { name: 'Vitamin E 400IU', query: 'Vitamin E', type: 'd-Alpha Tocopherol' },
  { name: 'Vitamin B Complex', query: 'Vitamin B', type: 'B1, B2, B6, B12' },
  { name: 'Collagen Type II / UC-II', query: 'Collagen', type: 'Undenatured Joint Collagen' },
  { name: 'Magnesium Glycinate 200mg', query: 'Magnesium', type: 'High Bioavailability' },
  { name: 'Omega-3 Fish Oil 1000mg', query: 'Fish Oil', type: 'EPA 180mg / DHA 120mg' },
  { name: 'Ginkgo Biloba Extract', query: 'Ginkgo', type: 'Standardized Flavonoids' },
];

export default function QuickSearchCategories() {
  const [openGoals, setOpenGoals] = useState(false);
  const [openIssues, setOpenIssues] = useState(false);
  const [openIngredients, setOpenIngredients] = useState(false);

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* Box 1: Health Goals (Left) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <button
            type="button"
            onClick={() => setOpenGoals((prev) => !prev)}
            className="w-full flex items-center justify-between text-left cursor-pointer select-none group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <HeartPulse size={18} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700 transition uppercase tracking-wider">
                  Health Goals
                </h3>
                <span className="text-[10px] text-slate-400 font-bold block">One-Click Quick Search</span>
              </div>
            </div>
            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${openGoals ? 'rotate-180 text-emerald-700' : ''}`} />
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${
            openGoals ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0'
          }`}>
            <div className="overflow-hidden flex flex-col gap-2">
              {HEALTH_GOALS.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/products?search=${encodeURIComponent(item.query)}`}
                  onClick={() => sendTelemetryEvent('search')}
                  className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer hover:scale-[1.01] ${item.bg}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="text-xs font-extrabold truncate">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Box 2: Health Conditions / Issues (Center) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <button
            type="button"
            onClick={() => setOpenIssues((prev) => !prev)}
            className="w-full flex items-center justify-between text-left cursor-pointer select-none group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <Stethoscope size={18} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700 transition uppercase tracking-wider">
                  Health Conditions / Issues
                </h3>
                <span className="text-[10px] text-slate-400 font-bold block">One-Click Quick Search</span>
              </div>
            </div>
            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${openIssues ? 'rotate-180 text-amber-700' : ''}`} />
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${
            openIssues ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0'
          }`}>
            <div className="overflow-hidden flex flex-col gap-2">
              {HEALTH_ISSUES.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/products?search=${encodeURIComponent(item.query)}`}
                  onClick={() => sendTelemetryEvent('search')}
                  className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer hover:scale-[1.01] ${item.bg}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="text-xs font-extrabold truncate">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Box 3: Key Active Ingredients (Right) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <button
            type="button"
            onClick={() => setOpenIngredients((prev) => !prev)}
            className="w-full flex items-center justify-between text-left cursor-pointer select-none group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                <FlaskConical size={18} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-teal-700 transition uppercase tracking-wider">
                  Key Active Ingredients
                </h3>
                <span className="text-[10px] text-slate-400 font-bold block">One-Click Quick Search</span>
              </div>
            </div>
            <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${openIngredients ? 'rotate-180 text-teal-700' : ''}`} />
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${
            openIngredients ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0'
          }`}>
            <div className="overflow-hidden max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-2 custom-scrollbar">
              {KEY_INGREDIENTS.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/products?search=${encodeURIComponent(item.query)}`}
                  onClick={() => sendTelemetryEvent('search')}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all duration-200 flex items-center justify-between group cursor-pointer hover:scale-[1.01]"
                >
                  <div className="truncate pr-1">
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-950 truncate">{item.name}</h4>
                    <span className="text-[10px] text-slate-500 group-hover:text-emerald-700 font-medium block truncate">{item.type}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs group-hover:border-emerald-300 shrink-0">
                    Search
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
