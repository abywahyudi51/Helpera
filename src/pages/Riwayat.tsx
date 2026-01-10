import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Import koneksi database
import { CheckCircle2, Clock, XCircle, ChevronRight, RefreshCcw, AlertCircle } from 'lucide-react';

// Definisikan bentuk data yang kita ambil dari database
interface Booking {
  id: string;
  created_at: string;
  status: 'pending' | 'on_process' | 'completed' | 'cancelled';
  total_price: number;
  service_name: string; // Asumsi kamu menyimpan nama layanan di sini atau join table
}

const Riwayat: React.FC = () => {
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. FUNGSI MENGAMBIL DATA (READ)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Mengambil data dari tabel 'bookings'
      // Pastikan kamu punya tabel 'bookings' di Supabase
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fungsi ambil data saat halaman pertama dibuka
  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. FUNGSI BATALKAN PESANAN (UPDATE)
  const handleCancel = async (id: string) => {
    const confirm = window.confirm("Yakin ingin membatalkan pesanan ini?");
    if (!confirm) return;

    try {
      // Update status di database menjadi 'cancelled'
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      // Refresh data di layar agar status langsung berubah
      fetchOrders(); 
      alert("Pesanan berhasil dibatalkan.");
    } catch (error) {
      alert("Gagal membatalkan pesanan.");
    }
  };

  if (loading) return <div className="p-10 text-center">Sedang memuat data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pt-6">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="py-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Riwayat Pesanan</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau status jasa real-time.</p>
        </div>

        {/* Jika belum ada data */}
        {orders.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <AlertCircle className="mx-auto w-12 h-12 mb-2 text-gray-400" />
            <p>Belum ada riwayat pesanan.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    {/* Icon berdasarkan status */}
                    <StatusIcon status={item.status} />
                    
                    <div>
                        {/* Jika di tabelmu kolomnya 'title' ganti service_name jadi title */}
                        <h3 className="font-bold text-gray-800 text-lg">{item.service_name || 'Layanan Jasa'}</h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="block font-bold text-gray-900">
                      Rp {item.total_price?.toLocaleString('id-ID') || '0'}
                    </span>
                    <StatusBadge status={item.status} />
                </div>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 italic">
                    {item.status === 'cancelled' ? 'Dibatalkan' : 'Layanan profesional Helpera'}
                  </p>
                  
                  {/* LOGIKA TOMBOL BERDASARKAN STATUS */}
                  {item.status === 'completed' ? (
                      <button className="flex items-center gap-2 bg-[#0056b3] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                          <RefreshCcw size={16} /> Pesan Lagi
                      </button>
                  ) : item.status === 'cancelled' ? (
                      <button disabled className="text-gray-300 text-sm font-bold cursor-not-allowed">
                          Sudah Dibatalkan
                      </button>
                  ) : (
                      // Jika status masih pending/process, Customer bisa membatalkan
                      <div className="flex gap-3">
                         <button 
                            onClick={() => handleCancel(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors"
                         >
                            Batalkan
                         </button>
                         <button className="flex items-center gap-1 text-[#0056b3] text-sm font-bold">
                            Detail <ChevronRight size={16} />
                         </button>
                      </div>
                  )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// --- KOMPONEN KECIL (HELPER) ---

function StatusBadge({ status }: { status: string }) {
    // Logika Warna Badge
    if (status === 'completed') {
        return <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 border border-green-100"><CheckCircle2 size={12}/> Selesai</span>;
    } else if (status === 'cancelled') {
        return <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 border border-red-100"><XCircle size={12}/> Batal</span>;
    } else {
        // Pending atau On Process
        return <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 border border-yellow-100"><Clock size={12}/> Proses</span>;
    }
}

function StatusIcon({ status }: { status: string }) {
    // Logika Warna Icon Besar
    let colorClass = "bg-blue-100 text-blue-600";
    if (status === 'completed') colorClass = "bg-green-100 text-green-600";
    if (status === 'cancelled') colorClass = "bg-red-100 text-red-600";
    if (status === 'on_process') colorClass = "bg-yellow-100 text-yellow-600";

    return (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClass}`}>
            {status === 'completed' ? '✅' : status === 'cancelled' ? '❌' : '⏳'}
        </div>
    )
}

export default Riwayat;