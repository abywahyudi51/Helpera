import React from 'react';
import { Link } from 'react-router-dom';
// Saya sudah menambahkan ikon baru: Wrench (Obeng), Monitor (Layar), Car (Mobil)
import { Search, Bell, Sparkles, Wrench, Monitor, Car, ChevronRight, ShieldCheck, Clock, ThumbsUp } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 bg-gray-50/50">
      
      {/* 1. HERO SECTION (Bagian Biru) */}
      <div className="relative bg-[#0F3D85] text-white pt-10 pb-32 md:pt-16 md:pb-40 overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-sm">
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 md:w-96 md:h-96 bg-blue-400 opacity-20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-72 h-72 md:w-[500px] md:h-[500px] bg-indigo-500 opacity-20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center md:text-left">
          
          {/* Header Mobile */}
          <div className="md:hidden flex justify-between items-center mb-8">
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-lg font-bold tracking-tight">Helpera</span>
             </div>
             <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/10">
                <Bell className="w-5 h-5" />
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-2/3">
                <p className="text-blue-200 font-semibold tracking-wider text-xs md:text-sm uppercase mb-3 flex items-center justify-center md:justify-start gap-2">
                    <span className="w-8 h-[2px] bg-blue-400 inline-block"></span> 
                    Solusi Harianmu
                </p>
                <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                  Jasa Profesional <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Tanpa Ribet.</span>
                </h2>
                
                {/* SEARCH BAR */}
                <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center w-full md:max-w-xl mx-auto md:mx-0">
                    <Search className="text-gray-400 ml-3 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Cari 'Cuci Mobil' atau 'Servis AC'..." 
                        className="w-full bg-transparent outline-none text-gray-700 px-3 py-3 font-medium placeholder-gray-400" 
                    />
                    <button className="bg-[#0056b3] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg">
                        Cari
                    </button>
                </div>
            </div>

            {/* Ilustrasi Dekorasi (Desktop Only) */}
            <div className="hidden md:block w-1/3 relative">
                 <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-2xl">🧹</div>
                        <div>
                            <h4 className="font-bold text-lg">Pebersihan Rumah</h4>
                            <p className="text-xs text-blue-100">Sedang berjalan • 2 jam lagi</p>
                        </div>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-400 w-3/4 h-full"></div>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KATEGORI JASA (PEMBARUAN: Link ke /kategori/...) */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10">
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Kategori Pilihan</h3>
                <p className="text-gray-500 text-sm mt-1 font-medium">Layanan favorit minggu ini</p>
              </div>
             <Link to="/semua-kategori" className="text-[#0056b3] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100">
            Lihat Semua <ChevronRight size={16} />
            </Link>
            </div>

            {/* GRID KATEGORI BARU */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                // 1. CLEANING (Tetap)
                { icon: <Sparkles />, label: 'Cleaning', slug: 'kebersihan', desc: 'Rumah & Kantor', color: 'text-blue-600', bg: 'bg-blue-50' },
                
                // 2. PERTUKANGAN (Ganti Servis AC jadi ini)
                { icon: <Wrench />, label: 'Pertukangan', slug: 'pertukangan', desc: 'Renovasi & AC', color: 'text-orange-600', bg: 'bg-orange-50' },
                
                // 3. ELEKTRONIK (Ganti Desain/Editing jadi ini)
                { icon: <Monitor />, label: 'Elektronik', slug: 'elektronik', desc: 'Laptop & TV', color: 'text-purple-600', bg: 'bg-purple-50' },
                
                // 4. OTOMOTIF (Ganti Tugas jadi ini)
                { icon: <Car />, label: 'Otomotif', slug: 'otomotif', desc: 'Mobil & Motor', color: 'text-slate-700', bg: 'bg-slate-100' },
              ].map((item, i) => (
                <Link 
                    key={i} 
                    to={`/kategori/${item.slug}`} // <--- PENTING: Link mengarah ke halaman List Kategori
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 cursor-pointer"
                >
                  <div className={`${item.bg} ${item.color} w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 26 })}
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800 text-base group-hover:text-[#0056b3] transition-colors">{item.label}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            
        </div>
      </div>

      {/* 3. SECTION PROMO */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="md:w-1/2">
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm border border-yellow-500/20">Kenapa Helpera?</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Keamanan & Kualitas <br/>Adalah Prioritas.</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                        Setiap mitra kami melewati proses seleksi ketat. Nikmati layanan profesional dengan garansi pengerjaan ulang jika tidak puas.
                    </p>
                    <div className="flex gap-4">
                        <FeatureBadge icon={<ShieldCheck size={18}/>} text="Terverifikasi" />
                        <FeatureBadge icon={<Clock size={18}/>} text="Tepat Waktu" />
                    </div>
                </div>
                
                <div className="md:w-1/2 w-full bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm">
                   <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">👋</div>
                      <div>
                        <p className="font-bold text-sm">Review Terbaru</p>
                        <p className="text-xs text-gray-400">Dari Pengguna Helpera</p>
                      </div>
                   </div>
                   <p className="italic text-gray-300 text-sm">"Sangat membantu! Tukang AC datang tepat waktu dan kerjanya bersih banget. Recommended!"</p>
                   <div className="flex gap-1 mt-4 text-yellow-400">
                      <ThumbsUp size={16} /> <span className="text-xs font-bold text-white">Budi Santoso</span>
                   </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        </div>
      </div>

    </div>
  );
};

// Komponen Kecil
function FeatureBadge({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm font-bold">
            {icon} {text}
        </div>
    )
}

export default Home;