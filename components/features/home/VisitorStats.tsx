import React from 'react';
import { Users, Search } from 'lucide-react';

export default function VisitorStats() {
    // สมมติตัวเลข Mockup ไว้ก่อน (ของจริงเดี๋ยวเราค่อยเขียน API ดึงจาก Fastify หรือ Google Analytics)
    const stats = {
        visitors: "1,248",
        searches: "3,892"
    };

    return (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="bg-green-700 rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-white">

                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold mb-1">ร่วมเป็นส่วนหนึ่งของ NutriTrust</h3>
                    <p className="text-green-100 text-sm">แพลตฟอร์มที่คนไทยเลือกใช้เพื่อสุขภาพที่ดีกว่า</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {/* การ์ด: จำนวนผู้เข้าชม */}
                    <div className="flex-1 md:w-48 bg-white/10 rounded-xl p-4 border border-green-600/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-green-200 mb-2">
                            <Users size={18} />
                            <span className="text-xs font-medium uppercase tracking-wider">ผู้ใช้งานระบบ</span>
                        </div>
                        <div className="text-3xl font-extrabold">{stats.visitors} <span className="text-sm font-normal text-green-200">คน</span></div>
                    </div>

                    {/* การ์ด: จำนวนการค้นหา (search_product) */}
                    <div className="flex-1 md:w-48 bg-white/10 rounded-xl p-4 border border-green-600/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-green-200 mb-2">
                            <Search size={18} />
                            <span className="text-xs font-medium uppercase tracking-wider">การค้นหาผลิตภัณฑ์</span>
                        </div>
                        <div className="text-3xl font-extrabold">{stats.searches} <span className="text-sm font-normal text-green-200">ครั้ง</span></div>
                    </div>
                </div>

            </div>
        </section>
    );
}