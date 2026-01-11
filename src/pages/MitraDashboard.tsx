import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { 
  MessageCircle, CheckCircle2, Clock, Smartphone, Wallet, Star, TrendingUp, LogOut, 
  AlertTriangle, Power, Calendar, MapPin, User, XCircle, PlayCircle 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from 'recharts';

export default function MitraDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('baru'); 
  const navigate = useNavigate();

  // STATE MODAL
  const [modal, setModal] = useState({
    show: false, type: '', id: '', title: '', desc: ''
  });

  // 1. MONITOR PESANAN
  useEffect(() => {
    const q = query(collection(db, "bookings"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const rawOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const enrichedOrders = await Promise.all(rawOrders.map(async (order: any) => {
        let clientName = "Pelanggan Helpera"; 
        if (order.userId) {
            try {
                const userSnap = await getDoc(doc(db, "users", order.userId));
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const detectedName = userData.username || userData.fullName || userData.name || userData.email?.split('@')[0];
                    if (detectedName) clientName = detectedName.charAt(0).toUpperCase() + detectedName.slice(1);
                }
            } catch (err) { console.error(err); }
        }
        return { ...order, clientName };
      }));

      enrichedOrders.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(enrichedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. HITUNG STATISTIK & PENDAPATAN (DINAMIS) ---
  const { totalPendapatan, graphData } = useMemo(() => {
    let total = 0;
    // Inisialisasi data grafik 0 untuk Senin-Minggu
    const stats: any = { 'Sen': 0, 'Sel': 0, 'Rab': 0, 'Kam': 0, 'Jum': 0, 'Sab': 0, 'Min': 0 };
    
    // Mapping hari dari getDay() JS (0=Minggu, 1=Senin, dst) ke Key stats kita
    const dayKeys = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    orders.forEach(order => {
        if (order.status === 'Selesai') {
            // 1. Hitung Total Uang
            // Pastikan price ada, kalau tidak ada anggap 0
            const price = typeof order.price === 'number' ? order.price : parseInt(order.price || '0');
            total += price;

            // 2. Masukkan ke Grafik berdasarkan Hari
            if (order.createdAt?.seconds) {
                const date = new Date(order.createdAt.seconds * 1000);
                const dayName = dayKeys[date.getDay()]; // Dapat 'Sen', 'Sel', dst
                if (stats[dayName] !== undefined) {
                    stats[dayName] += price;
                }
            }
        }
    });

    // Format ulang untuk Recharts
    const chartData = [
        { name: 'Sen', total: stats['Sen'] },
        { name: 'Sel', total: stats['Sel'] },
        { name: 'Rab', total: stats['Rab'] },
        { name: 'Kam', total: stats['Kam'] },
        { name: 'Jum', total: stats['Jum'] },
        { name: 'Sab', total: stats['Sab'] },
        { name: 'Min', total: stats['Min'] },
    ];

    return { totalPendapatan: total, graphData: chartData };
  }, [orders]); // Hitung ulang setiap kali 'orders' berubah
  // ---------------------------------------------------

  // FUNGSI MODAL
  const triggerAccept = (id: string) => setModal({ show: true, type: 'accept', id, title: 'Terima Pesanan?', desc: 'Pesanan masuk ke tab Proses.' });
  const triggerReject = (id: string) => setModal({ show: true, type: 'reject', id, title: 'Tolak Pesanan?', desc: 'Pesanan akan dibatalkan permanen.' });
  const triggerFinish = (id: string) => setModal({ show: true, type: 'finish', id, title: 'Selesaikan Pesanan?', desc: 'Pastikan pembayaran diterima.' });
  const triggerLogout = () => setModal({ show: true, type: 'logout', id: '', title: 'Keluar Portal?', desc: 'Anda akan keluar sesi.' });

  // EKSEKUTOR AKSI
  const handleConfirmAction = async () => {
    if (!modal.type) return;
    try {
        if (modal.type === 'accept') {
            await updateDoc(doc(db, "bookings", modal.id), { status: 'Proses', updatedAt: serverTimestamp() });
            toast.success("Pesanan Diterima! 🚀");
            setActiveTab('proses');
        } else if (modal.type === 'reject') {
            await updateDoc(doc(db, "bookings", modal.id), { status: 'Batal', updatedAt: serverTimestamp() });
            toast.success("Pesanan Ditolak ❌");
        } else if (modal.type === 'finish') {
            await updateDoc(doc(db, "bookings", modal.id), { status: 'Selesai', updatedAt: serverTimestamp() });
            toast.success("Pesanan Selesai! Saldo masuk 💰");
        } else if (modal.type === 'logout') {
            await signOut(auth);
            navigate('/login');
            toast.success("Berhasil Keluar");
        }
    } catch (e) { toast.error("Terjadi kesalahan sistem"); } 
    finally { setModal({ ...modal, show: false }); }
  };

  const filteredOrders = orders.filter(o => (o.status?.toLowerCase() || '') === activeTab);
  const totalSelesai = orders.filter(o => o.status === 'Selesai').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="bg-[#10B981] pt-8 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Selamat Sore,</p>
            <h1 className="text-2xl font-black text-white tracking-tight">Mitra Aby! 👋</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsOnline(!isOnline)} className={`flex items-center gap-2 px-3 py-2 rounded-full font-bold text-xs transition-all shadow-lg ${isOnline ? 'bg-white text-green-600' : 'bg-red-500 text-white'}`}>
              <Power size={14} /> {isOnline ? 'ON BID' : 'OFF'}
            </button>
            <button onClick={triggerLogout} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm"><LogOut size={20} /></button>
          </div>
        </div>

        {/* KARTU PENDAPATAN DINAMIS */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white relative z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 opacity-80">
              <Wallet size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Total Pendapatan</span>
            </div>
            {/* Indikator Naik (Hardcoded untuk contoh, bisa dibikin dinamis juga) */}
            <div className="px-2 py-1 bg-green-400/30 rounded-lg text-[10px] font-bold flex items-center gap-1">
              <TrendingUp size={12} /> Realtime
            </div>
          </div>
          {/* ANGKANYA SEKARANG BERGERAK! */}
          <h2 className="text-3xl font-black">
            Rp {totalPendapatan.toLocaleString('id-ID')}
          </h2>
        </div>
      </div>

      {/* STATS */}
      <div className="px-6 -mt-12 mb-8 relative z-20">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2"><CheckCircle2 size={20} /></div>
            <h3 className="font-black text-xl text-gray-800">{totalSelesai}</h3>
            <p className="text-xs text-gray-400 font-bold uppercase">Selesai</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 mb-2"><Star size={20} fill="currentColor" /></div>
            <h3 className="font-black text-xl text-gray-800">5.0</h3>
            <p className="text-xs text-gray-400 font-bold uppercase">Rating</p>
          </div>
        </div>
      </div>

      {/* CHART DINAMIS */}
      <div className="px-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-green-500"/> Statistik Mingguan</h3>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
              <Tooltip 
    // Ganti 'value: number' menjadi 'value: any'
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  cursor={{ stroke: '#10B981', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="total" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LIST PESANAN & TAB */}
      <div className="px-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Daftar Pesanan</h3>
        
        <div className="flex bg-gray-200 p-1 rounded-xl mb-6 overflow-x-auto">
            {['Baru', 'Proses', 'Selesai', 'Batal'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all capitalize min-w-[70px] ${activeTab === tab.toLowerCase() ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab}
                </button>
            ))}
        </div>

        <div className="space-y-4">
             {loading ? <div className="py-10 text-center text-gray-400 text-sm italic animate-pulse">Menghubungkan ke Cloud...</div> : 
             filteredOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-[40px] text-center shadow-sm border border-dashed border-gray-200">
                    <Smartphone size={48} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 text-sm font-medium">Tidak ada orderan di tab '{activeTab}'.</p>
                </div>
            ) : (
                filteredOrders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'Batal' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{order.serviceName}</h4>
                                <div className="flex items-center gap-1 mt-0.5"><User size={12} className="text-gray-400" /><p className="text-xs text-gray-600 font-semibold">{order.clientName}</p></div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${order.status === 'Baru' ? 'bg-blue-50 text-blue-600' : order.status === 'Proses' ? 'bg-orange-50 text-orange-600' : order.status === 'Batal' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{order.status}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin size={14} className="text-gray-300"/> {order.location || 'Lokasi GPS'}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar size={14} className="text-gray-300"/> {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('id-ID') : 'Baru saja'}</div>
                        {/* Tampilkan Harga di Kartu agar Mitra tahu nilainya */}
                        <div className="flex items-center gap-2 text-xs text-[#10B981] font-bold"><Wallet size={14} /> Rp {(order.price || 0).toLocaleString('id-ID')}</div>
                    </div>

                    <div className="flex gap-2">
                        {order.status === 'Baru' && (
                           <>
                             <button onClick={() => triggerReject(order.id)} className="bg-red-50 text-red-500 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"><XCircle size={16} /> Tolak</button>
                             <button onClick={() => triggerAccept(order.id)} className="flex-1 bg-[#10B981] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform"><PlayCircle size={16} /> Terima Pesanan</button>
                           </>
                        )}
                        {order.status === 'Proses' && (
                           <>
                             <button onClick={() => navigate(`/mitra-chat/${order.id}`)} className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform"><MessageCircle size={16} /> Hubungi Client</button>
                             <button onClick={() => triggerFinish(order.id)} className="bg-gray-800 text-white px-5 rounded-xl font-bold text-xs flex items-center justify-center active:scale-95 transition-all"><CheckCircle2 size={18} /></button>
                           </>
                        )}
                        {(order.status === 'Selesai' || order.status === 'Batal') && (
                             <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl font-bold text-xs cursor-not-allowed">Orderan Ditutup</button>
                        )}
                    </div>
                </div>
            )))}
        </div>
      </div>

       {/* MODAL POPUP */}
       {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${modal.type === 'accept' ? 'bg-green-100 text-green-600' : modal.type === 'reject' || modal.type === 'logout' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'}`}>
                {modal.type === 'accept' && <PlayCircle size={40} />}
                {modal.type === 'reject' && <XCircle size={40} />}
                {modal.type === 'logout' && <LogOut size={40} />}
                {modal.type === 'finish' && <CheckCircle2 size={40} />}
              </div>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{modal.title}</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">{modal.desc}</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirmAction} className={`w-full py-4 rounded-2xl font-bold text-white text-sm shadow-lg active:scale-95 transition-all ${modal.type === 'accept' ? 'bg-green-500 shadow-green-200' : modal.type === 'reject' || modal.type === 'logout' ? 'bg-red-500 shadow-red-200' : 'bg-blue-600 shadow-blue-200'}`}>Ya, Lanjutkan</button>
              <button onClick={() => setModal({...modal, show: false})} className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all hover:bg-gray-200">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}