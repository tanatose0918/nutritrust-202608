'use client';

import React, { Suspense } from 'react';
import TeleDoctorConferenceView from '@/components/features/telehealth/TeleDoctorConferenceView';

export default function HealthGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-slate-400 font-bold">
          กำลังโหลดห้องรับคำปรึกษา NutriTrust Health Guide...
        </div>
      }
    >
      <TeleDoctorConferenceView />
    </Suspense>
  );
}
