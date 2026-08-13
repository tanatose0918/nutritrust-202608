'use client';

import React, { useState } from 'react';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { User, Mail, Lock, Sparkles, CheckCircle2, ShieldCheck, Heart, AlertCircle, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';
import { submitUserProfile } from '@/services/api';
import { setUserSession } from '@/services/auth';

interface ExpectationRatings {
  traceability: number;
  compareEngine: number;
  scienceEvidence: number;
  bestDeals: number;
}

const HEALTH_GOALS_OPTIONS = [
  { id: 'brain', label: '🧠 สมอง & การทำงานของระบบประสาท (Brain & Memory)' },
  { id: 'heart', label: '🫀 หัวใจ & หลอดเลือด (Heart & Cardiovascular)' },
  { id: 'immune', label: '🛡️ ภูมิคุ้มกัน & ต้านอนุมูลอิสระ (Immunity Boost)' },
  { id: 'joint', label: '🦴 ข้อต่อ & กระดูก (Joint & Cartilage)' },
  { id: 'energy', label: '⚡ พลังงานเซลล์ & ต่อต้านวัย (Cellular Energy & Anti-Aging)' },
  { id: 'sleep', label: '😴 การนอนหลับ & คลายเครียด (Sleep & Stress Relief)' },
];

export default function SurveyWaitlistForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthIssues, setHealthIssues] = useState('');
  const [currentSupplements, setCurrentSupplements] = useState('');

  const [ratings, setRatings] = useState<ExpectationRatings>({
    traceability: 8,
    compareEngine: 9,
    scienceEvidence: 9,
    bestDeals: 7,
  });

  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [mongoId, setMongoId] = useState('');

  const handleGoalToggle = (goalId: string) => {
    setHealthGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const handleRatingChange = (key: keyof ExpectationRatings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim()) {
      setErrorMsg('Please enter a username.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      email,
      username,
      role: 'early_adopter',
      health_goals: healthGoals,
      health_issues: healthIssues,
      current_supplements: currentSupplements,
      ratings,
      feedback: additionalFeedback,
      is_newsletter_subscriber: true,
    };

    // Call API helper to submit to MongoDB backend
    const apiResult = await submitUserProfile(payload);

    if (apiResult?.data) {
      setUserSession(apiResult.data);
    }

    const realId = apiResult?.data?._id || '';
    setMongoId(realId);

    // Generate fallback or read ID from API result
    const returnedId = realId 
      ? `NTT-EARLY-${realId.substring(realId.length - 6).toUpperCase()}`
      : `NTT-EARLY-${Math.floor(1000 + Math.random() * 9000)}`;

    setMemberId(returnedId);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-xl space-y-6 max-w-xl mx-auto text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <UserCheck size={32} />
        </div>

        <div className="space-y-1">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-400/30 uppercase tracking-wider">
            Early Register Pass
          </span>
          <h2 className="text-2xl font-black text-white">Registration Successful</h2>
          <p className="text-xs text-slate-400">Welcome, <strong>{username}</strong>! You are officially an Early Register member.</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-emerald-500/30 text-left space-y-2 max-w-sm mx-auto">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>NutriTrust Member ID</span>
            </span>
            <span className="text-[10px] text-emerald-300 font-mono font-bold">ACTIVE</span>
          </div>
          <p className="text-2xl font-black text-amber-300 tracking-wider font-mono text-center py-1">
            {memberId}
          </p>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700">
            <span>Username: <strong>{username}</strong></span>
            <span>Email: <strong>{email}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {mongoId && (
            <a
              href={`/user/${mongoId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl transition cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Go to My Personal Health Profile (`/user/${mongoId.slice(-6)}`)</span>
            </a>
          )}
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-3.5 rounded-xl transition cursor-pointer border border-slate-700"
          >
            <span>Return to Home</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles size={14} className="text-emerald-600" />
          <span>Quick Early Access Pass</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">ลงทะเบียนสมาชิก Early Register Pass</h1>
        <p className="text-xs text-slate-500">กรอกข้อมูลเบื้องต้นเพียง 1 นาที เพื่อรับ Member ID และเข้าสู่หน้า Personal Health Profile</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <User size={16} className="text-emerald-600" />
          <span>1. ข้อมูลบัญชีผู้ใช้ (Account Setup)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Username *</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. biohacker_tor"
                className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Email *</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Password *</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 transition cursor-pointer"
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Confirm Password *</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่าน"
                className="w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 transition cursor-pointer"
                title={showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Health Goals */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Heart size={16} className="text-emerald-600" />
          <span>2. เป้าหมายสุขภาพเบื้องต้น (Initial Health Goals)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {HEALTH_GOALS_OPTIONS.map((goal) => {
            const isChecked = healthGoals.includes(goal.id);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => handleGoalToggle(goal.id)}
                className={`p-2.5 rounded-xl text-xs text-left font-semibold border transition cursor-pointer flex items-center gap-2 ${
                  isChecked
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 size={10} />}
                </div>
                <span className="truncate">{goal.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'กำลังสร้าง Member ID...' : 'ลงทะเบียนและรับ Member Pass ทันที'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}
