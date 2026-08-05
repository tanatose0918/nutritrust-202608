'use client';

import { useState, useEffect } from 'react';

export default function SurveyEarlyAccess() {
    const handleSurveyClick = () => {
        window.open('https://forms.gle/A5wbW599VsM2CziQ9', '_blank', 'noopener,noreferrer');
    };

    // State สำหรับนาฬิกานับถอยหลังเป้าหมายเวลา (Early Access Target Countdown)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [isGlowing, setIsGlowing] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // กำหนดเป้าหมายเวลาเปิดตัว (Target Launch Date: 9 ส.ค. 2026 00:00:00 UTC+7)
        const targetDate = new Date('2026-08-09T00:00:00+07:00').getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        // Handle URL Hash change glow animation
        const handleHashChange = () => {
            if (window.location.hash === '#early-access') {
                setIsGlowing(true);
                setTimeout(() => setIsGlowing(false), 3000);
            }
        };

        if (window.location.hash === '#early-access') {
            handleHashChange();
        }

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            clearInterval(timer);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <div id="early-access" className="bg-white font-sans text-gray-900 scroll-mt-24">

            {/* Survey & Early-Access Section (MVP Goal) */}
            <section className="px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto w-full">
                <div className={`bg-green-50 rounded-3xl p-8 sm:p-10 border transition-all duration-700 ${
                    isGlowing
                        ? 'border-emerald-500 ring-4 ring-emerald-300/80 shadow-2xl scale-[1.02] bg-emerald-50'
                        : 'border-green-100 shadow-sm'
                }`}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
                        ช่วยเราสร้างแพลตฟอร์มข้อมูลโภชนาการที่คนไทยไว้วางใจ
                    </h2>
                    <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
                        NutriTrust อยู่ระหว่างการพัฒนา ความคิดเห็นของคุณจะช่วยให้เราสร้างแพลตฟอร์มที่ตอบโจทย์ผู้ใช้งานจริง
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                        <button
                            onClick={handleSurveyClick}
                            className="w-full sm:w-auto bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-green-800 transition shadow-md cursor-pointer"
                        >
                            ทำแบบสำรวจ (5 นาที)
                        </button>
                    </div>

                    {/* นาฬิกานับถอยหลัง เป้าหมายเวลา (Target Time Countdown) */}
                    <div className="pt-6 border-t border-green-200/60 max-w-lg mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-green-800 tracking-wide uppercase">
                                นับถอยหลังสู่การเปิดตัว Early Access (Target Countdown)
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                            {[
                                { label: 'วัน', value: timeLeft.days },
                                { label: 'ชั่วโมง', value: timeLeft.hours },
                                { label: 'นาที', value: timeLeft.minutes },
                                { label: 'วินาที', value: timeLeft.seconds },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/90 backdrop-blur-sm border border-green-200 rounded-2xl p-2.5 sm:p-3 shadow-xs">
                                    <span className="block text-xl sm:text-3xl font-black text-green-800 tracking-tight font-mono">
                                        {isMounted ? String(item.value).padStart(2, '0') : '00'}
                                    </span>
                                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 mt-0.5 block">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}