import React from 'react';
import { Link } from 'react-router-dom'; // Penting agar bisa diklik
import { Search, MoreVertical, Check, CheckCheck } from 'lucide-react';

const ChatList: React.FC = () => {
  // Data Dummy Chat
  const chats = [
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
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      online: true,
      read: false, 
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 md:pt-6">
      
      {/* Header Halaman */}
      <div className="px-5 pt-6 pb-2 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-extrabold text-gray-900">Pesan</h1>
            <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical size={20} className="text-gray-600"/>
            </button>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input 
                type="text" 
                placeholder="Cari obrolan..." 
                className="bg-transparent outline-none w-full text-sm font-medium text-gray-700"
            />
        </div>
      </div>

      {/* Daftar Chat */}
      <div className="mt-2">
        {chats.map((chat) => (
            <Link 
                to={`/chat/${chat.id}`} // <--- Link ini akan membuka ChatRoom
                key={chat.id} 
                className="flex gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none block"
            >
                {/* Avatar & Status Online */}
                <div className="relative">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                    {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                </div>

                {/* Info Chat */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-sm truncate pr-2">{chat.name}</h3>
                        <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-[#0056b3]' : 'text-gray-400'}`}>{chat.time}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <p className={`text-xs truncate max-w-[80%] ${chat.unread > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                            {chat.message}
                        </p>

                        {/* Indikator Belum Dibaca / Centang */}
                        {chat.unread > 0 ? (
                            <div className="bg-[#0056b3] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full">
                                {chat.unread}
                            </div>
                        ) : (
                            chat.read ? <CheckCheck size={16} className="text-blue-500" /> : <Check size={16} className="text-gray-400" />
                        )}
                    </div>
                </div>
            </Link>
        ))}
      </div>

    </div>
  );
};

export default ChatList;