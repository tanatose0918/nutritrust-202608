'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Activity } from 'lucide-react';

// import Web Analytics number from MongoDB Analytics Collections (Future Phase)
const BASE_VISITORS = 0;
const BASE_SEARCHES = 0;

export default function VisitorStats() {
    const [visitorCount, setVisitorCount] = useState(BASE_VISITORS);
    const [searchCount, setSearchCount] = useState(BASE_SEARCHES);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        setIsLive(true);

        // -----------------------------------------------------------
        // 1. Capture Visitor IP and Increment Visitor Counter
        // -----------------------------------------------------------
        const trackVisitorIp = async () => {
            try {
                let userIp = 'local_session';
                try {
                    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
                    if (res.ok) {
                        const data = await res.json();
                        userIp = data.ip || 'unknown';
                    }
                } catch {
                    // Fallback if IP service is unreachable
                    userIp = 'session_' + Math.random().toString(36).substring(2, 8);
                }

                const rawLogs = localStorage.getItem('nutritrust_visitor_logs');
                const logs: Array<{ ip: string; timestamp: number }> = rawLogs ? JSON.parse(rawLogs) : [];

                // IP address เงื่อนไข: ซ้ำได้ เมื่อ Timestamp ต่างเวลากัน ให้นับเพิ่มขึ้น
                const now = Date.now();
                const newVisit = { ip: userIp, timestamp: now };
                logs.push(newVisit);

                localStorage.setItem('nutritrust_visitor_logs', JSON.stringify(logs));
                setVisitorCount(BASE_VISITORS + logs.length);
            } catch (err) {
                console.error('Visitor tracking error:', err);
            }
        };

        trackVisitorIp();

        // -----------------------------------------------------------
        // 2. Real-time Search Count Tracker
        // -----------------------------------------------------------
        const syncSearchCount = () => {
            try {
                const addedSearches = parseInt(localStorage.getItem('nutritrust_search_count') || '0', 10);
                setSearchCount(BASE_SEARCHES + addedSearches);
            } catch {
                // Ignore fallback
            }
        };

        syncSearchCount();

        // Listen for live search events triggered by HeroSection
        const handleSearchEvent = () => {
            syncSearchCount();
        };

        window.addEventListener('nutritrust_search_performed', handleSearchEvent);

        return () => {
            window.removeEventListener('nutritrust_search_performed', handleSearchEvent);
        };
    }, []);

    return (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="bg-green-700 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">

                {/* Decorative background glow */}
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center md:text-left space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
                        </span>
                        <span className="text-xs font-bold text-green-200 uppercase tracking-wider flex items-center gap-1">
                            <Activity size={14} /> Live Real-time Stats
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight">ร่วมเป็นส่วนหนึ่งของ NutriTrust</h3>
                    <p className="text-green-100 text-sm">แพลตฟอร์มที่คนไทยเลือกใช้เพื่อสุขภาพที่ดีกว่า</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {/* การ์ด: จำนวนผู้เข้าชม (IP Visitor Counter) */}
                    <div className="flex-1 md:w-52 bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-green-200 mb-1.5">
                            <Users size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">ผู้ใช้งานระบบ</span>
                        </div>
                        <div className="text-3xl font-black tracking-tight">
                            {isLive ? visitorCount.toLocaleString() : BASE_VISITORS.toLocaleString()}
                            <span className="text-xs font-normal text-green-200 ml-1.5">คน</span>
                        </div>
                    </div>

                    {/* การ์ด: จำนวนการค้นหา (Real-time Search Counter) */}
                    <div className="flex-1 md:w-52 bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md hover:bg-white/15 transition">
                        <div className="flex items-center gap-2 text-green-200 mb-1.5">
                            <Search size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">การค้นหาผลิตภัณฑ์</span>
                        </div>
                        <div className="text-3xl font-black tracking-tight">
                            {isLive ? searchCount.toLocaleString() : BASE_SEARCHES.toLocaleString()}
                            <span className="text-xs font-normal text-green-200 ml-1.5">ครั้ง</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}