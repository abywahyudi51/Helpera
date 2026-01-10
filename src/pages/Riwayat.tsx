import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase'; // Pakai Firebase DB
import { collection, query, orderBy, getDocs, doc, updateDoc, where } from 'firebase/firestore'; 
import { CheckCircle2, Clock, XCircle, ChevronRight, RefreshCcw, AlertCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Definisikan tipe data sesuai struktur Firebase nanti
interface Order {
  id: string;
  createdAt: any; // Firebase pakai Timestamp
  status: 'pending' | 'process' | 'completed' | 'cancelled';
  totalPrice: number;
  serviceName: string;
}

const Riwayat: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. FUNGSI MENGAMBIL DATA (READ dari Firestore)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Query ke collection 'orders', urutkan dari yang terbaru
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      
      // Mapping data dari Firestore ke State React
      const ordersData: Order[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      setOrders(ordersData);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. FUNGSI BATALKAN PESANAN (UPDATE ke Firestore)
  const handleCancel = async (id: string) => {
    const confirm = window.confirm("Yakin ingin membatalkan pesanan ini?");
    if (!confirm) return;

    try {
      // Update dokumen spesifik berdasarkan ID
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, {
        status: "cancelled"
      });

      alert("Pesanan berhasil dibatalkan.");
      fetchOrders(); // Refresh tampilan
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Gagal membatalkan pesanan.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Memuat riwayat...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pt-6 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="py-6 sticky top-0 bg-gray-50 z-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F3D85] tracking-tight">Riwayat Pesanan</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau status jasa real-time.</p>
        </div>

        {/* STATE KOSONG (Jika belum ada pesanan) */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="bg-gray-200 p-4 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-700 text-lg">Belum ada pesanan</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">Yuk, pesan jasa pertamamu sekarang!</p>
            <Link to="/" className="bg-[#0F3D85] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">
                Cari Jasa
            </Link>
          </div>
        )}

        {/* LIST PESANAN */}
        <div className="space-y-4">
          {orders.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-100 group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    {/* Icon Status */}
                    <StatusIcon status={item.status} />
                    
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">
                            {item.serviceName || 'Layanan Helpera'}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {/* Konversi Timestamp Firebase ke Tanggal Readable */}
                          {item.createdAt?.seconds 
                            ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })
                            : 'Baru saja'
                          }
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="block font-bold text-gray-900 text-lg">
                      Rp {item.totalPrice?.toLocaleString('id-ID') || '0'}
                    </span>
                    <StatusBadge status={item.status} />
                </div>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div className="flex justify-between items-center">
                  <p className={`text-xs italic ${item.status === 'cancelled' ? 'text-red-400' : 'text-gray-400'}`}>
                    {item.status === 'cancelled' ? 'Pesanan telah dibatalkan' : 'Menunggu helper konfirmasi...'}
                  </p>
                  
                  {/* LOGIKA TOMBOL AKSI */}
                  <div className="flex gap-3">
                      {item.status === 'completed' ? (
                          <button className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                              <RefreshCcw size={16} /> Pesan Lagi
                          </button>
                      ) : item.status === 'cancelled' ? (
                           <button disabled className="text-gray-300 text-sm font-bold cursor-not-allowed bg-gray-50 px-3 py-2 rounded-lg">
                              Dibatalkan
                          </button>
                      ) : (
                          // Jika Pending / Proses -> Bisa Batal & Chat
                          <>
                            <button 
                                onClick={() => handleCancel(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                                Batalkan
                            </button>
                            {/* Tombol ke Chat */}
                            <Link to={`/chat/1`} className="bg-[#0F3D85] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 flex items-center gap-1 shadow-sm">
                                Chat <ChevronRight size={16} />
                            </Link>
                          </>
                      )}
                  </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// --- KOMPONEN KECIL ---

function StatusBadge({ status }: { status: string }) {
    if (status === 'completed') return <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 border border-green-100"><CheckCircle2 size={12}/> Selesai</span>;
    if (status === 'cancelled') return <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 border border-red-100"><XCircle size={12}/> Batal</span>;
    if (status === 'process') return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 border border-blue-100"><Truck size={12}/> Jalan</span>;
    return <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 border border-yellow-100"><Clock size={12}/> Proses</span>;
}

function StatusIcon({ status }: { status: string }) {
    let colorClass = "bg-yellow-100 text-yellow-600";
    let icon = <Clock size={24} />;

    if (status === 'completed') { colorClass = "bg-green-100 text-green-600"; icon = <CheckCircle2 size={24} />; }
    if (status === 'cancelled') { colorClass = "bg-red-100 text-red-600"; icon = <XCircle size={24} />; }
    if (status === 'process') { colorClass = "bg-blue-100 text-blue-600"; icon = <Truck size={24} />; }

    return (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${colorClass}`}>
            {icon}
        </div>
    )
}

export default Riwayat;