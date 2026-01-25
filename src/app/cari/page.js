"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import Papa from "papaparse";
import { useSearchParams } from 'next/navigation';

// 1. Fungsi Helper: Membersihkan harga jadi angka murni
const cleanHarga = (hargaString) => {
  if (!hargaString) return 0;
  // Hapus semua karakter kecuali angka
  const numbersOnly = hargaString.toString().replace(/[^0-9]/g, ''); 
  return parseInt(numbersOnly) || 0;
};

function SearchContent() {
    const searchParams = useSearchParams();

    const [dataProperti, setDataProperti] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterLokasi, setFilterLokasi] = useState(searchParams.get('lokasi') || "Semua");
    const [filterTipe, setFilterTipe] = useState(searchParams.get('tipe') || "Semua");
    const [filterHarga, setFilterHarga] = useState(searchParams.get('harga') || "Semua");

    // Fetch Data
    useEffect(() => {
        const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSEaBcNHYoROpb8esZ7V2Efu620J8iDtl-pv9MKNDKNKgVBpXLGFJlRkqcvm7mlFBlCX6Ylh8RFcb7p/pub?gid=0&single=true&output=csv";

        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            complete: (results) => {
                const data = results.data.filter(item => item.nama);
                setDataProperti(data);
                
                // --- DEBUGGING HARGA (Cek Console Browser) ---
                if (data.length > 0) {
                    console.log("Cek Kolom Harga:", data[0]); 
                    console.log("Harga Raw:", data[0].harga); // Pastikan ini tidak undefined
                    console.log("Harga Clean:", cleanHarga(data[0].harga));
                }
                
                setLoading(false);
            },
            error: (error) => {
                console.error("Error fetching CSV:", error);
                setLoading(false);
            }
        });
    }, []);

    const listProvinsi = useMemo(() => {
      const rawProvinsi = dataProperti.map(item => item.provinsi);
      const distinctProvinsi = [...new Set(rawProvinsi.filter(p => p && p.trim() !== ""))];
      return distinctProvinsi.sort();
    }, [dataProperti]);

    // --- LOGIC FILTERING (REVISI POSITIVE LOGIC) ---
    const propertiDisaring = dataProperti.filter((item) => {
      // 1. Validasi
      if(!item.nama) return false;

      // 2. Filter Lokasi
      if(filterLokasi !== "Semua"){
        const isKotaMatch = item.kota === filterLokasi;
        const isProvinsiMatch = item.provinsi && item.provinsi === filterLokasi;
        if(!isKotaMatch && !isProvinsiMatch) return false;
      }

      // 3. Filter Tipe
      if(filterTipe !== "Semua"){
         if(item.tipe !== filterTipe) return false;
      }

      // 4. Filter Harga (LOGIC BARU)
      if (filterHarga !== "Semua") {
          // PENTING: Pastikan 'item.harga' sesuai dengan nama header di CSV (Case Sensitive!)
          // Kalau header di CSV 'Harga', ganti jadi item.Harga
          const harga = cleanHarga(item.harga); 
          
          // Kalau harga 0 atau error, sembunyikan (karena sedang difilter harga)
          if (harga === 0) return false;

          // Gunakan Positive Logic: "Jika cocok, return true"
          if (filterHarga === "<1M") return harga < 1000000000;
          if (filterHarga === "1M-2M") return harga >= 1000000000 && harga <= 2000000000;
          if (filterHarga === "2M-3M") return harga > 2000000000 && harga <= 3000000000;
          if (filterHarga === "3M-4M") return harga > 3000000000 && harga <= 4000000000;
          if (filterHarga === ">4M") return harga > 4000000000;
          
          // Kalau tidak ada yang cocok dengan kriteria harga di atas
          return false;
      }

      return true; // Lolos semua filter
    });

    return (
    <div className="min-h-screen pt-10 pb-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-serif text-header mb-8 font-bold">Hasil Pencarian Properti</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <select 
            value={filterLokasi} 
            className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" 
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
              <option value="Tangerang Selatan">Tangerang Selatan</option>
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

          <select value={filterTipe} className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterTipe(e.target.value)}>
            <option value="Semua">🏠 Semua Tipe</option>
            <option value="Rumah">Rumah</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Ruko">Ruko</option>
            <option value="Tanah">Tanah</option>
            <option value="Kantor">Kantor</option>
          </select>

          {/* FILTER HARGA - SUDAH DIPERBAIKI TYPO NYA */}
          <select value={filterHarga} className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterHarga(e.target.value)}>
            <option value="Semua">💰 Range Harga</option>
            <option value="<1M">Di Bawah 1M</option>
            <option value="1M-2M">1M - 2M</option>
            <option value="2M-3M">2M - 3M</option>
            <option value="3M-4M">3M - 4M</option>
            <option value="4M">Di Atas 4M</option>
          </select>
        </div>

        {loading && (
             <div className="text-center py-20 text-body animate-pulse">Sedang mencari properti terbaik...</div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {propertiDisaring.map((rumah, index) => (
              <div key={index} className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl shadow-sm border border-gray-50 flex flex-col">
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

                <div className="p-6 grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg text-header mb-1 font-serif leading-tight">{rumah.nama}</h2>
                    <p className="text-body text-xs uppercase tracking-wider font-bold mb-2">{rumah.kota}</p>
                    <h1 className="text-header font-serif font-bold text-2xl mb-4">{rumah.hargaDisplay}</h1>
                    <p className="text-body text-sm line-clamp-3 mb-6 leading-relaxed font-light text-gray-500">{rumah.deskripsi}</p>
                  </div>

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
            
            {!loading && propertiDisaring.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-xl text-header font-serif font-bold mb-2">Tidak Ditemukan</p>
                    <p className="text-gray-500">Coba ubah filter lokasi atau range harga Anda.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CariPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}