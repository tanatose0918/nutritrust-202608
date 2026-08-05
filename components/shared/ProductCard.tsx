'use client';

import React from 'react';

interface ProductCardProps {
    name: string;
    countdown: number; // e.g. 12.00 down to 0.01
    className?: string;
}

export default function ProductCard({ name, countdown, className = '' }: ProductCardProps) {
    // Formats countdown from 12.00 down to 0.01
    const formattedCountdown = Math.max(0.01, countdown).toFixed(2);

    return (
        <div className={`bg-white rounded-3xl p-4 sm:p-5 border border-green-100 shadow-xl flex flex-col justify-between w-full max-w-sm mx-auto transition-all hover:shadow-2xl ${className}`}>

            {/* ช่องว่างสำหรับใส่รูปภาพผลิตภัณฑ์ + Overlay ชื่อผลิตภัณฑ์ ({name}) บนรูปภาพ */}
            <div className="w-full h-64 sm:h-72 bg-gradient-to-br from-green-50/70 via-gray-50 to-emerald-50/50 rounded-2xl border border-dashed border-green-300/80 flex flex-col items-center justify-center relative overflow-hidden mb-4 group shadow-inner">

                {/* Placeholder Icon & Label (พื้นที่รูปภาพ) */}
                <div className="text-center p-4 pb-20">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white shadow-md border border-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase block">
                        พื้นที่รูปภาพผลิตภัณฑ์
                    </span>
                    <span className="text-[11px] text-gray-400 opacity-75 mt-0.5 block">
                        (Image Placeholder)
                    </span>
                </div>

                {/* Overlay ชื่อผลิตภัณฑ์ ({name}) ทับบนรูปภาพ */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-950/90 via-gray-900/65 to-transparent backdrop-blur-[1px] flex flex-col justify-end text-white">
                    {/* <span className="inline-block self-start text-[10px] font-extrabold tracking-wider text-emerald-300 uppercase bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full mb-1.5 border border-emerald-500/30">
                        Featured Supplement
                    </span> */}
                    <h3 className="text-base sm:text-lg font-bold leading-snug line-clamp-2 drop-shadow-md text-white">
                        {name}
                    </h3>
                </div>

            </div>

            {/* ใต้รูป: แสดงนับถอยหลัง (12.00 -> 0.01) */}
            {/* <div className="bg-gradient-to-r from-emerald-900 to-green-900 text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-md border border-emerald-800">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-emerald-200">
                            สลับการ์ดถัดไปใน
                        </span>
                    </div>
                    <div className="font-mono text-lg sm:text-xl font-black text-emerald-300 tracking-wider flex items-baseline gap-1">
                        <span>{formattedCountdown}</span>
                        <span className="text-xs font-sans text-emerald-400 font-medium">s</span>
                    </div>
                </div> */}

        </div>
    );
}
