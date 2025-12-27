"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

export default function Home() {
  const router = useRouter();

  // --- STATE ---
  const [allProperties, setAllProperties] = useState([]); // Ganti jadi Array biasa (bukan object grouping)
  const [counts, setCounts] = useState({ Rumah: 0, Apartemen: 0, Ruko: 0, Tanah: 0, Kantor: 0 });
  const [loading, setLoading] = useState(true);

  // State Filter Banner
  const [lokasi, setLokasi] = useState("Semua");
  const [tipe, setTipe] = useState("Semua");
  const [harga, setHarga] = useState("Semua");

  useEffect(() => {
    // ⚠️ JANGAN LUPA UPDATE LINK CSV DISINI
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEaBcNHYoROpb8esZ7V2Efu620J8iDtl-pv9MKNDKNKgVBpXLGFJlRkqcvm7mlFBlCX6Ylh8RFcb7p/pub?gid=0&single=true&output=csv';

    Papa.parse(SHEET_URL, {
      download: true, header: true,
      complete: (result) => {
        const data = result.data.filter(item => item.nama);
        
        // 1. SIMPAN DATA LANGSUNG (Tanpa Grouping)
        setAllProperties(data);

        // 2. LOGIKA HITUNG JUMLAH KATEGORI
        const newCounts = { Rumah: 0, Apartemen: 0, Ruko: 0, Tanah: 0, Kantor: 0 };
        data.forEach(rumah => {
          if (rumah.tipe) {
             const t = rumah.tipe;
             if (t.includes('Rumah')) newCounts.Rumah++;
             if (t.includes('Apartemen')) newCounts.Apartemen++;
             if (t.includes('Ruko')) newCounts.Ruko++;
             if (t.includes('Tanah')) newCounts.Tanah++;
             if (t.includes('Kantor')) newCounts.Kantor++;
          }
        });

        setCounts(newCounts);
        setLoading(false);
      },
      error: (err) => { console.error(err); setLoading(false); }
    });
  }, []);

  const handleSearch = () => {
    router.push(`/cari?lokasi=${lokasi}&tipe=${tipe}&harga=${harga}`);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* =========================================
          1. BANNER SECTION (GAMBAR SAJA)
      ========================================= */}
      <div className="relative bg-header h-100 md:h-[500px]">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/images/BannerFinal-mobile.png" 
            alt="Banner Property" 
            className="block md:hidden w-full h-full object-cover"
          />
          <img 
            src="/images/BannerFinal.png" 
            alt="Banner Property" 
            className="hidden md:block w-full h-full object-cover"
          />
        </div>
      </div>

      {/* =========================================
          2. SEARCH WIDGET CARD (OVERLAP BANNER)
      ========================================= */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 -mt-32 md:-mt-40 mb-16">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end text-left border border-gray-100">
          
          <div className="flex flex-col">
            <label className="text-xs text-body font-bold uppercase mb-2 tracking-wider">Lokasi</label>
            <select className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-header font-bold text-header bg-transparent cursor-pointer" onChange={(e) => setLokasi(e.target.value)}>
              <option value="Semua">Semua Area</option>
              <option value="Depok">Depok</option>
              <option value="Jakarta Selatan">Jakarta Selatan</option>
              <option value="Bekasi">Bekasi</option>
              <option value="Tangerang Selatan">Tangsel</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-body font-bold uppercase mb-2 tracking-wider">Tipe</label>
            <select className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-header font-bold text-header bg-transparent cursor-pointer" onChange={(e) => setTipe(e.target.value)}>
              <option value="Semua">Semua Tipe</option>
              <option value="Rumah">Rumah</option>
              <option value="Apartemen">Apartemen</option>
              <option value="Ruko">Ruko</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-body font-bold uppercase mb-2 tracking-wider">Harga</label>
            <select className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-header font-bold text-header bg-transparent cursor-pointer" onChange={(e) => setHarga(e.target.value)}>
              <option value="Semua">Semua Harga</option>
              <option value="<1M">&lt; 1 M</option>
              <option value="1M-2M">1 - 2 M</option>
              <option value=">2M">&gt; 2 M</option>
            </select>
          </div>

          <button onClick={handleSearch} className="w-full bg-header text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors text-sm shadow-md">
            Cari
          </button>
        </div>
      </div>

      {/* =========================================
          3. KATEGORI PROPERTI SECTION (ICONS)
      ========================================= */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-semibold text-header mb-2">Cari Semua Jenis Properti</h2>
          <p className="font-serif font-light">Jelajahi pilihan terbaik kami sesuai kebutuhan Anda</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CategoryCard icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />} title="Rumah" count={counts.Rumah} onClick={() => router.push('/cari?tipe=Rumah')} />
          <CategoryCard icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />} title="Apartemen" count={counts.Apartemen} onClick={() => router.push('/cari?tipe=Apartemen')} />
          <CategoryCard icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />} title="Kantor" count={counts.Kantor} onClick={() => router.push('/cari?tipe=Kantor')} />
          <CategoryCard icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />} title="Ruko/Usaha" count={counts.Ruko} onClick={() => router.push('/cari?tipe=Ruko')} />
          <CategoryCard icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />} title="Tanah" count={counts.Tanah} onClick={() => router.push('/cari?tipe=Tanah')} />
        </div>
      </div>

      {/* =========================================
          4. SECTION JUAL PROPERTI (CTA)
      ========================================= */}

      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">

      {/* 1. Background Image Wrapper */}
      {/* Saya ubah inset-1 jadi inset-0 agar gambar full tanpa celah putih di pinggir */}
      <div className="absolute inset-0">
        <img /*mobile*/
          src="/images/BannerLower-mobile.png" 
          alt="Jual Rumah" 
          className="block md:hidden w-full h-full object-cover object-center"
        />
        <img /*desktop*/
          src="/images/BannerLower.png" 
          alt="Jual Rumah" 
          className="hidden md:block w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-7">
      

        {/* Button: Background Putih, Teks Gelap (Kebalikan dari background) */}
        <a 
          href="/iklan" 
          className="mt-60 inline-block bg-white text-sky-800 px-8 py-3 rounded-lg font-serif font-medium hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl text-nm-lg"
        >
          Pasang Iklan Sekarang
        </a>
        
      </div>
    </div>

      {/* =========================================
          5. SECTION LISTING ALL PROPERTIES (GRID)
      ========================================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-semibold text-header mb-2">Rekomendasi Properti</h2>
          <p className="font-serif font-light">Pilihan properti terbaik untuk Anda</p>
        </div>

        {loading && (
          <div className="text-center py-20 text-body animate-pulse">Menyiapkan etalase properti...</div>
        )}

        {/* GRID UTAMA - MENAMPILKAN SEMUA PROPERTI */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allProperties.map((rumah, index) => (
              <div key={index} className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl shadow-sm border border-gray-50 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img src={rumah.gambar || "https://via.placeholder.com/400x300"} alt={rumah.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-header text-xs px-3 py-1 font-bold uppercase tracking-wider rounded-sm shadow-sm">{rumah.tipe}</div>
                </div>
                <div className="p-6 grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg text-header mb-1 font-serif leading-tight">{rumah.nama}</h2>
                    <p className="text-body text-xs uppercase tracking-wider font-bold mb-2">{rumah.kota}</p>
                    <h1 className="text-header font-serif font-bold text-2xl mb-4">{rumah.hargaDisplay}</h1>
                    <p className="text-body text-sm line-clamp-3 mb-6 leading-relaxed font-light text-gray-500">{rumah.deskripsi}</p>
                  </div>
                  <a href={`https://wa.me/${rumah.wa}?text=Info ${rumah.nama}`} target="_blank" className="w-full block text-center border border-header text-header py-3 text-xs font-bold tracking-widest uppercase hover:bg-header hover:text-white transition-colors rounded-lg">Chat Owner via WA</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TOMBOL LIHAT SEMUA (Opsional, kalau mau user eksplor lebih jauh) */}
        {!loading && allProperties.length > 0 && (
          <div className="mt-12 text-center">
             <button onClick={() => router.push('/cari')} className="inline-block border-b-2 border-header text-header pb-1 font-bold uppercase tracking-widest hover:text-brand hover:border-brand transition-colors text-sm">
                Lihat Semua Listing &rarr;
             </button>
          </div>
        )}
      </div>

    </div>
  );
}

// Komponen Card Kategori
function CategoryCard({ icon, title, count, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center text-center">
      <div className="bg-gray-50 p-4 rounded-full mb-4 group-hover:bg-brand/20 transition-colors">
        <svg className="w-8 h-8 text-header group-hover:text-header transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="font-bold text-header mb-1">{title}</h3>
      <p className="text-sm text-body font-serif font-extralight">{count} Properti tersedia</p>
    </div>
  );
}