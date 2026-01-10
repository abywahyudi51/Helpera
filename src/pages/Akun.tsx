import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Tambah query & getDocs
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast'; 
import { User, Bell, LogOut, ChevronRight, Shield, CreditCard, HelpCircle, X, Phone, Award, ShoppingBag } from 'lucide-react';

export default function Akun() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [joinDate, setJoinDate] = useState("-");
  const [loading, setLoading] = useState(true);
  
  // STATE TAMBAHAN UNTUK STATISTIK
  const [totalOrders, setTotalOrders] = useState(0);
  const [points, setPoints] = useState(0);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Format Tanggal Join
        if (user.metadata.creationTime) {
            const date = new Date(user.metadata.creationTime);
            setJoinDate(date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }));
        }
        try {
            // 1. Ambil Data User (untuk Nama, HP, dan Poin)
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              setProfile({
                name: data.name || user.displayName || "Pengguna Helpera",
                email: user.email,
                phone: data.phone || "-"
              });
              setPoints(data.points || 0); // Set Poin dari database
            } else {
              setProfile({ 
                name: user.displayName || "Pengguna Helpera", 
                email: user.email, 
                phone: "-" 
              });
            }

            // 2. Hitung Total Pesanan dari Koleksi Bookings
            const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            setTotalOrders(querySnapshot.size); // Set total pesanan berdasarkan jumlah dokumen

        } catch (err) {
            console.error(err);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const processLogout = async () => {
    try {
      setShowLogoutModal(false);
      await signOut(auth);
      toast.success("Berhasil keluar. Sampai jumpa! 👋");
      navigate('/login');
    } catch (error) {
      toast.error("Gagal logout.");
    }
  };

  const handleMenuClick = (menuName: string) => {
    if (menuName === 'Edit Profil') {
        navigate('/edit-profil');
    } else if (menuName === 'Metode Pembayaran') {
        navigate('/metode-pembayaran');
    } else if (menuName === 'Keamanan & Privasi') {
        navigate('/keamanan');
    } else if (menuName === 'Pusat Bantuan') {
        navigate('/bantuan');
    } else {
        toast(`🚧 Fitur "${menuName}" segera hadir!`, { icon: '🔨' });
    }
  };

  const menus = [
    { icon: <User size={20} />, label: 'Edit Profil', sub: 'Nama & WhatsApp' },
    { icon: <CreditCard size={20} />, label: 'Metode Pembayaran', sub: 'E-Wallet, Kartu' },
    { icon: <Bell size={20} />, label: 'Notifikasi', sub: 'Atur suara pesan' },
    { icon: <Shield size={20} />, label: 'Keamanan & Privasi', sub: 'Password, PIN' },
    { icon: <HelpCircle size={20} />, label: 'Pusat Bantuan', sub: 'FAQ, Hubungi CS' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Memuat profil...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pt-6 animate-in fade-in duration-500 relative">
      
      {/* HEADER PROFIL */}
      <div className="bg-[#0F3D85] text-white pt-10 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-[60px]"></div>
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0F3D85] to-transparent"></div>
         
         <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl bg-white flex items-center justify-center text-3xl font-bold text-[#0F3D85]">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
            </div>
            
            <div>
                <h1 className="text-xl font-bold leading-tight">{profile?.name}</h1>
                <p className="text-blue-200 text-sm mb-2">{profile?.email}</p>
                
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    <Phone size={12} className="text-green-300" />
                    <p className="text-xs font-medium text-white">
                        {profile?.phone !== "-" ? profile?.phone : "Belum ada No WA"}
                    </p>
                </div>
            </div>
         </div>
      </div>

      {/* CARD STATISTIK (DIPERBARUI DENGAN IKON & DATA DINAMIS) */}
      <div className="px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex justify-between items-center text-center">
            <div className="w-1/3 border-r border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Bergabung</p>
                <p className="font-bold text-gray-800 text-sm">{joinDate}</p>
            </div>
            <div className="w-1/3 border-r border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Pesanan</p>
                <div className="flex items-center justify-center gap-1">
                    <ShoppingBag size={14} className="text-blue-500" />
                    <p className="font-black text-gray-800 text-base">{totalOrders}</p>
                </div>
            </div>
            <div className="w-1/3">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Poin</p>
                <div className="flex items-center justify-center gap-1">
                    <Award size={16} className="text-orange-500" />
                    <p className="font-black text-[#0F3D85] text-base">{points}</p>
                </div>
            </div>
        </div>
      </div>

      {/* MENU PENGATURAN */}
      <div className="px-6 mt-8 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg mb-2 ml-1 tracking-tight">Pengaturan</h3>
        
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

        <button 
            onClick={() => setShowLogoutModal(true)} 
            className="w-full bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-4 mt-8 hover:bg-red-100 transition-colors active:scale-95 shadow-sm"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm">
                <LogOut size={20} />
            </div>
            <span className="font-bold text-red-600 text-sm">Kelola Sesi & Keluar</span>
        </button>
      </div>
      
      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Keluar Aplikasi?</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Sesi Anda akan berakhir. Pastikan semua pesanan sudah Anda pantau.</p>
                <div className="flex flex-col gap-3">
                    <button onClick={processLogout} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200">Ya, Keluar</button>
                    <button onClick={() => setShowLogoutModal(false)} className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">Batal</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}