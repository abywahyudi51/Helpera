import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Wallet, 
  Star, 
  TrendingUp, 
  LogOut,
  AlertTriangle,
  X
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function MitraDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State Modal
  const navigate = useNavigate();

  // 1. MONITOR SEMUA PESANAN (REALTIME)
  useEffect(() => {
    const q = query(collection(db, "bookings"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. LOGIKA SELESAIKAN PESANAN
  const handleFinishOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "bookings", orderId), { 
        status: 'Selesai',
        updatedAt: serverTimestamp() 
      });
      toast.success("Pesanan selesai! Poin telah dikirim ke customer.");
    } catch (e) {
      toast.error("Gagal update status");
    }
  };

  // 3. LOGOUT MITRA
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
    toast.success("Keluar dari Portal Mitra");
  };

  const totalSelesai = orders.filter(o => o.status === 'Selesai').length;
  const totalAktif = orders.filter(o => o.status === 'Proses').length;

  return (
    <div className="min-h-screen bg-[#F0F4F8] pb-24 animate-in fade-in duration-500">
      
      {/* HEADER PORTAL */}
      <div className="bg-[#10b981] pt-12 pb-24 px-6 rounded-b-[50px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex justify-between items-start text-white">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Halo, Mitra Aby! 👋</h1>
            <p className="text-emerald-100 text-xs mt-1 font-medium">Kelola bisnismu dalam satu genggaman.</p>
          </div>
          {/* Ubah langsung Logout menjadi buka Modal */}
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all active:scale-90"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-3 mt-8 relative z-20">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-white">
                <p className="text-[9px] uppercase font-bold opacity-70">Selesai</p>
                <p className="text-xl font-black">{totalSelesai}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-white">
                <p className="text-[9px] uppercase font-bold opacity-70">Aktif</p>
                <p className="text-xl font-black">{totalAktif}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-white">
                <p className="text-[9px] uppercase font-bold opacity-70">Rating</p>
                <div className="flex items-center gap-1">
                    <p className="text-xl font-black">5.0</p>
                    <Star size={12} fill="white" />
                </div>
            </div>
        </div>
      </div>

      {/* PENDAPATAN WIDGET */}
      <div className="px-6 -mt-8 relative z-30">
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Wallet size={24} />
                </div>
                <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Pendapatan</p>
                    <p className="text-lg font-black text-gray-800">Rp 1.250.000</p>
                </div>
            </div>
            <TrendingUp size={24} className="text-emerald-500" />
        </div>
      </div>

      {/* LIST ORDERS */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-black text-lg">Pesanan Terbaru</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Live Update</span>
        </div>

        {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm italic animate-pulse">Menghubungkan ke Helpera Cloud...</div>
        ) : orders.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] text-center shadow-sm border border-dashed border-gray-200">
                <Smartphone size={48} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm font-medium">Belum ada orderan masuk.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 hover:border-emerald-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-gray-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">{order.serviceName}</h3>
                                    <p className="text-[11px] text-gray-400 font-medium">ID: #{order.id.slice(0, 8)}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                                order.status === 'Selesai' 
                                ? 'bg-gray-50 text-gray-300 border-gray-100' 
                                : 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse'
                            }`}>
                                {order.status}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => navigate(`/mitra-chat/${order.id}`)}
                                className="flex-1 bg-emerald-500 text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                            >
                                <MessageCircle size={16} /> Hubungi Client
                            </button>
                            
                            {order.status !== 'Selesai' && (
                                <button 
                                    onClick={() => handleFinishOrder(order.id)}
                                    className="bg-gray-800 text-white px-5 rounded-2xl font-bold text-xs flex items-center justify-center active:scale-95 transition-all"
                                >
                                    <CheckCircle2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-center text-gray-900 mb-2">Keluar Portal?</h3>
            <p className="text-sm text-center text-gray-500 mb-8 leading-relaxed">
              Kamu akan keluar dari dashboard mitra. Pastikan semua orderan sudah dipantau.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-100 active:scale-95 transition-all"
              >
                Ya, Keluar Sekarang
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}