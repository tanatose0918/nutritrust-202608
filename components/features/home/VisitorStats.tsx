'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Activity, UserCheck } from 'lucide-react';
import { fetchWebAnalytics, sendTelemetryEvent } from '@/services/api';

export default function VisitorStats() {
    const [earlyAdopterCount, setEarlyAdopterCount] = useState(0);
    const [visitorCount, setVisitorCount] = useState(0);
    const [searchCount, setSearchCount] = useState(0);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        setIsLive(true);

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
                console.error('Telemetry error:', err);
            }
        };

        const loadAnalytics = async () => {
            const data = await fetchWebAnalytics();
            if (data) {
                setEarlyAdopterCount(data.early_adopters || 0);
                setVisitorCount(data.unique_visitors || 0);
                setSearchCount(data.product_searches || 0);
            }
        };

        trackSession();
        loadAnalytics();

        const handleSearchEvent = () => {
            sendTelemetryEvent('search');
            loadAnalytics();
        };

        window.addEventListener('nutritrust_search_performed', handleSearchEvent);
        return () => window.removeEventListener('nutritrust_search_performed', handleSearchEvent);
    }, []);

    return (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="bg-green-700 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center lg:text-left space-y-1">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200" />
                        </span>
                        <span className="text-xs font-bold text-green-200 uppercase tracking-wider flex items-center gap-1">
                            <Activity size={14} /> Live Real-time Community Stats
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight">ร่วมเป็นส่วนหนึ่งของ NutriTrust</h3>
                    <p className="text-green-100 text-sm">แพลตฟอร์มที่คนไทยเลือกใช้เพื่อสุขภาพที่ดีกว่า</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                    <div className="bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-amber-300 mb-1.5">
                            <UserCheck size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Early Adopter Members</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            {isLive ? earlyAdopterCount.toLocaleString() : '0'}
                            <span className="text-xs font-normal text-green-200 ml-1">คน</span>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-green-200 mb-1.5">
                            <Users size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">ผู้เข้าชมเว็บไซต์ (Unique)</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            {isLive ? visitorCount.toLocaleString() : '0'}
                            <span className="text-xs font-normal text-green-200 ml-1">คน</span>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-green-200 mb-1.5">
                            <Search size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">การค้นหาผลิตภัณฑ์</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            {isLive ? searchCount.toLocaleString() : '0'}
                            <span className="text-xs font-normal text-green-200 ml-1">ครั้ง</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}