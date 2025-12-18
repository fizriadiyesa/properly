"use client";

import React, { useState } from 'react';


export default function Home() {
// --- 1. DATABASE DUMMY ---
const daftarProperti = [
  {
    id: 1,
    nama: "Avyanna Cinere",
    hargaDisplay: "Rp 950 Juta",
    hargaAngka: 950000000,
    kota: "Depok",
    tipe: "Rumah",
    lokasi: "Limo, Depok",
    gambar: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    wa: "6281234567890"   
  },
  {
      id: 2,
      nama: "Shila Sawangan",
      hargaDisplay: "Rp 3.5 Miliar",
      hargaAngka: 3500000000,
      kota: "Depok",
      tipe: "Rumah",
      lokasi: "Sawangan, Depok",
      gambar: "https://images.unsplash.com/photo-1600596542815-e32cbee30d1c?auto=format&fit=crop&w=800&q=80",
      wa: "6281234567890"
    },
    {
      id: 3,
      nama: "Grand Kamala Lagoon",
      hargaDisplay: "Rp 800 Juta",
      hargaAngka: 800000000,
      kota: "Bekasi",
      tipe: "Apartemen",
      lokasi: "Bekasi Selatan",
      gambar: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      wa: "6281234567890"
    },
    {
      id: 4,
      nama: "Ruko Tebet Indah",
      hargaDisplay: "Rp 4.2 Miliar",
      hargaAngka: 4200000000,
      kota: "Jakarta Selatan",
      tipe: "Ruko",
      lokasi: "Tebet, Jakarta",
      gambar: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      wa: "6281234567890"
    },
    {
      id: 5,
      nama: "Cluster Bintaro Jaya",
      hargaDisplay: "Rp 1.5 Miliar",
      hargaAngka: 1500000000,
      kota: "Tangerang Selatan",
      tipe: "Rumah",
      lokasi: "Bintaro Sektor 9",
      gambar: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      wa: "6281234567890"
    }
];


// --- 2. STATE (Ini Ingatan Sementara Web) ---
const [filterLokasi, setFilterLokasi] = useState("Semua");
const [filterHarga, setFilterHarga] = useState("Semua");
const [filterTipe, setFilterTipe] = useState("Semua");


// --- 3. LOGIKA FILTER ---
const propertiDisaring = daftarProperti.filter((item) => {
  //Cek Lokasi
  if (filterLokasi !== "Semua" && item.kota !== filterLokasi) return false;

  //Cek Tipe
  if (filterTipe !== "Semua" && item.tipe!== filterTipe) return false;

  //Cek Harga (Logika Range)
  if(filterHarga !== "Semua") {
    const harga = item.hargaAngka;
    if (filterHarga === "<1M" && harga >= 1000000000) return false;
    if (filterHarga === "1M-2M" && (harga < 1000000000 || harga >= 2000000000)) return false;
    if (filterHarga === "2M-3M" && (harga < 1200000000 || harga >= 3000000000)) return false;
    if (filterHarga === "3M-4M" && (harga < 3000000000 || harga >= 4000000000)) return false;
    if (filterHarga === ">4M" && harga <= 4000000000) return false;
  }

  return true; //Lolos semua filter

});


// --- 4. TAMPILAN UI ---
return (
    <div className="min-h-screen bg-gray-50 pb-10">

      <div className="max-w-4xl mx-auto px-4">
        
        {/* BAGIAN FILTER CONTROL */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Dropdown Lokasi */}
          <select 
            className="border p-2 rounded w-full" 
            onChange={(e) => setFilterLokasi(e.target.value)}
          >
            <option value="Semua">Semua Lokasi</option>
            <option value="Depok">Depok</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
            <option value="Bekasi">Bekasi</option>
            <option value="Tangerang Selatan">Tangerang Selatan</option>
          </select>

          {/* Dropdown Tipe */}
          <select 
            className="border p-2 rounded w-full"
            onChange={(e) => setFilterTipe(e.target.value)}
          >
            <option value="Semua">Semua Tipe</option>
            <option value="Rumah">Rumah</option>
            <option value="Apartemen">Apartemen</option>
            <option value="Ruko">Ruko</option>
          </select>

          {/* Dropdown Harga */}
          <select 
            className="border p-2 rounded w-full"
            onChange={(e) => setFilterHarga(e.target.value)}
          >
            <option value="Semua">Semua Harga</option>
            <option value="<1M">Di bawah 1M</option>
            <option value="1M-2M">1M - 2M</option>
            <option value="2M-3M">2M - 3M</option>
            <option value="3M-4M">3M - 4M</option>
            <option value=">4M">Di atas 4M</option>
          </select>
        </div>

        {/* HASIL PENCARIAN */}
        <p className="mb-4 text-gray-600">Ditemukan {propertiDisaring.length} properti:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propertiDisaring.map((rumah) => (
            <div key={rumah.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              
              <div className="relative">
                <img src={rumah.gambar} alt={rumah.nama} className="w-full h-48 object-cover"/>
                <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">
                  {rumah.tipe}
                </span>
              </div>
              
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-800">{rumah.nama}</h2>
                <p className="text-gray-500 text-sm mb-2">{rumah.lokasi}</p>
                <p className="font-bold text-xl text-teal-700 mb-4">{rumah.hargaDisplay}</p>
                
                <a 
                  href={`https://wa.me/${rumah.wa}?text=Halo, saya tertarik dengan ${rumah.nama} di ${rumah.lokasi}`}
                  target="_blank"
                  className="block text-center border border-teal-600 text-teal-600 py-2 rounded font-semibold hover:bg-teal-600 hover:text-white transition-colors"
                >
                  Chat Owner via WA
                </a>
              </div>
            </div>
          ))}
          
          {/* Kalau gak ada hasil */}
          {propertiDisaring.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              Yah, properti yang lu cari gak ada Bro. Coba ganti filter lain.
            </div>
          )}

        </div>

      </div>
    </div>
  );



}


