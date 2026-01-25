"use client";
import React, { useState, useEffect, useMemo } from 'react'; // Tambah useMemo
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

// 1. Fungsi Helper buat bersihin harga (Taruh di luar component)
const cleanHarga = (hargaString) => {
  if (!hargaString) return 0;
  const numbersOnly = hargaString.toString().replace(/[^0-9]/g, ''); 
  return parseInt(numbersOnly) || 0;
};

export default function Home() {
  const router = useRouter();

  // --- STATE ---
  const [allProperties, setAllProperties] = useState([]);
  const [counts, setCounts] = useState({ Rumah: 0, Apartemen: 0, Ruko: 0, Tanah: 0, Kantor: 0 });
  const [loading, setLoading] = useState(true);

  // State Filter
  const [filterLokasi, setFilterLokasi] = useState("Semua");
  const [filterTipe, setFilterTipe] = useState("Semua");
  const [filterHarga, setFilterHarga] = useState("Semua");

  useEffect(() => {
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEaBcNHYoROpb8esZ7V2Efu620J8iDtl-pv9MKNDKNKgVBpXLGFJlRkqcvm7mlFBlCX6Ylh8RFcb7p/pub?gid=0&single=true&output=csv';

    Papa.parse(SHEET_URL, {
      download: true, header: true,
      complete: (result) => {
        const data = result.data.filter(item => item.nama);
        setAllProperties(data);

        // Hitung Kategori
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

  // 2. PERBAIKAN HANDLE SEARCH (Sesuaikan nama variabel)
  const handleSearch = () => {
    // Pakai 'filterLokasi', bukan 'lokasi'
    router.push(`/cari?lokasi=${filterLokasi}&tipe=${filterTipe}&harga=${filterHarga}`);
  };

  // --- LOGIC: Ambil List Provinsi Unik ---
  const listProvinsi = useMemo(() => {
    const rawProvinsi = allProperties.map(item => item.provinsi);
    const distinctProvinsi = [...new Set(rawProvinsi.filter(p => p && p.trim() !== ""))];
    return distinctProvinsi.sort();
  }, [allProperties]);

  // 3. LOGIC FILTER UTAMA (Ini yang tadinya hilang)
  const filteredProperties = allProperties.filter((rumah) => {
    // A. Filter Lokasi (Cek Kota ATAU Provinsi)
    const matchLokasi = filterLokasi === "Semua" || 
                        rumah.kota === filterLokasi || 
                        (rumah.provinsi && rumah.provinsi === filterLokasi);

    // B. Filter Tipe
    const matchTipe = filterTipe === "Semua" || rumah.tipe === filterTipe;
    
    // C. Filter Harga (LOGIC BARU & AMAN)
    let matchHarga = true; // Default lolos kalau "Semua"
    
    if (filterHarga !== "Semua") {
      const harga = cleanHarga(rumah.harga); // Pastikan function cleanHarga ada di atas component

      // Kalau data harga error/0, anggap GAK MATCH
      if (harga === 0) {
        matchHarga = false;
      } else {
        // Cek Range
        if (filterHarga === "<1M") matchHarga = harga < 1000000000;
        else if (filterHarga === "1M-2M") matchHarga = harga >= 1000000000 && harga <= 2000000000;
        else if (filterHarga === "2M-3M") matchHarga = harga > 2000000000 && harga <= 3000000000;
        else if (filterHarga === "3M-4M") matchHarga = harga > 3000000000 && harga <= 4000000000;
        else if (filterHarga === ">4M") matchHarga = harga > 4000000000;
      }
    }

    return matchLokasi && matchTipe && matchHarga;
    });

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. BANNER */}
      <div className="relative bg-header h-100 md:h-[500px]">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/images/BannerFinal-mobile.png" alt="Banner Property" className="block md:hidden w-full h-full object-cover"/>
          <img src="/images/BannerFinal.png" alt="Banner Property" className="hidden md:block w-full h-full object-cover"/>
        </div>
      </div>

      {/* 2. SEARCH WIDGET */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 -mt-32 md:-mt-40 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 items-end">
          
          {/* Filter Lokasi */}
          <div className="flex flex-col">
            <label className="text-xs text-body font-bold uppercase mb-2 tracking-wider">Lokasi</label>
            <select 
                value={filterLokasi} 
                className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" 
                onChange={(e) => setFilterLokasi(e.target.value)}
            >
                <option value="Semua">📍 Semua Lokasi</option>
                <optgroup label="Kota Populer">
                <option value="Jakarta Selatan">Jakarta Selatan</option>
                <option value="Jakarta Timur">Jakarta Timur</option>
                <option value="Jakarta Utara">Jakarta Utara</option>
                <option value="Jakarta Barat">Jakarta Barat</option>
                <option value="Jakarta Pusat">Jakarta Pusat</option>
                <option value="Depok">Depok</option>
                <option value="Bekasi">Bekasi</option>
                <option value="Tangerang">Tangerang</option>
                <option value="Tangerang Selatan">Tangsel</option>
                <option value="Bogor">Bogor</option>
                </optgroup>
                {listProvinsi.length > 0 && (
                <optgroup label="Provinsi & Area Lainnya">
                    {listProvinsi.map((prov, index) => (
                    <option key={index} value={prov}>{prov}</option>
                    ))}
                </optgroup>
                )}
            </select>
          </div>

          {/* Filter Tipe */}
          <div className="flex flex-col">
            <label className="text-xs text-body font-bold uppercase mb-2 tracking-wider">Tipe</label>
            <select value={filterTipe} className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterTipe(e.target.value)}>
                <option value="Semua">🏠 Semua Tipe</option>
                <option value="Rumah">Rumah</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Ruko">Ruko</option>
                <option value="Tanah">Tanah</option>
                <option value="Kantor">Kantor</option>
            </select>
          </div>

          {/* Filter Harga */}
          <div className="flex flex-col">
             <label className="text-xs text-body font-bold uppercase mb-2 tracking-wider">Harga</label>
             <select value={filterHarga} className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterHarga(e.target.value)}>
                <option value="Semua">💰 Range Harga</option>
                <option value="<1M">Di Bawah 1M</option>
                <option value="1M-2M">1M - 2M</option>
                <option value="2M-3M">2M - 3M</option>
                <option value="3M-4M">3M - 4M</option>
                <option value=">4M">Di Atas 4M</option>
            </select>
          </div>

          {/* Tombol Cari */}
          <button onClick={handleSearch} className="bg-header text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors text-xs h-12 shadow-md">
            Cari Detail
          </button>

        </div>
      </div>

      {/* 3. KATEGORI (Icons) */}
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

      {/* 4. CTA IKLAN */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
            <img src="/images/BannerLower-mobile.png" alt="Jual Rumah" className="block md:hidden w-full h-full object-cover object-center"/>
            <img src="/images/BannerLower.png" alt="Jual Rumah" className="hidden md:block w-full h-full object-cover object-center"/>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-7">
            <a href="/iklan" className="mt-60 inline-block bg-white text-sky-800 px-8 py-3 rounded-lg font-serif font-medium hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl text-nm-lg">
            Pasang Iklan Sekarang
            </a>
        </div>
      </div>

      {/* 5. GRID UTAMA (HASIL FILTER) */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-semibold text-header mb-2">Rekomendasi Properti</h2>
          <p className="font-serif font-light">Pilihan properti terbaik untuk Anda</p>
        </div>

        {loading && <div className="text-center py-20 text-body animate-pulse">Menyiapkan etalase properti...</div>}

        {/* 4. PENTING: Map ke 'filteredProperties', BUKAN 'allProperties' */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map((rumah, index) => (
              <div key={index} className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl shadow-sm border border-gray-50 flex flex-col">
                
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={rumah.gambar} 
                    alt={rumah.nama}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://placehold.co/600x400?text=Foto+Tidak+Tersedia";
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-header text-xs px-3 py-1 font-bold uppercase tracking-wider rounded-sm shadow-sm">
                    {rumah.tipe}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg text-header mb-1 font-serif leading-tight">{rumah.nama}</h2>
                    <p className="text-body text-xs uppercase tracking-wider font-bold mb-2">{rumah.kota}</p>
                    <h1 className="text-header font-serif font-bold text-2xl mb-4">{rumah.hargaDisplay}</h1>
                    <p className="text-body text-sm line-clamp-3 mb-6 leading-relaxed font-light text-gray-500">
                      {rumah.deskripsi}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <a 
                      href={`https://wa.me/${rumah.wa}?text=Info ${rumah.nama}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-header text-header py-3 text-[10px] md:text-xs font-bold tracking-widest uppercase hover:bg-header hover:text-white transition-colors rounded-lg group/btn"
                    >
                      <svg className="w-4 h-4 fill-current transition-transform group-hover/btn:scale-110" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chat Owner
                    </a>
                    <a 
                      href={rumah.instagramUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-gray-100 text-header py-3 text-[10px] md:text-xs font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors rounded-lg group/ig"
                    >
                      <svg className="w-4 h-4 fill-current transition-transform group-hover/ig:scale-110" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Detail
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Tidak ada properti yang cocok dengan filter Anda.
          </div>
        )}

        {!loading && filteredProperties.length > 0 && (
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