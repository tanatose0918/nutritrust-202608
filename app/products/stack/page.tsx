'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Sparkles, Trash2, ShieldCheck, AlertTriangle, CheckCircle2, ShoppingBag, ExternalLink, Activity, Info } from 'lucide-react';
import { getStackItems, removeFromStack, clearStack, STACK_UPDATED_EVENT, IStackItem } from '@/services/stack';
import { getUserSession } from '@/services/auth';
import { analyzeStackSafety, computeDynamicPersonaMatch } from '@/services/mcp';

export default function StackBuilderPage() {
  const [items, setItems] = useState<IStackItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Multi-MCP Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mcpSafety, setMcpSafety] = useState<any>(null);
  const [mcpPersona, setMcpPersona] = useState<any>(null);
  const [mcpPrice, setMcpPrice] = useState<any>(null);
  const [userSession, setUserSessionState] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setItems(getStackItems());
    setUserSessionState(getUserSession());

    const handleUpdate = (e: Event) => {
      const customEv = e as CustomEvent;
      setItems(customEv.detail || getStackItems());
    };

    window.addEventListener(STACK_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STACK_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleRunMultiMcpAnalysis = async () => {
    if (items.length === 0) return;
    setIsAnalyzing(true);

    const productIds = items.map((i) => i._id);

    try {
      // 1. Run MCP 2 (Stack Safety & Cumulative UL Guard)
      const safetyData = await analyzeStackSafety(productIds);
      if (safetyData) setMcpSafety(safetyData);

      // 2. Run MCP 5 (Dynamic Persona Match Engine)
      const email = userSession?.email || 'guest@nutritrust.com';
      const prompt = userSession?.health_issues || 'ดูแลสุขภาพทั่วไปและสร้างภูมิคุ้มกัน';
      const personaData = await computeDynamicPersonaMatch(email, prompt, productIds);
      if (personaData) setMcpPersona(personaData);

    } catch (err) {
      console.error('Error running Multi-MCP Analysis:', err);
    }
    setIsAnalyzing(false);
  };

  if (!mounted) return null;

  const totalMonthlyCost = items.reduce((sum, item) => sum + (item.price_thb || 0), 0);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 font-sans space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>กลับไปยัง Catalog สินค้า</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Layers size={14} className="text-emerald-600" />
          <span>Combination Supplements Stack Builder</span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wider">
            Pre-Purchase Intelligence
          </span>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>ตารางสะสม Stack อาหารเสริมประจำวัน</span>
            <span className="text-sm font-bold text-slate-400">({items.length} รายการ)</span>
          </h1>
          <p className="text-xs text-slate-400">
            วิเคราะห์ปริมาณสารอาหารสะสมรวม, ตรวจสอบ Upper Limit (UL) Overdose และประเมินความคุ้มค่าก่อนสั่งซื้อ
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleRunMultiMcpAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-lg flex items-center gap-2 shrink-0 hover:scale-105 active:scale-95"
          >
            <Sparkles size={16} />
            <span>{isAnalyzing ? 'กำลังวิเคราะห์ด้วย Multi-MCP...' : '⚡ รันระบบ Multi-MCP วิเคราะห์ภาพรวม Stack'}</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Layers size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">ยังไม่มีสินค้าในตะกร้าสะสม Stack</h3>
            <p className="text-xs text-slate-500">
              กดปุ่ม "+ Add to Stack" ที่การ์ดสินค้าเพื่อรวบรวมอาหารเสริมที่ต้องการทานร่วมกัน
            </p>
          </div>
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-sm"
            >
              <span>ไปเลือกดูสินค้าใน Catalog</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Stack Items List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* CRITICAL OVERDOSE WARNING BANNER (MCP 2) */}
            {mcpSafety?.warnings && mcpSafety.warnings.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl shadow-sm mb-4 animate-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-red-800">พบความเสี่ยงได้รับสารอาหารเกินขนาด (Overdose Warning)</h3>
                    <ul className="text-xs text-red-700 list-disc list-inside space-y-1">
                      {mcpSafety.warnings.map((warn: string, idx: number) => (
                        <li key={idx}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  รายการอาหารเสริมใน Stack
                </span>
                <button
                  type="button"
                  onClick={() => clearStack()}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>ล้างตะกร้า Stack</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain rounded-lg" />
                        ) : (
                          <ShoppingBag size={20} />
                        )}
                      </div>
                      <div className="space-y-0.5 truncate">
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 uppercase">
                          {item.brand_name || 'Verified Brand'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono font-bold">
                          ฿{(item.price_thb || 0).toLocaleString()} / เดือน
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromStack(item._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MCP 2 Cumulative Dosage Breakdown */}
            {mcpSafety?.cumulative_ingredients && (
              <div className="bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                    <ShieldCheck size={16} />
                    <span>MCP 2: Cumulative Ingredient Dosage Guard</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                    UL OVERDOSE CHECK
                  </span>
                </div>

                <div className="space-y-2">
                  {Object.values(mcpSafety.cumulative_ingredients).map((ing: any, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl border text-xs space-y-1 bg-slate-900 border-slate-800 text-slate-300"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span>{ing.name}</span>
                          </span>
                          <span className="font-mono text-amber-300">
                            รวม: {ing.total_volume} {ing.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pre-Purchase Summary & MCP Insights (1 col) */}
          <div className="space-y-4">
            {/* Total Budget Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  ประมาณการงบประมาณรวม
                </span>
                <p className="text-xs text-slate-500">ราคาตรงจาก Official Brand Stores</p>
              </div>

              <div className="space-y-2 text-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Total Monthly Stack Investment
                </span>
                <span className="text-3xl font-black text-emerald-700 font-mono tracking-tight block">
                  ฿{totalMonthlyCost.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">คำนวณจาก {items.length} รายการสำหรับ 30 วัน</span>
              </div>

              {/* Official Store Links (MCP 4) */}
              {mcpPrice?.merchants && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    ร้านค้าทางการ (Official Stores Indexer):
                  </span>
                  <div className="space-y-1.5">
                    {mcpPrice.merchants.map((m: any, idx: number) => (
                      <a
                        key={idx}
                        href={m.store_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 transition flex items-center justify-between group"
                      >
                        <span className="truncate">{m.platform_name} - {m.seller_name}</span>
                        <ExternalLink size={13} className="text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Safety Index Card (MCP 2) */}
            {mcpSafety && (
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Activity size={15} />
                    <span>Stack Safety Index</span>
                  </span>
                  <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    {mcpSafety.safety_score}% SAFE
                  </span>
                </div>

                {mcpSafety.conflicts?.length > 0 && (
                  <div className="space-y-1 text-xs mt-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-red-400 uppercase">ข้อควรระวัง (Conflicts):</span>
                    {mcpSafety.conflicts.map((conf: any, idx: number) => (
                      <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                        <span className="text-red-400 mt-0.5">⚠</span> 
                        <div>
                          <strong className="block text-red-200">{conf.title_th}</strong>
                          <span>{conf.description_th}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {mcpSafety.synergies?.length > 0 && (
                  <div className="space-y-1 text-xs mt-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">สารส่งเสริมกัน (Synergies):</span>
                    {mcpSafety.synergies.map((syn: any, idx: number) => (
                      <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                        <span className="text-emerald-400 mt-0.5">⚡</span> 
                        <div>
                          <strong className="block text-emerald-200">{syn.title_th}</strong>
                          <span>{syn.description_th}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Persona Match Card (MCP 5) */}
            {mcpPersona?.personalized_matches && (
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                  Personal Persona Match Score
                </span>
                <div className="space-y-2">
                  {mcpPersona.personalized_matches.slice(0, 2).map((p: any) => (
                    <div key={p.persona_id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white">{p.avatar_emoji} {p.persona_name_th}</span>
                        <span className="text-amber-300 font-mono">{p.match_percentage}% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
