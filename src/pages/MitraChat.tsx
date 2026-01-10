import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ArrowLeft, Send, Zap, User, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MitraChat() {
  const { id } = useParams(); // ID Booking
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // DAFTAR QUICK CHAT
  const quickReplies = [
    "Halo, pesanan saya terima ya! Segera meluncur. 👍",
    "Saya sudah sampai di lokasi kak. 📍",
    "Sedang dalam pengerjaan, mohon ditunggu ya. 🛠️",
    "Pekerjaan selesai! Semoga puas dengan layanannya. 🙏",
    "Boleh minta share location atau patokan rumahnya?",
    "Mohon maaf, pengerjaan sedikit terlambat karena cuaca. ⛈️"
  ];

  // 1. Ambil Info Pesanan
  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
        const docSnap = await getDoc(doc(db, "bookings", id));
        if (docSnap.exists()) setOrderInfo(docSnap.data());
    };
    fetchOrder();
  }, [id]);

  // 2. Listen Chat secara Realtime
  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, "bookings", id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  // 3. Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Fungsi Kirim Pesan
  const sendMessage = async (content: string) => {
    if (!content.trim() || !id) return;
    try {
      await addDoc(collection(db, "bookings", id, "messages"), {
        text: content,
        senderId: auth.currentUser?.uid,
        role: 'mitra', // Tetap sebagai penanda peran
        createdAt: serverTimestamp(),
      });
      setInputText('');
    } catch (e) {
        toast.error("Gagal mengirim pesan");
    }
  };

  // 5. FUNGSI HAPUS PESAN (Baru)
  const handleDeleteMessage = async (messageId: string) => {
    if(!window.confirm("Hapus pesan ini dari percakapan?")) return;
    try {
        await deleteDoc(doc(db, "bookings", id!, "messages", messageId));
        toast.success("Pesan dihapus");
    } catch (error) {
        toast.error("Gagal menghapus pesan");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      
      {/* HEADER CHAT MITRA */}
      <div className="bg-[#10b981] p-4 text-white flex items-center gap-3 shadow-md sticky top-0 z-10">
        <button onClick={() => navigate('/mitra-dashboard')} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/10">
                <User size={20} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Panel Mitra</p>
                <h1 className="font-bold text-sm leading-none">{orderInfo?.serviceName || 'Memuat...'}</h1>
            </div>
        </div>
      </div>

      {/* AREA PESAN */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m) => {
          // Logika Kanan: Jika pengirimnya adalah SAYA (Mitra yang sedang login)
          const isMe = m.senderId === auth.currentUser?.uid;

          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
              <div className={`relative max-w-[80%] p-3.5 rounded-2xl text-sm shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2
                  ${isMe 
                      ? 'bg-[#10b981] text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}
              `}>
                {/* Info Pengirim untuk Mitra jika pesan dari customer */}
                {!isMe && <p className="text-[9px] font-black text-[#10b981] mb-1 uppercase tracking-tighter">Customer</p>}
                
                {m.text}
                
                <p className={`text-[9px] mt-1.5 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                    {m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                </p>

                {/* Tombol Hapus Pesan Saya */}
                {isMe && (
                    <button 
                        onClick={() => handleDeleteMessage(m.id)}
                        className="absolute -left-10 top-2 p-2 bg-white text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* BAR QUICK CHAT */}
      <div className="bg-white border-t border-gray-100">
        <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar scroll-smooth">
            {quickReplies.map((reply, i) => (
                <button 
                    key={i} 
                    onClick={() => sendMessage(reply)}
                    className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
                >
                    <Zap size={12} fill="currentColor" /> {reply}
                </button>
            ))}
        </div>

        {/* INPUT CHAT MANUAL */}
        <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}
            className="p-4 bg-white flex items-center gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]"
        >
            <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Balas pelanggan..."
                className="flex-1 bg-gray-100 py-3 px-5 rounded-2xl text-sm outline-none border border-transparent focus:border-emerald-200 focus:bg-white transition-all"
            />
            <button 
                type="submit"
                className="w-12 h-12 bg-[#10b981] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 active:scale-90 transition-all"
            >
                <Send size={20} />
            </button>
        </form>
      </div>
    </div>
  );
}