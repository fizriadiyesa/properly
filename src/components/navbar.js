"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NAVBAR ATAS: Clean White */}
      {/* Tambahin 'relative' di sini biar logonya patuh sama kotak ini */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-5 sticky top-0 z-50 flex items-center justify-between relative h-20 md:h-24">
        
        {/* 1. KIRI: Hamburger Icon (Kasih z-10 biar gak ketutup layer logo) */}
        <div className="flex-none z-10">
          <button onClick={() => setIsOpen(true)} className="p-2 text-header hover:opacity-70 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* 2. TENGAH: LOGO (Absolute Center) */}
        {/* Trik: left-1/2 geser ke tengah, -translate-x-1/2 geser balik setengah ukuran logo biar presisi */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href="/">
            <img 
              src="/images/Logo.png" 
              alt="Properly Logo" 
              className="h-8 md:h-17 w-auto object-contain"
            />
          </Link>
        </div>

        {/* 3. KANAN: TOMBOL (Flex-none & z-10) */}
        <div className="flex items-center gap-3 flex-none z-10">
          
          {/* Tombol Pasang Iklan */}
          <a 
            href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20pasang%20iklan"
            target="_blank"
            className="hidden md:flex items-center gap-2 outline-1 outline-sky-900 text-sky-900 px-4 py-2 rounded-lg hover:bg-sky-900 hover:text-white transition-all shadow-sm text-sm font-serif font-medium tracking-wide"
          >
            {/* Icon Megaphone */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Pasang Iklan
          </a>

          {/* Tombol Cari (Versi Mobile cuma icon, Desktop teks) */}
          <Link 
            href="/cari"
            className="flex items-center gap-2 bg-sky-900 text-white px-3 py-2 rounded-lg transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="hidden md:block  text-sm font-serif font-medium tracking-wide">
                Cari Properti
            </span>
          </Link>

        </div>

      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* SIDEBAR / SLIDE MENU */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-8 flex justify-between items-center border-b border-gray-100">
          <span className="font-serif font-bold text-xl text-header tracking-widest">MENU</span>
          <button onClick={() => setIsOpen(false)} className="text-header hover:opacity-50 transition-opacity text-2xl">✕</button>
        </div>

        <nav className="p-8 flex flex-col space-y-6">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-header font-sans font-bold text-lg hover:translate-x-2 transition-transform tracking-wide flex items-center gap-3">
             Home
          </Link>
          <Link href="/cari" onClick={() => setIsOpen(false)} className="text-header font-sans font-bold text-lg hover:translate-x-2 transition-transform tracking-wide flex items-center gap-3">
             Cari Properti
          </Link>
          <Link href="/iklan" onClick={() => setIsOpen(false)} className="text-header font-sans font-bold text-lg hover:translate-x-2 transition-transform tracking-wide flex items-center gap-3">
             Pasang Iklan
          </Link>
          <div className="border-t border-gray-100 my-4"></div>
          <div className="text-xs text-body uppercase tracking-widest text-center opacity-60">
            Properly House © 2025
          </div>
        </nav>
      </div>
    </>
  );
}