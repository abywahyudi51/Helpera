import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'; 
import { Clock, ChevronRight, MapPin, Receipt, Calendar, XCircle, LayoutGrid, ListFilter, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Riwayat() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('semua');
  
  // STATE UNTUK MODAL KONFIRMASI
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setLoading(false); return; }

    const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const now = new Date();
        data.forEach(async (order: any) => {
             if (order.status === 'Selesai' || order.status === 'Batal' || order.status === 'Dibatalkan') {
                 const timeRef = order.updatedAt || order.createdAt;
                 if (timeRef) {
                     const statusTime = timeRef instanceof Timestamp ? timeRef.toDate() : new Date(timeRef.seconds * 1000);
                     const diffMinutes = (now.getTime() - statusTime.getTime()) / 1000 / 60;
                     if (diffMinutes > 10) {
                         try { await deleteDoc(doc(db, "bookings", order.id)); } catch (e) {}
                     }
                 }
             }
        });

        data.sort((a: any, b: any) => {
             const tA = a.createdAt?.seconds || 0;
             const tB = b.createdAt?.seconds || 0;
             return tB - tA;
        });

        setOrders(data);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // FUNGSI UNTUK MEMBUKA MODAL
  const openCancelModal = (id: string) => {
    setOrderToCancel(id);
    setShowCancelModal(true);
  };

  // FUNGSI EKSEKUSI PEMBATALAN FINAL
  const confirmCancel = async () => {
    if (!orderToCancel) return;
    try {
        await updateDoc(doc(db, "bookings", orderToCancel), { 
            status: "Dibatalkan", 
            updatedAt: new Date() 
        });
        toast.success("Pesanan berhasil dibatalkan");
        setShowCancelModal(false);
        setOrderToCancel(null);
    } catch (error) { 
        toast.error("Gagal membatalkan"); 
    }
  };

  const filteredOrders = orders.filter(order => {
    const status = order.status?.toLowerCase() || '';
    if (activeTab === 'semua') return true;
    if (activeTab === 'proses') return status === 'proses';
    if (activeTab === 'selesai') return status === 'selesai';
    if (activeTab === 'batal') return status === 'batal' || status === 'dibatalkan' || status === 'cancelled';
    return true;
  });

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'selesai') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Selesai' };
    if (s === 'batal' || s === 'dibatalkan') return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', label: 'Dibatalkan' };
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', label: 'Dalam Proses' };
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return { date: '-', time: '-' };
    const d = new Date(timestamp.seconds * 1000);
    return {
        date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-gray-400 bg-gray-50">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans animate-in fade-in duration-500 relative">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-10 md:flex md:gap-10 items-start">
        
        {/* === SIDEBAR MENU (KIRI) === */}
        <div className="w-full md:w-1/4 md:sticky md:top-24 z-10 mb-4 md:mb-0">
            <div className="mb-4 md:mb-6 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                    <LayoutGrid className="text-[#0F3D85] hidden md:block" /> Aktivitas
                </h1>
                <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Kelola semua pesanan jasamu di sini.</p>
            </div>

            <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {['semua', 'proses', 'selesai', 'batal'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-bold capitalize transition-all text-left flex items-center gap-2 md:gap-3 whitespace-nowrap
                            ${activeTab === tab 
                                ? 'bg-white text-[#0F3D85] shadow-sm border border-blue-50' 
                                : 'text-gray-400 hover:bg-white hover:text-gray-600'
                            }`}
                    >
                        {tab === 'semua' && <ListFilter size={16} className="md:w-5 md:h-5" />}
                        {tab === 'proses' && <Clock size={16} className="md:w-5 md:h-5" />}
                        {tab === 'selesai' && <Receipt size={16} className="md:w-5 md:h-5" />}
                        {tab === 'batal' && <XCircle size={16} className="md:w-5 md:h-5" />}
                        {tab}
                        {activeTab === tab && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0F3D85] hidden md:block"></div>}
                    </button>
                ))}
            </div>
        </div>

        {/* === DAFTAR KARTU (KANAN) === */}
        <div className="w-full md:w-3/4 space-y-3 md:space-y-4 pb-24 md:pb-0">
            {filteredOrders.length === 0 && (
                <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-8 md:p-12 text-center shadow-sm">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Receipt size={28} className="text-gray-300 md:w-8 md:h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base md:text-lg">Tidak ada riwayat</h3>
                    <p className="text-gray-400 text-xs md:text-sm mt-1 mb-6">Belum ada pesanan dengan status ini.</p>
                    {activeTab === 'semua' && (
                        <Link to="/" className="inline-block px-5 py-2.5 bg-[#0F3D85] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg hover:bg-blue-800 transition">
                            Mulai Pesan Jasa
                        </Link>
                    )}
                </div>
            )}

            {filteredOrders.map((order) => {
                const isCancelled = order.status === 'Batal' || order.status === 'Dibatalkan';
                const isDone = order.status === 'Selesai';
                const statusStyle = getStatusStyle(order.status);
                const { date, time } = formatDateTime(order.createdAt);

                return (
                    <div 
                        key={order.id}
                        className={`relative bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border transition-all duration-300 group
                            ${isCancelled 
                                ? 'border-gray-100 opacity-70 grayscale-[30%] bg-gray-50' 
                                : 'border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-100'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-2 md:mb-4 pb-2 md:pb-3 border-b border-gray-100 border-dashed">
                            <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 font-medium">
                                <Calendar size={12} className="md:w-4 md:h-4" /> 
                                <span className="font-semibold">{date}</span> • {time}
                            </div>
                            <span className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                {statusStyle.label}
                            </span>
                        </div>

                        <div className="flex gap-3 md:gap-6 items-start">
                            <div className="w-12 h-12 md:w-24 md:h-24 bg-gray-100 rounded-lg md:rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                 <img src={order.image || 'https://via.placeholder.com/150'} alt="Service" className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-sm md:text-xl mb-0.5 md:mb-1 truncate ${isCancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                    {order.serviceName}
                                </h4>
                                <div className="flex items-center gap-1 text-[10px] md:text-sm text-gray-400 mb-1 md:mb-2">
                                    <MapPin size={12} className="md:w-4 md:h-4" /> <span className="truncate">{order.location || 'Lokasi GPS'}</span>
                                </div>
                                <p className="text-[#0F3D85] font-extrabold text-base md:text-2xl">
                                    Rp{order.price?.toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="hidden md:flex flex-col gap-2 justify-center h-24">
                                {!isCancelled && !isDone && (
                                    <Link 
                                        to={`/chat/${order.id}`} 
                                        className="px-6 py-2 bg-[#0F3D85] text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-800 transition flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        Chat Mitra <ChevronRight size={16} />
                                    </Link>
                                )}
                                {order.status === 'Proses' && (
                                    <button 
                                        onClick={() => openCancelModal(order.id)}
                                        className="px-4 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-bold hover:bg-red-50 transition"
                                    >
                                        Batalkan
                                    </button>
                                )}
                                {(isCancelled || isDone) && (
                                    <div className="px-4 py-2 rounded-xl bg-gray-50 text-gray-400 text-xs font-bold flex items-center gap-2">
                                        <Trash2 size={14} /> Auto-hapus 10m
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between md:hidden">
                            {(isCancelled || isDone) ? (
                                <p className="text-[10px] text-gray-400 italic flex items-center gap-1 w-full justify-center">
                                    <Trash2 size={12} /> Hapus otomatis 10m
                                </p>
                            ) : (
                                <>
                                    <p className="text-[10px] text-gray-300 font-mono">#{order.id.slice(0,6).toUpperCase()}</p>
                                    <div className="flex gap-2">
                                        {order.status === 'Proses' && (
                                            <button onClick={() => openCancelModal(order.id)} className="px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-[10px] font-bold hover:bg-red-50">
                                                Batal
                                            </button>
                                        )}
                                        <Link to={`/chat/${order.id}`} className="px-4 py-1.5 bg-[#0F3D85] text-white rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1">
                                            Chat <ChevronRight size={12} />
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* --- CUSTOM CANCEL MODAL --- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <AlertTriangle size={28} />
                    </div>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-2">Batalkan Pesanan?</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={confirmCancel}
                        className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
                    >
                        Ya, Batalkan Pesanan
                    </button>
                    <button 
                        onClick={() => { setShowCancelModal(false); setOrderToCancel(null); }}
                        className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}