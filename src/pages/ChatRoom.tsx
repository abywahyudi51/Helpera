import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, MoreVertical, Paperclip } from 'lucide-react';

const ChatRoom: React.FC = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 1. LOGIKA DATA KONTAK DINAMIS (Biar Header Gak Statis)
  // Kita cek ID-nya: 1=Budi, 2=Siti, 3=Admin
  const contact = {
    id: Number(id),
    name: id === '1' ? 'Budi Santoso' : id === '2' ? 'Siti Aminah' : 'Admin Helpera',
    role: id === '1' ? 'Tukang AC' : id === '2' ? 'Cleaner' : 'Customer Support',
    avatar: id === '1' 
      ? 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' 
      : id === '2' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
      : 'https://ui-avatars.com/api/?name=Admin+Helpera&background=0F3D85&color=fff',
    online: true
  };

  // Data Dummy Chat Awal
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo, selamat siang kak.', sender: 'other', time: '10:30' },
    { id: 2, text: `Siang ${contact.name.split(' ')[0]}, bisa datang hari ini?`, sender: 'me', time: '10:31' },
  ]);

  const [inputText, setInputText] = useState('');

  // 2. SCROLL KE BAWAH OTOMATIS
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault(); // Mencegah reload form
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText(''); 
    
    // Simulasi Balasan Otomatis
    setTimeout(() => {
        const reply = {
            id: Date.now() + 1,
            text: 'Oke siap kak, pesanannya saya proses ya! Mohon ditunggu.',
            sender: 'other',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5] md:bg-gray-100 animate-in slide-in-from-right duration-300">
      
      {/* === HEADER (Sekarang ada di tengah layout desktop) === */}
      <div className="bg-[#0F3D85] text-white p-3 flex items-center justify-between shadow-md sticky top-0 z-20 md:max-w-4xl md:mx-auto md:w-full md:mt-4 md:rounded-t-xl">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('/chat')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <ArrowLeft size={22} />
            </button>
            <div className="flex items-center gap-3">
                <img src={contact.avatar} alt="User" className="w-10 h-10 rounded-full border border-white/20 object-cover"/>
                <div>
                    <h3 className="font-bold text-sm md:text-base leading-tight">{contact.name}</h3>
                    <p className="text-[10px] md:text-xs text-blue-200">{contact.role} • Online</p>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full"><Phone size={20} className="opacity-90" /></button>
            <button className="p-2 hover:bg-white/10 rounded-full"><MoreVertical size={20} className="opacity-90" /></button>
        </div>
      </div>

      {/* === CHAT AREA (Background Pattern ala WA) === */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 md:max-w-4xl md:mx-auto md:w-full md:bg-[#e5ddd5] relative">
        {/* Background Overlay (Opsional biar cantik) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}></div>

        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} relative z-10`}>
                <div 
                    className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-xl shadow-sm text-sm relative 
                    ${msg.sender === 'me' 
                        ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none' // Hijau Muda (Saya)
                        : 'bg-white text-gray-900 rounded-tl-none'     // Putih (Lawan)
                    }`}
                >
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-green-800/60' : 'text-gray-400'}`}>
                        {msg.time}
                    </p>
                </div>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* === INPUT AREA (Sticky di Container, bukan Fixed Layar) === */}
      <div className="bg-white p-3 md:pb-6 sticky bottom-0 z-20 md:max-w-4xl md:mx-auto md:w-full border-t border-gray-100">
        <form 
            onSubmit={handleSend}
            className="flex items-center gap-2 bg-gray-100 p-2 pr-2 rounded-3xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
        >
            <button type="button" className="text-gray-400 p-2 hover:text-gray-600 hover:bg-gray-200 rounded-full transition">
                <Paperclip size={20}/>
            </button>
            
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik pesan..." 
                className="flex-1 bg-transparent outline-none text-sm text-gray-800"
            />
            
            <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="bg-[#0F3D85] text-white p-3 rounded-full hover:bg-blue-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={18} className={inputText.trim() ? "translate-x-0.5 translate-y-0.5" : ""} />
            </button>
        </form>
      </div>

    </div>
  );
};

export default ChatRoom;