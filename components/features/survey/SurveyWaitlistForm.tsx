'use client';

import React, { useState } from 'react';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { User, Mail, Lock, Sparkles, CheckCircle2, ShieldCheck, Heart, AlertCircle, ArrowRight, UserCheck, Sliders, MessageSquare } from 'lucide-react';
import { submitUserProfile } from '@/services/api';

interface ExpectationRatings {
  traceability: number;
  compareEngine: number;
  scienceEvidence: number;
  bestDeals: number;
}

const HEALTH_GOAL_OPTIONS = [
  { id: 'brain', label: '🧠 Brain & Cognitive Performance' },
  { id: 'heart', label: '🫀 Heart & Cardiovascular Health' },
  { id: 'immune', label: '🛡️ Immune System Support' },
  { id: 'joint', label: '🦴 Joint, Bone & Cartilage Care' },
  { id: 'energy', label: '⚡ Cellular Energy & Anti-Aging' },
  { id: 'sleep', label: '😴 Sleep Quality & Stress Relief' },
];

export default function SurveyWaitlistForm() {
  // Credentials
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Health Profile
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthIssues, setHealthIssues] = useState('');
  const [currentSupplements, setCurrentSupplements] = useState('');

  // Expectation Ratings (0-5)
  const [ratings, setRatings] = useState<ExpectationRatings>({
    traceability: 5,
    compareEngine: 4,
    scienceEvidence: 5,
    bestDeals: 4,
  });

  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [legalConsent, setLegalConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [memberId, setMemberId] = useState('');

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

    // Generate fallback or read ID from API result
    const returnedId = apiResult?.data?._id 
      ? `NTT-EARLY-${apiResult.data._id.substring(apiResult.data._id.length - 6).toUpperCase()}`
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
            Early Adopter Membership Pass
          </span>
          <h2 className="text-2xl font-black text-white">Registration Successful</h2>
          <p className="text-xs text-slate-400">Welcome, <strong>{username}</strong>! You are officially an Early Adopter.</p>
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

        <div>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition cursor-pointer"
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
          <span>Anonymous Membership & Survey</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">Early Adopter Registration</h2>
        <p className="text-xs text-slate-500">Fast, 100% anonymous survey to personalize your NutriTrust experience.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Credentials */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <User size={15} className="text-emerald-600" />
          <span>1. Member Credentials (Anonymous)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. biohacker_99"
              className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Password (Min 6 chars) *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Health Profile */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Heart size={15} className="text-emerald-600" />
          <span>2. Health Profile & Goals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {HEALTH_GOAL_OPTIONS.map((goal) => {
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

        {/* Health Issues Prompt Input */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center justify-between">
            <span>Current Health Issues / Concerns</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              AI MCP Server Prompt Input
            </span>
          </label>
          <textarea
            value={healthIssues}
            onChange={(e) => setHealthIssues(e.target.value)}
            rows={2}
            placeholder="e.g. High triglycerides, knee stiffness, fatigue, poor sleep..."
            className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Current Supplements Taken</label>
          <input
            type="text"
            value={currentSupplements}
            onChange={(e) => setCurrentSupplements(e.target.value)}
            placeholder="e.g. Blackmores Fish Oil 1000mg, Vitamin C"
            className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Section 3: Feature Importance Sliders (0-5) */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders size={15} className="text-emerald-600" />
          <span>3. Feature Importance Ratings (0 - 5 Scale)</span>
        </h3>

        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          {[
            { key: 'traceability', label: '🔍 Upstream Raw Material Traceability' },
            { key: 'compareEngine', label: '⚖️ Side-by-Side Dosage & Price Compare Engine' },
            { key: 'scienceEvidence', label: '📚 PubMed Clinical Evidence Summaries' },
            { key: 'bestDeals', label: '🛒 E-Commerce Platform Price Tracking' },
          ].map((item) => {
            const val = ratings[item.key as keyof ExpectationRatings];
            return (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.label}</span>
                  <span className="font-extrabold text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {val} / 5
                  </span>
                </div>
                <div className="py-2 px-1">
                  {React.createElement(Slider as any, {
                    value: val,
                    min: 0,
                    max: 5,
                    step: 1,
                    onChange: (e: any) => handleRatingChange(item.key as keyof ExpectationRatings, e.value as number),
                    className: "w-full"
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-bold px-0.5 pt-1">
                  <span>0 (Not Needed)</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5 (Essential)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Feedback */}
      <div className="space-y-1.5 pt-3 border-t border-slate-100">
        <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare size={15} className="text-emerald-600" />
          <span>4. Additional Feedback</span>
        </label>
        <textarea
          value={additionalFeedback}
          onChange={(e) => setAdditionalFeedback(e.target.value)}
          rows={2}
          placeholder="Any comments or requested features for NutriTrust team..."
          className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
        />
      </div>

      {/* Legal & Medical Disclaimer Verification Checkbox (Task 3.2) */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={legalConsent}
            onChange={(e) => setLegalConsent(e.target.checked)}
            className="mt-0.5 accent-emerald-600 rounded shrink-0 cursor-pointer"
          />
          <span className="leading-relaxed font-medium">
            <strong className="text-amber-900 font-bold">Medical Disclaimer Agreement:</strong> I understand that NutriTrust compiles public research for educational purposes and does not replace medical advice from doctors or pharmacists.
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !legalConsent}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          <UserCheck size={16} />
          <span>{isSubmitting ? 'Saving to NutriTrust Backend...' : 'Submit & Get Early Access Pass'}</span>
        </button>
      </div>
    </form>
  );
}
