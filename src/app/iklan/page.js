export default function IklanPage() {
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center">
      
      {/* Gambar Ilustrasi (Pakai link luar aja biar cepet) */}
      <img 
        src="https://img.freepik.com/free-vector/house-searching-concept-illustration_114360-466.jpg" 
        alt="Jual Rumah" 
        className="w-64 mb-6"
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Jual Propertimu Lebih Cepat!</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        Jangkau ribuan pembeli potensial di platform kami. Proses mudah, cepat, dan transparan.
      </p>

      {/* Tombol CTA ke WA Admin */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20pasang%20iklan%20properti"
        target="_blank"
        className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-teal-700 transition-transform hover:scale-105"
      >
        Pasang Iklan Sekarang
      </a>

    </div>
  );
}