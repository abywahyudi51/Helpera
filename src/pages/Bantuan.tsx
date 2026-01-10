import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Mail, HelpCircle } from 'lucide-react';

export default function Bantuan() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // DATA DUMMY FAQ
  const faqs = [
    {
      q: "Bagaimana cara memesan jasa?",
      a: "Pilih layanan di beranda, baca deskripsi, lalu klik tombol 'Pesan Sekarang'. Kamu bisa memilih metode pembayaran Tunai atau E-Wallet."
    },
    {
      q: "Apakah saya bisa membatalkan pesanan?",
      a: "Ya, kamu bisa membatalkan pesanan selama statusnya masih 'Menunggu' atau 'Proses'. Masuk ke menu Riwayat, pilih pesanan, dan klik tombol 'Batalkan'."
    },
    {
      q: "Bagaimana sistem pembayarannya?",
      a: "Kami menerima pembayaran Tunai (bayar ke mitra setelah selesai) dan Non-Tunai (Transfer/E-Wallet). Pastikan kamu memilih metode yang diinginkan saat konfirmasi pesanan."
    },
    {
      q: "Apakah mitra Helpera terpercaya?",
      a: "Tentu! Semua mitra kami telah melalui proses verifikasi KTP, SKCK, dan pelatihan standar pelayanan sebelum bisa menerima pesanan."
    },
    {
      q: "Apa yang harus dilakukan jika mitra tidak datang?",
      a: "Jika mitra terlambat lebih dari 30 menit, silakan hubungi mitra via fitur Chat. Jika tidak ada respon, kamu bisa menghubungi CS kami untuk penggantian mitra."
    },
    {
      q: "Bagaimana cara mengganti nomor WhatsApp?",
      a: "Masuk ke menu Akun > Edit Profil. Ubah nomor di kolom WhatsApp lalu klik Simpan."
    }
  ];

  // Filter Pencarian
  const filteredFaqs = faqs.filter(item => 
    item.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="bg-[#0F3D85] p-6 pb-12 rounded-b-[40px] shadow-lg text-white relative overflow-hidden">
        {/* Hiasan */}
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Pusat Bantuan</h1>
            </div>

            <h2 className="text-2xl font-bold mb-2">Butuh bantuan apa?</h2>
            <p className="text-blue-200 text-sm mb-6">Cari jawaban seputar layanan kami di sini.</p>

            {/* SEARCH BAR */}
            <div className="bg-white p-3 rounded-2xl flex items-center gap-3 text-gray-800 shadow-lg">
                <Search size={20} className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Cari topik (misal: pembayaran)" 
                    className="flex-1 outline-none font-medium placeholder:text-gray-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 -mt-4 relative z-20">
        
        {/* LIST FAQ */}
        <div className="space-y-3 mb-8">
            {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-bold text-gray-800 text-sm">{item.q}</span>
                            {openIndex === index ? <ChevronUp size={18} className="text-[#0F3D85]" /> : <ChevronDown size={18} className="text-gray-400" />}
                        </button>
                        
                        {/* JAWABAN (Expandable) */}
                        <div className={`px-4 text-sm text-gray-600 bg-blue-50/50 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                            {item.a}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-400">
                    <HelpCircle size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Tidak ditemukan pencarian untuk "{search}"</p>
                </div>
            )}
        </div>

        {/* KONTAK ADMIN */}
        <h3 className="font-bold text-gray-900 mb-3">Masih butuh bantuan?</h3>
        <div className="grid grid-cols-2 gap-3">
            <a 
                href="https://wa.me/6282252989857" // <--- NOMOR WA ADMIN
                target="_blank" 
                rel="noreferrer"
                className="bg-green-50 border border-green-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-green-100 transition-colors cursor-pointer group"
            >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                </div>
                <span className="text-xs font-bold text-green-700">Chat WhatsApp</span>
            </a>

            <a 
                href="mailto:oriongroup2@gmail.com" // <--- EMAIL ADMIN
                className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors cursor-pointer group"
            >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                </div>
                <span className="text-xs font-bold text-blue-700">Email Admin</span>
            </a>
        </div>

      </div>
    </div>
  );
}