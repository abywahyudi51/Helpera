import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Sparkles, Wrench, Monitor, Car, ChevronRight, ShieldCheck, Clock } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Sobat Helpera");
  const [greeting, setGreeting] = useState('Halo');
  const [keyword, setKeyword] = useState('');
  
  // STATE BARU: STATUS NOTIFIKASI
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // 1. Logic Greeting
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    const user = auth.currentUser;
    if (user) {
        // 2. Ambil Nama User
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  setUserName(docSnap.data().name);
                } else {
                  setUserName(user.displayName || "User");
                }
            } catch (e) { console.error(e); }
        };
        fetchUserData();

        // 3. LISTEN NOTIFIKASI REALTIME (Untuk Titik Merah)
        const q = query(
            collection(db, "users", user.uid, "notifications"),
            where("read", "==", false) // Cari yang belum dibaca
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Jika ada minimal 1 dokumen, berarti ada notifikasi baru
            setHasUnread(!snapshot.empty);
        });

        return () => unsubscribe();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate('/semua-kategori', { state: { searchQuery: keyword } });
  };

  const firstName = userName.split(' ')[0];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-24 md:pb-0 bg-gray-50/50">
      
      {/* HERO SECTION */}
      <div className="relative bg-[#0F3D85] text-white pt-6 pb-24 md:pt-10 md:pb-40 overflow-hidden rounded-b-[30px] md:rounded-b-[60px] shadow-sm">
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 md:w-96 md:h-96 bg-blue-400 opacity-20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-72 h-72 md:w-[500px] md:h-[500px] bg-indigo-500 opacity-20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
          
          {/* HEADER ATAS */}
          <div className="flex justify-between items-center mb-8 md:mb-12">
             <div className="flex items-center gap-3">
                <div className="hidden md:flex w-12 h-12 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/10 text-white font-bold text-xl">
                    {userName.charAt(0)}
                </div>
                <div>
                    <p className="text-blue-200 text-sm md:text-base font-medium">{greeting},</p>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                        <span className="md:hidden">{firstName} 👋</span>
                        <span className="hidden md:inline">{userName}</span>
                    </h1>
                </div>
             </div>

             {/* TOMBOL NOTIFIKASI REALTIME */}
             <Link to="/notifikasi" className="relative p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 transition-all group">
                <Bell className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                
                {/* LOGIKA TITIK MERAH: Hanya muncul jika hasUnread === true */}
                {hasUnread && (
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0F3D85] animate-pulse"></span>
                )}
             </Link>
          </div>

          {/* KONTEN HERO & SEARCH */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-2/3 text-center md:text-left">
                <h2 className="text-3xl md:text-6xl font-extrabold leading-tight mb-6 md:mb-8 tracking-tight">
                  Jasa Profesional <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Tanpa Ribet.</span>
                </h2>
                
                <form onSubmit={handleSearch} className="bg-white p-1.5 md:p-2 rounded-2xl shadow-xl flex items-center w-full md:max-w-xl mx-auto md:mx-0 border-4 border-white/10">
                    <Search className="text-gray-400 ml-3 w-5 h-5" />
                    <input 
                        type="text" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Cari 'Cuci AC', 'Cleaning'..." 
                        className="w-full bg-transparent outline-none text-gray-700 px-3 py-3 text-sm md:text-base font-medium placeholder-gray-400" 
                    />
                    <button type="submit" className="bg-[#0F3D85] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-800 transition active:scale-95">
                        Cari
                    </button>
                </form>
            </div>

            <div className="hidden md:block w-1/3 relative">
                 <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-2xl shadow-lg">🧹</div>
                        <div>
                            <h4 className="font-bold text-lg">Pebersihan Rumah</h4>
                            <p className="text-xs text-blue-100">Sedang berjalan • 2 jam lagi</p>
                        </div>
                    </div>
                    <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-400 w-3/4 h-full shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* KATEGORI JASA */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 relative z-20">
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl border border-gray-100 p-5 md:p-10">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Kategori</h3>
                <p className="text-gray-500 text-xs md:text-sm mt-0.5 font-medium">Layanan favorit minggu ini</p>
              </div>
              <Link to="/semua-kategori" className="text-[#0056b3] font-bold text-xs md:text-sm flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
                Semua <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {[
                { icon: <Sparkles />, label: 'Cleaning', slug: 'kebersihan', desc: 'Rumah', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: <Wrench />, label: 'Tukang', slug: 'pertukangan', desc: 'Renovasi', color: 'text-orange-600', bg: 'bg-orange-50' },
                { icon: <Monitor />, label: 'Elektronik', slug: 'elektronik', desc: 'Service', color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: <Car />, label: 'Otomotif', slug: 'otomotif', desc: 'Bengkel', color: 'text-slate-700', bg: 'bg-slate-100' },
              ].map((item, i) => (
                <Link key={i} to={`/kategori/${item.slug}`} className="group flex flex-col md:flex-row items-center md:gap-4 p-3 md:p-4 rounded-2xl border border-gray-100 md:border-transparent bg-white md:hover:bg-gray-50 transition-all text-center md:text-left shadow-sm md:shadow-none hover:shadow-md cursor-pointer">
                  <div className={`${item.bg} ${item.color} w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl mb-2 md:mb-0 group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800 text-sm md:text-base">{item.label}</h4>
                      <p className="text-[10px] md:text-xs text-gray-400">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
        </div>
      </div>

      {/* PROMO */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                <div className="md:w-1/2">
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 inline-block border border-yellow-500/20">Aman & Terpercaya</span>
                    <h3 className="text-xl md:text-4xl font-bold mb-2 md:mb-4 leading-tight">Garansi Kepuasan <br/>Pelanggan.</h3>
                    <div className="flex gap-3 mt-4">
                        <FeatureBadge icon={<ShieldCheck size={14}/>} text="Verifikasi" />
                        <FeatureBadge icon={<Clock size={14}/>} text="Tepat Waktu" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

function FeatureBadge({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold">
            {icon} {text}
        </div>
    )
}

export default Home;