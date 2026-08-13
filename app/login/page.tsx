'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/services/api';
import { setUserSession } from '@/services/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('กรุณากรอก Email หรือ Username');
      return;
    }
    if (!password) {
      setErrorMsg('กรุณากรอก Password');
      return;
    }

    setIsSubmitting(true);

    const result = await loginUser(identifier, password);

    if (!result.success || !result.data) {
      setErrorMsg(result.message || 'การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง');
      setIsSubmitting(false);
      return;
    }

    // Save session in storage
    setUserSession(result.data);

    // Redirect to target URL or user profile page
    const target = redirectUrl || `/user/${result.data._id}`;
    router.push(target);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-slate-100 pb-4">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NutriTrust Member Authentication</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">เข้าสู่ระบบ (Member Login)</h1>
        <p className="text-xs text-slate-500">กรอกข้อมูลเพื่อเข้าสู่หน้าจัดการ Personal Health Profile & MCP Dashboard</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Email หรือ Username *</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. biohacker_99 หรือ name@example.com"
              className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Password *</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 transition cursor-pointer"
              title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบ (Sign In)'}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="text-center border-t border-slate-100 pt-4 space-y-1.5">
        <p className="text-xs text-slate-500">ยังไม่ได้เป็นสมาชิก NutriTrust?</p>
        <Link
          href="/survey"
          className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:underline"
        >
          <Sparkles size={14} />
          <span>สมัครสมาชิกด่วน Early Register Pass</span>
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 font-sans space-y-6">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading Login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
