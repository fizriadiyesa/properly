"use client";

import React, {useState, useEffect} from 'react';
import Papa from 'papaparse'; // Ini alat baca Excel/CSV nya

export default function Home() {
    // --- 1. STATE ---
    const [dataProperti, setDataProperti] = useState([]); // Wadah data kosong
    const [loading, setLoading] = useState(true); //Status laoding

    const [filterLokasi, setFilterLokasi] = useState("Semua");
    const [filterHarga, setFilterHarga] = useState("Semua");
    const [filterTipe, setFilterTipe] = useState("Semua");

    // --- 2. AMBIL DATA DARI GOOGLE SHEETS ---
    useEffect(() => {
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEaBcNHYoROpb8esZ7V2Efu620J8iDtl-pv9MKNDKNKgVBpXLGFJlRkqcvm7mlFBlCX6Ylh8RFcb7p/pub?gid=0&single=true&output=csv'

        Papa.parse(SHEET_URL, {
            download: true,
            header: true, // Baca baris pertama sebagai nama kolom
            complete: (result) => {
                // Ketika data berhasil ditarik:
                setDataProperti(result.data);
                setLoading(false); // Matikan loading
            },
            error: (err) => {
                console.error("Gagal menarik data:", err);
                setLoading(false);
            }
        });
    },[]);

    // --- 3. LOGIKA FILTER ---
    const propertiDisaring = dataProperti.filter((item) => {
        // Pastikan item.nama ada isinya biar gak error
        if (!item.nama) return false;

        // Cek Lokasi
        if (filterLokasi !== "Semua" && item.kota !== filterLokasi) return false;

        // Cek Tipe
        if (filterTipe !== "Semua" && item.tipe !== filterTipe) return false;

        // Cek Harga
        if (filterHarga !== "Semua"){
            const harga = parseInt(item.hargaAngka); // Ubah teks sheet jadi angka
            if (filterHarga === "<1M" && harga >= 1000000000) return false;
            if (filterHarga === "1M-2M" && (harga < 1000000000 || harga > 2000000000)) return false;
            if (filterHarga === "2M-3M" && (harga < 2000000000 || harga > 3000000000)) return false;
            if (filterHarga === "3M-4M" && (harga < 3000000000 || harga > 4000000000)) return false;
            if (filterHarga === ">4M" && harga <= 4000000000) return false;
        }

        return true;
    });

    // --- 4. TAMPILAN ---
    return (
    <div className="min-h-screen bg-gray-50 pb-10">
      
      {/* Container Utama */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        
        {/* BAGIAN FILTER CONTROL */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border p-2 rounded w-full" onChange={(e) => setFilterLokasi(e.target.value)}>
            <option value="Semua">Semua Lokasi</option>
            <option value="Depok">Depok</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
            <option value="Bekasi">Bekasi</option>
            <option value="Tangerang Selatan">Tangerang Selatan</option>
          </select>

          <select className="border p-2 rounded w-full" onChange={(e) => setFilterTipe(e.target.value)}>
            <option value="Semua">Semua Tipe</option>
            <option value="Rumah">Rumah</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Ruko">Ruko</option>
          </select>

          <select className="border p-2 rounded w-full" onChange={(e) => setFilterHarga(e.target.value)}>
            <option value="Semua">Semua Harga</option>
            <option value="<1M">Di bawah 1M</option>
            <option value="1M-2M">1M - 2M</option>
            <option value="2M-3M">2M - 3M</option>
            <option value="3M-4M">3M - 4M</option>
            <option value=">4M">Di atas 4M</option>
          </select>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-teal-600 font-bold animate-pulse">Sedang mengambil data properti terbaru...</p>
          </div>
        )}

        {/* HASIL PENCARIAN */}
        {!loading && (
          <>
            <p className="mb-4 text-gray-600">Ditemukan {propertiDisaring.length} properti:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {propertiDisaring.map((rumah, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  
                  <div className="relative">
                    {/* Fallback kalau gambar error/kosong */}
                    <img 
                      src={rumah.gambar || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={rumah.nama} 
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">
                      {rumah.tipe}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <h2 className="font-bold text-lg text-gray-800">{rumah.nama}</h2>
                    <p className="text-gray-500 text-sm mb-2">{rumah.lokasi}</p>
                    <p className="text-gray-500 text-sm mb-2">{rumah.deskripsi}</p>
                    <p className="font-bold text-xl text-teal-700 mb-4">{rumah.hargaDisplay}</p>
                    
                    <a 
                      href={`https://wa.me/${rumah.wa}?text=Halo, saya tertarik dengan ${rumah.nama}`}
                      target="_blank"
                      className="block text-center border border-teal-600 text-teal-600 py-2 rounded font-semibold hover:bg-teal-600 hover:text-white transition-colors"
                    >
                      Chat Owner via WA
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {propertiDisaring.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                Yah, properti yang kamu cari belum ada.
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}




