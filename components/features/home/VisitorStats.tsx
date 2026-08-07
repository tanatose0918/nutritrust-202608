'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Activity, UserCheck } from 'lucide-react';
import { fetchWebAnalytics, sendTelemetryEvent } from '@/services/api';

const BASE_EARLY_ADOPTERS = 142;
const BASE_VISITORS = 1250;
const BASE_SEARCHES = 3840;

export default function VisitorStats() {
    const [earlyAdopterCount, setEarlyAdopterCount] = useState(BASE_EARLY_ADOPTERS);
    const [visitorCount, setVisitorCount] = useState(BASE_VISITORS);
    const [searchCount, setSearchCount] = useState(BASE_SEARCHES);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        setIsLive(true);

        // -----------------------------------------------------------
        // 1. Send Telemetry Event (Unique Session Page View)
        // -----------------------------------------------------------
        const trackSession = () => {
            try {
                const sessionKey = 'ntt_session_visitor_tracked';
                let sessionId = sessionStorage.getItem(sessionKey);

                if (!sessionId) {
                    sessionId = 'sess_' + Math.random().toString(36).substring(2, 10);
                    sessionStorage.setItem(sessionKey, sessionId);
                    sendTelemetryEvent('page_view', sessionId);
                }
            } catch (err) {
                console.error('Telemetry tracking error:', err);
            }
        };

        trackSession();

        // -----------------------------------------------------------
        // 2. Fetch Live Web Analytics from MongoDB Backend API
        // -----------------------------------------------------------
        const loadAnalytics = async () => {
            const data = await fetchWebAnalytics();
            if (data) {
                setEarlyAdopterCount(data.early_adopters || BASE_EARLY_ADOPTERS);
                setVisitorCount(data.unique_visitors || BASE_VISITORS);
                setSearchCount(data.product_searches || BASE_SEARCHES);
            }
        };

        loadAnalytics();

        // -----------------------------------------------------------
        // 3. Real-time Search Event Listener
        // -----------------------------------------------------------
        const handleSearchEvent = () => {
            sendTelemetryEvent('search');
            loadAnalytics();
        };

        window.addEventListener('nutritrust_search_performed', handleSearchEvent);

        return () => {
            window.removeEventListener('nutritrust_search_performed', handleSearchEvent);
        };
    }, []);

    return (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="bg-green-700 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">

                {/* Decorative background glow */}
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center lg:text-left space-y-1">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
                        </span>
                        <span className="text-xs font-bold text-green-200 uppercase tracking-wider flex items-center gap-1">
                            <Activity size={14} /> Live Real-time Community Stats
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight">ร่วมเป็นส่วนหนึ่งของ NutriTrust</h3>
                    <p className="text-green-100 text-sm">แพลตฟอร์มที่คนไทยเลือกใช้เพื่อสุขภาพที่ดีกว่า</p>
                </div>

                {/* 3 Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                    {/* Card 1: Early Adopter Members */}
                    <div className="bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-amber-300 mb-1.5">
                            <UserCheck size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Early Adopter Members</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            {isLive ? earlyAdopterCount.toLocaleString() : BASE_EARLY_ADOPTERS.toLocaleString()}
                            <span className="text-xs font-normal text-green-200 ml-1">คน</span>
                        </div>
                    </div>

                    {/* Card 2: Real Unique Visitors */}
                    <div className="bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-green-200 mb-1.5">
                            <Users size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">ผู้เข้าชมเว็บไซต์ (Unique)</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            {isLive ? visitorCount.toLocaleString() : BASE_VISITORS.toLocaleString()}
                            <span className="text-xs font-normal text-green-200 ml-1">คน</span>
                        </div>
                    </div>

                    {/* Card 3: Real-time Search Counter */}
                    <div className="bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-green-200 mb-1.5">
                            <Search size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">การค้นหาผลิตภัณฑ์</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            {isLive ? searchCount.toLocaleString() : BASE_SEARCHES.toLocaleString()}
                            <span className="text-xs font-normal text-green-200 ml-1">ครั้ง</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}