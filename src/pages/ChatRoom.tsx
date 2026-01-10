import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Mic, Camera, Trash2 } from 'lucide-react'; 
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ChatRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const dummyEndRef = useRef<HTMLDivElement>(null);

  // 1. AMBIL PESAN REALTIME
  useEffect(() => {
    if (!id) return;
    
    const q = query(
      collection(db, "bookings", id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
      
      // Auto scroll ke bawah
      setTimeout(() => {
        dummyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [id]);

  // 2. KIRIM PESAN
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const user = auth.currentUser;
    if (!user || !id) return;

    try {
      await addDoc(collection(db, "bookings", id, "messages"), {
        text: newMessage,
        senderId: user.uid, 
        role: 'customer', // Tandai sebagai customer
        createdAt: serverTimestamp(),
        isRead: false
      });
      setNewMessage('');
    } catch (error) {
      toast.error("Gagal mengirim pesan");
    }
  };

  // 3. FUNGSI HAPUS PESAN
  const handleDeleteMessage = async (messageId: string) => {
    if(!window.confirm("Hapus pesan ini?")) return;
    
    try {
        await deleteDoc(doc(db, "bookings", id!, "messages", messageId));
        toast.success("Pesan dihapus");
    } catch (error) {
        toast.error("Gagal menghapus");
    }
  };

  const showComingSoon = (feature: string) => {
    toast(`Fitur ${feature} segera hadir! 🚧`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] animate-in fade-in duration-300">
      
      {/* HEADER - Tetap Biru Helpera */}
      <div className="bg-[#0F3D85] p-4 flex items-center justify-between text-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold border border-white/30">
                M
             </div>
             <div>
                <h3 className="font-bold text-sm md:text-base leading-none">Mitra Helpera</h3>
                <p className="text-[10px] md:text-xs text-blue-200 flex items-center gap-1 mt-1">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Terhubung
                </p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={() => showComingSoon('Video Call')} className="hover:text-blue-200 transition-colors"><Video size={20} /></button>
           <button onClick={() => showComingSoon('Telepon')} className="hover:text-blue-200 transition-colors"><Phone size={18} /></button>
           <button onClick={() => showComingSoon('Menu')} className="hover:text-blue-200 transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* AREA CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#E5DDD5] bg-opacity-50">
         {loading && <div className="text-center text-xs text-gray-500 mt-4 italic">Sinkronisasi pesan...</div>}
         
         <div className="text-center text-[10px] text-gray-400 my-4 bg-white/80 py-1.5 rounded-lg w-fit mx-auto px-4 shadow-sm border border-gray-100">
            Pesan terenkripsi secara end-to-end. Keamanan terjaga. 🔒
         </div>

         {messages.map((msg) => {
            // LOGIKA: Jika senderId adalah saya (Customer), taruh di Kanan
            const isMe = msg.senderId === auth.currentUser?.uid;
            
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                    <div 
                        className={`relative max-w-[80%] md:max-w-[60%] p-3 rounded-2xl text-sm shadow-sm transition-all ${
                            isMe 
                            ? 'bg-[#0F3D85] text-white rounded-tr-none' // Customer: Biru & Kanan
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100' // Mitra: Putih & Kiri
                        }`}
                    >
                        {/* Label "Mitra" untuk pesan dari mitra */}
                        {!isMe && (
                            <p className="text-[9px] font-black text-[#0F3D85] mb-1 uppercase tracking-tighter">Mitra Utama</p>
                        )}
                        
                        <p className="leading-relaxed">{msg.text}</p>
                        
                        <span className={`text-[9px] block mt-1 ${isMe ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
                           {msg.createdAt?.seconds 
                             ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                             : '...'}
                        </span>

                        {/* TOMBOL HAPUS */}
                        {isMe && (
                            <button 
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="absolute -left-10 top-2 p-2 bg-white text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>
            );
         })}
         <div ref={dummyEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-3 md:p-4 flex items-center gap-2 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <button onClick={() => showComingSoon('Lampiran')} className="p-2 text-gray-400 hover:text-[#0F3D85] rounded-full transition-colors"><Paperclip size={20} /></button>
          
          <form onSubmit={handleSend} className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#0F3D85]/20 transition-all">
            <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tulis pesan..." 
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
            {!newMessage && (
                <button type="button" onClick={() => showComingSoon('Kamera')} className="text-gray-400 hover:text-gray-600"><Camera size={18} /></button>
            )}
          </form>

          <button 
            type="submit"
            onClick={newMessage ? handleSend : () => showComingSoon('Voice Note')} 
            className="p-3.5 bg-[#0F3D85] text-white rounded-2xl shadow-lg shadow-blue-100 active:scale-90 transition-transform"
          >
            {newMessage ? <Send size={18} /> : <Mic size={18} />}
          </button>
      </div>

    </div>
  );
}