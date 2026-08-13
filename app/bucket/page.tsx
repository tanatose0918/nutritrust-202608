'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Sparkles, Trash2, ShieldCheck, AlertTriangle, CheckCircle2, ExternalLink, Activity, Lock, Mail, User, Eye, EyeOff, LogIn, Heart, Stethoscope, BookmarkPlus, FolderOpen, X, Zap, FlaskConical } from 'lucide-react';
import { getBucketItems, removeFromBucket, clearBucket, BUCKET_UPDATED_EVENT, IBucketItem } from '@/services/bucket';
import { getUserSession, setUserSession, IUserSession } from '@/services/auth';
import { loginUser } from '@/services/api';
import { getSavedStacks, saveStack, deleteSavedStack, ISavedStack } from '@/services/savedStack';

export default function BucketPage() {
  const [items, setItems] = useState<IBucketItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Auth State
  const [userSession, setUserSessionState] = useState<IUserSession | null>(null);

  // Mini Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showMiniPassword, setShowMiniPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Multi-MCP Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mcpSafety, setMcpSafety] = useState<any>(null);
  const [mcpPersona, setMcpPersona] = useState<any>(null);
  const [mcpPrice, setMcpPrice] = useState<any>(null);

  // Saved Stack State
  const [savedStacks, setSavedStacks] = useState<ISavedStack[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [stackName, setStackName] = useState('');
  const [showSavedPanel, setShowSavedPanel] = useState(false);

  const miniLoginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setItems(getBucketItems());
    setUserSessionState(getUserSession());
    setSavedStacks(getSavedStacks());

    const handleUpdate = (e: Event) => {
      const customEv = e as CustomEvent;
      setItems(customEv.detail || getBucketItems());
    };

    window.addEventListener(BUCKET_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(BUCKET_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleSaveStack = () => {
    if (items.length === 0) return;
    const ids = items.map((i) => i._id);
    const names = items.map((i) => i.name);
    const score = mcpSafety?.safety_score;
    saveStack(stackName || '', ids, names, score);
    setSavedStacks(getSavedStacks());
    setStackName('');
    setShowSaveModal(false);
  };

  const handleLoadSavedStack = (stack: ISavedStack) => {
    // Load saved product IDs back into bucket by rebuilding
    // Note: only IDs stored — names/prices are already in bucket service
    // We set the bucket via a page reload approach: navigate to bucket with ids param
    window.location.href = `/stack?ids=${stack.product_ids.join(',')}`;
  };

  const handleDeleteSavedStack = (stackId: string) => {
    deleteSavedStack(stackId);
    setSavedStacks(getSavedStacks());
  };

  const handleMiniLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('กรุณากรอก Email หรือ Username');
      return;
    }
    if (!loginPassword) {
      setLoginError('กรุณากรอก Password');
      return;
    }

    setIsLoggingIn(true);
    const result = await loginUser(loginIdentifier, loginPassword);

    if (!result.success || !result.data) {
      setLoginError(result.message || 'การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง');
      setIsLoggingIn(false);
      return;
    }

    setUserSession(result.data);
    setUserSessionState(result.data);
    setIsLoggingIn(false);
  };

  const handleRunMultiMcpAnalysis = async () => {
    if (!userSession) {
      setLoginError('กรุณาเข้าสู่ระบบก่อนรันระบบประมวลผล MCP');
      if (miniLoginRef.current) {
        miniLoginRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (items.length === 0) return;
    setIsAnalyzing(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const productIds = items.map((i) => i._id);

    try {
      const healthIssues = userSession?.health_issues ? [userSession.health_issues] : [];
      const healthGoals = userSession?.health_goals || [];

      // 1. Run MCP 2 (Stack Safety & Cumulative UL Guard)
      const safetyRes = await fetch(`${baseUrl}/api/mcp/stack-safety`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: productIds, health_issues: healthIssues, health_goals: healthGoals })
      });
      const safetyJson = await safetyRes.json();
      if (safetyJson.success) setMcpSafety(safetyJson.data);

      // 2. Run MCP 5 (Dynamic Persona Match Engine)
      const personaRes = await fetch(`${baseUrl}/api/mcp/dynamic-persona-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userSession?.email || 'guest@nutritrust.com',
          prompt: userSession?.health_issues || 'ดูแลสุขภาพทั่วไปและบำรุงข้อต่อ',
          product_ids: productIds,
          health_issues: healthIssues,
          health_goals: healthGoals
        })
      });
      const personaJson = await personaRes.json();
      if (personaJson.success) setMcpPersona(personaJson.data);

      // 3. Run MCP 4 (Merchant Price Indexer)
      const priceRes = await fetch(`${baseUrl}/api/mcp/merchant-prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: productIds })
      });
      const priceJson = await priceRes.json();
      if (priceJson.success) setMcpPrice(priceJson.data);

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
          <ShoppingBag size={14} className="text-emerald-600" />
          <span>Supplement Bucket Intelligence</span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wider">
            Pre-Purchase Bucket Intelligence
          </span>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>ตะกร้าสะสมอาหารเสริม (NutriTrust Bucket)</span>
            <span className="text-sm font-bold text-slate-400">({items.length} รายการ)</span>
          </h1>
          <p className="text-xs text-slate-400">
            วิเคราะห์ปริมาณสารอาหารสะสมรวม, ตรวจสอบ Upper Limit (UL) Overdose และประเมินความคุ้มค่าก่อนตัดสินใจซื้อ
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleRunMultiMcpAnalysis}
            disabled={isAnalyzing}
            className={`font-black text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-lg flex items-center gap-2 shrink-0 ${
              userSession
                ? 'bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 hover:scale-105 active:scale-95'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
            }`}
          >
            {userSession ? <Sparkles size={16} /> : <Lock size={16} />}
            <span>
              {isAnalyzing
                ? 'กำลังวิเคราะห์ด้วย Multi-MCP...'
                : userSession
                ? '⚡ รันระบบ Multi-MCP วิเคราะห์ภาพรวม Bucket'
                : '🔒 กรุณาเข้าสู่ระบบก่อนรันระบบประมวลผล MCP'}
            </span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">ยังไม่มีสินค้าในตะกร้าสะสม Bucket</h3>
            <p className="text-xs text-slate-500">
              กดปุ่มไอคอน "+ รถเข็น" ที่การ์ดสินค้าเพื่อรวบรวมอาหารเสริมที่ต้องการทานร่วมกัน
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
          {/* Left Column: Bucket Items List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  รายการอาหารเสริมใน Bucket
                </span>
                <button
                  type="button"
                  onClick={() => clearBucket()}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>ล้างตะกร้า Bucket</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:border-emerald-200 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain rounded-lg" />
                        ) : (
                          <ShoppingBag size={20} />
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 uppercase">
                          {item.brand_name || 'Verified Brand'}
                        </span>
                        {/* Feature 3: Product Detail Link */}
                        <Link href={`/products/${item._id}`} className="block">
                          <h4 className="text-xs font-bold text-slate-900 truncate hover:text-emerald-700 hover:underline underline-offset-2 transition cursor-pointer flex items-center gap-1">
                            {item.name}
                            <ExternalLink size={10} className="shrink-0 opacity-50 group-hover:opacity-100" />
                          </h4>
                        </Link>
                        <p className="text-[11px] text-slate-500 font-mono font-bold">
                          ฿{(item.price_thb || 0).toLocaleString()} / เดือน
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromBucket(item._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-200/60 rounded-xl transition cursor-pointer shrink-0"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 1: Conflict & Synergy Alerts (from MCP 2) */}
            {mcpSafety && (
              <div className="space-y-3">
                {/* Conflicts */}
                {mcpSafety.conflicts && mcpSafety.conflicts.length > 0 && (
                  <div className="bg-red-950/60 border border-red-500/50 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-red-300 font-extrabold text-xs border-b border-red-500/30 pb-2">
                      <AlertTriangle size={16} className="text-red-400" />
                      <span>⚠️ ข้อควรระวัง — อาจขัดแย้งกัน (Conflict Alerts)</span>
                    </div>
                    <div className="space-y-2">
                      {mcpSafety.conflicts.map((c: any, idx: number) => (
                        <div key={idx} className="bg-red-950/80 p-3 rounded-2xl border border-red-500/30 space-y-1">
                          <p className="text-xs font-bold text-red-200">{c.title_th}</p>
                          <p className="text-[11px] text-red-300/80 leading-relaxed">{c.description_th}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synergies */}
                {mcpSafety.synergies && mcpSafety.synergies.length > 0 && (
                  <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs border-b border-emerald-500/30 pb-2">
                      <Zap size={16} className="text-emerald-400" />
                      <span>⚡ เสริมฤทธิ์กัน — ทานร่วมกันได้ดีเยี่ยม (Synergies)</span>
                    </div>
                    <div className="space-y-2">
                      {mcpSafety.synergies.map((s: any, idx: number) => (
                        <div key={idx} className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-500/30 space-y-1">
                          <p className="text-xs font-bold text-emerald-200">{s.title_th}</p>
                          <p className="text-[11px] text-emerald-300/80 leading-relaxed">{s.description_th}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No conflicts and no synergies */}
                {mcpSafety.conflicts?.length === 0 && mcpSafety.synergies?.length === 0 && (
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>✅ ทานร่วมกันได้อย่างปลอดภัย ไม่พบ Conflict ใน Stack นี้</span>
                  </div>
                )}
              </div>
            )}

            {/* MCP 2 Cumulative Dosage Breakdown (kept for reference) */}
            {mcpSafety?.ingredient_breakdown && (
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
                  {mcpSafety.ingredient_breakdown.map((ing: any, idx: number) => {
                    const isOverdosed = ing.is_overdosed;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs space-y-1 ${
                          isOverdosed
                            ? 'bg-red-950/40 border-red-500/50 text-red-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white flex items-center gap-1.5">
                            {isOverdosed ? <AlertTriangle size={14} className="text-red-400" /> : <CheckCircle2 size={14} className="text-emerald-400" />}
                            <span>{ing.ingredient_name}</span>
                          </span>
                          <span className="font-mono text-amber-300">
                            รวม: {ing.cumulative_amount} {ing.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] opacity-80 pt-1 border-t border-slate-800">
                          <span>ทานร่วมกันใน {ing.found_in_products_count} รายการ</span>
                          <span>เกณฑ์ปลอดภัยสูงสุด (UL): {ing.upper_limit} {ing.unit}</span>
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
                  Total Monthly Investment
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

            {/* REQUIREMENT 4: Under Total Budget Box -> Mini Login Card (if logged out) OR User Health Profile Card (if logged in) */}
            <div ref={miniLoginRef}>
              {!userSession ? (
                /* Mini Login Form Card (Logged Out) */
                <form
                  onSubmit={handleMiniLoginSubmit}
                  className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-4 animate-in fade-in duration-200"
                >
                  <div className="border-b border-slate-800 pb-2.5 space-y-1">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Lock size={12} /> Authentication Required
                    </span>
                    <h3 className="text-sm font-black text-white">เข้าสู่ระบบเพื่อวิเคราะห์ MCP</h3>
                    <p className="text-[11px] text-slate-400">
                      กรุณาเข้าสู่ระบบเพื่อดึงข้อมูลสุขภาพของคุณเข้าสู่ระบบ MCP 5 & 2
                    </p>
                  </div>

                  {loginError && (
                    <div className="bg-red-950/60 text-red-200 p-2.5 rounded-xl border border-red-500/50 text-xs font-bold flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-red-400 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Email หรือ Username</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="e.g. biohacker_tor"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Password</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type={showMiniPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-8 pr-9 py-2 text-xs bg-slate-950 text-white rounded-xl border border-slate-800 outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMiniPassword(!showMiniPassword)}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-white p-0.5 transition cursor-pointer"
                        >
                          {showMiniPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <LogIn size={14} />
                    <span>{isLoggingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบเพื่อวิเคราะห์ MCP'}</span>
                  </button>

                  <div className="text-center pt-1 border-t border-slate-800">
                    <Link
                      href="/survey"
                      className="text-[11px] text-amber-300 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>ยังไม่มีบัญชี? สมัคร Early Access Pass</span>
                    </Link>
                  </div>
                </form>
              ) : (
                /* User Health Profile & Goals Card (Logged In) */
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <User size={15} />
                      <span>ข้อมูลสุขภาพผู้ใช้ (Active Session)</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      {userSession.username || 'Member'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Health Issues */}
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Stethoscope size={12} /> ปัญหาสุขภาพ / สภาวะร่างกาย (Health Issues):
                      </span>
                      <p className="text-slate-200 text-[11px] leading-relaxed">
                        {userSession.health_issues || 'บำรุงสุขภาพทั่วไป ดูแลข้อต่อและหลอดเลือด'}
                      </p>
                    </div>

                    {/* Health Goals */}
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Heart size={12} /> เป้าหมายสุขภาพที่เลือกไว้ (Health Goals):
                      </span>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(userSession.health_goals && userSession.health_goals.length > 0
                          ? userSession.health_goals
                          : ['Brain & Memory', 'Immunity Boost', 'Joint Care']
                        ).map((goal: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-800"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic text-center">
                    ✓ ข้อมูลสุขภาพข้างต้นจะถูกแปลงรหัสเป็น Anonymous ZK-Token ป้องกันความเป็นส่วนตัว ก่อนวิเคราะห์โดย MCP 5
                  </p>
                </div>
              )}
            </div>

            {/* Feature 2: Save Stack Button (appears when items exist) */}
            {items.length > 0 && (
              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <BookmarkPlus size={15} />
                  <span>💾 บันทึก Stack นี้ไว้ใช้ภายหลัง</span>
                </button>

                {savedStacks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowSavedPanel(!showSavedPanel)}
                    className="w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 font-bold text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FolderOpen size={14} />
                    <span>📚 Stack ที่บันทึกไว้ ({savedStacks.length})</span>
                  </button>
                )}
              </div>
            )}

            {/* Feature 2: Saved Stacks Panel */}
            {showSavedPanel && savedStacks.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-indigo-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <FlaskConical size={14} className="text-indigo-600" />
                    Stacks ที่บันทึกไว้
                  </span>
                  <button onClick={() => setShowSavedPanel(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={14} /></button>
                </div>
                <div className="space-y-2">
                  {savedStacks.map((stack) => (
                    <div key={stack.id} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{stack.name}</p>
                          <p className="text-[10px] text-slate-400">{new Date(stack.created_at).toLocaleDateString('th-TH')} · {stack.product_ids.length} รายการ</p>
                          {stack.safety_score !== undefined && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              stack.safety_score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              Safety: {stack.safety_score}%
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteSavedStack(stack.id)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                          title="ลบ Stack นี้"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{stack.product_names.join(', ')}</p>
                      <button
                        onClick={() => handleLoadSavedStack(stack)}
                        className="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[11px] py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <FolderOpen size={12} />
                        <span>โหลด Stack นี้เข้า Stack Analyzer</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Index Card (MCP 2) */}
            {mcpSafety && (
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Activity size={15} />
                    <span>Bucket Safety Index</span>
                  </span>
                  <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    {mcpSafety.safety_score}% SAFE
                  </span>
                </div>

                {mcpSafety.synergies?.length > 0 && (
                  <div className="space-y-1 text-xs mt-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">สารส่งเสริมกัน (Synergies):</span>
                    {mcpSafety.synergies.map((syn: string, idx: number) => (
                      <p key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                        <span className="text-emerald-400">⚡</span> {syn}
                      </p>
                    ))}
                  </div>
                )}

                {mcpSafety.consumption_schedule && (
                  <div className="space-y-2 text-xs mt-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-blue-400 uppercase block mb-2">ตารางการทานแนะนำ (Consumption Schedule):</span>
                    
                    {mcpSafety.consumption_schedule.morning_before_meal?.length > 0 && (
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-amber-400 font-bold block mb-1">🌅 เช้าก่อนอาหาร (Morning - Before Meal)</span>
                        <span className="text-slate-300 text-[11px]">{mcpSafety.consumption_schedule.morning_before_meal.join(', ')}</span>
                      </div>
                    )}

                    {mcpSafety.consumption_schedule.morning_after_meal?.length > 0 && (
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-emerald-400 font-bold block mb-1">🍽️ เช้าหลังอาหาร (Morning - After Meal)</span>
                        <span className="text-slate-300 text-[11px]">{mcpSafety.consumption_schedule.morning_after_meal.join(', ')}</span>
                      </div>
                    )}

                    {mcpSafety.consumption_schedule.bedtime?.length > 0 && (
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-indigo-400 font-bold block mb-1">🌙 ก่อนนอน (Bedtime)</span>
                        <span className="text-slate-300 text-[11px]">{mcpSafety.consumption_schedule.bedtime.join(', ')}</span>
                      </div>
                    )}
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

      {/* Feature 2: Save Stack Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BookmarkPlus size={16} className="text-indigo-600" />
                บันทึก Supplement Stack
              </h3>
              <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">ตั้งชื่อ Stack (เช่น "Stack เช้า", "วิ่งมาราธอน")</label>
              <input
                type="text"
                value={stackName}
                onChange={(e) => setStackName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveStack()}
                placeholder={`Stack ${new Date().toLocaleDateString('th-TH')}`}
                autoFocus
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition"
              />
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl">
              จะบันทึก <span className="font-bold text-slate-700">{items.length} รายการ</span>: {items.map((i) => i.name).slice(0, 2).join(', ')}{items.length > 2 ? ` +${items.length - 2} อื่นๆ` : ''}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveStack}
                className="flex-1 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition cursor-pointer shadow-md"
              >
                💾 บันทึก Stack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
