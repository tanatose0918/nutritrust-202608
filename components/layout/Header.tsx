// import React from 'react';
import { ShieldCheck } from 'lucide-react'; // แนะนำให้ลง npm install lucide-react สำหรับไอคอน


export default function Header() {
    return (
        <div className="font-sans text-gray-900">
            {/* 1. Header Navigation [cite: 322] */}
            <header className="bg-white flex justify-between items-center p-4 md:px-10 border-b border-gray-100 sticky top-0 bg-white z-50">
                <div className="text-2xl font-extrabold text-green-700 flex items-center gap-2">
                    <ShieldCheck className="text-green-600" size={28} />
                    NutriTrust
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                    <a href="#" className="hover:text-green-700 transition">Products</a>
                    <a href="#" className="hover:text-green-700 transition">Compare</a>
                    <a href="#" className="hover:text-green-700 transition">Health Guides</a>
                    <a href="#" className="hover:text-green-700 transition">About Us</a>
                </nav>
                <button className="bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800 transition shadow-sm">
                    Join Early Access
                </button>
            </header>
        </div>
    );
}