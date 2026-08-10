'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/features/home/HeroSection';
import QuickSearchCategories from '@/components/features/home/QuickSearchCategories';
import TrustPropositions from '@/components/features/home/TrustPropositions';
import VisitorStats from '@/components/features/home/VisitorStats';
import SurveyEarlyAccess from '@/components/features/home/SurveyEarlyAccess';

export default function HomePage() {
    const [animationClass, setAnimationClass] = useState('animate-section-swap');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const from = params.get('from');
            if (from === 'logo') {
                setAnimationClass('animate-slide-bottom-750');
            } else if (from === 'back') {
                setAnimationClass('animate-slide-right-750');
            }
        }
    }, []);

    return (
        <div className={`flex flex-col gap-6 md:gap-8 lg:gap-10 pt-2 md:pt-4 pb-10 md:pb-14 overflow-x-hidden ${animationClass}`}>
            {/* 1. Hero Section Banner & Search */}
            <HeroSection />

            {/* 2. Compact Collapsible One-Click Search Categories */}
            <QuickSearchCategories />

            {/* 3. Live Telemetry Visitor Stats */}
            <VisitorStats />

            {/* 4. Core Trust Layer Propositions */}
            <TrustPropositions />

            {/* 5. Early Access Membership Form */}
            <SurveyEarlyAccess />
        </div>
    );
}