"use client";

import { useState } from "react";
import Link from "next/link"; // Ini pengganti tag <a> biar gak reload page

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Status menu: buka/tutup

    return (
        <>
        {/* 1. TOP BAR (Selalu Muncul) */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-50 flex items-center justify-between">
            
            {/* Tombol Hamburger */}
            <button onClick={() => setIsOpen(true)} className="p-2">
                {/* Ikon Garis Tiga (SVG) */}
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        
            {/* Logo Tengah */}
            <div className="text-xl font-bold text-teal-600">
                Properly
            </div>

            {/* Ikon User/Share (Hiasan doang biar mirip) */}
            <div className="w-8"></div> 
        </div>

        {/* 2. OVERLAY GELAP (Kalau menu kebuka, background jadi gelap) */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={()=> setIsOpen(false)} // Klik gelap buat tutup
            ></div>
        )}

        {/* 3. SIDEBAR / DRAWER NYA */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            {/* Header Sidebar */}
            <div className="p-5 border-b flex justify-between items-center bg-teal-600 text-white">
            <span className="font-bold text-lg">Menu</span>
            <button onClick={() => setIsOpen(false)}>X</button>
            </div>

            {/* List Menu */}
            <nav className="p-4 flex flex-col space-y-2">
            
            <Link href="/" onClick={() => setIsOpen(false)} className="p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700">
                Cari Properti
            </Link>
            
            <Link href="/iklan" onClick={() => setIsOpen(false)} className="p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700">
                Iklankan Properti
            </Link>

            <div className="border-t my-2"></div>
            
            <div className="p-3 text-sm text-gray-400">
                Versi 1.0.0 (MVP)
            </div>

            </nav>
        </div>    
    </>
    );
}