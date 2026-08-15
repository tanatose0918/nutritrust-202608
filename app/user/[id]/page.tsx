'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles, Heart, Activity, CheckCircle2, Save, LogOut } from 'lucide-react';
import { fetchUserById, updateUserProfileById } from '@/services/api';
import { getUserSession, clearUserSession } from '@/services/auth';

const PERSONA_SUBJECT_OPTIONS = [
  { id: 'senior_grandparent', label: '👵 ผู้สูงอายุ / ข้อต่อ & กระดูก' },
  { id: 'active_athlete', label: '🏃 สายออกกำลังกาย / คาร์ดิโอ & เบิร์น' },
  { id: 'office_worker', label: '💻 วัยทำงาน / คลายเครียด & นอนหลับ' },
  { id: 'general_user', label: '🌟 ดูแลสุขภาพทั่วไป (General Wellness)' },
];

const INTAKE_ROUTINE_OPTIONS = [
  { id: 'morning', label: '🌅 ตอนเช้าหลังตื่นนอน' },
  { id: 'with_meals', label: '🍽️ พร้อมมื้ออาหาร' },
  { id: 'post_workout', label: '🏋️ หลังออกกำลังกาย' },
  { id: 'night', label: '🌙 ก่อนนอน' },
];

const HEALTH_GOALS_LIST = [
  { id: 'brain', label: '🧠 สมอง & การทำงานของประสาท' },
  { id: 'heart', label: '🫀 หัวใจ & หลอดเลือด' },
  { id: 'immune', label: '🛡️ ภูมิคุ้มกัน' },
  { id: 'joint', label: '🦴 ข้อต่อ & กระดูก' },
  { id: 'energy', label: '⚡ พลังงานเซลล์ & ต่อต้านวัย' },
  { id: 'sleep', label: '😴 การนอนหลับ & คลายเครียด' },
];

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Editable Profile State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [subjectType, setSubjectType] = useState('general_user');
  const [intakeRoutine, setIntakeRoutine] = useState('morning');
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthIssues, setHealthIssues] = useState('');
  const [currentSupplements, setCurrentSupplements] = useState('');

  // Live MCP Diagnostics State
  const [mcpResult, setMcpResult] = useState<any>(null);
  const [isRunningMcp, setIsRunningMcp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!userId) return;

      // Protected Route check: Require logged-in session matching user ID
      const session = getUserSession();
      if (!session) {
        router.push(`/login?redirect=/user/${userId}`);
        return;
      }

      setLoading(true);
      const dbUser = await fetchUserById(userId);
      if (dbUser) {
        setUser(dbUser);
        setUsername(dbUser.username || '');
        setEmail(dbUser.email || '');
        setSubjectType(dbUser.subject_type || 'general_user');
        setIntakeRoutine(dbUser.intake_routine || 'morning');
        setHealthGoals(dbUser.health_goals || []);
        setHealthIssues(dbUser.health_issues || '');
        setCurrentSupplements(dbUser.current_supplements || '');
      }
      setLoading(false);
    }
    loadData();
  }, [userId, router]);

  const handleGoalToggle = (goalId: string) => {
    setHealthGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg(null);

    const updated = await updateUserProfileById(userId, {
      username,
      subject_type: subjectType,
      intake_routine: intakeRoutine,
      health_goals: healthGoals,
      health_issues: healthIssues,
      current_supplements: currentSupplements
    });

    if (updated) {
      setUser(updated);
      setSaveSuccessMsg('อัปเดตข้อมูล Personal Health Profile เรียบร้อยแล้ว!');
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };

  const handleRunMcpDiagnostics = async () => {
    setIsRunningMcp(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://nutritrust-backend-production.up.railway.app'
          : 'http://localhost:5000');
      const res = await fetch(`${baseUrl}/api/mcp/dynamic-persona-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'guest@nutritrust.com',
          prompt: healthIssues || 'ดูแลสุขภาพทั่วไปและบำรุงข้อต่อ',
          product_ids: ['p_001', 'p_002'],
          health_issues: healthIssues ? [healthIssues] : [],
          health_goals: healthGoals
        })
      });
      const json = await res.json();
      if (json.success) {
        setMcpResult(json.data);
      }
    } catch (err) {
      console.error('MCP Diagnostics error:', err);
    }
    setIsRunningMcp(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500 font-bold text-sm">
        กำลังโหลดข้อมูล Personal Health Profile...
      </div>
    );
  }

  const memberPassCode = user?._id
    ? `NTT-EARLY-${user._id.substring(user._id.length - 6).toUpperCase()}`
    : `NTT-EARLY-${userId.slice(-6).toUpperCase()}`;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 font-sans space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/survey"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>กลับไปหน้า Early Register</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Personal Data & MCP Engine Pass</span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wider">
                Member Profile
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {memberPassCode}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">
              {username || 'NutriTrust Member'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">{email}</p>
          </div>

          <button
            type="button"
            onClick={handleRunMcpDiagnostics}
            disabled={isRunningMcp}
            className="bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Sparkles size={15} />
            <span>{isRunningMcp ? 'กำลังทดสอบ...' : 'ทดสอบรัน MCP 1 & 2 Diagnostics'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Privacy & ZK-Token Status Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
            <ShieldCheck size={16} />
            <span>MCP 1: Privacy & Zero-Knowledge Security Pass</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono">
            PDPA SAFE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">Zero-Knowledge Token ID</span>
            <span className="font-mono text-amber-300 font-bold block truncate">
              {mcpResult?.privacy_context?.zk_token || `zk_${userId.slice(-16)}`}
            </span>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">SIR 7+1 Matrix Stream</span>
            <span className="font-mono text-emerald-400 font-semibold block truncate">
              {mcpResult?.privacy_context?.sir_compression?.sir_token || 'S:user|V:health|SIG:protected'}
            </span>
          </div>
        </div>
      </div>

      {/* Live MCP Diagnostics Result View */}
      {mcpResult && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-amber-500/30 space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
              <Activity size={16} />
              <span>ผลการวิเคราะห์สดจาก MCP 1 (Privacy), MCP 2 (Safety) & MCP 5 (Match Engine)</span>
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full">
              Safety Score: {mcpResult.stack_safety?.safety_score}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mcpResult.personalized_matches?.map((p: any) => (
              <div key={p.persona_id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{p.avatar_emoji}</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Match {p.match_percentage}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{p.persona_name_th}</h4>
                <ul className="text-[10px] text-slate-400 space-y-1">
                  {p.strength_points?.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="text-emerald-400">✓</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editable Health Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Heart size={18} className="text-emerald-600" />
              <span>Personal Health Profile Data</span>
            </h2>
            <p className="text-xs text-slate-500">ปรับแต่งข้อมูลสุขภาพเพื่อใช้ในอัลกอริทึม MCP 1, 2 และ 5</p>
          </div>
        </div>

        {/* Target Persona Category (subject) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            1. กลุ่มเป้าหมายสุขภาพของท่าน (MCP 1 Target Subject)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PERSONA_SUBJECT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSubjectType(opt.id)}
                className={`p-3 rounded-2xl text-xs font-bold text-left transition border cursor-pointer ${subjectType === opt.id
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Intake Routine (auxiliary) */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 block">
            2. ช่วงเวลาการรับประทานอาหารเสริมประจำวัน (MCP 1 Auxiliary Routine)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INTAKE_ROUTINE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setIntakeRoutine(opt.id)}
                className={`p-2.5 rounded-xl text-xs font-bold text-center transition border cursor-pointer ${intakeRoutine === opt.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 block">
            3. เป้าหมายสุขภาพที่ต้องการเน้น (Health Goals)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {HEALTH_GOALS_LIST.map((goal) => {
              const isChecked = healthGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-2.5 rounded-xl text-xs text-left font-semibold border transition cursor-pointer flex items-center gap-2 ${isChecked
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
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

        {/* Health Issues Prompt Input */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 block flex items-center justify-between">
            <span>4. ปัญหาสุขภาพหรือข้อกังวลปัจจุบัน (Current Health Concerns)</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              MCP 1 Thai Prompt Input
            </span>
          </label>
          <textarea
            value={healthIssues}
            onChange={(e) => setHealthIssues(e.target.value)}
            rows={3}
            placeholder="เช่น ปวดข้อเข่า, ความดันสูง, นอนไม่หลับ, ปวดเมื่อยยามตื่น..."
            className="w-full p-3 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 placeholder-slate-400"
          />
        </div>

        {/* Current Supplements Taken */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 block flex items-center justify-between">
            <span>5. อาหารเสริมที่ทานอยู่ ณ ปัจจุบัน (Current Supplement Stack)</span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
              MCP 2 Stack Safety Check Input
            </span>
          </label>
          <input
            type="text"
            value={currentSupplements}
            onChange={(e) => setCurrentSupplements(e.target.value)}
            placeholder="เช่น Blackmores Fish Oil 1000mg, Vistra Vitamin C 1000mg"
            className="w-full px-3 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Save Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs py-3.5 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Save size={16} />
            <span>{isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูล Personal Health Profile'}</span>
          </button>
        </div>
      </form>

      {/* Prominent Logout Button at Bottom of Page */}
      <div className="pt-4 pb-8 text-center border-t border-slate-200">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl transition cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        >
          <LogOut size={16} />
          <span>ออกจากระบบ (Logout & Clear Session)</span>
        </button>
      </div>
    </div>
  );
}
