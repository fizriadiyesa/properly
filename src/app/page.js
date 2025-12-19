"use client";
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [dataProperti, setDataProperti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLokasi, setFilterLokasi] = useState("Semua");
  const [filterTipe, setFilterTipe] = useState("Semua");
  const [filterHarga, setFilterHarga] = useState("Semua");

  useEffect(() => {
    // ⚠️ JANGAN LUPA PASTE LINK GOOGLE SHEET LU DI SINI
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEaBcNHYoROpb8esZ7V2Efu620J8iDtl-pv9MKNDKNKgVBpXLGFJlRkqcvm7mlFBlCX6Ylh8RFcb7p/pub?gid=0&single=true&output=csv';

    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (result) => {
        setDataProperti(result.data);
        setLoading(false);
      },
      error: (err) => { console.error(err); setLoading(false); }
    });
  }, []);

  const propertiDisaring = dataProperti.filter((item) => {
    if (!item.nama) return false;

    // 1. Cek Lokasi
    if (filterLokasi !== "Semua" && item.kota !== filterLokasi) return false;

    // 2. Cek Tipe
    if (filterTipe !== "Semua"){
      const tipeDiDatabase = item.tipe ? item.tipe.toLowerCase() : "";
      const tipeYangDicari = filterTipe.toLowerCase();
      if (!tipeDiDatabase.includes(tipeYangDicari)) return false;
    }

    // 3. Cek Harga
    if (filterHarga !== "Semua") {
      const harga = parseInt(item.hargaAngka) || 0;
      if (filterHarga === "<1M" && harga >= 1000000000) return false;
      if (filterHarga === "1M-2M" && (harga < 1000000000 || harga > 2000000000)) return false;
      if (filterHarga === "2M-3M" && (harga < 2000000000 || harga > 3000000000)) return false;
      if (filterHarga === "3M-4M" && (harga < 3000000000 || harga > 4000000000)) return false;
      if (filterHarga === ">4M" && harga <= 4000000000) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pb-20">
      
      {/* ❌ HERO SECTION HAPUS (Langsung masuk konten) */}
      
      <div className="max-w-6xl mx-auto px-4 pt-10">
        
        {/* FILTER BAR - Clean Minimalist */}
        {/* Shadow subtle (shadow-sm) dan rounded dikit */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <select className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterLokasi(e.target.value)}>
            <option value="Semua">📍 Semua Lokasi</option>
            <option value="Bekasi">Bekasi</option>
            <option value="Depok">Depok</option>
            <option value="Jakarta Utara">Jakarta Utara</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
            <option value="Jakarta Timur">Jakarta Timur</option>
            <option value="Jakarta Barat">Jakarta Barat</option>
            <option value="Jakarta Pusat">Jakarta Pusat</option>
            <option value="Tangerang Selatan">Tangsel</option>
            <option value="Jawa Timur">Jawa Timur</option>
          </select>
          <select className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterTipe(e.target.value)}>
            <option value="Semua">🏠 Semua Tipe</option>
            <option value="Rumah">Rumah</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Ruko">Ruko</option>
            <option value="Tanah">Tanah</option>
            <option value="Usaha">Usaha</option>  
          </select>
          <select className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterHarga(e.target.value)}>
            <option value="Semua">💰 Range Harga</option>
            <option value="<1M">Di bawah 1M</option>
            <option value="1M-2M">1M - 2M</option>
            <option value="2M-3M">2M - 3M</option>
            <option value="3M-4M">3M - 4M</option>
            <option value=">4M"> Di atas 4M</option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-body text-lg animate-pulse">Memuat data...</p>
          </div>
        )}

        {/* LISTING CARD */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {propertiDisaring.map((rumah, index) => (
              <div key={index} className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl shadow-sm border border-gray-50 flex flex-col">
                
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={rumah.gambar || "https://via.placeholder.com/400x300"} 
                    alt={rumah.nama} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Label Tipe: Simple White Tag */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-header text-xs px-3 py-1 font-bold uppercase tracking-wider rounded-sm shadow-sm">
                    {rumah.tipe}
                  </div>
                </div>
                
                {/* CONTENT */}
                <div className="p-6 grow flex flex-col justify-between">
                  <div>
                    {/* Nama Property */}
                    <h2 className=" text-header font-serif leading-tight text-lg mb-3">{rumah.nama}</h2>

                    {/* Kota */}
                    <p className="text-body text-xs uppercase tracking-wider font-bold mb-4">{rumah.kota}</p>
                    
                    {/* Harga */}
                    <h1 className="text-header font-serif font-bold text-2xl mb-4">{rumah.hargaDisplay}</h1>

                    {/* Deskripsi */}
                    <p className="text-body text-sm line-clamp-3 mb-6 leading-relaxed font-light">
                      {rumah.deskripsi}
                    </p>
                  </div>
                  
                  {/* TOMBOL: Minimalist Outline */}
                  <a 
                    href={`https://wa.me/${rumah.wa}?text=Halo, saya tertarik dengan listing ${rumah.nama}`}
                    target="_blank"
                    className="w-full block text-center border border-header text-header py-3 text-xs font-bold tracking-widest uppercase hover:bg-header hover:text-white transition-colors rounded-lg"
                  >
                    Chat Owner via WA
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}