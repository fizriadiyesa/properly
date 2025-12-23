"use client";
import React, {useState, useEffect, Suspense} from "react";
import Papa from "papaparse";
import { useSearchParams } from 'next/navigation';

// Komponen utama untuk baca URL parameter
function SearchContent () {
    const searchParams = useSearchParams(); // Untuk nangkep filter dari Home

    const [dataProperti, setDataProperti] = useState([]);
    const [loading, setLoading] = useState(true);

    // Set default filter sesuai kiriman dari Home (kalau ada), kalau gak ada default "Semua"
    const [filterLokasi, setFilterLokasi] = useState(searchParams.get('lokasi')||"Semua");
    const [filterTipe, setFilterTipe] = useState(searchParams.get('tipe')||"Semua");
    const [filterHarga, setFilterHarga] = useState(searchParams.get('harga')||"Semua");

    // Fungsi untuk fetch dan parse CSV
    useEffect(() => {
        const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSEaBcNHYoROpb8esZ7V2Efu620J8iDtl-pv9MKNDKNKgVBpXLGFJlRkqcvm7mlFBlCX6Ylh8RFcb7p/pub?gid=0&single=true&output=csv";

        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            complete: (results) => {
                setDataProperti(results.data);
                setLoading(false);
            },
            error: (error) => {
                console.error("Error fetching or parsing CSV:", error);
                setLoading(false);
            }
        });

    }, []);

    const propertiDisaring = dataProperti.filter((item) => {
        if(!item.nama) return false;
        if(filterLokasi !== "Semua" && item.kota !== filterLokasi) return false;

        // Logic Includes (Rumah, Ruko)
        if(filterTipe !== "Semua"){
            const tipeDiDatabase = item.tipe ? item.tipe.toLowerCase() : "";
            const tipeDicari = filterTipe.toLowerCase();
            if(!tipeDiDatabase.includes(tipeDicari)) return false;
        }

        if (filterHarga !== "Semua") {
            const harga = parseInt(item.hargaAngka) || 0;
            if (filterHarga == "Di Bawhah 1M" && harga >= 1000000000) return false;
            if (filterHarga == "1M-2M" && (harga < 1000000000 || harga > 2000000000)) return false;
            if (filterHarga == "2M-3M" && (harga < 2000000000 || harga > 3000000000)) return false;
            if (filterHarga == "3M-4M" && (harga < 3000000000 || harga > 4000000000)) return false;
            if (filterHarga == "Di Atas 4M" && harga <= 4000000000) return false;
        }
        return true;
    })

    return (
    <div className="min-h-screen pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-serif text-header mb-8">Hasil Pencarian Properti</h1>
        
        {/* FILTER BAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <select value={filterLokasi} className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterLokasi(e.target.value)}>
            <option value="Semua">📍 Semua Lokasi</option>
            <option value="Depok">Depok</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
            <option value="Bekasi">Bekasi</option>
            <option value="Tangerang Selatan">Tangsel</option>
          </select>
          <select value={filterTipe} className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterTipe(e.target.value)}>
            <option value="Semua">🏠 Semua Tipe</option>
            <option value="Rumah">Rumah</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Ruko">Ruko</option>
            <option value="Tanah">Tanah</option>
          </select>
          <select value={filterHarga} className="bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-header text-header font-sans font-bold cursor-pointer" onChange={(e) => setFilterHarga(e.target.value)}>
            <option value="Semua">💰 Range Harga</option>
            <option value="<1M">Di bawah 1M</option>
            <option value="1M-2M">1M - 2M</option>
            <option value="2M-3M">2M - 3M</option>
            <option value=">4M">Di atas 4M</option>
          </select>
        </div>

        {loading && <p className="text-center animate-pulse">Sedang mencari...</p>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {propertiDisaring.map((rumah, index) => (
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
            {propertiDisaring.length === 0 && <p className="text-center col-span-full text-gray-400">Properti tidak ditemukan.</p>}
          </div>
        )}
      </div>
    </div>
  );
}


// Wrapper untuk ubah URL parameter
export default function CariPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
