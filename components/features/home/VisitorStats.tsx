'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Activity, UserCheck, Loader2 } from 'lucide-react';
import { fetchWebAnalytics } from '@/services/api';

export default function VisitorStats() {
    const [earlyAdopterCount, setEarlyAdopterCount] = useState(0);
    const [visitorCount, setVisitorCount] = useState(0);
    const [searchCount, setSearchCount] = useState(0);
    const [isLive, setIsLive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadAnalytics = useCallback(async () => {
        const result = await fetchWebAnalytics();
        if (result) {
            // Check if backend says it's still loading (cache not ready)
            if (result.loading) {
                setIsLoading(true);
                return;
            }
            setIsLoading(false);
            setEarlyAdopterCount(result.data?.early_adopters ?? result.early_adopters ?? 0);
            setVisitorCount(result.data?.unique_visitors ?? result.unique_visitors ?? 0);
            setSearchCount(result.data?.product_searches ?? result.product_searches ?? 0);
        }
    }, []);

    useEffect(() => {
        setIsLive(true);
        loadAnalytics();

        // Poll every 5 minutes (300,000 ms)
        const pollInterval = setInterval(() => {
            loadAnalytics();
        }, 5 * 60 * 1000);

        const handleSearchEvent = () => {
            setSearchCount((prev) => prev + 1);
        };

        window.addEventListener('nutritrust_search_performed', handleSearchEvent);
        return () => {
            clearInterval(pollInterval);
            window.removeEventListener('nutritrust_search_performed', handleSearchEvent);
        };
    }, [loadAnalytics]);

    /** Skeleton pulse block for loading state */
    const SkeletonStat = () => (
        <div className="bg-white/10 rounded-2xl p-4 border border-green-500/40 backdrop-blur-md animate-pulse">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-white/20 rounded-full" />
                <div className="h-3 bg-white/20 rounded w-2/3" />
            </div>
            <div className="flex items-center gap-2">
                <Loader2 size={20} className="text-green-200/60 animate-spin" />
                <div className="h-7 bg-white/15 rounded w-16" />
            </div>
        </div>
    );

    return (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="bg-green-700 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center lg:text-left space-y-1">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isLoading ? 'bg-amber-300 animate-ping' : 'bg-emerald-300 animate-ping'}`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-amber-200' : 'bg-emerald-200'}`} />
                        </span>
                        <span className="text-xs font-bold text-green-200 uppercase tracking-wider flex items-center gap-1">
                            <Activity size={14} />
                            {isLoading ? 'กำลังซิงค์ข้อมูล...' : 'Live Real-time Community Stats'}
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight">ร่วมเป็นส่วนหนึ่งของ NutriTrust</h3>
                    <p className="text-green-100 text-sm">แพลตฟอร์มที่คนไทยเลือกใช้เพื่อสุขภาพที่ดีกว่า</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                    {isLoading ? (
                        <>
                            <SkeletonStat />
                            <SkeletonStat />
                            <SkeletonStat />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}