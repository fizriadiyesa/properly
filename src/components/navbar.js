"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NAVBAR ATAS: Clean White */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-5 sticky top-0 z-50 flex items-center justify-between">
        
        {/* Hamburger Icon */}
        <button onClick={() => setIsOpen(true)} className="p-2 text-header hover:opacity-70 transition-opacity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* LOGO */}
        <div className="text-2xl font-serif font-bold text-header tracking-tight">
            PROPERLY<span className="text-brand">.</span>
        </div>

        <div className="w-8"></div> 
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
        
        {/* Header Sidebar: Putih Bersih */}
        <div className="p-8 flex justify-between items-center border-b border-gray-100">
          <span className="font-serif font-bold text-xl text-header tracking-widest">MENU</span>
          <button onClick={() => setIsOpen(false)} className="text-header hover:opacity-50 transition-opacity text-2xl">✕</button>
        </div>

        {/* List Menu */}
        <nav className="p-8 flex flex-col space-y-6">
          
          <Link href="/" onClick={() => setIsOpen(false)} className="text-header font-sans font-bold text-lg hover:translate-x-2 transition-transform tracking-wide flex items-center gap-3">
             Home
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