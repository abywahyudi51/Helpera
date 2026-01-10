import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MoreVertical, Check, CheckCheck } from 'lucide-react';

const ChatList: React.FC = () => {
  const [keyword, setKeyword] = useState("");

  const initialChats = [
    {
      id: 1,
      name: 'Budi Santoso (Tukang AC)',
      message: 'Siap mas, saya meluncur ke lokasi skrg.',
      time: '10:30',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
      online: true,
    },
    {
      id: 2,
      name: 'Siti Aminah (Cleaner)',
      message: 'Terima kasih kembali kak!',
      time: 'Kemarin',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      online: false,
      read: true, 
    },
    {
      id: 3,
      name: 'Admin Helpera',
      message: 'Selamat datang di Helpera! Ada kendala?',
      time: 'Senin',
      unread: 0,
      avatar: 'https://ui-avatars.com/api/?name=Admin+Helpera&background=0F3D85&color=fff',
      online: true,
      read: false, 
    },
  ];

  const filteredChats = initialChats.filter(chat => 
    chat.name.toLowerCase().includes(keyword.toLowerCase()) ||
    chat.message.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pt-10 animate-in fade-in duration-500">
      
      {/* Container Card: Dibatasi max-w-2xl agar tidak terlalu lebar di laptop */}
      <div className="bg-white md:max-w-2xl md:mx-auto md:rounded-3xl md:shadow-xl md:border md:border-gray-100 overflow-hidden min-h-[80vh]">
        
        {/* Header Halaman */}
        <div className="px-5 pt-6 pb-2 bg-white z-10">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-extrabold text-[#0F3D85] tracking-tight">Pesan</h1>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <MoreVertical size={20} className="text-gray-600"/>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-3 border border-transparent focus-within:border-blue-200 focus-within:bg-blue-50 transition-all">
                <Search size={18} className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Cari obrolan..." 
                    className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
        </div>

        {/* Daftar Chat */}
        <div className="mt-2">
            {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                    <Link 
                        to={`/chat/${chat.id}`} 
                        key={chat.id} 
                        className="flex gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none group"
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover border border-gray-100 group-hover:scale-105 transition-transform" />
                            {chat.online && (
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </div>

                        {/* Info Chat */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900 text-sm truncate pr-2 group-hover:text-[#0056b3] transition-colors">{chat.name}</h3>
                                <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-[#0056b3]' : 'text-gray-400'}`}>{chat.time}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <p className={`text-xs truncate max-w-[85%] ${chat.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                    {chat.message}
                                </p>

                                {chat.unread > 0 ? (
                                    <div className="bg-[#0056b3] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-sm">
                                        {chat.unread}
                                    </div>
                                ) : (
                                    chat.read ? <CheckCheck size={16} className="text-blue-500" /> : <Check size={16} className="text-gray-400" />
                                )}
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Search size={48} className="opacity-20 mb-4" />
                    <p className="text-sm">Tidak ada pesan ditemukan.</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default ChatList;