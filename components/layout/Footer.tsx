'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SiFacebook, SiLine, SiYoutube, SiInstagram } from '@icons-pack/react-simple-icons';
import { submitUserProfile } from '@/services/api';

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subscribedSuccess, setSubscribedSuccess] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;

        setIsSubmitting(true);
        // Call API endpoint to record newsletter consent
        await submitUserProfile({
            email: newsletterEmail.trim(),
            is_newsletter_subscriber: true,
        });

        setIsSubmitting(false);
        setSubscribedSuccess(true);
        setNewsletterEmail('');
        setTimeout(() => setSubscribedSuccess(false), 5000);
    };

    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-12 text-sm text-gray-600">
            <div className="max-w-7xl mx-auto px-6 md:px-10">

                {/* ส่วนบน: 4 คอลัมน์ สำหรับ โลโก้ และ ลิงก์ต่างๆ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* คอลัมน์ 1: โลโก้ และ สโลแกน */}
                    <div className="space-y-4">
                        <div className="text-2xl font-extrabold text-green-700 flex items-center gap-2.5">
                            <img
                                src="/nutritrust_icon.jpg"
                                alt="NutriTrust Logo"
                                className="w-9 h-9 rounded-full border border-emerald-200/80 object-cover p-0.5 bg-white shrink-0"
                            />
                            <span>NutriTrust</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            แหล่งข้อมูลโภชนาการและอาหารเสริมที่คุณเชื่อถือได้ เพื่อการตัดสินใจที่ดีที่สุดเพื่อสุขภาพของคุณและคนที่คุณรัก
                        </p>
                        <p className="text-xs text-gray-400 mt-4">
                            © 2026 NutriTrust. All rights reserved.
                        </p>
                    </div>

                    {/* คอลัมน์ 2: เมนูเกี่ยวกับเรา */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 text-base">เกี่ยวกับเรา</h3>
                        <ul className="space-y-3">
                            <li><a href="/about" className="hover:text-green-700 transition">เกี่ยวกับ NutriTrust</a></li>
                            <li><a href="/about" className="hover:text-green-700 transition">วิธีการประเมินของเรา (Methodology)</a></li>
                            <li><a href="/about" className="hover:text-green-700 transition">ทีมงาน & Blue Horizon</a></li>
                            <li><a href="/about" className="hover:text-green-700 transition">ติดต่อเรา</a></li>
                        </ul>
                    </div>

                    {/* คอลัมน์ 3: เมนูช่วยเหลือและข้อกฎหมาย */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 text-base">ช่วยเหลือ</h3>
                        <ul className="space-y-3">
                            <li><a href="/help#faq" className="hover:text-green-700 transition">คำถามที่พบบ่อย (FAQ)</a></li>
                            <li><a href="/help#terms" className="hover:text-green-700 transition">ข้อกำหนดการใช้งาน</a></li>
                            <li><a href="/help#privacy" className="hover:text-green-700 transition">นโยบายความเป็นส่วนตัว (Privacy Policy)</a></li>
                            <li><a href="/help#cookies" className="hover:text-green-700 transition">การใช้คุกกี้</a></li>
                        </ul>
                    </div>

                    {/* คอลัมน์ 4: โซเชียล และ ฟอร์มรับข่าวสาร (ใช้ Model เดียวกันกับ Survey) */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 text-base">ติดตามเรา</h3>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition">
                                <SiFacebook size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#06C755] hover:text-white transition">
                                <SiLine size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#FF0000] hover:text-white transition">
                                <SiYoutube size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#E4405F] hover:text-white transition">
                                <SiInstagram size={16} />
                            </a>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 text-sm">รับข่าวสาร (NEWS Broadcast)</h3>
                        <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                            <input
                                type="email"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? '...' : 'Subscribe'}
                            </button>
                        </form>
                        {subscribedSuccess && (
                            <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                                <CheckCircle2 size={13} />
                                <span>ลงทะเบียนรับข่าวสาร NEWS Broadcast เรียบร้อย!</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* ส่วนท้ายสุด: Copyright & Disclaimer */}
                <div className="pt-8 border-t border-gray-200 text-center">
                    <p className="mb-2">© 2026 NutriTrust. All rights reserved.</p>
                    <p className="max-w-2xl mx-auto text-xs text-gray-400">
                        คำเตือนทางการแพทย์: ข้อมูลบน NutriTrust มีวัตถุประสงค์เพื่อให้ข้อมูลทั่วไปเท่านั้น ไม่สามารถใช้แทนคำแนะนำ การวินิจฉัย หรือการรักษาจากแพทย์หรือผู้ประกอบวิชาชีพด้านสุขภาพได้
                    </p>
                </div>

            </div>
        </footer>
    );
}
