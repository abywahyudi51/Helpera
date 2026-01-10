import React from 'react';
import { User, HelpCircle, LogOut, ChevronRight, Shield, Bell, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase'; // Import Auth Firebase

const Akun: React.FC = () => {
  const navigate = useNavigate();

  // Data Dummy User (Nanti bisa diganti dengan data dari auth.currentUser)
  const user = {
    name: 'Rizky Fauzan',
    email: auth.currentUser?.email || 'rizky@helpera.com', // Coba ambil email asli jika login
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

  const handleMenuClick = (menuName: string) => {
    alert(`🚧 Fitur "${menuName}" sedang dalam pengembangan.`);
  };

  // FUNGSI LOGOUT ASLI
  const handleLogout = async () => {
    const confirm = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirm) {
        try {
            await auth.signOut(); // Logout dari Firebase
            navigate('/'); // Kembalikan ke Beranda
            // window.location.reload(); // Opsional: Reload agar state bersih
        } catch (error) {
            alert("Gagal logout. Coba lagi.");
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pt-6 animate-in fade-in duration-500">
      
      {/* 1. HEADER PROFIL */}
      <div className="bg-[#0F3D85] text-white pt-10 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
         {/* Dekorasi Background */}
         <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-[60px]"></div>
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0F3D85] to-transparent"></div>
         
         <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
                <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white/30 shadow-md object-cover" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-[#0F3D85] rounded-full"></div>
            </div>
            <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-blue-200 text-sm">{user.email}</p>
            </div>
         </div>
      </div>

      {/* 2. CARD STATISTIK */}
      <div className="px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex justify-between items-center text-center">
            <div className="w-1/3 border-r border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Bergabung</p>
                <p className="font-bold text-gray-800 text-sm">{user.joined}</p>
            </div>
            <div className="w-1/3 border-r border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Pesanan</p>
                <p className="font-bold text-gray-800 text-sm">12</p>
            </div>
            <div className="w-1/3">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Poin</p>
                <p className="font-bold text-[#0056b3] text-sm">{user.poin}</p>
            </div>
        </div>
      </div>

      {/* 3. MENU PENGATURAN */}
      <div className="px-6 mt-6 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg mb-2 ml-1">Pengaturan</h3>
        
        {menus.map((item, index) => (
            <button 
                key={index} 
                onClick={() => handleMenuClick(item.label)} 
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:bg-gray-50 hover:border-blue-100 transition-all active:scale-95"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {item.icon}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm group-hover:text-blue-700">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
            </button>
        ))}

        {/* Tombol Logout */}
        <button 
            onClick={handleLogout}
            className="w-full bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-4 mt-8 hover:bg-red-100 transition-colors active:scale-95"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm">
                <LogOut size={20} />
            </div>
            <span className="font-bold text-red-600 text-sm">Keluar Aplikasi</span>
        </button>
      </div>

      <p className="text-center text-gray-300 text-xs mt-8 mb-4">Helpera App v1.0.0 • React Vite</p>

    </div>
  );
};

export default Akun;