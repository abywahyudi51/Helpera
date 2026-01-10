import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MoreVertical, CheckCheck, ShoppingBag, ArrowLeft, Trash2, X, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const ChatList: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal State

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(fetchedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedChats.includes(id)) {
        setSelectedChats(selectedChats.filter(chatId => chatId !== id));
    } else {
        setSelectedChats([...selectedChats, id]);
    }
  };

  // LOGIKA HAPUS FINAL
  const confirmDelete = async () => {
    try {
        for (const chatId of selectedChats) {
            await deleteDoc(doc(db, "bookings", chatId));
        }
        toast.success(`${selectedChats.length} Percakapan dihapus`);
        setIsSelectMode(false);
        setSelectedChats([]);
        setShowDeleteModal(false);
    } catch (error) {
        toast.error("Gagal menghapus chat");
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.serviceName?.toLowerCase().includes(keyword.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex justify-center items-center text-gray-400">Memuat percakapan...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pt-10 animate-in fade-in duration-500">
      
      <div className="bg-white md:max-w-2xl md:mx-auto md:rounded-3xl md:shadow-xl md:border md:border-gray-100 overflow-hidden min-h-[80vh] relative">
        
        {/* HEADER */}
        <div className="px-5 pt-6 pb-2 bg-white z-20 relative shadow-sm md:shadow-none">
            {!isSelectMode ? (
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-extrabold text-[#0F3D85] tracking-tight">Pesan</h1>
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <MoreVertical size={20} className="text-gray-600"/>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200 z-50">
                                <button 
                                    onClick={() => { setIsSelectMode(true); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex items-center gap-2"
                                >
                                    <CheckSquare size={18} /> Pilih Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center mb-4 bg-blue-50 -mx-5 px-5 py-4 -mt-6 pt-10 animate-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-3">
                        <button onClick={() => { setIsSelectMode(false); setSelectedChats([]); }} className="p-1 rounded-full hover:bg-blue-100 text-gray-600">
                            <X size={24} />
                        </button>
                        <span className="font-bold text-lg text-[#0F3D85]">{selectedChats.length} Terpilih</span>
                    </div>
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        disabled={selectedChats.length === 0}
                        className="p-2.5 rounded-full bg-red-50 text-red-500 disabled:opacity-30 disabled:grayscale transition-all hover:bg-red-100 active:scale-90"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            )}

            {!isSelectMode && (
                <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-3 border border-transparent focus-within:border-blue-200 focus-within:bg-blue-50 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Cari percakapan..." 
                        className="bg-transparent outline-none w-full text-sm font-medium text-gray-700"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            )}
        </div>

        {/* LIST CHAT */}
        <div className="mt-2">
            {filteredChats.map((chat) => (
                <div 
                    key={chat.id} 
                    className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 transition-all cursor-pointer
                        ${isSelectMode && selectedChats.includes(chat.id) ? 'bg-blue-50/70 translate-x-1' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => isSelectMode ? toggleSelect(chat.id) : navigate(`/chat/${chat.id}`)}
                >
                    {isSelectMode && (
                        <div className="text-[#0F3D85] animate-in zoom-in duration-200">
                            {selectedChats.includes(chat.id) 
                                ? <CheckSquare size={24} fill="#0F3D85" className="text-white" /> 
                                : <Square size={24} className="text-gray-200" />
                            }
                        </div>
                    )}
                    <div className="relative flex-shrink-0">
                        <img src={chat.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                        {chat.status === 'Proses' && !isSelectMode && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-900 text-sm truncate">{chat.serviceName}</h3>
                            <span className="text-[10px] font-bold text-gray-400">
                                {chat.createdAt?.seconds ? new Date(chat.createdAt.seconds * 1000).toLocaleDateString() : 'Baru'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs truncate text-gray-500">
                                {chat.status === 'Batal' ? 'Pesanan dibatalkan' : 'Klik untuk lanjut chat'}
                            </p>
                            {!isSelectMode && <CheckCheck size={16} className="text-blue-500 opacity-50" />}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* --- CUSTOM DELETE MODAL --- */}
        {showDeleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <Trash2 size={28} />
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-2">Hapus Chat?</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        {selectedChats.length} percakapan terpilih akan dihapus permanen dan tidak bisa dikembalikan.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={confirmDelete}
                            className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
                        >
                            Ya, Hapus Sekarang
                        </button>
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ChatList;