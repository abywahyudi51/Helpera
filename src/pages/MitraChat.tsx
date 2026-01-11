import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, Phone, MoreVertical, User, MapPin, 
  Wallet, CheckCircle2, ChevronDown, ChevronUp, Calendar 
} from 'lucide-react'; 
import { auth, db } from '../lib/firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, updateDoc, getDoc 
} from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function MitraChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [clientName, setClientName] = useState('Memuat...');
  
  // STATE BARU UNTUK DATA PESANAN LENGKAP
  const [booking, setBooking] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false); // Untuk toggle detail
  
  const dummyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    // 1. AMBIL DATA PESANAN & CLIENT
    const fetchData = async () => {
      try {
        const bookingSnap = await getDoc(doc(db, "bookings", id));
        if (bookingSnap.exists()) {
           const data = bookingSnap.data();
           setBooking(data); // Simpan semua data booking (price, location, dll)

           // Ambil Nama Client
           if (data.userId) {
             const userSnap = await getDoc(doc(db, "users", data.userId));
             if (userSnap.exists()) {
                const u = userSnap.data();
                const name = u.username || u.fullName || u.name || u.email?.split('@')[0];
                if(name) setClientName(name.charAt(0).toUpperCase() + name.slice(1));
             }
           }
        }
      } catch (error) { console.error(error); }
    };
    fetchData();

    // 2. LISTEN CHAT
    const q = query(collection(db, "bookings", id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => dummyEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [id]);

  // 3. KIRIM PESAN
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const user = auth.currentUser;
    if (!user || !id) return;

    try {
      await addDoc(collection(db, "bookings", id, "messages"), {
        text: newMessage, senderId: user.uid, role: 'mitra', createdAt: serverTimestamp(), isRead: false
      });
      await updateDoc(doc(db, "bookings", id), {
        lastMessage: newMessage, updatedAt: serverTimestamp(), isChatVisible: true
      });
      setNewMessage('');
    } catch (error) { toast.error("Gagal kirim pesan"); }
  };

  // 4. SELESAIKAN PESANAN DARI HALAMAN CHAT
  const handleFinishFromChat = async () => {
    if(!window.confirm("Pekerjaan selesai & pembayaran diterima?")) return;
    try {
        await updateDoc(doc(db, "bookings", id!), {
            status: 'Selesai',
            updatedAt: serverTimestamp()
        });
        toast.success("Pesanan Selesai! Saldo bertambah.");
        navigate('/mitra-dashboard'); // Kembali ke dashboard untuk lihat grafik naik
    } catch (error) {
        toast.error("Gagal update status");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 animate-in fade-in duration-300">
      
      {/* HEADER HIJAU */}
      <div className="bg-[#10B981] pt-4 pb-2 px-4 shadow-md sticky top-0 z-20 transition-all">
        <div className="flex items-center justify-between text-white mb-2">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30"><User size={20} /></div>
                    <div>
                        <h3 className="font-bold text-base leading-none capitalize">{clientName}</h3>
                        <p className="text-[10px] text-emerald-100 flex items-center gap-1 mt-1">
                           <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
            </div>
            {/* Tombol Toggle Detail */}
            <button onClick={() => setShowDetail(!showDetail)} className="flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-all">
                {showDetail ? 'Tutup Info' : 'Lihat Info'} 
                {showDetail ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
        </div>

        {/* PANEL DETAIL PESANAN (MUNCUL JIKA showDetail === TRUE) */}
        {showDetail && booking && (
            <div className="bg-white rounded-xl p-4 mt-2 mb-2 text-gray-800 shadow-xl animate-in slide-in-from-top-2">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Layanan</p>
                        <h4 className="font-bold text-lg text-[#10B981]">{booking.serviceName}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">Pendapatan</p>
                        <p className="font-black text-lg text-gray-800">Rp {(booking.price || 0).toLocaleString('id-ID')}</p>
                    </div>
                </div>
                
                <div className="space-y-2 text-sm border-t border-gray-100 pt-3 mb-3">
                    <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 mt-0.5" />
                        <span className="text-gray-600 font-medium">{booking.location || 'Lokasi GPS'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-gray-400" />
                        <span className="text-gray-600 font-medium">{booking.paymentMethod || 'Tunai'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-600 font-medium">
                            {booking.createdAt?.seconds ? new Date(booking.createdAt.seconds * 1000).toLocaleDateString('id-ID') : '-'}
                        </span>
                    </div>
                </div>

                {/* TOMBOL SELESAIKAN (Hanya jika belum selesai) */}
                {booking.status === 'Proses' && (
                    <button 
                        onClick={handleFinishFromChat}
                        className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <CheckCircle2 size={18} /> Selesaikan Pekerjaan
                    </button>
                )}
            </div>
        )}
      </div>

      {/* AREA CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5]">
         {/* Info Bubble System */}
         <div className="flex justify-center my-4">
            <div className="bg-yellow-50 text-yellow-800 text-[10px] px-3 py-1 rounded-full shadow-sm border border-yellow-100 font-medium">
                Jangan lakukan transaksi di luar aplikasi Helpera.
            </div>
         </div>

         {messages.map((msg) => {
           const isMe = msg.role === 'mitra'; 
           return (
               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`relative max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-[#10B981] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'}`}>
                       <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                       <span className={`text-[9px] block mt-1 text-right ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>
                          {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                       </span>
                   </div>
               </div>
           );
         })}
         <div ref={dummyEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-3 flex items-center gap-2 border-t border-gray-200 shadow-lg">
          <form onSubmit={handleSend} className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <input 
                type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Balas pesan...`} 
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </form>
          <button onClick={handleSend} disabled={!newMessage.trim()} className="p-3.5 bg-[#10B981] text-white rounded-full shadow-lg hover:bg-emerald-600 disabled:opacity-50 transition-all">
            <Send size={18} />
          </button>
      </div>

    </div>
  );
}