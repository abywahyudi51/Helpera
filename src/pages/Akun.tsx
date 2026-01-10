import React from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Shield, Bell, CreditCard } from 'lucide-react';

const Akun: React.FC = () => {
  // Data Dummy User
  const user = {
    name: 'Rizky Fauzan',
    email: 'rizky@helpera.com',
    phone: '+62 812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    joined: 'Jan 2025',
    poin: 1500
  };

  const menus = [
    { icon: <User size={20} />, label: 'Edit Profil', sub: 'Nama, Email, Telepon' },
    { icon: <CreditCard size={20} />, label: 'Metode Pembayaran', sub: 'E-Wallet, Kartu' },
    { icon: <Bell size={20} />, label: 'Notifikasi', sub: 'Atur suara pesan' },
    { icon: <Shield size={20} />, label: 'Keamanan & Privasi', sub: 'Password, PIN' },
    { icon: <HelpCircle size={20} />, label: 'Pusat Bantuan', sub: 'FAQ, Hubungi CS' },
  ];

  // Fungsi untuk menangani klik menu
  const handleMenuClick = (menuName: string) => {
    alert(`🚧 Fitur "${menuName}" sedang dalam pengerjaan. Ditunggu ya!`);
  };

  const handleLogout = () => {
    const confirm = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirm) {
        alert("Anda berhasil keluar (Simulasi).");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pt-6">
      
      {/* 1. HEADER PROFIL */}
      <div className="bg-[#0F3D85] text-white pt-10 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-[60px]"></div>
         
         <div className="flex items-center gap-4 relative z-10">
            <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white/30 shadow-md object-cover" />
            <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-blue-200 text-sm">{user.email}</p>
            </div>
         </div>
      </div>

      {/* 2. CARD STATISTIK */}
      <div className="px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex justify-between items-center text-center">
            <div className="w-1/3 border-r border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Bergabung</p>
                <p className="font-bold text-gray-800 text-sm">{user.joined}</p>
            </div>
            <div className="w-1/3 border-r border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Total Pesanan</p>
                <p className="font-bold text-gray-800 text-sm">12</p>
            </div>
            <div className="w-1/3">
                <p className="text-xs text-gray-400 mb-1">Helpera Poin</p>
                <p className="font-bold text-[#0056b3] text-sm">{user.poin}</p>
            </div>
        </div>
      </div>

      {/* 3. MENU PENGATURAN */}
      <div className="px-6 mt-6 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg mb-2">Pengaturan</h3>
        
        {menus.map((item, index) => (
            <button 
                key={index} 
                onClick={() => handleMenuClick(item.label)} // <--- AKSI KLIK DISINI
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {item.icon}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>
        ))}

        {/* Tombol Logout */}
        <button 
            onClick={handleLogout}
            className="w-full bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-4 mt-6 hover:bg-red-100 transition-colors"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500">
                <LogOut size={20} />
            </div>
            <span className="font-bold text-red-600 text-sm">Keluar Aplikasi</span>
        </button>
      </div>

      <p className="text-center text-gray-300 text-xs mt-8 mb-4">Helpera App v1.0.0</p>

    </div>
  );
};

export default Akun;