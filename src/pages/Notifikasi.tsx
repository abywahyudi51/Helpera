import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Tag, MessageCircle, Clock, CheckCircle2, Trash2, PlusCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, onSnapshot, updateDoc, doc, writeBatch, deleteDoc, serverTimestamp, Timestamp, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Notifikasi() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. AMBIL DATA & AUTO DELETE CLEANER ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "notifications"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // A. LOGIKA HAPUS OTOMATIS (10 MENIT SETELAH DIBACA)
        const now = new Date();
        data.forEach(async (item: any) => {
            if (item.read && item.readAt) {
                // Konversi Timestamp Firestore ke Date Javascript
                const readTime = item.readAt instanceof Timestamp ? item.readAt.toDate() : new Date(item.readAt);
                const diffInMinutes = (now.getTime() - readTime.getTime()) / 1000 / 60;
                
                // Jika sudah dibaca lebih dari 10 menit yang lalu -> HAPUS
                if (diffInMinutes > 10) {
                    try {
                        await deleteDoc(doc(db, "users", user.uid, "notifications", item.id));
                        console.log(`Notifikasi ${item.title} dihapus otomatis.`);
                    } catch (err) {
                        console.error("Gagal auto-delete", err);
                    }
                }
            }
        });

        // B. SORTING (Terbaru diatas)
        data.sort((a: any, b: any) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
        });

        setNotifications(data);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. GENERATE 10 DUMMY PROMO (MANUAL BUTTON) ---
  const generateDummyPromos = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const dummyData = [
        { title: 'Diskon 50% Cuci AC', message: 'Kode: SEGAR50. Khusus hari ini!', type: 'promo' },
        { title: 'Cashback OVO 20rb', message: 'Top up dan bayar pakai OVO.', type: 'promo' },
        { title: 'Gratis Ongkir Tukang', message: 'Biaya transport tukang gratis.', type: 'promo' },
        { title: 'Voucher Pengguna Baru', message: 'Potongan 10rb untuk pesanan pertama.', type: 'promo' },
        { title: 'Promo Gajian Hemat', message: 'Diskon 30% semua layanan cleaning.', type: 'promo' },
        { title: 'Bundle Hemat Dapur', message: 'Paket bersihkan dapur + kulkas.', type: 'promo' },
        { title: 'Flash Sale 12.12', message: 'Harga miring mulai Rp 10.000.', type: 'promo' },
        { title: 'Referral Bonus', message: 'Ajak teman dapat saldo Rp 50.000.', type: 'promo' },
        { title: 'Diskon Service TV', message: 'Service TV LED diskon 20%.', type: 'promo' },
        { title: 'Promo Akhir Pekan', message: 'Libur santai, rumah bersih.', type: 'promo' }
    ];

    setLoading(true);
    const batch = writeBatch(db);

    dummyData.forEach((item) => {
        const newRef = doc(collection(db, "users", user.uid, "notifications"));
        batch.set(newRef, {
            ...item,
            date: 'Baru saja',
            read: false, // Default Belum Dibaca (Titik Merah Muncul)
            link: '/semua-kategori',
            createdAt: serverTimestamp()
        });
    });

    await batch.commit();
    setLoading(false);
    toast.success("10 Promo Dummy Berhasil Ditambahkan! 🚀");
  };

  // --- 3. KLIK NOTIFIKASI (TANDAI BACA & CATAT WAKTU) ---
  const handleNotificationClick = async (notif: any) => {
    const user = auth.currentUser;
    if (!user) return;

    // Jika belum dibaca, update status dan set WAKTU BACA (readAt)
    if (!notif.read) {
        const notifRef = doc(db, "users", user.uid, "notifications", notif.id);
        await updateDoc(notifRef, { 
            read: true, 
            readAt: serverTimestamp() // Catat waktu dibaca untuk timer 10 menit
        });
        toast("Ditandai sudah baca. Akan hilang dalam 10 menit.", { icon: '⏳' });
    }

    if (notif.link) {
        navigate(notif.link);
    }
  };

  // Helper UI
  const getIcon = (type: string) => {
    switch (type) {
      case 'promo': return <Tag size={20} className="text-orange-600" />;
      case 'chat': return <MessageCircle size={20} className="text-blue-600" />;
      case 'system': return <CheckCircle2 size={20} className="text-green-600" />;
      default: return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'promo': return 'bg-orange-100';
      case 'chat': return 'bg-blue-100';
      case 'system': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-gray-800"/>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Notifikasi</h1>
        </div>
        
        {/* Tombol Generate Dummy (Bisa dihapus nanti jika mau) */}
        <button 
            onClick={generateDummyPromos} 
            className="text-[10px] font-bold text-gray-400 hover:text-blue-600 border border-gray-200 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
        >
            <PlusCircle size={12} /> Isi 10 Promo
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-3">
        
        {loading ? (
             <div className="text-center py-10 text-gray-400">Memuat notifikasi...</div>
        ) : notifications.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <p>Belum ada notifikasi baru.</p>
                <button onClick={generateDummyPromos} className="mt-4 text-blue-600 text-sm font-bold underline">
                    Generate Promo Dummy
                </button>
            </div>
        ) : (
            notifications.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => handleNotificationClick(item)}
                    className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden ${
                        item.read 
                        ? 'bg-white border-gray-100 opacity-60' // Jika sudah baca, agak transparan
                        : 'bg-white border-blue-100 shadow-md ring-1 ring-blue-50' // Jika belum baca, menonjol
                    }`}
                >
                    {/* IKON */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(item.type)}`}>
                        {getIcon(item.type)}
                    </div>

                    {/* KONTEN */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-bold ${!item.read ? 'text-[#0F3D85]' : 'text-gray-500'}`}>
                                {item.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                                <Clock size={10} /> {item.date}
                            </span>
                        </div>
                        
                        <p className={`text-xs leading-relaxed line-clamp-2 ${!item.read ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                            {item.message}
                        </p>
                        
                        {/* Status Penghapusan Otomatis (Info User) */}
                        {item.read && (
                            <p className="text-[10px] text-red-300 mt-2 italic flex items-center gap-1">
                                <Clock size={10} /> Auto-hapus dlm 10 menit
                            </p>
                        )}
                    </div>

                    {/* DOT MERAH (Hanya muncul jika BELUM DIBACA) */}
                    {!item.read && (
                        <div className="absolute top-4 right-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100 animate-pulse"></div>
                        </div>
                    )}
                </div>
            ))
        )}

      </div>
    </div>
  );
}