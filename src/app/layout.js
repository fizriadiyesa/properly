import "./globals.css";
import Navbar from "../components/navbar"; // Panggil Navbar yang tadi kita buat

export const metadata = {
  title: "Aplikasi Properti Gw",
  description: "Cari rumah murah meriah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900">
        
        {/* TEMPEL NAVBAR DI SINI */}
        <Navbar />
        
        {/* Ini konten halaman (Page Cari / Page Iklan) bakal muncul di sini */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}