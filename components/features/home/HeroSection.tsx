import React from 'react';
import { Search } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full gap-12">

            {/* ฝั่งซ้าย: ข้อความและช่องค้นหา */}
            <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight">
                    เลือกวิตามินและอาหารเสริมอย่างมั่นใจ <br />
                    <span className="text-green-700">ด้วยข้อมูลที่ตรวจสอบได้</span>
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                    เปรียบเทียบราคา ส่วนประกอบ รีวิว และข้อมูลทางวิทยาศาสตร์ เพื่อช่วยให้คุณเลือกผลิตภัณฑ์ที่เหมาะสมได้ง่ายขึ้น
                </p>

                {/* กล่องค้นหา */}
                <div className="flex w-full max-w-lg items-center bg-white rounded-full p-2 border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-green-500">
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อผลิตภัณฑ์ แบรนด์ หรือส่วนประกอบ"
                        className="flex-grow bg-transparent outline-none px-4 text-sm text-gray-700"
                    />
                    <button className="bg-green-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-green-800 transition">
                        <Search size={18} /> ค้นหาผลิตภัณฑ์
                    </button>
                </div>

                {/* แท็กค้นหายอดนิยม */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 mt-4">
                    <span className="mr-1">ยอดนิยม:</span>
                    {['Vitamin D3', 'Omega-3', 'Magnesium', 'CoQ10', 'Vitamin C'].map((tag) => (
                        <span key={tag} className="bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer border border-gray-200 transition">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* ฝั่งขวา: รูป Mockup (เตรียมพื้นที่ไว้ให้ใส่รูปแอป/ขวดยา) */}
            <div className="w-full md:w-1/2 flex justify-center relative">
                <div className="w-full max-w-md h-[400px] bg-gradient-to-tr from-green-50 to-green-100 rounded-3xl flex items-center justify-center border border-green-200 shadow-lg relative overflow-hidden">
                    <div className="text-center text-green-800">
                        <p className="font-bold text-lg">[ พื้นที่ใส่รูป Mockup ]</p>
                        <p className="text-sm mt-2 opacity-70">ขวดอาหารเสริม + หน้าจอ Safety Score</p>
                    </div>
                </div>
            </div>

        </section>
    );
}