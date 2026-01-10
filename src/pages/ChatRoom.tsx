import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, MoreVertical, Paperclip } from 'lucide-react';

const ChatRoom: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Data Dummy Chat Room
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo, selamat siang kak.', sender: 'other', time: '10:30' },
    { id: 2, text: 'Siang mas, mau tanya jasa cuci AC bisa datang hari ini?', sender: 'me', time: '10:31' },
    { id: 3, text: 'Bisa kak, kebetulan jadwal kosong jam 2 siang.', sender: 'other', time: '10:32' },
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]); 
    setInputText(''); 
    
    // Simulasi Balasan Otomatis
    setTimeout(() => {
        const reply = {
            id: messages.length + 2,
            text: 'Oke siap kak, pesanannya saya proses ya!',
            sender: 'other',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">
      
      {/* HEADER */}
      <div className="bg-[#0F3D85] text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-1 rounded-full">
                <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" alt="User" className="w-10 h-10 rounded-full border border-white/20"/>
                <div>
                    <h3 className="font-bold text-sm leading-tight">Partner Helpera</h3>
                    <p className="text-xs text-blue-200">Online</p>
                </div>
            </div>
        </div>
        <div className="flex gap-4">
            <Phone size={20} className="opacity-80" />
            <MoreVertical size={20} className="opacity-80" />
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[60%] px-4 py-2 rounded-lg shadow-sm text-sm relative ${msg.sender === 'me' ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-green-800' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA (DIPERBAIKI: FULL WIDTH) */}
      <div className="bg-white p-3 flex items-center gap-2 fixed bottom-0 left-0 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-100 z-20">
        <button className="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition"><Paperclip size={20}/></button>
        
        <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pesan..." 
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-all"
        />
        
        <button onClick={handleSend} className="bg-[#0F3D85] text-white p-3 rounded-full hover:bg-blue-800 transition shadow-md active:scale-95">
            <Send size={18} />
        </button>
      </div>

    </div>
  );
};

export default ChatRoom;