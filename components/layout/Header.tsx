'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
    const scrollToEarlyAccess = (e: React.MouseEvent) => {
        const el = document.getElementById('early-access');
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth' });
            window.location.hash = 'early-access';
        }
    };

    return (
        <div className="font-sans text-gray-900">
            {/* Header Navigation */}
            <header className="bg-white/95 backdrop-blur-md flex justify-between items-center p-4 md:px-10 border-b border-gray-100 sticky top-0 z-50 shadow-sm shadow-slate-200/50">
                
                {/* Logo with Link to Home Page (Bottom-Up animation trigger) */}
                <Link
                    href="/?from=logo"
                    className="text-2xl font-extrabold text-green-700 flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer"
                >
                    <img
                        src="/nutritrust_icon.jpg"
                        alt="NutriTrust Logo"
                        className="w-9 h-9 rounded-full border border-emerald-200/80 shadow-xs object-cover p-0.5 bg-white shrink-0"
                    />
                    <span>NutriTrust</span>
                </Link>

                <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                    <Link href="/products?from=nav" className="hover:text-green-700 transition font-semibold">
                        Products
                    </Link>
                    <Link href="/compare" className="hover:text-green-700 transition font-semibold">
                        Compare
                    </Link>
                    <a href="#early-access" onClick={scrollToEarlyAccess} className="hover:text-green-700 transition">
                        Health Guides
                    </a>
                    <a href="#early-access" onClick={scrollToEarlyAccess} className="hover:text-green-700 transition">
                        About Us
                    </a>
                </nav>

                {/* Join Early Access Button */}
                <Link
                    href="/survey"
                    className="bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                    Join Early Access
                </Link>
            </header>
        </div>
    );
}